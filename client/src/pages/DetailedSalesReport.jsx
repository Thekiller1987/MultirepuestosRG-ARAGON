import React, { useEffect, useState, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import {
    FaArrowLeft, FaSyncAlt, FaCalendarAlt, FaSearch,
    FaShoppingCart, FaUndoAlt, FaBarcode, FaFileInvoice,
    FaUser, FaClock, FaChevronDown, FaChevronUp, FaPrint, FaBoxOpen
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/* ================== CONFIG ================== */
const API_URL = '/api';

/* ================== HELPERS ================== */
function todayManagua() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const fmtMoney = (n) => `C$${Number(n || 0).toFixed(2)}`;

const fmtDT = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('es-NI', {
        timeZone: 'America/Managua',
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
    });
};

const fmtDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-NI', {
        timeZone: 'America/Managua',
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
};

/* ================== THEME & STYLES ================== */
const theme = {
    primary: '#0f172a',
    secondary: '#475569',
    success: '#16a34a',
    danger: '#dc2626',
    warning: '#d97706',
    info: '#0284c7',
    bg: '#f8fafc',
    surface: '#ffffff',
    border: '#e2e8f0',
    text: '#1e293b',
    textLight: '#64748b'
};

const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;

// Define Styled Components
const Container = styled.div`
  max-width: 1500px;
  margin: 0 auto;
  padding: 2rem;
  background: ${theme.bg};
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: ${theme.text};
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  background: white;
  padding: 1.25rem 2rem;
  border-radius: 12px;
  border: 1px solid ${theme.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  flex-wrap: wrap;
  gap: 1rem;
`;

const BackButton = styled.button`
  background: white;
  border: 1px solid ${theme.border};
  width: 40px; height: 40px;
  border-radius: 8px;
  display: grid; place-items: center;
  cursor: pointer;
  color: ${theme.text};
  transition: all 0.2s;
  &:hover { background: ${theme.bg}; color: ${theme.primary}; }
`;

