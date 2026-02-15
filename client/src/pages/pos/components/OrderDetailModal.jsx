import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../../context/AuthContext';
import * as api from '../../../service/api';
import { ModalOverlay, ModalContent, Button } from '../POS.styles';
import PaymentModal from './PaymentModal';
import { FaInfoCircle, FaBox, FaHistory } from 'react-icons/fa';

const DetailsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-height: 70vh;
    overflow-y: auto;
    padding: 5px;
`;
const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;
const InfoCard = styled.div`
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #e9ecef;
    h4 {
        margin-top: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #495057;
    }
    p { margin: 0.5rem 0; }
`;
const ActionsSection = styled.div`
    margin-top: 1.5rem;
    border-top: 1px solid #e9ecef;
    padding-top: 1.5rem;
`;

const OrderDetailModal = ({ pedidoId, onClose, onUpdate, showAlert, showConfirmation, isCajaOpen }) => {
    const { addCajaTransaction, clients, user } = useAuth();
    const token = localStorage.getItem('token');
    const [pedido, setPedido] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    const [abonoAmount, setAbonoAmount] = useState('');

    const tasaDolar = useMemo(() => {
        if (!user) return 36.60;
        const userId = user.id_usuario || user.id;
        return Number(localStorage.getItem(`tasa_dolar_${userId}`) || 36.60);
    }, [user]);

    const fetchDetails = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await api.fetchOrderDetails(pedidoId, token);
            setPedido(data);
        } catch (error) {
            showAlert({ title: "Error", message: `No se pudieron cargar los detalles del pedido. ${error.message}` });
            onClose();
        } finally {
            setIsLoading(false);
        }
    }, [pedidoId, token, showAlert, onClose]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    const saldoPendiente = pedido ? Number(pedido.total) - Number(pedido.abonado) : 0;
    
    const handleAddAbono = async () => {
        const monto = parseFloat(abonoAmount);
        if (isNaN(monto) || monto <= 0) {
            showAlert({title: "Monto Inválido", message: "Ingrese un monto válido para el abono."});
            return;
        }
        if (monto > saldoPendiente + 0.01) {
            showAlert({title: "Monto Excedido", message: `El abono no puede ser mayor al saldo pendiente de C$${saldoPendiente.toFixed(2)}.`});
            return;
        }
        try {
            const pagoDetalles = { efectivo: monto, ingresoCaja: monto };
            await api.addAbonoToOrder(pedidoId, { monto, pagoDetalles }, token);
            addCajaTransaction({
                type: 'abono',
                amount: monto,
                note: `Abono al Pedido #${pedidoId}`,
                at: new Date().toISOString(),
                pagoDetalles: { ingresoCaja: monto }
            });
            showAlert({title: "Éxito", message: "Abono registrado correctamente."});
            setAbonoAmount('');
            await fetchDetails();
            onUpdate();
        } catch (error) {
            showAlert({title: "Error", message: `No se pudo registrar el abono. ${error.message}`});
        }
    };
    
    const handleLiquidar = async (pagoDetalles) => {
        const ingresoRealEnCaja = (pagoDetalles.efectivo || 0) + ((pagoDetalles.dolares || 0) * tasaDolar) - (pagoDetalles.cambio || 0);
        showConfirmation({
            title: "Confirmar Liquidación",
            message: `¿Confirma la liquidación del pedido #${pedido.id} por C$${saldoPendiente.toFixed(2)}?`,
            onConfirm: async () => {
                 try {
                    await api.liquidateOrder(pedido.id, { pagoDetalles }, token);
                    addCajaTransaction({
                        type: 'liquidación',
                        amount: saldoPendiente,
                        note: `Liquidación del Pedido #${pedidoId}`,
                        at: new Date().toISOString(),
                        pagoDetalles: { ...pagoDetalles, ingresoCaja: ingresoRealEnCaja }
                    });
                    showAlert({title: "Éxito", message: "Pedido liquidado y completado."});
                    setPaymentModalOpen(false);
                    onUpdate();
                    onClose();
                } catch (error) {
                    showAlert({title: "Error", message: `No se pudo liquidar el pedido. ${error.message}`});
                }
            }
        });
    };

    const handleCancel = () => {
        showConfirmation({
            title: "Cancelar Pedido",
            message: `¿Está seguro de CANCELAR el Pedido #${pedido.id}? El stock reservado será devuelto. Los abonos NO se devuelven automáticamente.`,
            onConfirm: async () => {
                try {
                    await api.cancelOrder(pedido.id, token);
                    addCajaTransaction({
                        type: 'cancelación',
                        amount: 0,
                        note: `Cancelación del Pedido #${pedidoId}`,
                        at: new Date().toISOString(),
                        pagoDetalles: { ingresoCaja: 0 }
                    });
                    showAlert({title: "Éxito", message: "Pedido cancelado correctamente."});
                    onUpdate();
                    onClose();
                } catch (error) {
                    showAlert({title: "Error", message: `No se pudo cancelar el pedido. ${error.message}`});
                }
            }
        });
    };

    if (isLoading) return <ModalOverlay><ModalContent>Cargando detalles...</ModalContent></ModalOverlay>;
    if (!pedido) return null;

    return (
        <>
            <ModalOverlay>
                <ModalContent $large>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <h2>Detalles del Pedido #{pedido.id}</h2>
                        <Button $cancel onClick={onClose} style={{padding: '0.5rem'}}>✕</Button>
                    </div>
                    <DetailsWrapper>
                        <InfoGrid>
                            <InfoCard>
                                <h4><FaInfoCircle /> Información General</h4>
                                <p><strong>Cliente:</strong> {pedido.cliente}</p>
                                <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleString('es-NI')}</p>
                                <p><strong>Estado:</strong> <span style={{fontWeight:'bold'}}>{pedido.estado}</span></p>
                            </InfoCard>
                            <InfoCard>
                                <h4>Resumen Financiero</h4>
                                <p><strong>Total Pedido:</strong> C${Number(pedido.total).toFixed(2)}</p>
                                <p style={{color: '#28a745'}}><strong>Total Abonado:</strong> C${Number(pedido.abonado).toFixed(2)}</p>
                                <p style={{fontSize: '1.2rem', fontWeight: 'bold', color: '#dc3545'}}>Saldo Pendiente: C${saldoPendiente.toFixed(2)}</p>
                            </InfoCard>
                        </InfoGrid>
                        
                        <InfoCard>
                            <h4><FaBox /> Productos</h4>
                            {pedido.items.map((item, index) => (
                                <div key={index} style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', padding: '8px 0'}}>
                                    <span>{item.cantidad} x {item.nombre}</span>
                                    <span>@ C${Number(item.precio).toFixed(2)}</span>
                                </div>
                            ))}
                        </InfoCard>

                        <InfoCard>
                             <h4><FaHistory /> Historial de Abonos</h4>
                            {pedido.abonos.length > 0 ? pedido.abonos.map((abono, index) => (
                                <p key={index}>- {new Date(abono.fecha).toLocaleDateString()}: <strong>C${Number(abono.monto).toFixed(2)}</strong></p>
                            )) : <p>No hay abonos registrados.</p>}
                        </InfoCard>
                    </DetailsWrapper>
                    
                    {pedido.estado !== 'COMPLETADO' && pedido.estado !== 'CANCELADO' && isCajaOpen && (
                        <ActionsSection>
                             <h4>Acciones</h4>
                            <div style={{display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem'}}>
                                <input type="number" placeholder="Monto a abonar" value={abonoAmount} onChange={e => setAbonoAmount(e.target.value)} style={{padding: '0.7rem', flex: 1, fontSize: '1rem'}} min="0" />
                                <Button onClick={handleAddAbono}>Abonar</Button>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem'}}>
                                <Button onClick={handleCancel} style={{backgroundColor: '#6c757d'}}>Cancelar Pedido</Button>
                                <Button $primary onClick={() => setPaymentModalOpen(true)} disabled={saldoPendiente <= 0}>Liquidar Saldo (C${saldoPendiente.toFixed(2)})</Button>
                            </div>
                        </ActionsSection>
                    )}

                    <div style={{marginTop: '1.5rem', textAlign: 'center'}}>
                        {pedido.estado === 'COMPLETADO' && <p style={{color: 'green', fontWeight: 'bold'}}>Este pedido ya fue completado.</p>}
                        {pedido.estado === 'CANCELADO' && <p style={{color: 'red', fontWeight: 'bold'}}>Este pedido fue cancelado.</p>}
                    </div>

                </ModalContent>
            </ModalOverlay>
            {isPaymentModalOpen && 
                <PaymentModal 
                    total={saldoPendiente} 
                    onFinishSale={handleLiquidar} 
                    onClose={() => setPaymentModalOpen(false)} 
                    showAlert={showAlert}
                    clientes={clients}
                    tasaDolar={tasaDolar}
                />
            }
        </>
    );
};

export default OrderDetailModal;