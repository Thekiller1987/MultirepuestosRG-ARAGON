// HistorialCreditoModal.jsx — Vista de historial por ticket individual
import React, { useEffect, useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import { FaTimes, FaMoneyBillWave, FaCreditCard, FaSpinner, FaFileInvoiceDollar, FaArrowLeft, FaPrint, FaCheckCircle, FaClock } from "react-icons/fa";
import * as api from "../../../service/api";
import TicketModal from "./TicketModal";
import { useAuth } from "../../../context/AuthContext";

const ModalOverlay = styled.div`position: fixed; inset: 0; background-color: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 1rem;`;
const ModalContent = styled.div`background: #f4f7f6; color: #333; border-radius: 10px; width: 900px; max-width: 100%; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0,0,0,0.1);`;
const Header = styled.div`padding: 1rem 1.5rem; border-bottom: 1px solid #dee2e6; display: flex; justify-content: space-between; align-items: center;`;
const Title = styled.h2`margin: 0; font-size: 1.5rem;`;
const CloseButton = styled.button`background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #888; &:hover{color:#333;}`;
const Body = styled.div`padding: 1.5rem; overflow-y: auto;`;
const SummaryContainer = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;`;
const SummaryCard = styled.div`
  background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border-left: 5px solid ${props => props.color || '#ccc'};
  h3 { margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666; text-transform: uppercase; }
  p { margin: 0; font-size: 1.75rem; font-weight: bold; color: ${props => props.color || '#333'}; }
`;
const SpinAnimation = styled(FaSpinner)`animation: spin 1s linear infinite; @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
const CenteredMessage = styled.div`text-align: center; padding: 2rem; color: #6c757d;`;

// Componente para cada ticket de crédito
const TicketCardStyled = styled.div`
  background: white; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;
  border: 1px solid #e9ecef; box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  border-left: 5px solid ${p => p.$estado === 'PAGADO' ? '#28a745' : p.$estado === 'DEVUELTO' ? '#ffc107' : '#dc3545'};
`;

const TicketHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;
  .ticket-title { font-weight: 700; font-size: 1.1rem; color: #0056b3; }
  .ticket-date { font-size: 0.85rem; color: #6c757d; }
`;

const ProgressBar = styled.div`
  width: 100%; height: 8px; background: #e9ecef; border-radius: 4px; overflow: hidden; margin: 0.5rem 0;
  .fill { height: 100%; background: ${p => p.$pct >= 100 ? '#28a745' : '#007bff'}; border-radius: 4px; transition: width 0.3s; }
`;

const TicketStats = styled.div`
  display: flex; gap: 1.5rem; flex-wrap: wrap; font-size: 0.9rem; color: #495057;
  .stat { display: flex; flex-direction: column; }
  .stat-label { font-size: 0.75rem; color: #6c757d; text-transform: uppercase; font-weight: 600; }
  .stat-value { font-weight: 700; font-size: 1.1rem; }
`;

const StatusBadge = styled.span`
  font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 12px;
  background: ${p => p.$type === 'PAGADO' ? '#d4edda' : p.$type === 'DEVUELTO' ? '#fff3cd' : '#f8d7da'};
  color: ${p => p.$type === 'PAGADO' ? '#155724' : p.$type === 'DEVUELTO' ? '#856404' : '#721c24'};
`;

const Timeline = styled.div`padding: 0; margin: 0.75rem 0 0;`;
const TimelineItem = styled.div`
  display: flex; gap: 0.75rem; padding: 0.5rem 0; border-bottom: 1px solid #f1f5f9;
  &:last-child { border-bottom: none; }
  .icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0;
    background: ${p => p.$type === 'credito' ? '#dc3545' : '#28a745'}; font-size: 0.8rem; }
  .content { flex: 1; }
  .amount { font-weight: 700; color: ${p => p.$type === 'credito' ? '#dc3545' : '#28a745'}; }
  .meta { font-size: 0.8rem; color: #6c757d; }
`;

const formatCurrency = (amount) => `C$${Number(amount || 0).toFixed(2)}`;
const fmtDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-NI', {
        timeZone: 'America/Managua', day: '2-digit', month: '2-digit', year: 'numeric'
    });
};
const fmtDateTime = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('es-NI', {
        timeZone: 'America/Managua', day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
    });
};

export default function HistorialCreditoModal({ client, onClose, token }) {
    const [loading, setLoading] = useState(true);
    const [creditTickets, setCreditTickets] = useState([]);
    const [historial, setHistorial] = useState([]);
    const [error, setError] = useState(null);
    const { allUsers } = useAuth();
    const [showTicket, setShowTicket] = useState(false);
    const [selectedAbono, setSelectedAbono] = useState(null);

    const fetchData = useCallback(async () => {
        if (!client) return;
        setLoading(true); setError(null);
        try {
            const [ticketsData, creditos, abonos] = await Promise.all([
                api.getCreditosPendientes(client.id_cliente, token),
                api.getCreditosByClient(client.id_cliente, token),
                api.getAbonosByClient(client.id_cliente, token)
            ]);

            setCreditTickets(Array.isArray(ticketsData) ? ticketsData : []);

            // Construir timeline completo
            const creditosFormat = (creditos || []).map(c => {
                let pd = c.pagoDetalles || {};
                if (typeof pd === 'string') { try { pd = JSON.parse(pd); } catch { pd = {}; } }
                return {
                    id: `c-${c.id_venta}`,
                    fecha: new Date(c.fecha),
                    tipo: 'credito',
                    descripcion: `Compra a crédito (Venta #${c.id_venta})`,
                    monto: Number(pd.credito || c.total || 0),
                    userId: c.id_usuario,
                    idVenta: c.id_venta
                };
            });
            const abonosFormat = (abonos || []).map(a => ({
                id: `a-${a.id_abono}`,
                fecha: new Date(a.fecha),
                tipo: 'abono',
                descripcion: `Abono registrado`,
                monto: Number(a.monto),
                userId: a.id_usuario || a.usuario
            }));
            setHistorial([...creditosFormat, ...abonosFormat].sort((a, b) => b.fecha - a.fecha));
        } catch (err) {
            console.error("Error cargando historial:", err);
            setError("No se pudo cargar el historial del cliente.");
        } finally {
            setLoading(false);
        }
    }, [client, token]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const summary = useMemo(() => {
        const totalCredito = historial.filter(h => h.tipo === 'credito').reduce((s, h) => s + h.monto, 0);
        const totalAbono = historial.filter(h => h.tipo === 'abono').reduce((s, h) => s + h.monto, 0);
        const ticketsPendientes = creditTickets.filter(t => t.saldoRestante > 0).length;
        const ticketsPagados = creditTickets.filter(t => t.saldoRestante <= 0).length;
        return { totalCredito, totalAbono, ticketsPendientes, ticketsPagados };
    }, [historial, creditTickets]);

    if (!client) return null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <Header>
                    <Title>Historial de {client.nombre}</Title>
                    <CloseButton onClick={onClose}><FaTimes /></CloseButton>
                </Header>
                <Body>
                    {loading && <CenteredMessage><SpinAnimation size={30} /> <p>Cargando...</p></CenteredMessage>}
                    {error && <CenteredMessage style={{ color: 'red' }}>{error}</CenteredMessage>}
                    {!loading && !error && (
                        <>
                            {/* Resumen General */}
                            <SummaryContainer>
                                <SummaryCard color="#dc3545"><h3>Total Crédito</h3><p>{formatCurrency(summary.totalCredito)}</p></SummaryCard>
                                <SummaryCard color="#28a745"><h3>Total Abonado</h3><p>{formatCurrency(summary.totalAbono)}</p></SummaryCard>
                                <SummaryCard color="#007bff"><h3>Saldo Actual</h3><p>{formatCurrency(client.saldo_pendiente)}</p></SummaryCard>
                                <SummaryCard color={summary.ticketsPendientes > 0 ? '#ffc107' : '#28a745'}>
                                    <h3>Facturas</h3>
                                    <p style={{ fontSize: '1.2rem' }}>
                                        {summary.ticketsPendientes > 0 ? (
                                            <><FaClock style={{ color: '#ffc107' }} /> {summary.ticketsPendientes} pendiente{summary.ticketsPendientes > 1 ? 's' : ''}</>
                                        ) : (
                                            <><FaCheckCircle style={{ color: '#28a745' }} /> Todo pagado</>
                                        )}
                                    </p>
                                </SummaryCard>
                            </SummaryContainer>

                            {/* Desglose por Ticket */}
                            {creditTickets.length > 0 && (
                                <>
                                    <h3 style={{ margin: '0 0 1rem', color: '#333', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FaFileInvoiceDollar /> Desglose por Factura
                                    </h3>
                                    {creditTickets.map(ticket => {
                                        const pagado = ticket.montoOriginal - ticket.saldoRestante;
                                        const pct = ticket.montoOriginal > 0 ? (pagado / ticket.montoOriginal) * 100 : 0;
                                        return (
                                            <TicketCardStyled key={ticket.idVenta} $estado={ticket.estado}>
                                                <TicketHeader>
                                                    <div>
                                                        <span className="ticket-title">Venta #{ticket.idVenta}</span>
                                                        <StatusBadge $type={ticket.estado} style={{ marginLeft: '0.75rem' }}>{ticket.estado}</StatusBadge>
                                                    </div>
                                                    <span className="ticket-date">{fmtDate(ticket.fecha)}</span>
                                                </TicketHeader>

                                                <ProgressBar $pct={pct}>
                                                    <div className="fill" style={{ width: `${Math.min(100, pct)}%` }} />
                                                </ProgressBar>

                                                <TicketStats>
                                                    <div className="stat">
                                                        <span className="stat-label">Monto Original</span>
                                                        <span className="stat-value">{formatCurrency(ticket.montoOriginal)}</span>
                                                    </div>
                                                    <div className="stat">
                                                        <span className="stat-label">Pagado</span>
                                                        <span className="stat-value" style={{ color: '#28a745' }}>{formatCurrency(pagado)}</span>
                                                    </div>
                                                    <div className="stat">
                                                        <span className="stat-label">Pendiente</span>
                                                        <span className="stat-value" style={{ color: ticket.saldoRestante > 0 ? '#dc3545' : '#28a745' }}>
                                                            {formatCurrency(ticket.saldoRestante)}
                                                        </span>
                                                    </div>
                                                    <div className="stat">
                                                        <span className="stat-label">Progreso</span>
                                                        <span className="stat-value">{Math.round(pct)}%</span>
                                                    </div>
                                                </TicketStats>
                                            </TicketCardStyled>
                                        );
                                    })}
                                </>
                            )}

                            {/* Timeline de movimientos */}
                            <h3 style={{ margin: '1.5rem 0 0.75rem', color: '#333' }}>Historial Completo</h3>
                            <Timeline>
                                {historial.length > 0 ? (
                                    historial.map(item => {
                                        const user = allUsers.find(u => (u.id_usuario ?? u.id) === item.userId);
                                        return (
                                            <TimelineItem key={item.id} $type={item.tipo}>
                                                <div className="icon">
                                                    {item.tipo === 'credito' ? <FaCreditCard /> : <FaMoneyBillWave />}
                                                </div>
                                                <div className="content">
                                                    <span className="amount">{formatCurrency(item.monto)}</span>
                                                    <p style={{ margin: '2px 0' }}>{item.descripcion}</p>
                                                    <span className="meta">
                                                        {fmtDateTime(item.fecha)} por <strong>{user?.nombre_usuario || 'Sistema'}</strong>
                                                    </span>
                                                </div>
                                            </TimelineItem>
                                        );
                                    })
                                ) : (
                                    <CenteredMessage>
                                        <FaFileInvoiceDollar size={40} />
                                        <p>No hay movimientos para mostrar.</p>
                                    </CenteredMessage>
                                )}
                            </Timeline>
                        </>
                    )}
                </Body>
            </ModalContent>

            {showTicket && selectedAbono && (
                <TicketModal
                    transaction={{ estado: 'ABONO_CREDITO', totalVenta: selectedAbono.monto, fecha: selectedAbono.fecha, id: selectedAbono.id.split('-')[1], clientId: client.id_cliente, userId: selectedAbono.userId }}
                    creditStatus={{ remainingBalance: Number(client.saldo_pendiente || 0) }}
                    clients={[client]}
                    users={allUsers}
                    onClose={() => setShowTicket(false)}
                />
            )}
        </ModalOverlay>
    );
}