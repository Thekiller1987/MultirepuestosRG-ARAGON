import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { FaUsers, FaCreditCard, FaTrashAlt, FaEdit, FaPlus, FaMoneyBillWave, FaArrowLeft, FaRedo, FaHistory, FaPhone, FaIdCard } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import * as api from '../service/api';
import ClientFormModal from './pos/components/ClientFormModal';
import AbonoCreditoModal from './pos/components/AbonoCreditoModal';
import HistorialCreditoModal from './pos/components/HistorialCreditoModal';
import SalesHistoryModal from './pos/components/SalesHistoryModal';
import TicketModal from './pos/components/TicketModal';

const PageWrapper = styled.div`
    padding: 2rem 4rem;
    background: #f8f9fa;
    min-height: 100vh;
    @media(max-width: 992px) {
        padding: 1rem;
    }
`;

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    color: #343a40;
    display: flex;
    align-items: center;
    gap: 1rem;
    @media(max-width: 992px) {
        font-size: 1.8rem;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
`;

const Button = styled.button`
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    color: white;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    background: ${props => props.primary ? '#007bff' : props.$delete ? '#dc3545' : props.$abono ? '#17a2b8' : props.$refresh ? '#6c757d' : '#6c757d'};
    &:hover:not(:disabled) {
        opacity: 0.85;
    }
    &:disabled {
        background: #adb5bd;
        cursor: not-allowed;
    }
`;

const BackButton = styled(Link)`
    padding: 0.7rem 1.3rem;
    background-color: #6c757d;
    color: white;
    border-radius: 8px;
    font-weight: bold;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    &:hover {
        background-color: #5a6268;
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    border-radius: 8px;
    overflow: hidden;
    @media(max-width: 992px) {
        display: none;
    }
    th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #dee2e6;
        vertical-align: middle;
    }
    th {
        background: #f8f9fa;
        color: #495057;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.8rem;
    }
`;

/* MOBILE STYLES */
const MobileGrid = styled.div`
    display: none;
    @media(max-width: 992px) {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
`;

const ClientCard = styled.div`
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    padding: 1.25rem;
    border: 1px solid #e9ecef;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-left: 5px solid ${props => props.$hasDebt ? '#dc3545' : '#28a745'};
`;

const CardRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const CardLabel = styled.span`
    font-size: 0.85rem;
    color: #6c757d;
    font-weight: 600;
`;

const CardValue = styled.span`
    font-size: 1rem;
    font-weight: 700;
    color: ${props => props.color || '#343a40'};
`;

const ActionGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px dashed #dee2e6;
`;

export default function ClientesYCreditos() {
    const { clients, user, token, isLoading, refreshClients, cajaSession, allUsers } = useAuth();
    const [modal, setModal] = useState({ name: null, data: null });
    const [ticketToPrint, setTicketToPrint] = useState(null);

    // Bridge: AbonoCreditoModal expects showAlert({ title, message, type })
    const showAlert = ({ title, message, type }) => {
        if (type === 'error') toast.error(message);
        else toast.success(message);
    };

    const isCajaOpen = useMemo(() => {
        return cajaSession && !cajaSession.closedAt;
    }, [cajaSession]);

    const handleDelete = async (cliente) => {
        if (cliente.saldo_pendiente > 0) {
            toast.error("El cliente tiene saldo pendiente.");
            return;
        }
        if (window.confirm("¿Seguro de eliminar este cliente?")) {
            try {
                await api.deleteClient(cliente.id_cliente, token);
                toast.success("Cliente eliminado correctamente.");
                refreshClients();
            } catch (err) {
                toast.error(err.message || "Error al eliminar cliente.");
            }
        }
    };

    const handleOpenModal = (name, data = null) => setModal({ name, data });
    const handleCloseModal = () => setModal({ name: null, data: null });

    const formatCurrency = (amount) => `C$${Number(amount || 0).toFixed(2)}`;
    const renderLimit = (limit) => limit === null ? '∞' : formatCurrency(limit);

    if (isLoading) {
        return <PageWrapper><h1>Cargando...</h1></PageWrapper>;
    }

    return (
        <PageWrapper>
            <HeaderContainer>
                <Title><FaUsers /> Clientes y Créditos</Title>
                <ButtonGroup>
                    <Button primary onClick={() => handleOpenModal('client')}><FaPlus /> Crear Cliente</Button>
                    <Button $refresh onClick={refreshClients}><FaRedo /> Recargar</Button>
                    <BackButton to="/dashboard"><FaArrowLeft /> Volver</BackButton>
                </ButtonGroup>
            </HeaderContainer>

            <Table>
                <thead>
                    <tr><th>ID</th><th>Nombre</th><th>Teléfono</th><th>Límite</th><th><FaCreditCard /> Saldo</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                    {clients.map(c => (
                        <tr key={c.id_cliente}>
                            <td>{c.id_cliente}</td>
                            <td>{c.nombre}</td>
                            <td>{c.telefono || 'N/A'}</td>
                            <td>{renderLimit(c.limite_credito)}</td>
                            <td style={{ fontWeight: 'bold', color: c.saldo_pendiente > 0 ? '#dc3545' : '#28a745' }}>{formatCurrency(c.saldo_pendiente)}</td>
                            <td>
                                <ButtonGroup>
                                    <Button $abono disabled={!isCajaOpen || c.saldo_pendiente <= 0} onClick={() => handleOpenModal('abono', c)}><FaMoneyBillWave /> Abono</Button>
                                    <Button onClick={() => handleOpenModal('client', c)}><FaEdit /> Editar</Button>
                                    <Button $delete onClick={() => handleDelete(c)}><FaTrashAlt /> Eliminar</Button>
                                    <Button primary onClick={() => handleOpenModal('historial', c)}><FaHistory /> Créditos</Button>
                                    <Button $refresh style={{ background: '#6f42c1' }} onClick={() => handleOpenModal('tickets', c)}><FaMoneyBillWave /> Ver Tickets</Button>
                                </ButtonGroup>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <MobileGrid>
                {clients.map(c => (
                    <ClientCard key={c.id_cliente} $hasDebt={c.saldo_pendiente > 0}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                            <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#343a40' }}>{c.nombre}</span>
                            <span style={{ fontSize: '0.8rem', color: '#adb5bd' }}>#{c.id_cliente}</span>
                        </div>

                        <CardRow>
                            <CardLabel><FaPhone size={12} /> Teléfono</CardLabel>
                            <CardValue style={{ fontWeight: 'normal' }}>{c.telefono || 'N/A'}</CardValue>
                        </CardRow>

                        <CardRow>
                            <CardLabel><FaIdCard size={12} /> Límite</CardLabel>
                            <CardValue style={{ fontWeight: 'normal' }}>{renderLimit(c.limite_credito)}</CardValue>
                        </CardRow>

                        <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600, color: '#495057' }}>Saldo Pendiente:</span>
                            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: c.saldo_pendiente > 0 ? '#dc3545' : '#28a745' }}>
                                {formatCurrency(c.saldo_pendiente)}
                            </span>
                        </div>

                        <ActionGrid>
                            <Button $abono disabled={!isCajaOpen || c.saldo_pendiente <= 0} onClick={() => handleOpenModal('abono', c)} style={{ justifyContent: 'center' }}>
                                <FaMoneyBillWave /> Abonar
                            </Button>
                            <Button onClick={() => handleOpenModal('client', c)} style={{ justifyContent: 'center', background: '#e2e6ea', color: '#495057' }}>
                                <FaEdit /> Editar
                            </Button>
                            <Button primary onClick={() => handleOpenModal('historial', c)} style={{ justifyContent: 'center' }}>
                                <FaHistory /> Historial
                            </Button>
                            <Button $refresh style={{ background: '#6f42c1', justifyContent: 'center' }} onClick={() => handleOpenModal('tickets', c)}>
                                <FaMoneyBillWave /> Tickets
                            </Button>
                            <Button $delete onClick={() => handleDelete(c)} style={{ justifyContent: 'center', gridColumn: 'span 2' }}>
                                <FaTrashAlt /> Eliminar Cliente
                            </Button>
                        </ActionGrid>
                    </ClientCard>
                ))}
            </MobileGrid>

            {modal.name === 'client' && <ClientFormModal client={modal.data} onClose={handleCloseModal} onSave={refreshClients} />}
            {modal.name === 'abono' && <AbonoCreditoModal client={modal.data} onClose={handleCloseModal} onAbonoSuccess={refreshClients} showAlert={showAlert} />}
            {modal.name === 'historial' && <HistorialCreditoModal client={modal.data} onClose={handleCloseModal} token={token} />}

            {/* Modal de Tickets (SalesHistoryModal) Integrado */}
            {modal.name === 'tickets' && (
                <SalesHistoryModal
                    onClose={handleCloseModal}
                    initialClientId={modal.data?.id_cliente} // Pass client ID to filter
                    clients={clients}
                    users={allUsers} // Pass users for seller name resolution
                    loadSales={async (date) => {
                        try {
                            // Reuse the fetchSales from api service
                            return await api.fetchSales(token, date);
                        } catch (e) { console.error(e); return []; }
                    }}
                    onReprintTicket={(sale) => {
                        setTicketToPrint(sale); // Set ticket to print
                    }}
                />
            )}

            {/* Modal para Reimprimir Ticket */}
            {ticketToPrint && (
                <TicketModal
                    isOpen={true}
                    transaction={ticketToPrint}
                    onClose={() => setTicketToPrint(null)}
                    clients={clients}
                    users={allUsers}
                    currentUser={user}
                />
            )}
        </PageWrapper>
    );
}