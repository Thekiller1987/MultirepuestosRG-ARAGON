import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    FaExclamationTriangle, FaArrowLeft, FaTruck, FaHistory,
    FaSearch, FaBarcode, FaTrash, FaSave, FaTimes, FaPrint, FaFileInvoice, FaUser
} from 'react-icons/fa';
import * as api from '../service/api';
import { useAuth } from '../context/AuthContext';
import OutflowTicketModal from './pos/components/OutflowTicketModal';
import { motion, AnimatePresence } from 'framer-motion';

const ModalOverlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
  background: rgba(15, 23, 42, 0.6); z-index: 50; 
  display: flex; align-items: center; justify-content: center; padding: 1rem;
  backdrop-filter: blur(4px);
`;
const ModalContent = styled.div`
  background: white; width: 100%; max-width: 450px; 
  border-radius: 20px; padding: 2rem; 
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;
const ModalTitle = styled.h2` margin-top: 0; color: #1e293b; margin-bottom: 1rem; font-size: 1.4rem; display: flex; align-items: center; gap: 10px; `;
const ModalActions = styled.div` display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; `;
const CancelButton = styled.button` background: white; color: #64748b; border: 1px solid #cbd5e1; padding: 10px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; `;
const SaveButton = styled.button` background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; `;

const ConfirmDialog = ({ open, onCancel, onConfirm, title, message }) => {
    if (!open) return null;
    return (
        <ModalOverlay onClick={onCancel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <ModalTitle><FaExclamationTriangle color="#ef4444" /> {title}</ModalTitle>
                <p style={{ color: '#4b5563', lineHeight: 1.5 }}>{message}</p>
                <ModalActions>
                    <CancelButton onClick={onCancel}>Cancelar</CancelButton>
                    <SaveButton onClick={onConfirm}>Confirmar Salida</SaveButton>
                </ModalActions>
            </ModalContent>
        </ModalOverlay>
    );
};

/* ================== STYLES COPIED/ADAPTED FROM POS/INVENTORY ================== */
const PageContainer = styled.div`
  display: flex; flex-direction: column; height: 100vh; background-color: #f3f4f6;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.header`
  background: white; padding: 1rem 1.5rem; display: flex; align-items: center; justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05); z-index: 10;
`;

const Title = styled.h1`
  font-size: 1.5rem; font-weight: 800; color: #111827; display: flex; align-items: center; gap: 10px; margin: 0;
`;

const MainContent = styled.div`
  display: flex; flex: 1; overflow: hidden; padding: 1rem; gap: 1rem;
  @media(max-width: 768px) { flex-direction: column; }
`;

const Panel = styled.div`
  background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  display: flex; flex-direction: column; overflow: hidden;
`;

const SearchPanel = styled(Panel)`
  flex: 1.5; padding: 1rem;
`;

const CartPanel = styled(Panel)`
  flex: 1; min-width: 350px; background: #fff; border-left: 1px solid #e5e7eb;
`;

const SearchInputContainer = styled.div`
  position: relative; margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%; padding: 12px 14px 12px 45px; border: 2px solid #e5e7eb; border-radius: 8px;
  font-size: 1rem; outline: none; transition: all 0.2s;
  &:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
`;

const ProductList = styled.div`
  flex: 1; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; padding-bottom: 10px;