const TabBar = styled.div`
  display: flex;
  gap: 0;
  background: white;
  border-radius: 12px;
  border: 1px solid ${theme.border};
  overflow: hidden;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

const Tab = styled.button`
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  background: ${props => props.active ? theme.primary : 'white'};
  color: ${props => props.active ? 'white' : theme.secondary};
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  border-right: 1px solid ${theme.border};
  &:last-child { border-right: none; }
  &:hover {
    background: ${props => props.active ? theme.primary : '#f1f5f9'};
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  input[type="date"], input[type="text"] {
    padding: 10px 14px;
    border: 1px solid ${theme.border};
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.9rem;
    color: ${theme.text};
    background: white;
    outline: none;
    transition: border-color 0.2s;
    &:focus { border-color: ${theme.primary}; }
  }

  select {
    padding: 10px 14px;
    border: 1px solid ${theme.border};
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.9rem;
    color: ${theme.text};
    background: white;
    outline: none;
    cursor: pointer;
  }
`;

const ActionBtn = styled.button`
  padding: 10px 18px;
  border: 1px solid ${theme.border};
  border-radius: 8px;
  background: ${props => props.variant === 'primary' ? theme.primary : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : theme.secondary};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  &:hover {
    background: ${props => props.variant === 'primary' ? '#1e293b' : theme.bg};
    transform: translateY(-1px);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${theme.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  animation: ${fadeIn} 0.3s ease;

  thead {
    background: #f1f5f9;
    th {
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      font-size: 0.8rem;
      color: ${theme.secondary};
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 2px solid ${theme.border};
      white-space: nowrap;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #f1f5f9;
      transition: background 0.15s;
      cursor: ${props => props.clickable ? 'pointer' : 'default'};
      &:hover { background: #fafbfc; }
      &:last-child { border-bottom: none; }
    }
    td {
      padding: 10px 16px;
      font-size: 0.9rem;
      color: ${theme.text};
      vertical-align: top;
    }
  }

  .num { text-align: right; font-family: 'Roboto Mono', monospace; }
  .center { text-align: center; }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: ${theme.textLight};
  background: white;
  border-radius: 12px;
  border: 1px solid ${theme.border};
  animation: ${fadeIn} 0.3s ease;
  p { margin: 0.5rem 0; }
  svg { font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.4; }
`;

const SummaryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 0.3s ease;
`;

const SummaryCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid ${theme.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  
  .label {
    font-size: 0.8rem;
    color: ${theme.textLight};
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.03em;
    margin-bottom: 0.4rem;
  }
  .value {
    font-size: 1.4rem;
    font-weight: 700;
    color: ${props => props.color || theme.primary};
    font-family: 'Roboto Mono', monospace;
  }
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.82rem;
  color: ${theme.secondary};
  
  .item-row {
    display: flex;
    justify-content: space-between;
    padding: 2px 0;
    &:hover { color: ${theme.text}; }
  }
  .item-name { flex: 1; }
  .item-qty { width: 40px; text-align: center; color: ${theme.textLight}; }
  .item-price { width: 90px; text-align: right; font-family: 'Roboto Mono', monospace; }
`;

const ExpandBtn = styled.button`
  all: unset;
  cursor: pointer;
  color: ${theme.info};
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  &:hover { text-decoration: underline; }
`;

const LoadingOverlay = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${theme.textLight};
  font-size: 1rem;
`;

/* ================== MOBILE STYLES ================== */
const MobileGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 2rem;
`;

const MobileCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid ${theme.border};
  box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  animation: ${fadeIn} 0.3s ease;
`;

const MobileRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  
  .label { font-size: 0.75rem; color: ${theme.textLight}; font-weight: 600; text-transform: uppercase; }
  .value { font-size: 0.95rem; font-weight: 600; color: ${theme.text}; }
  .price { font-family: 'Roboto Mono', monospace; font-size: 1.1rem; color: ${theme.primary}; }
`;

const MobileItems = styled.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.85rem;
  border: 1px dashed ${theme.border};
`;

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const h = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', h);
        return () => window.removeEventListener('resize', h);
    }, []);
    return isMobile;
};

// Helper for badge styles
const getBadgeStyles = (type) => {
    switch (type) {
        case 'COMPLETADA': return { background: '#dcfce7', color: '#166534' };
        case 'DEVOLUCION': return { background: '#fee2e2', color: '#991b1b' };
        case 'CANCELADA': return { background: '#fef3c7', color: '#92400e' };
        default: return { background: '#f1f5f9', color: '#475569' };
    }
};

const Badge = ({ type, children }) => {
    const style = {
        fontSize: '0.7rem',
        fontWeight: 700,
        padding: '3px 8px',
        borderRadius: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
        whiteSpace: 'nowrap',
        ...getBadgeStyles(type)
    };
    return <span style={style}>{children}</span>;
};

/* ================== MAIN COMPONENT ================== */
export default function DetailedSalesReport() {
    const { token, products: allProducts } = useAuth(); // Use products from Context for instant access
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const [activeTab, setActiveTab] = useState('ventas');
    const [startDate, setStartDate] = useState(todayManagua());
    const [endDate, setEndDate] = useState(todayManagua());

    // Sales Data
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedRows, setExpandedRows] = useState({});

    // Product Mode State
    const [searchTerm, setSearchTerm] = useState('');
    const [reportKeyword, setReportKeyword] = useState(''); // Global keyword for "Búsqueda por Palabra"
    const [reportClient, setReportClient] = useState(null);
    const [showClientList, setShowClientList] = useState(false);
    const [clientSearch, setClientSearch] = useState('');
    const [productResult, setProductResult] = useState(null); // Selected product history
    const [productLoading, setProductLoading] = useState(false);

    const authHeader = useMemo(() => {
        const h = { 'Content-Type': 'application/json' };
        if (token) h.Authorization = `Bearer ${token}`;
        return h;
    }, [token]);

    // Fetch sales based on tab
    const fetchSales = useCallback(async (tipo, keywordSearch, clientId) => {
        setLoading(true);
        try {
            const params = { startDate, endDate };
            if (tipo) params.tipo = tipo;
            if (keywordSearch) params.keyword = keywordSearch;
            if (clientId) params.clientId = clientId;

            const res = await axios.get(`${API_URL}/reports/detailed-sales`, { headers: authHeader, params });
            setSales(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Error fetching detailed sales:', err);
            setSales([]);
        } finally {
            setLoading(false);
        }
    }, [authHeader, startDate, endDate]);

    // Auto-fetch sales when tab changes
    useEffect(() => {
        if (activeTab === 'ventas') fetchSales(null, null, reportClient?.id_cliente);
        else if (activeTab === 'devoluciones') fetchSales('DEVOLUCION');
        else if (activeTab === 'busqueda' && reportKeyword.trim().length >= 3) fetchSales(null, reportKeyword);
    }, [activeTab, startDate, endDate, fetchSales, reportKeyword, reportClient]);

    // Derived state for Product List (filtered)
    const filteredProducts = useMemo(() => {
        if (!searchTerm) return allProducts; // Show all (or limit logic in render)
        const lower = searchTerm.toLowerCase();
        return allProducts.filter(p =>
            p.nombre.toLowerCase().includes(lower) ||
            String(p.codigo).toLowerCase().includes(lower)
        );
    }, [allProducts, searchTerm]);

    const fetchProductHistory = async (product) => {
        if (!product) return;
        setProductLoading(true);
        try {
            const res = await axios.get(`${API_URL}/reports/product-history`, {
                headers: authHeader,
                params: { code: product.codigo }
            });
            // Construct result with the full product object passed in
            setProductResult({
                product: product,
                history: Array.isArray(res.data.history) ? res.data.history : (Array.isArray(res.data) ? res.data : [])
            });
        } catch (err) {
            console.error('Error fetching product history:', err);
            // Even if history fails, show the product details
            setProductResult({ product: product, history: [] });
        } finally {
            setProductLoading(false);
        }
    };

    const toggleExpand = (id) => {
        setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Stats for Sales/Returns
    const totalVentas = sales.reduce((s, v) => s + Number(v.totalVenta || 0), 0);
    const totalTransacciones = sales.length;

    const getPaymentMethod = (pd) => {
        if (!pd) return '—';
        const parts = [];
        if (pd.efectivo > 0) parts.push(`Efectivo: ${fmtMoney(pd.efectivo)}`);
        if (pd.tarjeta > 0) parts.push(`Tarjeta: ${fmtMoney(pd.tarjeta)}`);
        if (pd.transferencia > 0) parts.push(`Transf: ${fmtMoney(pd.transferencia)}`);
        if (pd.credito > 0) parts.push(`Crédito: ${fmtMoney(pd.credito)}`);
        if (pd.dolares > 0) parts.push(`USD: $${Number(pd.dolares).toFixed(2)}`);
        return parts.length ? parts.join(' | ') : 'Efectivo';
    };

    const handlePrint = () => {
        const win = window.open('', '_blank');
        if (!win) return;

        const isProduct = activeTab === 'producto';
        const title = isProduct
            ? `Historial de Producto: ${productResult?.product?.nombre || ''}`
            : `Reporte de ${activeTab === 'devoluciones' ? 'Devoluciones' : 'Ventas Detalladas'}`;

        const dateRange = isProduct ? '' : `Del ${fmtDate(startDate)} al ${fmtDate(endDate)}`;

        let content = '';
        /* Reuse styles... omitted for brevity in thought, but included in code */
        const style = `
            @page { size: A4 landscape; margin: 10mm; }
            body { font-family: 'Inter', sans-serif; color: #1e293b; padding: 20px; }
            h1 { font-size: 18pt; margin-bottom: 5px; color: #0f172a; }
            p { margin: 0 0 20px; color: #64748b; font-size: 10pt; }
            table { width: 100%; border-collapse: collapse; font-size: 9pt; }
            th { background: #f1f5f9; text-align: left; padding: 8px; border-bottom: 2px solid #e2e8f0; }
            td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
            .num { text-align: right; font-family: 'Roboto Mono', monospace; }
            .center { text-align: center; }
            .badge { padding: 2px 6px; border-radius: 4px; font-size: 8pt; font-weight: bold; border: 1px solid #ccc; }
        `;

        if (isProduct) {
            if (!productResult || !productResult.product) return;
            const p = productResult.product;
            const history = productResult.history || [];
            content += `
                 <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #cbd5e1; border-radius: 8px;">
                     <h2 style="margin:0 0 10px;">${p.nombre}</h2>
                     <div style="display:flex; gap:20px; font-size:10pt;">
                         <strong>Código: ${p.codigo}</strong>
                         <strong>Precio: ${fmtMoney(p.precio)}</strong>
                         <strong>Existencia: ${p.existencia}</strong>
                     </div>
                 </div>
                 <table>
                     <thead>
                         <tr>
                             <th>Fecha</th>
                             <th>Factura</th>
                             <th>Cliente</th>
                             <th>Tipo</th>
                             <th class="center">Cant.</th>
                             <th class="num">Precio</th>
                             <th class="num">Subtotal</th>
                         </tr>
                     </thead>
                     <tbody>
                         ${history.map(h => `
                             <tr>
                                 <td>${fmtDT(h.fecha)}</td>
                                 <td>#${h.idVenta}</td>
                                 <td>${h.clienteNombre || 'Público'}</td>
                                 <td>${h.tipo_venta}</td>
                                 <td class="center">${h.cantidad}</td>
                                 <td class="num">${fmtMoney(h.precioUnitario)}</td>
                                 <td class="num">${fmtMoney(h.cantidad * h.precioUnitario)}</td>
                             </tr>
                         `).join('')}
                     </tbody>
                 </table>
             `;
        } else {
            // ... (Sales logic similar to previous)
            content += `
                <div style="margin-bottom:20px;">
                    <strong>Total:</strong> ${fmtMoney(totalVentas)} (${totalTransacciones} tx)
                </div>
                <table>
                    <thead>
                        <tr>
                             <th>#</th><th>Fecha</th><th>Estado</th><th>Cliente</th><th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sales.map(s => `
                            <tr>
                                <td>${s.id}</td>
                                <td>${fmtDT(s.fecha)}</td>
                                <td>${s.estado}</td>
                                <td>${s.clienteNombre || 'PG'}</td>
                                <td class="num">${fmtMoney(s.totalVenta)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }

        const html = `<html><head><title>${title}</title><style>${style}</style></head>
        <body><h1>${title}</h1>${content}<script>window.onload=()=>{window.print();}</script></body></html>`;

        win.document.write(html);
        win.document.close();
    };

    return (
        <Container>
            <Header>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <BackButton onClick={() => navigate('/dashboard')}>
                        <FaArrowLeft />
                    </BackButton>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: theme.primary }}>
                            Reportes de Ventas Detallado
                        </h1>
                        <p style={{ margin: '2px 0 0', color: theme.textLight, fontSize: '0.9rem' }}>
                            Ventas, devoluciones y seguimiento por producto
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {loading && <span style={{ color: theme.textLight }}><FaSyncAlt className="icon-spin" /> Cargando...</span>}
                    <ActionBtn onClick={handlePrint}>
                        <FaPrint /> Imprimir
                    </ActionBtn>
                </div>
            </Header>

            <TabBar>
                <Tab active={activeTab === 'ventas'} onClick={() => setActiveTab('ventas')}>
                    <FaShoppingCart /> Ventas Detalladas
                </Tab>
                <Tab active={activeTab === 'busqueda'} onClick={() => setActiveTab('busqueda')}>
                    <FaSearch /> Búsqueda por Palabra
                </Tab>
                <Tab active={activeTab === 'producto'} onClick={() => setActiveTab('producto')}>
                    <FaBarcode /> Buscar por Producto
                </Tab>
            </TabBar>

            {(activeTab === 'ventas' || activeTab === 'devoluciones' || activeTab === 'busqueda') && (
                <>
                    <FilterBar>
                        <FaCalendarAlt style={{ color: theme.primary }} />
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                        <span style={{ color: theme.textLight }}>a</span>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />

                        {activeTab === 'ventas' && (
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <FaUser style={{ position: 'absolute', left: '10px', color: theme.textLight }} />
                                <input
                                    type="text"
                                    placeholder="Filtrar por cliente..."
                                    value={reportClient ? reportClient.nombre : clientSearch}
                                    onChange={e => {
                                        setClientSearch(e.target.value);
                                        setReportClient(null);
                                        setShowClientList(true);
                                    }}
                                    onFocus={() => setShowClientList(true)}
                                    style={{ paddingLeft: '35px', minWidth: '200px' }}
                                />
                                {reportClient && (
                                    <FaTimes
                                        onClick={() => { setReportClient(null); setClientSearch(''); }}
                                        style={{ position: 'absolute', right: '10px', color: theme.textLight, cursor: 'pointer' }}
                                    />
                                )}
                                {showClientList && (
                                    <div style={{
                                        position: 'absolute', top: '100%', left: 0, width: '100%', background: 'white',
                                        border: `1px solid ${theme.border}`, borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 100,
                                        maxHeight: '200px', overflowY: 'auto'
                                    }}>
                                        <div
                                            onClick={() => { setReportClient(null); setClientSearch(''); setShowClientList(false); }}
                                            style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: `1px solid ${theme.border}`, fontSize: '0.9rem' }}
                                        >
                                            -- Todos los clientes --
                                        </div>
                                        {clients.filter(c => c.nombre.toLowerCase().includes(clientSearch.toLowerCase())).slice(0, 20).map(c => (
                                            <div
                                                key={c.id_cliente}
                                                onClick={() => { setReportClient(c); setClientSearch(c.nombre); setShowClientList(false); }}
                                                style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: `1px solid ${theme.border}`, fontSize: '0.9rem' }}
                                            >
                                                {c.nombre}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'busqueda' && (
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <FaSearch style={{ position: 'absolute', left: '10px', color: theme.textLight }} />
                                <input
                                    type="text"
                                    placeholder="Buscar palabra..."
                                    value={reportKeyword}
                                    onChange={e => setReportKeyword(e.target.value)}
                                    style={{ paddingLeft: '35px', minWidth: '180px' }}
                                />
                            </div>
                        )}

                        <ActionBtn variant="primary" onClick={() => {
                            if (activeTab === 'ventas') fetchSales(null, null, reportClient?.id_cliente);
                            else if (activeTab === 'devoluciones') fetchSales('DEVOLUCION');
                            else if (activeTab === 'busqueda') fetchSales(null, reportKeyword);
                        }}>
                            <FaSyncAlt /> {activeTab === 'busqueda' ? 'Buscar' : 'Actualizar'}
                        </ActionBtn>
                    </FilterBar>

                    <SummaryCards>
                        <SummaryCard color={theme.primary}>
                            <div className="label">
                                {activeTab === 'busqueda' ? `Ventas con "${reportKeyword}"` :
                                    activeTab === 'devoluciones' ? 'Total Devoluciones' : 'Total Ventas'}
                            </div>
                            <div className="value">{fmtMoney(totalVentas)}</div>
                        </SummaryCard>
                        <SummaryCard color={theme.info}>
                            <div className="label">Transacciones</div>
                            <div className="value">{totalTransacciones}</div>
                        </SummaryCard>
                        <SummaryCard color={theme.success}>
                            <div className="label">Promedio por Venta</div>
                            <div className="value">{fmtMoney(totalTransacciones > 0 ? totalVentas / totalTransacciones : 0)}</div>
                        </SummaryCard>
                    </SummaryCards>

                    {loading ? (
                        <LoadingOverlay><FaSyncAlt /> Cargando datos...</LoadingOverlay>
                    ) : sales.length === 0 ? (
                        <EmptyState>
                            <FaFileInvoice />
                            <p>
                                {activeTab === 'busqueda'
                                    ? `No se encontraron resultados para "${reportKeyword}"`
                                    : `No se encontraron ${activeTab === 'devoluciones' ? 'devoluciones' : 'ventas'} en este rango.`
                                }
                            </p>
                        </EmptyState>
                    ) : isMobile ? (
                        /* ================== MOBILE VIEW (Ventas/Devoluciones/Busqueda) ================== */
                        <MobileGrid>
                            {sales.map(sale => (
                                <MobileCard key={sale.id}>
                                    <MobileRow>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 700, color: theme.info }}>#{sale.id}</span>
                                            <Badge type={sale.estado}>{sale.estado}</Badge>
                                        </div>
                                        <div className="price">{fmtMoney(sale.totalVenta)}</div>
                                    </MobileRow>

                                    <MobileRow>
                                        <div className="label">Fecha</div>
                                        <div className="value">{fmtDT(sale.fecha)}</div>
                                    </MobileRow>

                                    <MobileRow>
                                        <div className="label">Cliente</div>
                                        <div className="value">{sale.clienteNombre || 'Público General'}</div>
                                    </MobileRow>

                                    <MobileItems>
                                        <div className="label" style={{ marginBottom: '4px', display: 'block' }}>Productos</div>
                                        {sale.items?.map((item, i) => {
                                            const isMatch = activeTab === 'busqueda' && reportKeyword && item.nombre.toLowerCase().includes(reportKeyword.toLowerCase());
                                            return (
                                                <div key={i} style={{
                                                    display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem',
                                                    background: isMatch ? '#fef9c3' : 'transparent',
                                                    padding: isMatch ? '2px 4px' : '0',
                                                    borderRadius: '4px',
                                                    border: isMatch ? `1px dashed #facc15` : 'none'
                                                }}>
                                                    <span>{item.nombre} (x{item.quantity})</span>
                                                    <span style={{ fontWeight: 600 }}>{fmtMoney(item.precio * item.quantity)}</span>
                                                </div>
                                            );
                                        })}
                                    </MobileItems>

                                    <div style={{ fontSize: '0.75rem', color: theme.textLight, marginTop: '4px' }}>
                                        <strong>Vendedor:</strong> {sale.vendedorNombre || '—'} | <strong>Pago:</strong> {getPaymentMethod(sale.pagoDetalles)}
                                    </div>
                                </MobileCard>
                            ))}
                        </MobileGrid>
                    ) : (
                        /* ================== DESKTOP VIEW (Ventas/Devoluciones/Busqueda) ================== */
                        <Table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Fecha / Hora</th>
                                    <th>Estado</th>
                                    <th>Cliente</th>
                                    <th style={{ width: '30%' }}>Productos</th>
                                    <th>Forma de Pago</th>
                                    <th className="num">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.map(sale => {
                                    const isExpanded = expandedRows[sale.id];
                                    const items = sale.items || [];
                                    const showItems = isExpanded ? items : items.slice(0, 3);
                                    return (
                                        <tr key={sale.id}>
                                            <td style={{ fontWeight: 600, color: theme.info }}>#{sale.id}</td>
                                            <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>{fmtDT(sale.fecha)}</td>
                                            <td><Badge type={sale.estado}>{sale.estado}</Badge></td>
                                            <td>
                                                <div style={{ fontSize: '0.9rem' }}>{sale.clienteNombre || <span style={{ color: theme.textLight }}>Público Gral.</span>}</div>
                                                <div style={{ fontSize: '0.75rem', color: theme.textLight }}>Vendedor: {sale.vendedorNombre || '—'}</div>
                                            </td>
                                            <td>
                                                <ItemsList>
                                                    {showItems.map((item, i) => {
                                                        const isMatch = activeTab === 'busqueda' && reportKeyword && item.nombre.toLowerCase().includes(reportKeyword.toLowerCase());
                                                        return (
                                                            <div className="item-row" key={i} style={{
                                                                background: isMatch ? '#fef9c3' : 'transparent',
                                                                padding: isMatch ? '2px 4px' : '0',
                                                                borderRadius: '4px'
                                                            }}>
                                                                <span className="item-name">{item.nombre || '—'}</span>
                                                                <span className="item-qty">x{item.quantity}</span>
                                                                <span className="item-price">{fmtMoney(item.precio * item.quantity)}</span>
                                                            </div>
                                                        );
                                                    })}
                                                    {items.length > 3 && (
                                                        <ExpandBtn onClick={() => toggleExpand(sale.id)}>
                                                            {isExpanded ? <><FaChevronUp /> Menos</> : <><FaChevronDown /> +{items.length - 3} más</>}
                                                        </ExpandBtn>
                                                    )}
                                                </ItemsList>
                                            </td>
                                            <td style={{ fontSize: '0.82rem', color: theme.secondary }}>
                                                {getPaymentMethod(sale.pagoDetalles)}
                                            </td>
                                            <td className="num" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                                                {fmtMoney(sale.totalVenta)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    )}
                </>
            )}

            {activeTab === 'producto' && (
                <>
                    {!productResult ? (
                        /* ================== PRODUCT LIST VIEW ================== */
                        <>
                            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '10px' }}>
                                <div style={{ position: 'relative', flex: 1, maxWidth: isMobile ? '100%' : '600px' }}>
                                    <FaSearch style={{ position: 'absolute', left: '12px', top: '14px', color: theme.textLight }} />
                                    <input
                                        type="text"
                                        placeholder="Filtrar por nombre o código..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        autoFocus
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px 12px 40px',
                                            borderRadius: '8px',
                                            border: `1px solid ${theme.border}`,
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>
                            </div>

                            {isMobile ? (
                                <MobileGrid>
                                    {filteredProducts.slice(0, 50).map(p => (
                                        <MobileCard key={p.id_producto} onClick={() => fetchProductHistory(p)} style={{ cursor: 'pointer' }}>
                                            <MobileRow>
                                                <div className="value" style={{ color: theme.info }}>{p.codigo}</div>
                                                <div className="price">{fmtMoney(p.precio)}</div>
                                            </MobileRow>
                                            <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{p.nombre}</div>
                                            <MobileRow>
                                                <div className="label">Stock</div>
                                                <div className="value">
                                                    <span style={{
                                                        padding: '2px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '0.8rem',
                                                        background: p.existencia > 0 ? '#dcfce7' : '#fee2e2',
                                                        color: p.existencia > 0 ? '#166534' : '#991b1b'
                                                    }}>
                                                        {p.existencia}
                                                    </span>
                                                </div>
                                            </MobileRow>
                                        </MobileCard>
                                    ))}
                                </MobileGrid>
                            ) : (
                                <Table clickable={true}>
                                    <thead>
                                        <tr>
                                            <th>Código</th>
                                            <th>Nombre</th>
                                            <th className="center">Existencia</th>
                                            <th className="num">Precio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.slice(0, 100).map(p => (
                                            <tr key={p.id_producto} onClick={() => fetchProductHistory(p)}>
                                                <td style={{ fontWeight: 600, color: theme.primary }}>{p.codigo}</td>
                                                <td>{p.nombre}</td>
                                                <td className="center">
                                                    <span style={{
                                                        padding: '2px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '0.8rem',
                                                        background: p.existencia > 0 ? '#dcfce7' : '#fee2e2',
                                                        color: p.existencia > 0 ? '#166534' : '#991b1b'
                                                    }}>
                                                        {p.existencia}
                                                    </span>
                                                </td>
                                                <td className="num">{fmtMoney(p.precio)}</td>
                                            </tr>
                                        ))}
                                        {filteredProducts.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="center" style={{ padding: '2rem' }}>
                                                    No se encontraron productos.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            )}
                            {filteredProducts.length > (isMobile ? 50 : 100) && (
                                <div style={{ textAlign: 'center', marginTop: '1rem', color: theme.textLight, fontSize: '0.9rem' }}>
                                    Mostrando {isMobile ? 50 : 100} de {filteredProducts.length} productos. Refina tu búsqueda.
                                </div>
                            )}
                        </>
                    ) : (
                        /* ================== PRODUCT HISTORY VIEW ================== */
                        <div>
                            <div style={{ marginBottom: '1rem' }}>
                                <ActionBtn onClick={() => setProductResult(null)}>
                                    <FaArrowLeft /> Volver a lista de productos
                                </ActionBtn>
                            </div>
                            <SummaryCard style={{ marginBottom: '1rem' }}>
                                <h2>{productResult.product?.nombre}</h2>
                                <div style={{ display: 'flex', gap: '20px', color: theme.secondary, flexWrap: 'wrap' }}>
                                    <span>Código: <strong>{productResult.product?.codigo}</strong></span>
                                    <span>Precio: <strong>{fmtMoney(productResult.product?.precio)}</strong></span>
                                    <span>Existencia: <strong>{productResult.product?.existencia}</strong></span>
                                    <span>Transacciones: <strong>{productResult.history?.length || 0}</strong></span>
                                </div>
                            </SummaryCard>

                            {productLoading ? (
                                <LoadingOverlay><FaSyncAlt className="icon-spin" /> Cargando historial...</LoadingOverlay>
                            ) : (!productResult.history || productResult.history.length === 0) ? (
                                <EmptyState>
                                    <FaBoxOpen />
                                    <p>Este producto no tiene historial de ventas reciente.</p>
                                </EmptyState>
                            ) : isMobile ? (
                                <MobileGrid>
                                    {productResult.history.map((h, i) => (
                                        <MobileCard key={i}>
                                            <MobileRow>
                                                <div className="value" style={{ color: theme.info }}>Doc #{h.idVenta}</div>
                                                <Badge type={h.tipo_venta}>{h.tipo_venta}</Badge>
                                            </MobileRow>
                                            <MobileRow>
                                                <div className="label">Fecha</div>
                                                <div className="value">{fmtDT(h.fecha)}</div>
                                            </MobileRow>
                                            <MobileRow>
                                                <div className="label">Cliente</div>
                                                <div className="value">{h.clienteNombre || 'Público'}</div>
                                            </MobileRow>
                                            <MobileRow>
                                                <div className="label">Cant. x Precio</div>
                                                <div className="value">{h.cantidad} x {fmtMoney(h.precioUnitario)}</div>
                                            </MobileRow>
                                            <MobileRow>
                                                <div className="label">Subtotal</div>
                                                <div className="price">{fmtMoney(h.cantidad * h.precioUnitario)}</div>
                                            </MobileRow>
                                        </MobileCard>
                                    ))}
                                </MobileGrid>
                            ) : (
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Doc</th>
                                            <th>Cliente</th>
                                            <th>Tipo</th>
                                            <th className="center">Cant.</th>
                                            <th className="num">Precio</th>
                                            <th className="num">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productResult.history.map((h, i) => (
                                            <tr key={i}>
                                                <td>{fmtDT(h.fecha)}</td>
                                                <td>#{h.idVenta}</td>
                                                <td>{h.clienteNombre || 'Público'}</td>
                                                <td><Badge type={h.tipo_venta}>{h.tipo_venta}</Badge></td>
                                                <td className="center" style={{ fontWeight: 700 }}>{h.cantidad}</td>
                                                <td className="num">{fmtMoney(h.precioUnitario)}</td>
                                                <td className="num">{fmtMoney(h.cantidad * h.precioUnitario)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </div>
                    )}
                </>
            )}
        </Container>
    );
}
