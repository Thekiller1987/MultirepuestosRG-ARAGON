// Archivo: src/pages/PedidosYApartados.jsx

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import {
    FaSearch, FaFilePdf, FaPlus, FaTrash,
    FaSync, FaBarcode, FaFont, FaMinus, FaFileAlt,
    FaArrowLeft, FaPhone, FaImage, FaEye, FaTimes, FaShoppingCart
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// ... imports
import { useAuth } from '../context/AuthContext';
import * as api from '../service/api';

import ProformaEmpleadoModal from './pos/components/ProformaEmpleadoModal.jsx';

// =================================================================
// ESTILOS PREMIUM
// =================================================================
const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;
const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

const Container = styled.div`
    display: flex; height: 100vh; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); font-family: 'Inter', sans-serif; overflow: hidden;
    @media (max-width: 960px) { flex-direction: column; overflow-y: auto; height: 100vh; } 
    /* Force height 100vh on mobile to avoid double scrollbars with drawer */
`;
const LeftPanel = styled.div`
    flex: 1; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; overflow-y: hidden;
    @media (max-width: 960px) { padding: 12px; height: 100%; overflow-y: auto; padding-bottom: 80px; /* Space for FAB */ }
`;

// Updated RightPanel to act as Drawer on Mobile
const RightPanel = styled.div`
    width: 420px; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(16px); padding: 1.5rem; display: flex; flex-direction: column; box-shadow: -10px 0 30px rgba(0,0,0,0.03); border-left: 1px solid rgba(255,255,255,0.5); z-index: 100;
    
    @media (max-width: 960px) { 
        position: fixed; inset: 0; width: 100%; height: 100%;
        background: white; border-left: none; padding: 15px;
        transform: translateY(${props => props.isOpen ? '0' : '100%'});
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex; /* Always display but hide via transform */
    }
`;

const Header = styled.div` 
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;
`;

const HeaderActions = styled.div`
    display: flex; gap: 10px;
`;

const BackButton = styled(motion.button)`
    background: white; border: 1px solid #e2e8f0; color: #64748b; padding: 8px 16px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.9rem;
    &:hover { background: #f8fafc; color: #334155; border-color: #cbd5e1; }
`;

const SearchContainer = styled.div`
    background: white; padding: 1.5rem; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; gap: 12px; border: 1px solid #f1f5f9;
    @media (max-width: 960px) { padding: 1rem; border-radius: 16px; position: sticky; top: 0; z-index: 50; }
`;
const SearchTypeToggle = styled.div` display: flex; gap: 10px; `;
const ToggleButton = styled.button`
    flex: 1; padding: 10px; border-radius: 12px; border: 1px solid ${props => props.active ? '#3b82f6' : '#e2e8f0'};
    background: ${props => props.active ? '#eff6ff' : 'white'}; color: ${props => props.active ? '#2563eb' : '#64748b'};
    font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;
    &:hover { border-color: #3b82f6; }
`;
const SearchInputWrapper = styled.div`
    display: flex; align-items: center; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 14px; padding: 0 15px; transition: all 0.2s;
    &:focus-within { border-color: #3b82f6; background: white; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
`;
const Input = styled.input` flex: 1; padding: 12px 0; border: none; background: transparent; outline: none; font-size: 1rem; color: #1e293b; `;

const ProductGrid = styled.div`
    display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
    grid-auto-rows: min-content; align-content: start;
    gap: 1.25rem; overflow-y: auto; padding-bottom: 30px; flex: 1;
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
    @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); gap: 10px; padding-bottom: 80px; }
`;

const ProductCard = styled.div`
    background: white; border-radius: 18px; border: 1px solid #f1f5f9; display: flex; flex-direction: column; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; position: relative; overflow: hidden;
    &:hover { transform: translateY(-4px); border-color: #3b82f680; box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.08); .eye-icon { opacity: 1; transform: scale(1); } }
    ${p => p.outOfStock && css` opacity: 0.6; filter: grayscale(0.5); background: #f8fafc; `}
    
    @media (max-width: 768px) { border-radius: 14px; } 
    /* Mobile optimization */
`;

const StockBadge = styled.div`
  position: absolute; top: 10px; right: 10px; background: ${p => p.outOfStock ? '#ef4444' : p.lowstock ? '#f59e0b' : '#10b981'};
  color: white; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 30px; z-index: 10; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) { font-size: 0.65rem; padding: 3px 8px; }