`;

const ProductCard = styled.div`
  border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; cursor: pointer; transition: all 0.2s;
  background: white; display: flex; flex-direction: column; justify-content: space-between; height: 120px;
  &:hover { border-color: #3b82f6; transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
`;

const CartList = styled.div`
  flex: 1; overflow-y: auto; padding: 10px;
`;

const CartItem = styled.div`
  display: flex; justify-content: space-between; align-items: center; padding: 10px;
  background: #f9fafb; border-bottom: 1px solid #e5e7eb; margin-bottom: 5px; border-radius: 6px;
`;

const ReasonInput = styled.textarea`
  width: 100%; padding: 10px; border: 2px solid #e5e7eb; border-radius: 8px; margin: 10px 0;
  resize: none; font-family: inherit;
  &:focus { border-color: #3b82f6; outline: none; }
`;

const ActionButton = styled.button`
  width: 100%; padding: 12px; background: #ef4444; color: white; font-weight: bold; border: none; border-radius: 8px;
  cursor: pointer; font-size: 1rem; transition: background 0.2s;
  &:hover { background: #dc2626; }
  &:disabled { background: #fee2e2; cursor: not-allowed; }
`;

const ToggleContainer = styled.div`
  display: flex; background: #e2e8f0; border-radius: 10px; padding: 4px; margin-bottom: 1rem;
`;

const ToggleButton = styled.button`
  flex: 1; padding: 8px; border-radius: 7px; border: none; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
  ${props => props.$active ? `background: white; color: #1e293b; shadow: 0 2px 4px rgba(0,0,0,0.1);` : `background: transparent; color: #64748b;`}
`;

const ClientSelector = styled.div`
  background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px; margin-bottom: 1rem; position: relative;
`;

const ClientSearchInput = styled.input`
  width: 100%; border: none; outline: none; font-size: 0.9rem; padding: 4px; border-bottom: 1px solid #f1f5f9;
`;

const ClientDropdown = styled.div`
  position: absolute; top: 100%; left: 0; width: 100%; background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); z-index: 20; max-height: 200px; overflow-y: auto;
`;

const ClientOption = styled.div`
  padding: 8px 12px; cursor: pointer; &:hover { background: #f8fafc; } border-bottom: 1px solid #f1f5f9;
`;

const HistoryItem = styled.div`
  padding: 12px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;
  &:hover { background: #f8fafc; }
`;

/* ================== COMPONENTS ================== */

const InventoryOutflowPage = () => {
    const { user, products: globalProducts, refreshProducts } = useAuth();
    const navigate = useNavigate();

    // States
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [reason, setReason] = useState('');
    const [outflowType, setOutflowType] = useState('SALIDA'); // 'SALIDA' or 'COTIZACION'
    const [selectedClient, setSelectedClient] = useState(null);
    const [clientSearch, setClientSearch] = useState('');
    const [showClientDropdown, setShowClientDropdown] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState([]);
    const [ticketData, setTicketData] = useState(null); // For printing
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { clients = [] } = useAuth();
    const filteredClients = useMemo(() => {
        if (!clientSearch.trim()) return clients.slice(0, 10);
        return clients.filter(c => c.nombre.toLowerCase().includes(clientSearch.toLowerCase())).slice(0, 10);
    }, [clientSearch, clients]);

    // Refs
    const searchInputRef = useRef(null);

    // Search Logic (Memoized for performance)
    const results = React.useMemo(() => {
        if (!searchTerm.trim()) return globalProducts.slice(0, 24);
        const term = searchTerm.toLowerCase();
        return globalProducts.filter(p =>
            (p.nombre?.toLowerCase().includes(term)) ||
            (p.codigo?.toString().toLowerCase().includes(term))
        ).slice(0, 50);
    }, [searchTerm, globalProducts]);

    // 3. Add to Cart
    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id_producto === product.id_producto);
            if (existing) {
                // Check stock only for Salida
                if (outflowType === 'SALIDA' && existing.cantidad >= product.existencia) {
                    toast.error('No hay suficiente stock.');
                    return prev;
                }
                return prev.map(item =>
                    item.id_producto === product.id_producto
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            } else {
                if (outflowType === 'SALIDA' && product.existencia <= 0) {
                    toast.error('Producto sin existencia.');
                    return prev;
                }
                toast.success(`${product.nombre} añadido`);
                return [...prev, { ...product, cantidad: 1, unit: product.precio, precio_modificado: product.precio }];
            }
        });
        setSearchTerm('');
        searchInputRef.current?.focus();
    };

    // 4. Remove/Update Cart
    const updateQty = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id_producto === id) {
                const newQty = item.cantidad + delta;
                if (newQty <= 0) return null; // Remove
                if (outflowType === 'SALIDA' && newQty > item.existencia) return item; // Limit
                return { ...item, cantidad: newQty };
            }
            return item;
        }).filter(Boolean));
    };

    const updatePrice = (id, newPrice) => {
        setCart(prev => prev.map(item => {
            if (item.id_producto === id) {
                return { ...item, precio_modificado: newPrice };
            }
            return item;
        }));
    };

    // 5. Submit Outflow
    const handleSubmit = async () => {
        if (outflowType === 'SALIDA' && !reason.trim()) return toast.error('Debe ingresar un motivo para la salida.');
        if (outflowType === 'COTIZACION' && !selectedClient) return toast.error('Seleccione un cliente para la cotización.');
        if (cart.length === 0) return toast.error('El carrito está vacío.');
        setShowConfirm(true);
    };

    const confirmSubmit = async () => {
        setShowConfirm(false);

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await api.createOutflow({
                motivo: reason,
                items: cart,
                tipo: outflowType,
                id_cliente: selectedClient?.id_cliente,
                cliente_nombre: selectedClient?.nombre
            }, token);

            // Success
            setCart([]);
            setReason('');
            setSelectedClient(null);
            setClientSearch('');
            setTicketData(res.ticket); // Trigger print modal
            toast.success(outflowType === 'SALIDA' ? 'Salida procesada correctamente' : 'Cotización generada');

            // Refresh global products in background
            refreshProducts();

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.msg || 'Error al procesar salida.');
        } finally {
            setIsLoading(false);
        }
    };

    // 6. Fetch History
    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const data = await api.fetchOutflowHistory(token);
            setHistory(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenHistory = () => {
        setShowHistory(true);
        fetchHistory();
    };

    const handleReprint = (tx) => {
        // Construct ticket data from historical record
        const ticket = {
            id: tx.tipo === 'COTIZACION' ? `COT-${tx.id}` : `TR-${tx.id}`,
            outflowId: tx.id,
            type: tx.tipo === 'COTIZACION' ? 'quote' : 'outflow',
            tipo: tx.tipo,
            fecha: tx.fecha,
            usuarioNombre: tx.usuario_nombre,
            clienteNombre: tx.tipo === 'COTIZACION' ? (tx.cliente_nombre || 'Cliente General') : `MOTIVO: ${tx.motivo}`,
            items: tx.items.map(i => ({ ...i, total: i.quantity * i.unit })), // Ensure structure matches TicketModal
            totalVenta: tx.total_venta,
            totalCosto: tx.total_costo,
            isOutflow: true,
            isQuote: tx.tipo === 'COTIZACION'
        };
        setTicketData(ticket);
    };

    return (
        <PageContainer>
            <Header>
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                    <Link to="/dashboard" style={{ color: '#6b7280', fontSize: '1.2rem' }}><FaArrowLeft /></Link>
                    <Title><FaTruck style={{ color: '#ef4444' }} /> Traslados / Salidas</Title>
                </div>
                <button
                    onClick={handleOpenHistory}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}
                >
                    <FaHistory /> Historial
                </button>
            </Header>

            <MainContent>
                {/* LEFT: SEARCH & PRODUCTS */}
                <SearchPanel>
                    <SearchInputContainer>
                        <FaSearch style={{ position: 'absolute', left: 15, top: 15, color: '#9ca3af' }} />
                        <SearchInput
                            ref={searchInputRef}
                            placeholder="Buscar producto por nombre o código..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </SearchInputContainer>

                    <ProductList>
                        {results.map(p => (
                            <ProductCard key={p.id_producto} onClick={() => addToCart(p)}>
                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: 5 }}>{p.nombre}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#6b7280' }}>
                                    <span>{p.codigo}</span>
                                    <span style={{ color: p.existencia > 0 ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>Stock: {p.existencia}</span>
                                </div>
                                <div style={{ marginTop: 'auto', textAlign: 'right', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                    C$ {Number(p.precio).toFixed(2)}
                                </div>
                            </ProductCard>
                        ))}
                    </ProductList>
                </SearchPanel>

                {/* RIGHT: CART */}
                <CartPanel>
                    <div style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                        <ToggleContainer>
                            <ToggleButton $active={outflowType === 'SALIDA'} onClick={() => setOutflowType('SALIDA')}>
                                <FaTruck size={12} style={{ marginRight: 5 }} /> Salida
                            </ToggleButton>
                            <ToggleButton $active={outflowType === 'COTIZACION'} onClick={() => setOutflowType('COTIZACION')}>
                                <FaFileInvoice size={12} style={{ marginRight: 5 }} /> Cotización
                            </ToggleButton>
                        </ToggleContainer>

                        {outflowType === 'COTIZACION' && (
                            <ClientSelector>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                                    <FaUser size={14} color="#64748b" />
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Cliente:</span>
                                </div>
                                <ClientSearchInput
                                    placeholder="Buscar cliente..."
                                    value={selectedClient ? selectedClient.nombre : clientSearch}
                                    onChange={e => {
                                        setClientSearch(e.target.value);
                                        setSelectedClient(null);
                                        setShowClientDropdown(true);
                                    }}
                                    onFocus={() => setShowClientDropdown(true)}
                                />
                                {selectedClient && (
                                    <button onClick={() => { setSelectedClient(null); setClientSearch(''); }} style={{ position: 'absolute', right: 10, top: 32, background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                        <FaTimes size={12} />
                                    </button>
                                )}
                                {showClientDropdown && (
                                    <ClientDropdown>
                                        {filteredClients.map(c => (
                                            <ClientOption key={c.id_cliente} onClick={() => {
                                                setSelectedClient(c);
                                                setClientSearch(c.nombre);
                                                setShowClientDropdown(false);
                                            }}>
                                                {c.nombre}
                                            </ClientOption>
                                        ))}
                                    </ClientDropdown>
                                )}
                            </ClientSelector>
                        )}

                        <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Carrito de {outflowType === 'SALIDA' ? 'Salida' : 'Cotización'}</h2>
                        <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>{cart.length} items</div>
                    </div>

                    <CartList>
                        {cart.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#9ca3af', marginTop: 50 }}>
                                <FaBarcode size={40} style={{ marginBottom: 10 }} />
                                <p>Escanea o selecciona productos</p>
                            </div>
                        ) : cart.map(item => (
                            <CartItem key={item.id_producto}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.nombre}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.codigo}</div>
                                    {outflowType === 'COTIZACION' && (
                                        <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>C$</span>
                                            <input
                                                type="number"
                                                value={item.precio_modificado}
                                                onChange={e => updatePrice(item.id_producto, e.target.value)}
                                                style={{ width: 80, padding: '2px 5px', fontSize: '0.85rem', border: '1px solid #e2e8f0', borderRadius: 4 }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <button
                                        onClick={() => updateQty(item.id_producto, -1)}
                                        style={{ width: 25, height: 25, borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}
                                    >-</button>
                                    <span style={{ fontWeight: 'bold', minWidth: 20, textAlign: 'center' }}>{item.cantidad}</span>
                                    <button
                                        onClick={() => updateQty(item.id_producto, 1)}
                                        style={{ width: 25, height: 25, borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}
                                    >+</button>
                                    <button
                                        onClick={() => updateQty(item.id_producto, -9999)}
                                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', marginLeft: 5 }}
                                    ><FaTrash /></button>
                                </div>
                            </CartItem>
                        ))}
                    </CartList>

                    <div style={{ padding: '1rem', background: '#f8fafc', borderTop: '1px solid #e5e7eb' }}>
                        {outflowType === 'SALIDA' && (
                            <>
                                <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#374151' }}>Motivo / Razón:</label>
                                <ReasonInput
                                    rows="2"
                                    placeholder="Ej: Merma, Uso Interno, Traslado a Bodega B..."
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                />
                            </>
                        )}
                        <ActionButton disabled={cart.length === 0 || isLoading} onClick={handleSubmit}>
                            {isLoading ? 'Procesando...' : <><FaSave /> {outflowType === 'SALIDA' ? 'Procesar Salida' : 'Generar Cotización'}</>}
                        </ActionButton>
                    </div>
                </CartPanel>
            </MainContent>

            {/* HISTORY MODAL (SIMPLIFIED OVERLAY) */}
            {showHistory && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
                }} onClick={() => setShowHistory(false)}>
                    <div style={{ background: 'white', width: '90%', maxWidth: 600, maxHeight: '80vh', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                            <h2 style={{ margin: 0 }}>Historial de Salidas</h2>
                            <button onClick={() => setShowHistory(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}><FaTimes /></button>
                        </div>
                        <div style={{ overflowY: 'auto', flex: 1 }}>
                            {history.length === 0 && <p style={{ textAlign: 'center', padding: 20 }}>No hay registros.</p>}
                            {history.map(tx => (
                                <HistoryItem key={tx.id}>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>
                                            {tx.tipo === 'COTIZACION' ? 'COT' : 'TR'}-#{tx.id} - {new Date(tx.fecha).toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                                            {tx.tipo === 'COTIZACION' ? `Cliente: ${tx.cliente_nombre || 'General'}` : `Motivo: ${tx.motivo}`}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Por: {tx.usuario_nombre} | {tx.total_items} items</div>
                                    </div>
                                    <button
                                        onClick={() => handleReprint(tx)}
                                        style={{ padding: '6px 12px', background: '#e0f2fe', color: '#0284c7', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
                                    >
                                        <FaPrint /> Imprimir
                                    </button>
                                </HistoryItem>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TICKET MODAL */}
            {ticketData && (
                <OutflowTicketModal
                    isOpen={!!ticketData}
                    transaction={ticketData}
                    onClose={() => setTicketData(null)}
                />
            )}

            <AnimatePresence>
                {showConfirm && (
                    <ConfirmDialog
                        open={showConfirm}
                        onCancel={() => setShowConfirm(false)}
                        onConfirm={confirmSubmit}
                        title={outflowType === 'SALIDA' ? "Confirmar Salida" : "Confirmar Cotización"}
                        message={outflowType === 'SALIDA'
                            ? "¿Estás seguro de que deseas procesar esta salida? El inventario se descontará inmediatamente."
                            : "¿Estás seguro de que deseas generar esta cotización? No afectará el inventario."
                        }
                    />
                )}
            </AnimatePresence>
        </PageContainer>
    );
};

export default InventoryOutflowPage;
