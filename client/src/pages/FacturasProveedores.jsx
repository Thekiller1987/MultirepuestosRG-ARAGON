import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    FaArrowLeft, FaPlus, FaSearch, FaFileInvoiceDollar,
    FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaClock,
    FaMoneyBillWave, FaBuilding, FaList, FaTrashAlt, FaTimes, FaStore,
    FaFilter, FaReceipt // Nuevo ícono para la referencia
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import * as api from '../service/api';
import { API_URL } from '../service/api';

// --- HELPERS DE FECHA (ZONA MANAGUA) ---

// Obtener la fecha actual en formato YYYY-MM-DD para inputs tipo date, usando hora Managua
const getTodayManaguaISO = () => {
    return new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Managua' });
};

// Formatear fecha para visualización (dd/mm/yyyy)
const formatDateManagua = (isoString) => {
    if (!isoString) return '—';
    // Se fuerza la interpretación de la fecha en Managua evitando conversiones UTC automáticas indeseadas
    // Si la fecha viene como YYYY-MM-DD, le agregamos T12:00 para asegurar el día correcto
    const date = new Date(isoString.includes('T') ? isoString : `${isoString}T12:00:00`);
    return new Intl.DateTimeFormat('es-NI', {
        timeZone: 'America/Managua',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};

// --- ANIMACIONES ---
const fadeIn = keyframes`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`;
const scaleIn = keyframes`from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; }`;

// --- ESTILOS RESPONSIVOS Y MODERNOS ---
const PageWrapper = styled.div`
    padding: clamp(1rem, 3vw, 2.5rem); 
    background: #f8fafc; /* Fondo más limpio */
    min-height: 100vh; 
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    animation: ${fadeIn} 0.5s ease-out;
`;

const HeaderContainer = styled.div`
    display: flex; 
    justify-content: space-between; 
    align-items: flex-start; 
    margin-bottom: 2rem; 
    flex-wrap: wrap; 
    gap: 1.5rem;
`;

const TitleSection = styled.div`
    display: flex;
    flex-direction: column;
`;

const Title = styled.h1`
    font-size: clamp(1.8rem, 2.5vw, 2.2rem); 
    color: #1e293b; 
    display: flex; 
    align-items: center; 
    gap: 0.75rem; 
    margin: 0; 
    font-weight: 800;
    letter-spacing: -0.03em;
    
    svg { color: #3b82f6; } /* Azul vibrante */
`;

const Subtitle = styled.p`
    color: #64748b;
    margin: 0.5rem 0 0 0;
    font-size: 1rem;
    font-weight: 500;
`;

const ActionButtons = styled.div`
    display: flex; 
    gap: 0.75rem;
    flex-wrap: wrap;
    
    @media (max-width: 600px) {
        width: 100%;
        button, a { flex: 1; justify-content: center; }
    }
`;

const Button = styled.button`
    padding: 0.75rem 1.25rem; 
    border: none; 
    border-radius: 12px; /* Más redondeado */
    font-weight: 600; 
    font-size: 0.95rem;
    cursor: pointer; 
    display: flex; 
    align-items: center; 
    justify-content: center;
    gap: 0.5rem; 
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    ${props => props.$primary && css`
        background: #3b82f6;
        color: white;
        box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
        &:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4); }
    `}

    ${props => props.$secondary && css`
        background: white;
        color: #334155;
        border: 1px solid #e2e8f0;
        &:hover { background: #f1f5f9; border-color: #cbd5e1; transform: translateY(-1px); }
    `}

    ${props => props.$danger && css`
        background: #fee2e2;
        color: #ef4444;
        &:hover { background: #fecaca; transform: scale(1.05); }
    `}

    &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;

const BackButton = styled(Link)`
    padding: 0.75rem 1.25rem; 
    background: white; 
    color: #475569; 
    border: 1px solid #e2e8f0;
    border-radius: 12px; 
    font-weight: 600; 
    text-decoration: none; 
    display: flex; 
    align-items: center; 
    gap: 0.5rem; 
    transition: all 0.2s;
    font-size: 0.95rem;
    &:hover { background: #f8fafc; color: #0f172a; transform: translateY(-1px); }
`;

// --- STATS CARDS (KPIs) ---
const StatsGrid = styled.div`
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); 
    gap: 1.5rem; 
    margin-bottom: 2.5rem;
`;

const StatCard = styled.div`
    background: white; 
    padding: 1.75rem; 
    border-radius: 20px; 
    border: 1px solid rgba(226, 232, 240, 0.6);
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); 
    position: relative; 
    overflow: hidden;
    transition: transform 0.2s;
    
    &:hover { transform: translateY(-4px); box-shadow: 0 15px 25px -5px rgba(0,0,0,0.06); }
    
    /* Barra lateral de color */
    &::before { 
        content: ''; position: absolute; top: 0; left: 0; width: 6px; height: 100%; 
        background: ${props => props.color}; 
    }

    .icon-wrapper {
        width: 48px; height: 48px; border-radius: 12px; background: ${props => props.bg}; 
        display: flex; align-items: center; justify-content: center; 
        color: ${props => props.color}; font-size: 1.4rem; margin-bottom: 1rem;
    }

    .label { font-size: 0.85rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .value { font-size: 2.2rem; font-weight: 800; color: #1e293b; margin: 0.25rem 0; letter-spacing: -0.03em; }
    .sub { font-size: 0.9rem; color: ${props => props.color}; font-weight: 600; }
`;

// --- MODAL BASE ---
const ModalOverlay = styled.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
    background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); 
    display: flex; justify-content: center; align-items: center; z-index: 1200; 
    animation: ${fadeIn} 0.2s;
`;
const ModalContent = styled.div`
    background: white; padding: 2.5rem; border-radius: 24px; 
    width: 95%; max-width: 550px; 
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); 
    animation: ${scaleIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    max-height: 90vh; overflow-y: auto;
    
    h2 { margin: 0 0 1.5rem 0; color: #1e293b; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.025em; }
`;

const FormGroup = styled.div`
    margin-bottom: 1.25rem;
    label { display: block; font-size: 0.92rem; color: #475569; margin-bottom: 0.5rem; font-weight: 600; }
    input, select, textarea { 
        width: 100%; padding: 0.9rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; 
        font-size: 1rem; color: #1e293b; background: #fff; transition: all 0.2s; 
        &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
        &::placeholder { color: #94a3b8; }
    }
`;

const CloseButton = styled.button`
    position: absolute; top: 1.5rem; right: 1.5rem; 
    background: #f1f5f9; border-radius:50%; width:32px; height:32px; 
    border: none; color: #64748b; font-size: 1rem; cursor: pointer; display:grid; place-items:center;
    transition: all 0.2s;
    &:hover { color: #ef4444; background: #fee2e2; }
`;

// --- TOOLBAR ---
const Toolbar = styled.div`
    background: white; padding: 0.75rem; border-radius: 20px;
    border: 1px solid #e2e8f0; display: flex; flex-direction: column; 
    gap: 1.5rem; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01);
`;

const FilterTabs = styled.div`
    display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 0.75rem;
    border-bottom: 1px solid #f1f5f9;
    &::-webkit-scrollbar { height: 4px; }
    &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
`;

const TabButton = styled.button`
    padding: 0.65rem 1.25rem; border-radius: 12px; border: none; 
    font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.6rem; 
    transition: all 0.2s; font-size: 0.92rem; white-space: nowrap;

    background: ${props => props.active ? props.activeBg : 'transparent'};
    color: ${props => props.active ? props.activeColor : '#64748b'};
    
    &:hover { background: ${props => props.active ? props.activeBg : '#f8fafc'}; color: ${props => props.active ? props.activeColor : '#334155'}; }

    .badge {
        background: ${props => props.active ? props.activeColor : '#e2e8f0'};
        color: ${props => props.active ? 'white' : '#64748b'};
        padding: 0.15rem 0.6rem; border-radius: 99px; font-size: 0.75rem; 
        font-weight: 800; min-width: 24px; text-align: center;
    }
`;

const SearchAndFilters = styled.div`
    display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between;
`;

const SearchContainer = styled.div`
    position: relative; min-width: 280px; flex: 2;
    svg { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
    input {
        width: 100%; padding: 0.75rem 1rem 0.75rem 2.8rem;
        border: 1px solid #e2e8f0; border-radius: 12px; font-size: 0.95rem;
        &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
    }
`;

const FilterGroup = styled.div`
    min-width: 160px; flex: 1;
    display: flex; flex-direction: column; gap: 0.4rem;
    label { font-size: 0.8rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    select, input {
        width: 100%; padding: 0.7rem 1rem; border: 1px solid #e2e8f0; border-radius: 12px; 
        font-size: 0.92rem; background: #fff;
        &:focus { border-color: #3b82f6; outline: none; }
    }
`;

// --- INVOICE CARD ---
const InvoicesGrid = styled.div`
    display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem;
`;

const InvoiceCard = styled.div`
    background: white; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column;
    
    &:hover { 
        transform: translateY(-5px); 
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); 
        border-color: #cbd5e1;
    }

    .card-header {
        padding: 1.5rem; background: linear-gradient(to bottom, #ffffff, #f8fafc);
        border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: flex-start;
    }
    .provider-info h3 { margin: 0; font-size: 1.1rem; color: #1e293b; font-weight: 800; line-height: 1.3; }
    .invoice-number { font-size: 0.85rem; color: #64748b; font-family: 'Monaco', monospace; background: #e2e8f0; padding: 4px 8px; border-radius: 6px; margin-top: 0.5rem; display: inline-block; }

    .card-body { padding: 1.5rem; flex: 1; }
    
    .meta-row {
        display: flex; justify-content: space-between; margin-bottom: 0.8rem; font-size: 0.92rem;
        .label { color: #64748b; display: flex; align-items: center; gap: 0.5rem; font-weight: 500; }
        .value { font-weight: 700; color: #334155; }
    }

    .financial-block { margin-top: 1.5rem; padding-top: 1rem; border-top: 2px dashed #f1f5f9; }
    .total-row {
        display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.75rem;
        .label { font-size: 0.85rem; font-weight: 700; color: #64748b; text-transform: uppercase; }
        .amount { font-size: 1.75rem; font-weight: 900; color: #0f172a; ; }
    }

    .progress-bar {
        height: 8px; background: #f1f5f9; border-radius: 99px; overflow: hidden; margin-bottom: 0.75rem;
        div { height: 100%; border-radius: 99px; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
    }

    .balance-text { font-size: 0.9rem; text-align: right; color: #64748b; font-weight: 500; }
    .balance-text strong { color: ${props => props.balanceColor}; font-weight: 800; }

    .card-footer {
        padding: 1rem 1.5rem; background: #f8fafc; border-top: 1px solid #f1f5f9;
        display: flex; gap: 1rem;
    }
`;

const StatusBadge = styled.span`
    padding: 0.4rem 1rem; border-radius: 99px; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;
    background: ${props => props.bg}; color: ${props => props.text}; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
`;

const Alert = ({ info, onClose }) => {
    if (!info.show) return null;
    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent style={{ maxWidth: '400px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', color: info.type === 'error' ? '#ef4444' : (info.type === 'success' ? '#22c55e' : '#3b82f6') }}>
                    {info.type === 'error' ? <FaTimes style={{ border: '3px solid', borderRadius: '50%', padding: 5 }} /> :
                        info.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                </div>
                <h2>{info.title}</h2>
                <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>{info.message}</p>
                <Button $primary onClick={onClose} style={{ margin: '0 auto', width: '100%' }}>Entendido</Button>
            </ModalContent>
        </ModalOverlay>
    )
}


// =================================================================
// COMPONENTE PRINCIPAL: FacturasProveedores
// =================================================================

const FacturasProveedores = () => {
    const { token } = useAuth();

    // --- ESTADOS ---
    const [invoices, setInvoices] = useState([]);
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    // Estados de UI
    const [filter, setFilter] = useState('PENDIENTE');
    const [sortBy, setSortBy] = useState('vencimiento_asc'); // 'vencimiento_asc', 'emision_desc', 'emision_asc'
    const [searchTerm, setSearchTerm] = useState('');

    // FILTROS INDIVIDUALES
    const [filterProvider, setFilterProvider] = useState('');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');

    // Alertas y Modales
    const [alertInfo, setAlertInfo] = useState({ show: false, title: '', message: '', type: 'info' });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    // Formularios
    // NOTA: Usamos getTodayManaguaISO() para la fecha por defecto
    const [formData, setFormData] = useState({
        proveedor: '',
        numero_factura: '',
        fecha_emision: getTodayManaguaISO(),
        fecha_vencimiento: '',
        monto_total: '',
        notas: ''
    });

    const [payData, setPayData] = useState({ amount: '', reference: '' });

    // --- HELPER ALERTAS ---
    const showAlert = (title, message, type = 'info') => {
        setAlertInfo({ show: true, title, message, type });
    };

    // --- CARGAR DATOS ---
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // 1. Cargar Facturas
                const invResponse = await api.fetchProviderInvoices(token);
                // Aseguramos que sea array
                const invData = Array.isArray(invResponse) ? invResponse : (invResponse?.data || []);
                setInvoices(invData);

                // 2. Cargar Proveedores
                const provResponse = await axios.get(`${API_URL}/providers`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const provList = Array.isArray(provResponse.data) ? provResponse.data : (provResponse.data.data || []);
                setProviders(provList);

            } catch (err) {
                console.error("Error cargando datos:", err);
                // No mostrar alerta intrusiva inicial si falla silenciosamente, solo log
            } finally {
                setLoading(false);
            }
        };
        if (token) loadData();
    }, [token, refreshTrigger]);

    // --- LÓGICA DE PAGO (ADMINISTRATIVO) ---
    // Esta función NO valida si la caja está abierta, ya que es un proceso administrativo
    // y no afecta el arqueo diario (a menos que el backend lo vincule explícitamente).
    const openPayModal = (invoice) => {
        setSelectedInvoice(invoice);
        setPayData({ amount: '', reference: '' });
        setShowPayModal(true);
    };

    const handlePay = async (e) => {
        e.preventDefault();
        if (!selectedInvoice || !payData.amount) return;

        const payAmount = parseFloat(payData.amount);
        const maxPay = (parseFloat(selectedInvoice.monto_total) || 0) - (parseFloat(selectedInvoice.monto_abonado) || 0);

        if (payAmount <= 0) return showAlert("Error", "El monto debe ser mayor a cero.", "error");
        if (payAmount > maxPay + 0.01) return showAlert("Error", "El monto excede la deuda pendiente.", "error");

        // Si paga todo (o casi todo por decimales), cambiar estado a PAGADA
        const isFullPayment = payAmount >= maxPay - 0.1;
        const newStatus = isFullPayment ? 'PAGADA' : selectedInvoice.estado;

        try {
            await api.payProviderInvoice(selectedInvoice.id, payAmount, payData.reference, newStatus, token);
            setRefreshTrigger(prev => prev + 1);
            setShowPayModal(false);
            showAlert("Pago Registrado", `Se registró el abono correctamente. Estado: ${newStatus}`, "success");
        } catch (error) {
            console.error(error);
            showAlert("Error", "No se pudo registrar el pago. Intente nuevamente.", "error");
        }
    };

    // --- CREAR FACTURA ---
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!formData.proveedor) return showAlert("Falta Proveedor", "Seleccione un proveedor.", "warning");

        try {
            await api.createProviderInvoice(formData, token);
            setRefreshTrigger(prev => prev + 1);
            setShowCreateModal(false);
            // Reset form
            setFormData({
                proveedor: '', numero_factura: '',
                fecha_emision: getTodayManaguaISO(),
                fecha_vencimiento: '', monto_total: '', notas: ''
            });
            showAlert("Guardado", "La factura ha sido registrada exitosamente.", "success");
        } catch (error) {
            showAlert("Error", "Error al guardar factura.", "error");
        }
    };

    // --- ELIMINAR FACTURA ---
    const handleDelete = async () => {
        if (!selectedInvoice) return;
        try {
            await api.deleteProviderInvoice(selectedInvoice.id, token);
            setRefreshTrigger(prev => prev + 1);
            setShowConfirmDelete(false);
            showAlert("Eliminada", "La factura fue eliminada del sistema.", "success");
        } catch (error) {
            showAlert("Error", "No se pudo eliminar la factura.", "error");
        }
    };

    // --- CÁLCULO DE ESTADO DINÁMICO ---
    const getEffectiveStatus = useCallback((invoice) => {
        const total = parseFloat(invoice.monto_total) || 0;
        const abonado = parseFloat(invoice.monto_abonado) || 0;

        // 1. Si está pagada (margen de error 0.1 por decimales)
        if (total > 0 && abonado >= (total - 0.1)) return 'PAGADA';

        // 2. Chequeo de fechas
        if (!invoice.fecha_vencimiento) return 'PENDIENTE';

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalizar hoy

        // Ajustamos la fecha de vencimiento a hora local Managua (evitar desfase)
        // La fecha viene YYYY-MM-DD.
        let fVenc = invoice.fecha_vencimiento;
        if (fVenc && fVenc.includes('T')) fVenc = fVenc.split('T')[0];

        // Normalizamos separadores (acepta - o /)
        const parts = fVenc.split(/[-/]/);

        let yyyy, mm, dd;

        // Detectar formato: Si el primer elemento es 4 dígitos -> YYYY-MM-DD
        if (parts[0].length === 4) {
            yyyy = parseInt(parts[0], 10);
            mm = parseInt(parts[1], 10) - 1;
            dd = parseInt(parts[2], 10);
        } else {
            // Asumimos DD-MM-YYYY (formato local común si no es ISO)
            dd = parseInt(parts[0], 10);
            mm = parseInt(parts[1], 10) - 1;
            yyyy = parseInt(parts[2], 10);
        }

        const vencDate = new Date(yyyy, mm, dd);
        vencDate.setHours(0, 0, 0, 0);

        const diffTime = vencDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'VENCIDA'; // Ya pasó la fecha
        if (diffDays <= 5) return 'PROXIMA'; // Faltan 5 días o menos (incluyendo hoy)

        return 'PENDIENTE';
    }, []);

    // --- ESTILOS DINÁMICOS Y CÁLCULOS ---
    const getStatusStyles = useCallback((status) => {
        switch (status) {
            case 'VENCIDA': return { color: '#dc2626', bg: '#fee2e2', activeColor: '#dc2626', activeBg: '#fef2f2', label: 'Vencida' };
            case 'PROXIMA': return { color: '#ea580c', bg: '#ffedd5', activeColor: '#c2410c', activeBg: '#fff7ed', label: 'Próxima a Vencer' }; // Naranja
            case 'PAGADA': return { color: '#16a34a', bg: '#dcfce7', activeColor: '#16a34a', activeBg: '#f0fdf4', label: 'Pagada' };
            default: return { color: '#3b82f6', bg: '#dbeafe', activeColor: '#2563eb', activeBg: '#eff6ff', label: 'Pendiente' };
        }
    }, []);

    const stats = useMemo(() => {
        let pend = 0, venc = 0, pag = 0, prox = 0, totalDebt = 0;

        invoices.forEach(inv => {
            const status = getEffectiveStatus(inv);
            if (status === 'PENDIENTE') pend++;
            if (status === 'VENCIDA') venc++;
            if (status === 'PAGADA') pag++;
            if (status === 'PROXIMA') prox++;

            const deuda = (parseFloat(inv.monto_total) || 0) - (parseFloat(inv.monto_abonado) || 0);
            if (status !== 'PAGADA') totalDebt += deuda;
        });

        return { pend, venc, pag, prox, totalDebt };
    }, [invoices, getEffectiveStatus]);

    const filteredInvoices = useMemo(() => {
        let data = invoices.map(inv => ({ ...inv, effectiveStatus: getEffectiveStatus(inv) }));

        // 1. Filtro Tabs (Estado)
        if (filter !== 'TODAS') {
            // "PENDIENTE" en el filtro tabs ahora agrupa 'PENDIENTE' y 'PROXIMA' para no esconderlas, 
            // O podríamos hacer un tab separado. El usuario pidió ver naranjas.
            // Vamos a mostrar las "PROXIMAS" dentro de "PENDIENTES" o hacer un filtro inteligente.
            // UPD: El usuario pidió que se pongan en roja si vencidas, naranja si faltan 5 días.
            // Si elijo Tab Pendientes, quiero ver las pendientes nomas.
            // Si elijo Tab Vencidas, solo las vencidas.
            // Voy a asumir que PROXIMA cuenta como PENDIENTE para efectos de Tabs generales, 
            // o crear un Tab "Próximas"? Mejor las incluyo en PENDIENTES pero visualmente destacadas,
            // O si filtro VENCIDAS solo vencidas.

            if (filter === 'PENDIENTE') {
                // Mostrar Pendientes Y Próximas
                data = data.filter(i => i.effectiveStatus === 'PENDIENTE' || i.effectiveStatus === 'PROXIMA');
            } else {
                data = data.filter(i => i.effectiveStatus === filter);
            }
        }

        // 2. Filtro Proveedor
        if (filterProvider) {
            data = data.filter(i => i.proveedor === filterProvider);
        }

        // 3. Filtro Fechas
        if (filterDateFrom && filterDateTo) {
            const start = new Date(filterDateFrom).getTime();
            const end = new Date(filterDateTo).getTime() + 86400000;
            data = data.filter(i => {
                const em = new Date(i.fecha_emision).getTime();
                return em >= start && em < end;
            });
        }

        // 4. Búsqueda Texto
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            data = data.filter(i =>
                (i.proveedor && i.proveedor.toLowerCase().includes(term)) ||
                (i.numero_factura && i.numero_factura.toLowerCase().includes(term))
            );
        }

        // 5. ORDENAMIENTO
        data.sort((a, b) => {
            // Prioridad forzada: Vencidas arriba si no hay orden especifico
            // El usuario pidió: "deberia pasarse a la lista de vencidas"

            if (sortBy === 'vencimiento_asc') {
                return new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento);
            } else if (sortBy === 'emision_desc') {
                return new Date(b.fecha_emision) - new Date(a.fecha_emision);
            } else if (sortBy === 'emision_asc') {
                return new Date(a.fecha_emision) - new Date(b.fecha_emision);
            }
            return 0;
        });

        return data;
    }, [invoices, filter, searchTerm, filterProvider, filterDateFrom, filterDateTo, sortBy, getEffectiveStatus]);

    return (
        <PageWrapper>
            <Alert info={alertInfo} onClose={() => setAlertInfo({ ...alertInfo, show: false })} />

            <HeaderContainer>
                <TitleSection>
                    <Title><FaFileInvoiceDollar /> Facturas de Proveedores</Title>
                    <Subtitle>Gestión y control de cuentas por pagar</Subtitle>
                </TitleSection>
                <ActionButtons>
                    <Button $secondary onClick={() => setRefreshTrigger(prev => prev + 1)}>Actualizar</Button>
                    <BackButton to="/dashboard"><FaArrowLeft /> Volver</BackButton>
                    <Button $primary onClick={() => setShowCreateModal(true)}>
                        <FaPlus /> Registrar Factura
                    </Button>
                </ActionButtons>
            </HeaderContainer>

            {/* KPI CARDS */}
            <StatsGrid>
                <StatCard color="#ef4444" bg="#fef2f2">
                    <div className="icon-wrapper"><FaExclamationCircle /></div>
                    <div className="label">Vencidas</div>
                    <div className="value">{stats.venc}</div>
                    <div className="sub">Requieren atención urgente</div>
                </StatCard>
                <StatCard color="#ea580c" bg="#fff7ed">
                    <div className="icon-wrapper"><FaClock /></div>
                    <div className="label">Próximas a Vencer</div>
                    <div className="value">{stats.prox}</div>
                    <div className="sub">En los próx. 5 días</div>
                </StatCard>
                <StatCard color="#3b82f6" bg="#eff6ff">
                    <div className="icon-wrapper"><FaClock /></div>
                    <div className="label">Pendientes</div>
                    <div className="value">{stats.pend}</div>
                    <div className="sub">Sin riesgo inmediato</div>
                </StatCard>
                <StatCard color="#f59e0b" bg="#fffbeb">
                    <div className="icon-wrapper"><FaMoneyBillWave /></div>
                    <div className="label">Deuda Total</div>
                    <div className="value" style={{ color: '#b45309' }}>C${stats.totalDebt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    <div className="sub" style={{ color: '#b45309' }}>Saldo Pendiente Global</div>
                </StatCard>
            </StatsGrid>

            {/* TOOLBAR */}
            <Toolbar>
                <FilterTabs>
                    {[
                        { id: 'PENDIENTE', label: 'Por Pagar (Prox)', icon: FaClock, color: '#3b82f6', bg: '#eff6ff', count: stats.pend + stats.prox },
                        { id: 'VENCIDA', label: 'Vencidas', icon: FaExclamationCircle, color: '#dc2626', bg: '#fef2f2', count: stats.venc },
                        { id: 'PAGADA', label: 'Pagadas', icon: FaCheckCircle, color: '#16a34a', bg: '#f0fdf4', count: stats.pag },
                        { id: 'TODAS', label: 'Todas', icon: FaList, color: '#64748b', bg: '#f1f5f9', count: null },
                    ].map(tab => (
                        <TabButton
                            key={tab.id}
                            active={filter === tab.id}
                            activeColor={tab.color}
                            activeBg={tab.bg}
                            onClick={() => setFilter(tab.id)}
                        >
                            <tab.icon /> {tab.label}
                            {tab.count !== null && <span className="badge">{tab.count}</span>}
                        </TabButton>
                    ))}
                </FilterTabs>

                <SearchAndFilters>
                    <SearchContainer>
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Buscar proveedor o No. factura..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </SearchContainer>

                    <FilterGroup style={{ minWidth: '180px' }}>
                        <label>Ordenar Por</label>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                        >
                            <option value="vencimiento_asc">Vencen Primero (Próximas)</option>
                            <option value="emision_desc">Emitidas Reciente (Nuevas)</option>
                            <option value="emision_asc">Emitidas Antiguas (Viejas)</option>
                        </select>
                    </FilterGroup>

                    <FilterGroup>
                        <label>Proveedor</label>
                        <select
                            value={filterProvider}
                            onChange={e => setFilterProvider(e.target.value)}
                        >
                            <option value="">Todos</option>
                            {providers.map(p => (
                                <option key={p.id_proveedor || p.id} value={p.nombre}>
                                    {p.nombre}
                                </option>
                            ))}
                        </select>
                    </FilterGroup>

                    <FilterGroup style={{ minWidth: '140px' }}>
                        <label>Desde</label>
                        <input
                            type="date"
                            value={filterDateFrom}
                            onChange={e => setFilterDateFrom(e.target.value)}
                        // Usamos el placeholder nativo, pero el valor debe ser YYYY-MM-DD
                        />
                    </FilterGroup>

                    <FilterGroup style={{ minWidth: '140px' }}>
                        <label>Hasta</label>
                        <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} />
                    </FilterGroup>
                </SearchAndFilters>
            </Toolbar>

            {/* GRID FACTURAS */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                    <FaClock className="spin" style={{ fontSize: '2rem', marginBottom: '1rem' }} />
                    <p>Cargando información...</p>
                </div>
            ) : filteredInvoices.length > 0 ? (
                <InvoicesGrid>
                    {filteredInvoices.map(inv => {
                        const status = inv.effectiveStatus; // Usamos la calculada
                        const styles = getStatusStyles(status);
                        const total = parseFloat(inv.monto_total) || 0;
                        const abonado = parseFloat(inv.monto_abonado) || 0;
                        const saldo = total - abonado;
                        const progress = total > 0 ? (abonado / total) * 100 : 0;
                        const reference = status === 'PAGADA' ? inv.referencia_pago : null;

                        return (
                            <InvoiceCard key={inv.id} color={styles.color} balanceColor={saldo > 0 ? '#ef4444' : '#16a34a'}>
                                <div className="card-header">
                                    <div className="provider-info">
                                        <h3 title={inv.proveedor}>
                                            <FaStore style={{ marginRight: 6, color: '#94a3b8' }} /> {inv.proveedor}
                                        </h3>
                                        <span className="invoice-number">#{inv.numero_factura}</span>
                                    </div>
                                    <StatusBadge bg={styles.bg} text={styles.color}>{styles.label}</StatusBadge>
                                </div>

                                <div className="card-body">
                                    <div className="meta-row">
                                        <span className="label"><FaCalendarAlt /> Emisión</span>
                                        {/* Usamos el helper formatManagua */}
                                        <span className="value">{formatDateManagua(inv.fecha_emision)}</span>
                                    </div>
                                    <div className="meta-row">
                                        <span className="label"><FaExclamationCircle /> Vence</span>
                                        <span className="value" style={{ color: inv.estado === 'VENCIDA' ? '#ef4444' : 'inherit' }}>
                                            {formatDateManagua(inv.fecha_vencimiento)}
                                        </span>
                                    </div>
                                    {reference && (
                                        <div className="meta-row">
                                            <span className="label"><FaReceipt /> Referencia</span>
                                            <span className="value">{reference}</span>
                                        </div>
                                    )}

                                    <div className="financial-block">
                                        <div className="total-row">
                                            <span className="label">Total a Pagar</span>
                                            <span className="amount">C${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div style={{ width: `${progress}%`, background: styles.color }}></div>
                                        </div>
                                        <div className="balance-text">
                                            Abonado: C${abonado.toLocaleString(undefined, { minimumFractionDigits: 2 })} &bull; <strong>Resta: C${saldo.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    {saldo > 0 && (
                                        <Button $primary style={{ flex: 1, justifyContent: 'center' }} onClick={() => openPayModal(inv)}>
                                            <FaMoneyBillWave /> Abonar
                                        </Button>
                                    )}
                                    <Button $danger style={{ padding: '0.75rem' }} onClick={() => { setSelectedInvoice(inv); setShowConfirmDelete(true); }}>
                                        <FaTrashAlt />
                                    </Button>
                                </div>
                            </InvoiceCard>
                        );
                    })}
                </InvoicesGrid>
            ) : (
                <div style={{
                    textAlign: 'center', padding: '4rem', color: '#94a3b8',
                    border: '2px dashed #e2e8f0', borderRadius: '24px', background: 'white'
                }}>
                    <FaFileInvoiceDollar style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }} />
                    <h3 style={{ color: '#475569' }}>No se encontraron facturas</h3>
                    <p>Intenta ajustar los filtros o registra una nueva.</p>
                </div>
            )}

            {/* --- MODAL CREAR FACTURA --- */}
            {showCreateModal && (
                <ModalOverlay onClick={() => setShowCreateModal(false)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <CloseButton onClick={() => setShowCreateModal(false)}><FaTimes /></CloseButton>
                        <h2>Registrar Factura</h2>
                        <form onSubmit={handleCreate}>
                            <FormGroup>
                                <label>Proveedor</label>
                                <select
                                    required
                                    value={formData.proveedor}
                                    onChange={e => setFormData({ ...formData, proveedor: e.target.value })}
                                >
                                    <option value="">Seleccione un proveedor...</option>
                                    {providers.map(p => (
                                        <option key={p.id_proveedor || p.id} value={p.nombre}>
                                            {p.nombre}
                                        </option>
                                    ))}
                                </select>
                            </FormGroup>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <FormGroup>
                                    <label>No. Factura</label>
                                    <input required type="text" value={formData.numero_factura} onChange={e => setFormData({ ...formData, numero_factura: e.target.value })} placeholder="Ej: F-001" />
                                </FormGroup>
                                <FormGroup>
                                    <label>Monto Total (C$)</label>
                                    <input required type="number" step="0.01" value={formData.monto_total} onChange={e => setFormData({ ...formData, monto_total: e.target.value })} placeholder="0.00" />
                                </FormGroup>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <FormGroup>
                                    <label>Fecha Emisión</label>
                                    <input required type="date" value={formData.fecha_emision} onChange={e => setFormData({ ...formData, fecha_emision: e.target.value })} />
                                </FormGroup>
                                <FormGroup>
                                    <label>Fecha Vencimiento</label>
                                    <input required type="date" value={formData.fecha_vencimiento} onChange={e => setFormData({ ...formData, fecha_vencimiento: e.target.value })} />
                                </FormGroup>
                            </div>
                            <FormGroup>
                                <label>Notas (Opcional)</label>
                                <textarea rows="3" value={formData.notas} onChange={e => setFormData({ ...formData, notas: e.target.value })} placeholder="Detalles extra..."></textarea>
                            </FormGroup>

                            <Button $primary type="submit" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}>
                                <FaCheckCircle /> Guardar Factura
                            </Button>
                        </form>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* --- MODAL PAGO --- */}
            {showPayModal && (
                <ModalOverlay onClick={() => setShowPayModal(false)}>
                    <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
                        <CloseButton onClick={() => setShowPayModal(false)}><FaTimes /></CloseButton>
                        <h2>Registrar Abono</h2>
                        <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.25rem' }}>Factura #{selectedInvoice?.numero_factura}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>
                                Deuda: C${((parseFloat(selectedInvoice?.monto_total) || 0) - (parseFloat(selectedInvoice?.monto_abonado) || 0)).toFixed(2)}
                            </div>
                        </div>
                        <form onSubmit={handlePay}>
                            <FormGroup>
                                <label>Monto a Abonar (C$)</label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    autoFocus
                                    placeholder="0.00"
                                    value={payData.amount}
                                    onChange={e => setPayData({ ...payData, amount: e.target.value })}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>Referencia / Detalle (Opcional)</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Transferencia #1234, Pago en efectivo..."
                                    value={payData.reference}
                                    onChange={e => setPayData({ ...payData, reference: e.target.value })}
                                />
                            </FormGroup>
                            <Button $primary type="submit" style={{ width: '100%', padding: '1rem' }}>
                                <FaMoneyBillWave /> Confirmar Pago
                            </Button>
                        </form>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* --- CONFIRMACION ELIMINAR --- */}
            {showConfirmDelete && (
                <ModalOverlay onClick={() => setShowConfirmDelete(false)}>
                    <ModalContent style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', color: '#ef4444', marginBottom: '1rem' }}>
                            <FaExclamationCircle />
                        </div>
                        <h2>¿Eliminar Factura?</h2>
                        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                            Estás a punto de eliminar la factura <b>#{selectedInvoice?.numero_factura}</b>. Esta acción no se puede deshacer.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Button $secondary onClick={() => setShowConfirmDelete(false)} style={{ flex: 1 }}>Cancelar</Button>
                            <Button $danger onClick={handleDelete} style={{ flex: 1 }}>Sí, Eliminar</Button>
                        </div>
                    </ModalContent>
                </ModalOverlay>
            )}

        </PageWrapper>
    );
};

export default FacturasProveedores;