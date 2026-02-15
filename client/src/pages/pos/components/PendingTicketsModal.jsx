import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
    FaTimes, 
    FaSync, 
    FaFileInvoiceDollar, 
    FaBug, 
    FaClipboardList 
} from 'react-icons/fa';
import * as api from '../../service/api'; 

// Función de formato de moneda local (solo para este componente)
const fmt = (n) =>
  new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n || 0));

// --- ESTILOS DEL MODAL ---
const Overlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9999;
  display: flex; align-items: center; justify-content: center; backdrop-filter: blur(3px);
`;
const Container = styled.div`
  background: white; width: 95%; max-width: 1100px; height: 85vh; border-radius: 12px;
  display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  font-family: 'Segoe UI', sans-serif;
`;
const Header = styled.div`
  padding: 20px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;
  background: #f8fafc; border-radius: 12px 12px 0 0;
`;
const Body = styled.div`flex: 1; padding: 20px; overflow-y: auto; display: flex; gap: 20px;`;
const ListSection = styled.div`flex: 2; display: flex; flex-direction: column; gap: 15px;`;
const DetailSection = styled.div`
  flex: 1; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px;
  display: flex; flex-direction: column; gap: 15px; height: fit-content;
`;
const DebugBox = styled.pre`
  background: #333; color: #0f0; padding: 10px; border-radius: 5px; font-size: 0.7rem; 
  max-height: 150px; overflow: auto; margin-top: 20px;
