import React, { useMemo } from 'react';
import styled from 'styled-components';
import { FaUser, FaRegClock, FaDollarSign, FaCreditCard, FaPrint, FaTrashAlt, FaUndo, FaInfoCircle, FaExchangeAlt } from 'react-icons/fa';
import { Button as OriginalButton, InfoBox } from '../POS.styles.jsx';

const money = (n) => Number(n || 0).toFixed(2);
const safeItemName = (it, idx = 0) =>
  it?.nombre ?? it?.name ?? it?.producto ?? it?.descripcion ?? `Item ${idx + 1}`;

// ===================== Styled =====================
const DetailWrapper = styled.div`
  border-left: 1px solid #e9ecef; padding-left: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.2rem;
`;
const DetailSection = styled.div`
  background-color: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 1.2rem;
  h4 { margin-top: 0; margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; color: #495057; }
`;
const ProductTable = styled.table`
  width: 100%; border-collapse: collapse; font-size: 0.9rem;
  th, td { padding: 0.6rem; text-align: left; border-bottom: 1px solid #f1f1f1; }
  th { font-weight: 600; color: #6c757d; }
  td:nth-child(3), td:nth-child(4) { text-align: right; }
`;
const TotalsRow = styled.div`
  display: flex; justify-content: space-between; padding: 0.4rem 0; font-size: 0.95rem; font-weight: ${props => props.$bold ? '600' : 'normal'};
  border-top: ${props => props.$bordered ? '1px dashed #ccc' : 'none'}; color: ${props => props.color || 'inherit'};
  span:first-child { color: #6c757d; }
`;
const ActionsContainer = styled.div`
  display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem;
`;
const StatusBadge = styled.span`
  font-weight: bold; padding: 0.25rem 0.5rem; border-radius: 4px; color: white; background-color: ${props => props.color};
`;

