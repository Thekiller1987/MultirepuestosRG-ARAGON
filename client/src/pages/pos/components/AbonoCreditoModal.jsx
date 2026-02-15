// AbonoCreditoModal.jsx — Sistema de abono por ticket individual
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { FaTimes, FaSave, FaSpinner, FaMoneyBillWave, FaFileInvoiceDollar, FaCheckCircle } from 'react-icons/fa';
import * as api from '../../../service/api';
import { useAuth } from '../../../context/AuthContext.jsx';

// ===================== Styled Components =====================
const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1050;
  backdrop-filter: blur(5px);
`;

const ModalContainer = styled.div`
  background: white; padding: 2rem; border-radius: 12px; width: 560px; max-width: 95%; max-height: 90vh; overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  animation: fadeIn 0.3s ease-out;
  @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
`;

const Header = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef; padding-bottom: 1rem;
`;

const Title = styled.h2`margin: 0; font-size: 1.5rem; color: #333;`;

const CloseButton = styled.button`
  border: none; background: none; font-size: 1.5rem; cursor: pointer; color: #888;
  &:hover { color: #333; }
`;

const Form = styled.form`display: flex; flex-direction: column; gap: 1.25rem;`;

const InputGroup = styled.div`display: flex; flex-direction: column; gap: 0.5rem;`;
const Label = styled.label`font-weight: 600; color: #495057; font-size: 0.9rem;`;

const Input = styled.input`
  padding: 0.75rem; border: 1px solid #ccc; border-radius: 6px; font-size: 1rem;
  &:focus { border-color: #007bff; outline: none; box-shadow: 0 0 0 2px rgba(0,123,255,0.25); }
`;

const Select = styled(Input).attrs({ as: 'select' })``;

const Button = styled.button`
  padding: 0.85rem 1.5rem; background: #28a745; color: white; border: none;
  border-radius: 6px; font-weight: bold; display: flex; align-items: center; gap: 0.5rem;
  justify-content: center; cursor: pointer; transition: background-color 0.2s; font-size: 1rem;
  &:hover:not(:disabled) { background: #218838; }
  &:disabled { background: #6c757d; cursor: not-allowed; }
`;

const InfoText = styled.p`
  margin: 0 0 0.5rem 0; padding: 0.75rem; background-color: #e9ecef; border-radius: 6px;
  color: #495057; text-align: center; font-size: 1rem;
  strong { color: #dc3545; }
`;

const ErrorText = styled.p`
  margin-top: -1rem; margin-bottom: 0.5rem; padding: 0.5rem; color: #dc3545; font-size: 0.9rem; text-align: center;
`;

const SpinAnimation = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

// ===================== Ticket Cards =====================
const TicketList = styled.div`
  display: flex; flex-direction: column; gap: 0.5rem;
  max-height: 220px; overflow-y: auto; padding: 0.25rem;
`;

const TicketCard = styled.div`
  padding: 0.75rem 1rem; border: 2px solid ${p => p.$selected ? '#007bff' : '#e9ecef'};
  border-radius: 8px; cursor: pointer; transition: all 0.2s;
  background: ${p => p.$selected ? '#e8f0fe' : (p.$paid ? '#f0f9f0' : 'white')};
  opacity: ${p => p.$paid ? 0.6 : 1};
  display: flex; justify-content: space-between; align-items: center;
  &:hover { border-color: ${p => p.$paid ? '#e9ecef' : '#007bff'}; }

  .ticket-info {
    display: flex; flex-direction: column; gap: 2px;
    .ticket-id { font-weight: 700; color: #0056b3; font-size: 0.9rem; }
    .ticket-date { font-size: 0.8rem; color: #6c757d; }
  }
  .ticket-amounts {
    text-align: right;
    .original { font-size: 0.8rem; color: #6c757d; text-decoration: line-through; }
    .remaining { font-weight: 700; color: ${p => p.$paid ? '#28a745' : '#dc3545'}; font-size: 1rem; }
  }
`;

const SectionLabel = styled.div`
  font-size: 0.85rem; font-weight: 600; color: #495057;
  margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.5rem;
`;

const formatCurrency = (amount) => `C$${Number(amount || 0).toFixed(2)}`;
const fmtDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-NI', {
    timeZone: 'America/Managua', day: '2-digit', month: '2-digit', year: 'numeric'
  });
};