`;

const Input = styled.input`width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; outline: none; &:focus{border-color:#3b82f6}`;
const Button = styled.button`
  padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px; justify-content: center;
  background: ${p => p.color || '#3b82f6'}; color: white; transition: 0.2s;
  &:hover { opacity: 0.9; transform: translateY(-1px); }
  &:disabled { background: #94a3b8; cursor: not-allowed; }
`;
const Table = styled.table`
  width: 100%; border-collapse: collapse; font-size: 0.9rem;
  th { text-align: left; padding: 12px; background: #f1f5f9; position: sticky; top: 0; }
  td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
  tr:hover { background: #f8fafc; }
`;
const Badge = styled.span`
  padding: 3px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;
  background: ${p => p.bg}; color: ${p => p.txt};
`;

const PendingTicketsModal = ({ onClose, onLoadToPOS, token, showAlert }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [rawDataDebug, setRawDataDebug] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);

    // --- FUNCIONES HELPER LOCALES ---
    const getNum = (val) => {
         if (val === null || val === undefined) return 0;
         const num = parseFloat(val);
         return isNaN(num) ? 0 : num;
    };

    const getCliente = (obj) => {
         return obj.clienteNombre || 
                obj.cliente?.nombre || 
                obj.nombre_cliente || 
                'Consumidor Final';
    };

    const getEstado = (obj) => {
         return (obj.estado || obj.status || 'PENDIENTE').toUpperCase();
    };

    // --- CARGA DE DATOS ---
    const loadData = async () => {
        setLoading(true);
        setSelectedTicket(null); // Deseleccionar al recargar
        showAlert({ title: "Cargando", message: "Buscando pedidos pendientes...", type: "loading" });

        try {
            let orders = [];
            let sales = [];

            try {
                 const resOrders = await api.fetchOrders(token);
                 if (Array.isArray(resOrders)) { orders = resOrders; } 
                 else if (resOrders && Array.isArray(resOrders.data)) { orders = resOrders.data; } 
                 else if (resOrders && resOrders.orders) { orders = Array.isArray(resOrders.orders) ? resOrders.orders : []; }
            } catch (e) { console.error("❌ Error Pedidos:", e); }

            try {
                 const resSales = await api.fetchSales(token);
                 if (Array.isArray(resSales)) { sales = resSales; } 
                 else if (resSales && Array.isArray(resSales.data)) { sales = resSales.data; }
            } catch (e) { console.error("❌ Error Ventas:", e); }

            // Procesar pedidos
            const processedOrders = orders.map(o => {
                 const totalPedido = getNum(o.total || o.monto_total || o.precio_total || 0);
                 const abonadoPedido = getNum(o.abonado || o.pagado || 0);
                 
                 return {
                     id: o.id || o.id_pedido,
                     type: 'PEDIDO',
                     raw: o,
                     client: getCliente(o),
                     date: o.created_at || o.fecha || o.fecha_creacion || new Date().toISOString(),
                     total: totalPedido,
                     paid: abonadoPedido,
                     status: getEstado(o),
                     saldo: totalPedido - abonadoPedido,
                 };
            });

            // Procesar ventas pendientes (crédito/apartado que no estén completadas)
            const processedSales = sales.map(s => {
                 const totalVenta = getNum(s.total_venta || s.total || s.monto_final || 0);
                 const pagadoVenta = getNum(s.monto_pagado || s.abonado || 0);
                 const estadoVenta = getEstado(s);
                 
                 if (estadoVenta.includes('COMPLETADO') || estadoVenta.includes('CANCELADO')) {
                     return null;
                 }
                 
                 return {
                     id: s.id || s.id_venta,
                     type: 'VENTA',
                     raw: s,
                     client: getCliente(s),
                     date: s.fecha || s.created_at || s.fecha_creacion || new Date().toISOString(),
                     total: totalVenta,
                     paid: pagadoVenta,
                     status: estadoVenta,
                     saldo: totalVenta - pagadoVenta
                 };
            }).filter(Boolean);

            const allItems = [...processedOrders, ...processedSales];
            
            const filteredList = allItems.filter(t => {
                 if (t.status.includes('CANCELADO') || t.status.includes('ANULADO') || t.status.includes('COMPLETADO')) {
                     return false;
                 }
                 if (t.saldo > 0.01) return true; // Si hay saldo pendiente
                 if (t.status.includes('PENDIENTE') || t.status.includes('APARTADO') || t.status.includes('CREDITO') || t.status.includes('POR COBRAR')) {
                     return true;
                 }
                 return false;
            });

            filteredList.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            setTickets(filteredList);
            showAlert({ title: "Carga Completa", message: `Se encontraron ${filteredList.length} pedidos pendientes.`, type: "success" });
            
        } catch (error) {
            console.error("❌ Error fatal:", error);
            showAlert({ title: "Error de Carga", message: "No se pudieron obtener los pedidos pendientes." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [token]);

    const handleLoadTicket = (rawTicket) => {
        if (!onLoadToPOS) return;
        // Llama a la función del POS para cargar el ticket al carrito activo
        onLoadToPOS(rawTicket);
    };

    const displayTickets = tickets.filter(t => 
        t.client.toLowerCase().includes(searchTerm.toLowerCase()) || String(t.id).includes(searchTerm)
    );

    return (
        <Overlay>
            <Container>
                <Header>
                    <h2 style={{margin:0, display:'flex', alignItems:'center', gap:10}}>
                        <FaFileInvoiceDollar color="#2563eb"/> Pedidos Pendientes ({tickets.length})
                    </h2>
                    <Button onClick={onClose} color="#ef4444" style={{padding:'8px'}}><FaTimes/></Button>
                </Header>

                <Body>
                    <ListSection>
                        <div style={{display:'flex', gap:10}}>
                            <Input placeholder="Buscar por cliente o ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} autoFocus/>
                            <Button color="#64748b" onClick={loadData} disabled={loading}>{loading ? 'Recargando...' : <FaSync/>}</Button>
                        </div>
                        
                        <div style={{overflow:'auto', border:'1px solid #e2e8f0', borderRadius:8, flex:1}}>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>ID</th><th>Tipo</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Pagado</th><th>Saldo</th><th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={8} align="center" style={{padding:20}}>Cargando...</td></tr>
                                    ) : displayTickets.length === 0 ? (
                                        <tr><td colSpan={8} align="center" style={{padding:20}}>No hay tickets pendientes.</td></tr>
                                    ) : displayTickets.map(t => (
                                        <tr key={`${t.type}-${t.id}`} 
                                            style={{background: selectedTicket?.id === t.id ? '#eff6ff' : '', cursor: 'pointer'}} 
                                            onClick={() => setSelectedTicket(t)}
                                        >
                                            <td>#{t.id}</td>
                                            <td><Badge bg={t.type === 'PEDIDO'?'#fff7ed':'#f0f9ff'} txt={t.type==='PEDIDO'?'#c2410c':'#0369a1'}>{t.type}</Badge></td>
                                            <td>{new Date(t.date).toLocaleDateString()}</td>
                                            <td>{t.client}</td>
                                            <td>C$ {fmt(t.total)}</td>
                                            <td>C$ {fmt(t.paid)}</td>
                                            <td style={{color:t.saldo>0?'red':'green', fontWeight:'bold'}}>C$ {fmt(t.saldo)}</td>
                                            <td>
                                                <Button 
                                                    onClick={() => handleLoadTicket(t.raw)} 
                                                    style={{padding:'5px 10px', fontSize:'0.8rem', background: '#2563eb'}}
                                                >
                                                    <FaClipboardList/> Cargar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </ListSection>

                    {selectedTicket && (
                        <DetailSection>
                            <h3>Ticket Seleccionado #{selectedTicket.id}</h3>
                            <p>Cliente: <strong>{selectedTicket.client}</strong></p>
                            <p>Tipo: <strong>{selectedTicket.type}</strong></p>
                            <p style={{fontSize:'1.1rem'}}>Total: C$ {fmt(selectedTicket.total)}</p>
                            <p style={{fontSize:'1.1rem', color:'green'}}>Pagado: C$ {fmt(selectedTicket.paid)}</p>
                            <p style={{fontSize:'1.4rem', color:'red'}}>Saldo Pendiente: C$ {fmt(selectedTicket.saldo)}</p>
                            
                            <Button 
                                onClick={() => handleLoadTicket(selectedTicket.raw)} 
                                color="#2563eb" 
                                style={{width:'100%', marginTop:20, padding:15}}
                            >
                                <FaClipboardList/> CARGAR AL POS
                            </Button>
                            
                            <div style={{marginTop: 15, padding: 10, background: '#fef3c7', borderRadius: 6}}>
                                <small>
                                    <strong>Nota:</strong> Esto transfiere el detalle de los productos y el saldo pendiente al carrito del POS para que puedas proceder al pago/facturación final.
                                </small>
                            </div>
                        </DetailSection>
                    )}
                </Body>
            </Container>
        </Overlay>
    );
};

export default PendingTicketsModal;