// ===================== Componente =====================
const SaleDetailView = ({
  sale, client, creditStatus, dailySales, isAdmin,
  onOpenAbonoModal, onCancelSale, onReturnItem, onReprintTicket,
  showConfirmation, showPrompt, showAlert
}) => {
  const canModifySale = useMemo(() => {
    // Allow modification if sale is COMPLETADA
    if (!sale || sale.estado !== 'COMPLETADA') return false;
    return true;
  }, [sale]);

  if (!sale) {
    return (
      <DetailWrapper style={{ justifyContent: 'center', alignItems: 'center' }}>
        <InfoBox><FaInfoCircle /> Seleccione una transacción de la lista para ver sus detalles.</InfoBox>
      </DetailWrapper>
    );
  }

  const statusInfo = {
    COMPLETADA: { text: 'COMPLETADA', color: '#28a745' },
    CANCELADA: { text: 'CANCELADA', color: '#dc3545' },
    DEVOLUCION: { text: 'DEVOLUCIÓN', color: '#ffc107' },
    ABONO_CREDITO: { text: 'ABONO A CRÉDITO', color: '#17a2b8' }
  };
  const currentStatus = statusInfo[sale.estado] || { text: sale.estado, color: '#6c757d' };
  const isSale = sale.estado === 'COMPLETADA';

  // =============== HANDLERS ===============
  const handleReturnClick = (item, index) => {
    if (!canModifySale) return;
    if (!onReturnItem) {
      showAlert?.({ title: 'Config', message: 'Falta onReturnItem en props.', type: 'error' });
      return;
    }
    onReturnItem(item, index); // el prompt vive en el padre
  };

  const handleCancelClick = () => {
    if (!canModifySale) return;
    if (!onCancelSale) {
      showAlert?.({ title: 'Config', message: 'Falta onCancelSale en props.', type: 'error' });
      return;
    }
    showConfirmation?.({
      title: 'Cancelar Venta',
      message: `Esta acción revertirá stock y (si aplica) crédito del cliente.\n\n¿Cancelar la venta #${sale.id}?`,
      onConfirm: () => onCancelSale(sale.id)
    });
  };

  return (
    <DetailWrapper>
      <h3>Detalle de Transacción #{sale.id}</h3>

      {/* Estado de cuenta (si lo pasas) */}
      {client && creditStatus && (
        <InfoBox $type="info" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>Estado de Cuenta: {client.nombre}</span>
            <OriginalButton $primary onClick={onOpenAbonoModal} disabled={creditStatus.currentBalance <= 0}>
              <FaDollarSign /> Registrar Abono
            </OriginalButton>
          </div>
          <TotalsRow $bold color={creditStatus.currentBalance > 0 ? '#dc3545' : '#28a745'}>
            <span>SALDO PENDIENTE TOTAL:</span>
            <span>C${creditStatus.currentBalance.toFixed(2)}</span>
          </TotalsRow>
        </InfoBox>
      )}

      {/* Datos generales */}
      <DetailSection>
        <p><strong><FaUser /> Cliente:</strong> {client?.nombre || 'Cliente Genérico'}</p>
        <p><strong><FaRegClock /> Fecha:</strong> {new Date(sale.fecha).toLocaleString('es-NI')}</p>
        <p><strong>Estado:</strong> <StatusBadge color={currentStatus.color}>{currentStatus.text}</StatusBadge></p>
      </DetailSection>

      {/* Productos + resumen solo para ventas (no abonos/devoluciones) */}
      {isSale && (
        <>
          {Array.isArray(sale.items) && sale.items.length > 0 && (
            <DetailSection>
              <h4>Productos</h4>
              <ProductTable>
                <thead>
                  <tr><th>Producto</th><th>Cant.</th><th>P. Unit.</th><th>Subtotal</th><th></th></tr>
                </thead>
                <tbody>
                  {sale.items.map((item, index) => (
                    <tr key={(item && (item.id_producto || item.id)) ?? index}>
                      <td>{safeItemName(item, index)}</td>
                      <td>{item?.quantity ?? item?.cantidad ?? 0}</td>
                      <td>C${money(item?.precio)}</td>
                      <td>C${money((item?.quantity ?? item?.cantidad ?? 0) * (item?.precio ?? 0))}</td>
                      <td>
                        {canModifySale && (
                          <OriginalButton $warning $small onClick={() => handleReturnClick(item, index)} title="Devolver">
                            <FaUndo />
                          </OriginalButton>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ProductTable>
            </DetailSection>
          )}

          <DetailSection>
            <h4>Resumen Financiero de esta Venta</h4>
            {sale.subtotal !== undefined && <TotalsRow><span>Subtotal:</span><span>C${money(sale.subtotal)}</span></TotalsRow>}
            {sale.descuento > 0 && <TotalsRow><span>Descuento:</span><span style={{ color: '#dc3545' }}>- C${money(sale.descuento)}</span></TotalsRow>}
            <TotalsRow $bold $bordered><span>Total Transacción:</span><span>C${money(Math.abs(sale.totalVenta))}</span></TotalsRow>

            {sale.pagoDetalles && (
              <div style={{ marginTop: '1rem' }}>
                <h5 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Detalle del Pago:</h5>
                {sale.pagoDetalles.efectivo > 0 && <TotalsRow><span><FaDollarSign /> Efectivo Recibido:</span><span>C${money(sale.pagoDetalles.efectivo)}</span></TotalsRow>}
                {sale.pagoDetalles.tarjeta > 0 && (
                  <>
                    <TotalsRow><span><FaCreditCard /> Tarjeta:</span><span>C${money(sale.pagoDetalles.tarjeta)}</span></TotalsRow>
                    {sale.pagoDetalles.referenciaTarjeta && (
                      <TotalsRow style={{ fontSize: '0.85rem', color: '#666', paddingLeft: '1.5rem' }}>
                        <span>↳ Ref:</span><span>{sale.pagoDetalles.referenciaTarjeta}</span>
                      </TotalsRow>
                    )}
                  </>
                )}
                {sale.pagoDetalles.transferencia > 0 && (
                  <>
                    <TotalsRow><span><FaExchangeAlt /> Transferencia:</span><span>C${money(sale.pagoDetalles.transferencia)}</span></TotalsRow>
                    {sale.pagoDetalles.referenciaTransferencia && (
                      <TotalsRow style={{ fontSize: '0.85rem', color: '#666', paddingLeft: '1.5rem' }}>
                        <span>↳ Ref:</span><span>{sale.pagoDetalles.referenciaTransferencia}</span>
                      </TotalsRow>
                    )}
                  </>
                )}
                {sale.pagoDetalles.credito > 0 && <TotalsRow><span><FaUser /> Crédito Otorgado:</span><span style={{ color: '#dc3545' }}>C${money(sale.pagoDetalles.credito)}</span></TotalsRow>}
                {sale.pagoDetalles.vuelto > 0 && <TotalsRow><span>Vuelto Entregado:</span><span>- C${money(sale.pagoDetalles.vuelto)}</span></TotalsRow>}
              </div>
            )}
          </DetailSection>
        </>
      )}

      {/* Acciones */}
      {sale.estado !== 'CANCELADA' && (
        <DetailSection>
          <h4>Acciones</h4>
          <ActionsContainer>
            <OriginalButton onClick={onReprintTicket}><FaPrint /> Reimprimir Ticket</OriginalButton>
            {canModifySale && (
              <OriginalButton $cancel onClick={handleCancelClick}>
                <FaTrashAlt /> Cancelar Venta
              </OriginalButton>
            )}
          </ActionsContainer>
        </DetailSection>
      )}
    </DetailWrapper>
  );
};

export default React.memo(SaleDetailView);