`;

const CartList = styled.div` flex: 1; overflow-y: auto; margin-top: 15px; padding-right: 5px; &::-webkit-scrollbar { width: 4px; } `;

const CartItem = styled.div`
    display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: white; margin-bottom: 10px; border-radius: 16px; border: 1px solid #f1f5f9;
`;
const QtyControl = styled.div`
    display: flex; align-items: center; gap: 10px; background: #f8fafc; padding: 6px; border-radius: 12px; border: 1px solid #f1f5f9;
`;
const RoundBtn = styled.button`
    width: 32px; height: 32px; border-radius: 10px; border: none; background: white; color: #64748b; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); cursor: pointer; transition: all 0.2s;
    &:hover { color: #3b82f6; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
`;
const ActionButton = styled.button`
    background: ${props => props.bg || '#3b82f6'}; color: white; border: none; padding: 16px; border-radius: 16px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 1rem; width: 100%; transition: all 0.2s;
    &:disabled { opacity: 0.5; cursor: not-allowed; } 
    &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
`;
const LoadingIcon = styled(FaSync)` animation: ${spin} 1s linear infinite; `;

const ModalOverlay = styled.div`
  position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 5000;
`;

const ModalContent = styled.div`
  background: white; padding: 20px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; position: relative;
`;

// NEW MOBILE FAB (Floating Action Button)
const MobileCartFAB = styled(motion.button)`
    display: none;
    @media (max-width: 960px) {
        display: flex; align-items: center; justify-content: space-between;
        position: fixed; bottom: 20px; left: 20px; right: 20px;
        background: #0f172a; color: white;
        padding: 16px 24px; border-radius: 16px; border: none;
        box-shadow: 0 10px 25px rgba(15, 23, 42, 0.4);
        z-index: 90; font-weight: 700; font-size: 1rem; cursor: pointer;
    }
`;

const ImageViewModal = ({ isOpen, imageSrc, onClose }) => {
    if (!isOpen || !imageSrc) return null;
    return (
        <ModalOverlay onClick={onClose}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: '95%', maxHeight: '90vh' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: -15, right: -15, background: 'white', width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, color: '#ef4444' }}><FaTimes /></button>
                <img src={imageSrc} alt="Vista Completa" style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', display: 'block', background: 'white', objectFit: 'contain' }} />
            </motion.div>
        </ModalOverlay>
    );
};

// =================================================================
// COMPONENTE PRINCIPAL
// =================================================================

// --- BARCODE SCANNER MODAL COMPONENT (CUSTOM UI) ---
import { Html5Qrcode } from 'html5-qrcode';

// Styled components specifically for the Scanner
const ScannerContainer = styled.div`
  width: 100%;
  height: 350px;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const ScannerOverlay = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border: 40px solid rgba(0, 0, 0, 0.5); /* Semi-transparent border simulates viewport */
  border-radius: 12px;
  z-index: 10;
  pointer-events: none; /* Let clicks pass through if needed */
  &::before {
    content: '';
    position: absolute;
    top: 50%; left: 0; right: 0;
    height: 2px;
    background: #ef4444;
    box-shadow: 0 0 4px #ef4444;
    animation: scanAnimation 2s infinite ease-in-out;
  }
  @keyframes scanAnimation {
    0% { top: 10%; opacity: 0; }
    50% { opacity: 1; }
    100% { top: 90%; opacity: 0; }
  }
`;

const BarcodeScannerModal = ({ onClose, onScan }) => {
    const scannerRef = useRef(null);

    // Effect to initialize scanner
    React.useEffect(() => {
        const scannerId = "reader-custom";
        const html5QrCode = new Html5Qrcode(scannerId);
        scannerRef.current = html5QrCode;

        const startCamera = async () => {
            try {
                // Auto-start with "environment" (back camera)
                await html5QrCode.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0
                    },
                    (decodedText) => {
                        // Success
                        // Stop scanning and return result
                        html5QrCode.stop().then(() => {
                            html5QrCode.clear();
                            onScan(decodedText);
                        }).catch(err => {
                            console.error("Failed to stop scanner", err);
                            onScan(decodedText); // Return anyway
                        });
                    },
                    (errorMessage) => {
                        // Parse error, ignore
                    }
                );
            } catch (err) {
                console.error("Error starting camera", err);
                alert("No se pudo iniciar la cámara. Verifique permisos.");
                onClose();
            }
        };

        // Little delay to ensure DOM is clear
        setTimeout(() => startCamera(), 100);

        // Cleanup
        return () => {
            if (html5QrCode.isScanning) {
                html5QrCode.stop().then(() => html5QrCode.clear()).catch(console.error);
            } else {
                html5QrCode.clear();
            }
        };
    }, [onScan, onClose]);

    return (
        <ModalOverlay style={{ zIndex: 6000 }} onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()} style={{ padding: '0', width: '90%', maxWidth: '380px', background: 'transparent', boxShadow: 'none', border: 'none' }}>
                <div style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                    <h3 style={{ margin: '0 0 12px', textAlign: 'center', fontSize: '1.2rem' }}>Escanear Producto</h3>

                    <ScannerContainer>
                        <div id="reader-custom" style={{ width: '100%', height: '100%' }}></div>
                        <ScannerOverlay />
                    </ScannerContainer>

                    <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b', marginTop: '12px' }}>
                        Apunta la cámara al código de barras
                    </p>

                    <ActionButton bg="#ef4444" onClick={onClose} style={{ marginTop: '15px' }}>
                        Cancelar
                    </ActionButton>
                </div>
            </ModalContent>
        </ModalOverlay>
    );
};

const ProformaGenerator = () => {
    const { user, products: authProducts } = useAuth();
    const token = localStorage.getItem('token');

    const [products, setProducts] = useState(authProducts || []);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('nombre');
    const [loading, setLoading] = useState(false);

    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [proformaNumber, setProformaNumber] = useState('');

    const [isProformaModalOpen, setIsProformaModalOpen] = useState(false);
    const [proformaDetails, setProformaDetails] = useState(null);
    const [viewImage, setViewImage] = useState({ isOpen: false, imageUrl: null });

    // MOBILE STATES
    const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false); // <--- NEW STATE FOR CAMERA

    const searchInputRef = useRef(null);

    useEffect(() => {
        if (authProducts) setProducts(authProducts);
    }, [authProducts]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.fetchProducts(token);
            setProducts(Array.isArray(data) ? data : (data?.data || []));
        } catch (error) {
            console.error(error);
        } finally { setLoading(false); }
    }, [token]);

    // Cargar productos al iniciar la vista
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const goToDashboard = () => { window.location.href = '/dashboard'; };

    const addToCart = (product) => {
        const currentQty = cart.find(i => i.id === product.id)?.quantity || 0;
        if (currentQty >= product.existencia) { return alert(`Stock máximo alcanzado (${product.existencia}).`); }

        // Optional: Auto open cart on mobile when adding first item? 
        // User requested "custom design", likely prefers smooth experience. Let's show a toast or just update FAB.

        setCart(prev => {
            const existing = prev.find(p => p.id === product.id);
            if (existing) return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
            return [...prev, { ...product, quantity: 1, precio_venta: parseFloat(product.precio_venta || product.precio || 0) }];
        });
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => {
            const item = prev.find(p => p.id === id);
            if (!item) return prev;
            const product = products.find(p => p.id === id) || item;
            const newQty = item.quantity + delta;
            if (newQty > product.existencia) { alert(`Stock máximo alcanzado (${product.existencia}).`); return prev; }
            if (newQty < 1) return prev.filter(p => p.id !== id);
            return prev.map(p => p.id === id ? { ...p, quantity: newQty } : p);
        });
    };

    const filteredProducts = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return products.slice(0, 100);
        return products.filter(p => {
            if (searchType === 'codigo') return String(p.codigo || '').toLowerCase().includes(term);
            return String(p.nombre || '').toLowerCase().includes(term);
        }).slice(0, 100);
    }, [products, searchTerm, searchType]);

    const total = useMemo(() => cart.reduce((acc, item) => acc + (parseFloat(item.precio_venta) * item.quantity), 0), [cart]);

    // --- BARCODE SCANNER LISTENER ---
    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            // 1. Ignore if modal is open
            if (isProformaModalOpen || viewImage.isOpen || isMobileCartOpen || isScannerOpen) return;

            // 2. Ignore if user is already typing in an input
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

            // 3. Ignore control keys, F-keys, etc. (Allow only printable characters)
            if (e.key.length > 1 || e.ctrlKey || e.altKey || e.metaKey) return;

            // 4. ACTION: Switch to code search and input character
            // Prevent default to avoid double-entry if the focus happens too fast or event bubbles
            e.preventDefault();

            // If we were not in 'codigo' mode, clear previous search cleanly
            // If we were already in 'codigo', we append (effectively provided by the logic below)
            if (searchType !== 'codigo') {
                setSearchType('codigo');
                setSearchTerm(e.key); // Start fresh with this char
            } else {
                setSearchTerm(prev => prev + e.key); // Append
            }

            // 5. Focus the input so subsequent characters (remainder of the barcode) flow naturally
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [isProformaModalOpen, viewImage, isMobileCartOpen, searchType, isScannerOpen]);

    const handleGenerateProforma = () => {
        if (!clientName.trim()) return alert("El nombre del cliente es obligatorio.");
        setProformaDetails({ cart, total, subtotal: total, discount: 0, proformaNumber, client: { nombre: clientName, telefono: clientPhone || 'N/D' } });
        setIsProformaModalOpen(true);
    };

    // --- CAMERA SCAN HANDLER ---
    const handleCameraScan = (code) => {
        if (!code) return;
        setSearchType('codigo');
        setSearchTerm(code);
        setIsScannerOpen(false);
    };

    return (
        <Container>
            <LeftPanel>
                <Header>
                    <h2 style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>Catálogo y Proformas</h2>
                    <HeaderActions>
                        <BackButton onClick={goToDashboard} whileHover={{ x: -4 }}><FaArrowLeft size={14} /> Regresar</BackButton>
                        <BackButton onClick={fetchProducts} disabled={loading}>{loading ? <LoadingIcon size={14} /> : <FaSync size={14} />} Actualizar</BackButton>
                    </HeaderActions>
                </Header>

                <SearchContainer>
                    <SearchTypeToggle>
                        <ToggleButton active={searchType === 'nombre'} onClick={() => { setSearchType('nombre'); setSearchTerm(''); searchInputRef.current?.focus(); }}><FaFont /> Nombre</ToggleButton>
                        <ToggleButton active={searchType === 'codigo'} onClick={() => { setSearchType('codigo'); setSearchTerm(''); searchInputRef.current?.focus(); }}><FaBarcode /> Código</ToggleButton>
                    </SearchTypeToggle>
                    <SearchInputWrapper>
                        <FaSearch color="#94a3b8" />
                        <Input ref={searchInputRef} placeholder={searchType === 'codigo' ? "Escanea o escribe código..." : "Escribe para buscar..."} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} autoFocus />
                        {/* CAMERA BUTTON: Visible mainly in code mode or mobile */}
                        <div
                            onClick={() => setIsScannerOpen(true)}
                            style={{
                                padding: '8px', cursor: 'pointer', color: '#64748b',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderLeft: '1px solid #e2e8f0', marginLeft: '5px'
                            }}
                            title="Usar Cámara"
                        >
                            <FaBarcode size={18} />
                            <FaSearch size={10} style={{ marginLeft: -6, marginTop: -8 }} /> {/* Composite icon look */}
                        </div>
                    </SearchInputWrapper>
                </SearchContainer>

                <ProductGrid>
                    {filteredProducts.map(p => {
                        const pid = p.id_producto || p.id;
                        const enCarrito = cart.find(i => (i.id_producto || i.id) === pid)?.quantity || 0;
                        const restante = Math.max(0, Number(p.existencia || 0) - enCarrito);
                        const agotado = restante <= 0;

                        return (
                            <ProductCard
                                key={pid}
                                onClick={() => !agotado && addToCart(p)}
                                outOfStock={agotado}
                                title={p.nombre}
                            >
                                <StockBadge outOfStock={agotado} lowstock={restante < 5 && !agotado}>
                                    {agotado ? 'Agotado' : `Stock: ${restante}`}
                                </StockBadge>

                                {p.imagen && (
                                    <div
                                        className="eye-icon"
                                        onClick={(e) => { e.stopPropagation(); setViewImage({ isOpen: true, imageUrl: p.imagen }); }}
                                        style={{
                                            position: 'absolute', top: 10, left: 10, zIndex: 20,
                                            background: 'white', borderRadius: '50%', width: 32, height: 32,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', cursor: 'pointer',
                                            transition: 'transform 0.2s',
                                        }}
                                        title="Ver imagen"
                                    >
                                        <FaEye size={14} color="#64748b" />
                                    </div>
                                )}

                                <div style={{ height: 160, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                                    {p.imagen ? (
                                        <img src={p.imagen} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <FaImage size={40} color="#e2e8f0" />
                                    )}
                                </div>

                                <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{
                                        fontWeight: 600, fontSize: '0.88rem', color: '#1e293b',
                                        lineHeight: '1.25', height: '2.5rem', overflow: 'hidden',
                                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                                    }}>
                                        {p.nombre}
                                    </div>
                                    <div style={{ fontWeight: 800, color: '#2563eb', fontSize: '1.05rem', marginTop: 'auto' }}>
                                        C$ {parseFloat(p.precio_venta || p.precio || 0).toFixed(2)}
                                    </div>
                                </div>
                            </ProductCard>
                        );
                    })}
                </ProductGrid>
            </LeftPanel>

            {/* Always rendered, controlled by props on mobile */}
            <RightPanel isOpen={isMobileCartOpen}>
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}><FaShoppingCart color="#3b82f6" /> Tu Proforma</h3>
                        {/* Close button for mobile */}
                        <button
                            onClick={() => setIsMobileCartOpen(false)}
                            style={{ display: 'none', background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                            className="mobile-close-btn"
                        >
                            <FaTimes />
                        </button>
                        <style>{`@media(max-width: 960px) { .mobile-close-btn { display: block !important; } }`}</style>
                    </div>

                    <input style={{ width: '100%', padding: '12px', marginTop: 15, border: '2px solid #e2e8f0', borderRadius: 12, outline: 'none' }} placeholder="Nombre del Cliente" value={clientName} onChange={e => setClientName(e.target.value)} />
                    <input style={{ width: '100%', padding: '12px', marginTop: 10, border: '2px solid #e2e8f0', borderRadius: 12, outline: 'none' }} placeholder="Teléfono" value={clientPhone} onChange={e => setClientPhone(e.target.value)} />
                </div>

                <CartList>
                    {cart.length === 0 ? <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: 40 }}><FaFilePdf size={48} style={{ opacity: 0.1, marginBottom: 15 }} /><p>Agrega productos</p></div> : cart.map(item => (
                        <CartItem key={item.id}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.nombre}</div>
                                <div style={{ color: '#64748b', fontSize: '0.85rem' }}>C$ {parseFloat(item.precio_venta).toFixed(2)}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <QtyControl>
                                    <RoundBtn onClick={() => updateQuantity(item.id, -1)}><FaMinus size={10} /></RoundBtn>
                                    <span style={{ fontWeight: 700 }}>{item.quantity}</span>
                                    <RoundBtn onClick={() => updateQuantity(item.id, 1)}><FaPlus size={10} /></RoundBtn>
                                </QtyControl>
                                <RoundBtn onClick={() => setCart(c => c.filter(x => x.id !== item.id))} style={{ color: '#ef4444' }}><FaTrash /></RoundBtn>
                            </div>
                        </CartItem>
                    ))}
                </CartList>

                <div style={{ borderTop: '2px dashed #e2e8f0', paddingTop: '20px', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 900, marginBottom: 20 }}><span>TOTAL</span><span>C$ {total.toFixed(2)}</span></div>
                    <ActionButton onClick={handleGenerateProforma} disabled={cart.length === 0 || !clientName.trim()}><FaFilePdf /> GENERAR PROFORMA PDF</ActionButton>
                </div>
            </RightPanel>

            <MobileCartFAB
                initial={{ y: 200 }}
                animate={{ y: cart.length > 0 ? 0 : 200 }}
                onClick={() => setIsMobileCartOpen(true)}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ background: '#3b82f6', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                        {cart.reduce((a, c) => a + c.quantity, 0)}
                    </div>
                    <span>Ver Pedido</span>
                </div>
                <span>C$ {total.toFixed(2)}</span>
            </MobileCartFAB>

            <AnimatePresence>{viewImage.isOpen && <ImageViewModal isOpen={true} imageSrc={viewImage.imageUrl} onClose={() => setViewImage({ isOpen: false, imageUrl: null })} />}</AnimatePresence>
            {isProformaModalOpen && <ProformaEmpleadoModal {...proformaDetails} onClose={() => setIsProformaModalOpen(false)} setTicketData={() => setCart([])} currentUser={user} client={proformaDetails.client} />}

            {/* SCANNER MODAL */}
            {isScannerOpen && (
                <BarcodeScannerModal
                    onClose={() => setIsScannerOpen(false)}
                    onScan={handleCameraScan}
                />
            )}
        </Container>
    );
};

export default ProformaGenerator;