// ===================== Componente Principal =====================
const AbonoCreditoModal = ({ client, onClose, onAbonoSuccess, showAlert }) => {
  const { addCajaTransaction, user } = useAuth();

  const [monto, setMonto] = useState('');
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [referencia, setReferencia] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMonto, setErrorMonto] = useState('');

  // Per-ticket state
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null); // null = FIFO automático

  const saldoPendiente = useMemo(() => Number(client?.saldo_pendiente) || 0, [client]);

  // Cargar facturas pendientes al abrir
  useEffect(() => {
    const loadTickets = async () => {
      setLoadingTickets(true);
      try {
        const token = localStorage.getItem('token');
        const data = await api.getCreditosPendientes(client.id_cliente, token);
        setTickets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error cargando tickets:', err);
        setTickets([]);
      } finally {
        setLoadingTickets(false);
      }
    };
    if (client?.id_cliente) loadTickets();
  }, [client]);

  const pendingTickets = useMemo(() => tickets.filter(t => t.saldoRestante > 0), [tickets]);
  const paidTickets = useMemo(() => tickets.filter(t => t.saldoRestante <= 0), [tickets]);

  const maxMonto = selectedTicket
    ? Math.min(saldoPendiente, selectedTicket.saldoRestante)
    : saldoPendiente;

  useEffect(() => {
    if (!monto) { setErrorMonto(''); return; }
    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      setErrorMonto('Ingrese un monto válido mayor a cero.');
    } else if (montoNum > maxMonto) {
      setErrorMonto(`El máximo es ${formatCurrency(maxMonto)}.`);
    } else {
      setErrorMonto('');
    }
  }, [monto, maxMonto]);

  const handleSelectTicket = (ticket) => {
    if (ticket.saldoRestante <= 0) return;
    setSelectedTicket(prev => prev?.idVenta === ticket.idVenta ? null : ticket);
    setMonto(''); // Reset monto on selection change
  };

  const handlePayFull = () => {
    if (selectedTicket) {
      setMonto(selectedTicket.saldoRestante.toFixed(2));
    } else {
      setMonto(saldoPendiente.toFixed(2));
    }
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const montoNum = parseFloat(monto);
    const token = localStorage.getItem('token');

    if (errorMonto || !montoNum || montoNum <= 0) {
      showAlert?.({ title: "Monto Inválido", message: errorMonto || "Revise el monto ingresado." });
      return;
    }

    if (metodoPago !== 'Efectivo' && !referencia.trim()) {
      showAlert?.({ title: "Referencia Requerida", message: "Ingrese el número de referencia, transferencia o voucher." });
      return;
    }

    setIsLoading(true);
    try {
      // 1. Registrar abono en backend (con ticket específico si seleccionado)
      await api.addCreditPayment(client.id_cliente, {
        monto: montoNum,
        id_venta: selectedTicket?.idVenta || null,
        pagoDetalles: {
          metodo: metodoPago,
          usuario: user?.nombre_usuario || 'Desconocido',
          referencia: referencia || '',
          ticketRef: selectedTicket ? `Venta #${selectedTicket.idVenta}` : 'FIFO'
        }
      }, token);

      // 2. Registrar la transacción en la caja
      const esIngresoEnCaja = metodoPago === 'Efectivo';
      const txCaja = {
        id: `abono-${Date.now()}`,
        type: 'abono',
        amount: montoNum,
        note: `Abono Cliente: ${client.nombre} (${metodoPago})${selectedTicket ? ` - Venta #${selectedTicket.idVenta}` : ''} ${referencia ? '- Ref: ' + referencia : ''}`,
        at: new Date().toISOString(),
        pagoDetalles: {
          clienteId: client.id_cliente,
          clienteNombre: client.nombre,
          metodo: metodoPago,
          referencia: referencia,
          ingresoCaja: esIngresoEnCaja ? montoNum : 0,
          efectivo: esIngresoEnCaja ? montoNum : 0,
          tarjeta: metodoPago === 'Tarjeta' ? montoNum : 0,
          transferencia: metodoPago === 'Transferencia' ? montoNum : 0,
          credito: 0
        }
      };

      await addCajaTransaction(txCaja);
      onAbonoSuccess?.(txCaja);
      onClose?.();
    } catch (err) {
      console.error("Error al registrar abono:", err);
      showAlert?.({ title: "Error", message: `No se pudo registrar el abono. ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  }, [monto, metodoPago, referencia, errorMonto, client, user, selectedTicket, addCajaTransaction, onAbonoSuccess, onClose, showAlert]);

  const isSubmitDisabled = isLoading || saldoPendiente <= 0 || !!errorMonto || !monto;

  return (
    <ModalOverlay>
      <ModalContainer>
        <Header>
          <Title>Registrar Abono</Title>
          <CloseButton onClick={onClose} disabled={isLoading}><FaTimes /></CloseButton>
        </Header>

        <p>Cliente: <strong>{client?.nombre || 'Desconocido'}</strong></p>
        <InfoText>
          Saldo Pendiente Total: <strong>{formatCurrency(saldoPendiente)}</strong>
        </InfoText>

        {/* ─── FACTURAS PENDIENTES ─── */}
        {loadingTickets ? (
          <div style={{ textAlign: 'center', padding: '1rem', color: '#6c757d' }}>
            <SpinAnimation /> Cargando facturas...
          </div>
        ) : pendingTickets.length > 0 ? (
          <>
            <SectionLabel>
              <FaFileInvoiceDollar /> Selecciona una factura (opcional — si no, paga la más antigua):
            </SectionLabel>
            <TicketList>
              {pendingTickets.map(t => (
                <TicketCard
                  key={t.idVenta}
                  $selected={selectedTicket?.idVenta === t.idVenta}
                  onClick={() => handleSelectTicket(t)}
                >
                  <div className="ticket-info">
                    <span className="ticket-id">Venta #{t.idVenta}</span>
                    <span className="ticket-date">{fmtDate(t.fecha)}</span>
                  </div>
                  <div className="ticket-amounts">
                    {t.montoOriginal !== t.saldoRestante && (
                      <div className="original">{formatCurrency(t.montoOriginal)}</div>
                    )}
                    <div className="remaining">{formatCurrency(t.saldoRestante)}</div>
                  </div>
                </TicketCard>
              ))}
            </TicketList>

            {paidTickets.length > 0 && (
              <details style={{ marginTop: '0.5rem' }}>
                <summary style={{ cursor: 'pointer', fontSize: '0.85rem', color: '#6c757d' }}>
                  <FaCheckCircle style={{ color: '#28a745' }} /> {paidTickets.length} factura(s) pagada(s)
                </summary>
                <TicketList style={{ marginTop: '0.5rem' }}>
                  {paidTickets.map(t => (
                    <TicketCard key={t.idVenta} $paid>
                      <div className="ticket-info">
                        <span className="ticket-id">Venta #{t.idVenta}</span>
                        <span className="ticket-date">{fmtDate(t.fecha)}</span>
                      </div>
                      <div className="ticket-amounts">
                        <div className="remaining" style={{ color: '#28a745' }}>Pagada ✔</div>
                      </div>
                    </TicketCard>
                  ))}
                </TicketList>
              </details>
            )}
          </>
        ) : null}

        {/* ─── FORM ─── */}
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="montoAbono">
              Monto a Abonar (C$)
              {selectedTicket && (
                <span style={{ fontWeight: 'normal', color: '#007bff', marginLeft: '0.5rem' }}>
                  — Venta #{selectedTicket.idVenta} (máx: {formatCurrency(maxMonto)})
                </span>
              )}
            </Label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Input
                id="montoAbono"
                type="number"
                value={monto}
                onChange={e => setMonto(e.target.value)}
                placeholder="0.00"
                required
                autoFocus
                step="0.01"
                min="0.01"
                max={maxMonto ? maxMonto.toFixed(2) : undefined}
                disabled={isLoading || saldoPendiente <= 0}
                style={{ flex: 1 }}
              />
              <Button type="button" onClick={handlePayFull}
                style={{ background: '#007bff', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                disabled={isLoading || saldoPendiente <= 0}>
                Total
              </Button>
            </div>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="metodoPago">Método de Pago</Label>
            <Select id="metodoPago" value={metodoPago} onChange={e => setMetodoPago(e.target.value)} disabled={isLoading}>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
            </Select>
          </InputGroup>

          {metodoPago !== 'Efectivo' && (
            <InputGroup>
              <Label htmlFor="referencia">Referencia / Voucher / N° Transferencia</Label>
              <Input id="referencia" type="text" value={referencia} onChange={e => setReferencia(e.target.value)} placeholder="Ej: BAC-123456" required />
            </InputGroup>
          )}

          {errorMonto && <ErrorText>{errorMonto}</ErrorText>}

          <Button type="submit" disabled={isSubmitDisabled}>
            {isLoading ? <><SpinAnimation /> Procesando...</> : <><FaSave /> Registrar Abono</>}
          </Button>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default React.memo(AbonoCreditoModal);