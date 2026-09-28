import React, { useState, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaArrowLeft, FaBoxes, FaTruck, FaFilePdf, FaUsers, FaFileInvoiceDollar,
  FaSearch, FaPlus, FaCheck, FaTimes, FaEdit, FaPrint, FaGift, FaTags,
  FaExclamationTriangle, FaWarehouse, FaUserTie, FaMoneyBillWave, FaSpinner,
  FaExchangeAlt, FaPercent, FaBoxOpen, FaChartLine, FaFileExcel, FaDownload,
  FaClipboardCheck, FaSignature, FaStore, FaChartPie, FaUserPlus, FaRedo
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';

import { useAuth } from '../context/AuthContext';
import {
  fetchMayoristaMetrics,
  fetchMayoristaProducts,
  fetchMayoristaCatalog,
  toggleCatalogStatusApi,
  updateMayoristaConfigApi,
  fetchCargasRuta,
  fetchDetalleCargaRuta,
  createCargaRuta,
  liquidarCargaRuta,
  fetchClientesRuta,
  createClienteRuta,
  fetchFacturasRuta,
  fetchDetalleFacturaRuta,
  createFacturaRuta,
  updateComisionPagadaApi,
  fetchEmployees,
  createEmployeeApi,
  clearCachedImage
} from '../service/api';
import { useLazyImage } from '../hooks/useLazyImage.js';
import socket from '../service/socket.js';

/* =========================================================================
   ESTILOS GENERALES Y TEMA ELEGANTE
========================================================================= */
const PageWrapper = styled.div`
  padding: clamp(1rem, 3vw, 2rem);
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #1e293b;
  box-sizing: border-box;
`;

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 8px 14px;
  margin-bottom: 1.25rem;
  background: white;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  &:hover {
    color: #059669;
    border-color: #059669;
    background: #ecfdf5;
    transform: translateX(-3px);
  }
`;

const HeaderBanner = styled.div`
  background: linear-gradient(135deg, #065f46 0%, #059669 100%);
  color: white;
  padding: 1.75rem 2rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  box-shadow: 0 10px 25px -5px rgba(5, 150, 105, 0.25);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.25rem;
`;

const BannerText = styled.div`
  h1 {
    margin: 0;
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  p {
    margin: 0.4rem 0 0;
    font-size: 0.95rem;
    opacity: 0.9;
  }
`;

/* TAB NAVIGATION */
const TabNav = styled.div`
  display: flex;
  gap: 0.5rem;
  background: white;
  padding: 0.5rem;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.75rem;
  overflow-x: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.25rem;
  border: none;
  background: ${props => props.$active ? '#059669' : 'transparent'};
  color: ${props => props.$active ? '#ffffff' : '#64748b'};
  font-weight: 700;
  font-size: 0.95rem;
  border-radius: 10px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? '#059669' : '#f1f5f9'};
    color: ${props => props.$active ? '#ffffff' : '#0f172a'};
  }
`;

/* KPI CARDS (DASHBOARD METRICS) */
const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
`;

const KpiCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  }
`;

const KpiIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: ${props => props.$bg || '#ecfdf5'};
  color: ${props => props.$color || '#059669'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  flex-shrink: 0;
`;

const KpiInfo = styled.div`
  span {
    display: block;
    font-size: 0.82rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
  }
  strong {
    display: block;
    font-size: 1.5rem;
    font-weight: 800;
    color: #1e293b;
    margin-top: 0.2rem;
  }
  small {
    font-size: 0.78rem;
    color: #059669;
    font-weight: 600;
  }
`;

/* FILTERS & SEARCH */
const FilterBar = styled.div`
  background: white;
  padding: 1.25rem;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
`;

const SearchInputWrap = styled.div`
  position: relative;
  flex: 1;
  min-width: 260px;
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
  }
  input {
    width: 100%;
    padding: 0.65rem 1rem 0.65rem 2.4rem;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    font-size: 0.92rem;
    outline: none;
    box-sizing: border-box;
    &:focus { border-color: #059669; box-shadow: 0 0 0 2px rgba(5,150,105,0.15); }
  }
`;

const SelectBox = styled.select`
  padding: 0.65rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 0.92rem;
  outline: none;
  background: white;
  color: #334155;
  cursor: pointer;
  &:focus { border-color: #059669; }
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  background: ${props => props.$secondary ? '#f1f5f9' : (props.$danger ? '#fee2e2' : (props.$excel ? '#107c41' : '#059669'))};
  color: ${props => props.$secondary ? '#334155' : (props.$danger ? '#dc2626' : '#ffffff')};
  border: ${props => props.$secondary ? '1px solid #cbd5e1' : 'none'};
  font-weight: 700;
  font-size: 0.92rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    filter: brightness(0.95);
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/* PRODUCT CARDS GRID FOR CATALOG VIEW */
const CatalogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 1.25rem;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid ${props => props.$inCatalog ? '#a7f3d0' : '#e2e8f0'};
  overflow: hidden;
  box-shadow: ${props => props.$inCatalog ? '0 4px 12px rgba(5,150,105,0.08)' : '0 1px 3px rgba(0,0,0,0.04)'};
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  }
`;

const CardImageContainer = styled.div`
  width: 100%;
  height: 160px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .no-img {
    color: #94a3b8;
    font-size: 2.5rem;
  }
`;

const CatalogBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${props => props.$active ? '#059669' : '#64748b'};
  color: white;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 5px;
`;

const CardBody = styled.div`
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.6rem;
`;

const ProductTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductCode = styled.span`
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
`;

const PriceRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  background: #f8fafc;
  padding: 0.6rem 0.8rem;
  border-radius: 10px;
  margin-top: 0.2rem;
`;

const PriceItem = styled.div`
  span {
    display: block;
    font-size: 0.72rem;
    color: #64748b;
    text-transform: uppercase;
    font-weight: 700;
  }
  strong {
    font-size: 1.05rem;
    color: ${props => props.$highlight ? '#059669' : '#0f172a'};
    font-weight: 800;
  }
`;

const PromoTag = styled.div`
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ComboTag = styled.div`
  background: #eff6ff;
  color: #1e40af;
  border: 1px solid #bfdbfe;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const CardFooter = styled.div`
  padding: 0.8rem 1.2rem;
  background: #fcfdfe;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  span {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: #cbd5e1;
    transition: 0.2s;
    border-radius: 24px;
  }
  span:before {
    position: absolute;
    content: "";
    height: 18px; width: 18px;
    left: 3px; bottom: 3px;
    background-color: white;
    transition: 0.2s;
    border-radius: 50%;
  }
  input:checked + span {
    background-color: #059669;
  }
  input:checked + span:before {
    transform: translateX(24px);
  }
`;

/* MODAL STYLES */
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalBox = styled(motion.div)`
  background: white;
  width: 100%;
  max-width: ${props => props.$xlarge ? '1020px' : props.$large ? '820px' : '520px'};
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const FormGroup = styled.div`
  margin-bottom: 1.15rem;
  label {
    display: block;
    font-size: 0.88rem;
    font-weight: 700;
    color: #334155;
    margin-bottom: 0.4rem;
  }
  input, select, textarea {
    width: 100%;
    padding: 0.7rem 0.9rem;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    font-size: 0.92rem;
    outline: none;
    box-sizing: border-box;
    &:focus { border-color: #059669; box-shadow: 0 0 0 2px rgba(5,150,105,0.15); }
  }
  small {
    color: #64748b;
    font-size: 0.8rem;
    margin-top: 0.25rem;
    display: block;
  }
`;

const TableWrap = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow-x: auto;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.92rem;
    text-align: left;
  }
  th {
    background: #f8fafc;
    padding: 0.9rem 1rem;
    font-weight: 700;
    color: #475569;
    border-bottom: 1px solid #e2e8f0;
  }
  td {
    padding: 0.9rem 1rem;
    border-bottom: 1px solid #f1f5f9;
    color: #1e293b;
  }
  tr:last-child td {
    border-bottom: none;
  }
`;

/* =========================================================================
   COMPONENTES AUXILIARES: IMÁGENES LAZY LOAD (ALTA VELOCIDAD Y MALA SEÑAL)
========================================================================= */
const LazyMayoristaImage = ({ productId, productName, inCatalog }) => {
  const { imgSrc, cardRef } = useLazyImage(productId);
  return (
    <CardImageContainer ref={cardRef}>
      {imgSrc ? (
        <img src={imgSrc} alt={productName} />
      ) : (
        <div className="no-img"><FaBoxOpen /></div>
      )}
      <CatalogBadge $active={inCatalog}>
        {inCatalog ? <><FaCheck /> En Catálogo</> : 'Inactivo'}
      </CatalogBadge>
    </CardImageContainer>
  );
};

const LazyPdfCatalogItemImage = ({ productId, productName, fallbackSrc }) => {
  const { imgSrc, cardRef } = useLazyImage(productId);
  const src = imgSrc || fallbackSrc;
  return (
    <div ref={cardRef} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {src ? (
        <img src={src} alt={productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <FaBoxOpen style={{ fontSize: '2rem', color: '#cbd5e1' }} />
      )}
    </div>
  );
};

/* =========================================================================
   COMPONENTE PRINCIPAL: MAYORISTAMANAGEMENT
========================================================================= */
const MayoristaManagement = () => {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState('metricas'); // 'metricas', 'catalogo', 'inventario_ruta', 'clientes', 'facturas', 'pdf_preview'

  // Estados de datos
  const [metrics, setMetrics] = useState(null);
  const [products, setProducts] = useState([]);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [cargas, setCargas] = useState([]);
  const [clientesRuta, setClientesRuta] = useState([]);
  const [facturasRuta, setFacturasRuta] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Formato de Catálogo PDF
  const [catalogPdfFormat, setCatalogPdfFormat] = useState('VISUAL'); // 'VISUAL' con fotos o 'COMPACT' lista de precios

  // Filtros de Catálogo
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [catalogStatusFilter, setCatalogStatusFilter] = useState('ALL');

  // Modal de Configuración / Activación Mayorista
  const [configModal, setConfigModal] = useState({
    isOpen: false,
    product: null,
    precio_ruta: '',
    descuento_mayorista: '',
    promocion_mayorista: '',
    combo_mayorista: '',
    catalogo_mayorista: false,
    requireReason: ''
  });

  // Modal para Cargar Inventario a Rutero (Despacho a Ruta)
  const [isCargaModalOpen, setIsCargaModalOpen] = useState(false);
  const [isQuickEmployeeModalOpen, setIsQuickEmployeeModalOpen] = useState(false);
  const [quickEmployee, setQuickEmployee] = useState({
    nombre: '',
    telefono: '',
    cargo: 'Rutero / Repartidor'
  });
  const [nuevaCarga, setNuevaCarga] = useState({
    nombre_rutero: '',
    id_empleado: '',
    vehiculo_ruta: '',
    zona: '',
    porcentaje_comision: '5',
    notas: '',
    items: []
  });

  // Modal de Detalle / Liquidación de Carga
  const [detalleCargaModal, setDetalleCargaModal] = useState({
    isOpen: false,
    carga: null,
    items: [],
    devoluciones: {},
    pagar_comision: true
  });

  // Modal Comprobante de Despacho (Impresión)
  const [comprobanteDespachoModal, setComprobanteDespachoModal] = useState({
    isOpen: false,
    carga: null,
    items: []
  });

  // Modal Nuevo Cliente de Ruta
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    zona_ruta: '',
    limite_credito: ''
  });

  // Modal Facturación de Ruta Mayorista
  const [isFacturaModalOpen, setIsFacturaModalOpen] = useState(false);
  const [nuevaFactura, setNuevaFactura] = useState({
    id_cliente: '',
    id_carga: '',
    metodo_pago: 'EFECTIVO',
    tipo_pago: 'Contado',
    descuento_general: 0,
    notas: '',
    items: []
  });
  const [cargaProductsForInvoice, setCargaProductsForInvoice] = useState([]);
  const [loadingCargaProducts, setLoadingCargaProducts] = useState(false);
  const [facturaDetalleModal, setFacturaDetalleModal] = useState({
    isOpen: false,
    factura: null,
    items: [],
    loading: false
  });
  const facturaTicketRef = useRef(null);

  // Ref para el área imprimible del Catálogo PDF
  const printableCatalogRef = useRef(null);
  const comprobanteRef = useRef(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // Cargar datos del sistema mayorista
  const loadData = async () => {
    try {
      setLoading(true);
      const [met, prods, cats, cargs, clis, facts, emps] = await Promise.all([
        fetchMayoristaMetrics(token).catch(() => null),
        fetchMayoristaProducts(token).catch(() => []),
        fetchMayoristaCatalog(token).catch(() => []),
        fetchCargasRuta(token).catch(() => []),
        fetchClientesRuta(token).catch(() => []),
        fetchFacturasRuta(token).catch(() => []),
        fetchEmployees(token).catch(() => [])
      ]);

      setMetrics(met);
      setProducts(prods);
      setCatalogProducts(cats);
      setCargas(cargs);
      setClientesRuta(clis);
      setFacturasRuta(facts);
      setEmployees(emps);
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar datos del módulo mayorista.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleMayoristaSync = (data) => {
      if (data?.id) {
        clearCachedImage(data.id);
      }
      if (data?.id_producto) {
        clearCachedImage(data.id_producto);
      }
      loadData();
    };

    socket.on('inventory_update', handleMayoristaSync);
    socket.on('products:update', handleMayoristaSync);
    socket.on('sales_update', handleMayoristaSync);
    socket.on('mayorista_update', handleMayoristaSync);

    return () => {
      socket.off('inventory_update', handleMayoristaSync);
      socket.off('products:update', handleMayoristaSync);
      socket.off('sales_update', handleMayoristaSync);
      socket.off('mayorista_update', handleMayoristaSync);
    };
  }, [token]);

  // Categorías únicas
  const categoriesList = useMemo(() => {
    const set = new Set();
    products.forEach(p => {
      if (p.nombre_categoria) set.add(p.nombre_categoria);
    });
    return Array.from(set).sort();
  }, [products]);

  // Productos filtrados para la vista de Catálogo
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = (p.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (p.codigo || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = !categoryFilter || p.nombre_categoria === categoryFilter;
      const matchesStatus =
        catalogStatusFilter === 'ALL' ? true :
        catalogStatusFilter === 'IN_CATALOG' ? Number(p.catalogo_mayorista) === 1 :
        Number(p.catalogo_mayorista) === 0;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [products, searchTerm, categoryFilter, catalogStatusFilter]);

  /* =========================================================================
     MANEJADORES: ACTIVACIÓN Y CONFIGURACIÓN MAYORISTA
  ========================================================================= */

  const handleToggleCatalog = async (product) => {
    const willActivate = Number(product.catalogo_mayorista) === 0;

    if (willActivate) {
      const pRuta = Number(product.precio_ruta || product.mayorista || 0);
      const cost = Number(product.costo || 0);

      if (pRuta <= 0 || pRuta < cost) {
        setConfigModal({
          isOpen: true,
          product,
          precio_ruta: product.precio_ruta || product.mayorista || (cost > 0 ? (cost * 1.15).toFixed(2) : ''),
          descuento_mayorista: product.descuento_mayorista || '',
          promocion_mayorista: product.promocion_mayorista || '',
          combo_mayorista: product.combo_mayorista || '',
          catalogo_mayorista: true,
          requireReason: pRuta <= 0
            ? 'Para activar en el Catálogo Mayorista es obligatorio definir un Precio de Ruta mayor a 0.'
            : `El Precio de Ruta actual (C$ ${pRuta.toFixed(2)}) es menor al costo (C$ ${cost.toFixed(2)}). Debe corregirlo.`
        });
        return;
      }
    }

    try {
      await toggleCatalogStatusApi(product.id_producto, willActivate, token);
      toast.success(willActivate ? 'Producto activado en el Catálogo' : 'Producto retirado del Catálogo');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Error al cambiar estado en catálogo');
    }
  };

  const handleOpenConfig = (product) => {
    setConfigModal({
      isOpen: true,
      product,
      precio_ruta: product.precio_ruta ?? product.mayorista ?? '',
      descuento_mayorista: product.descuento_mayorista ?? '',
      promocion_mayorista: product.promocion_mayorista ?? '',
      combo_mayorista: product.combo_mayorista ?? '',
      catalogo_mayorista: Boolean(product.catalogo_mayorista),
      requireReason: ''
    });
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    const { product, precio_ruta, descuento_mayorista, promocion_mayorista, combo_mayorista, catalogo_mayorista } = configModal;
    const cost = Number(product.costo || 0);
    const pRuta = parseFloat(precio_ruta);

    if (catalogo_mayorista) {
      if (isNaN(pRuta) || pRuta <= 0) {
        toast.error('Para activar en el Catálogo, debe definir un Precio de Ruta mayor a C$ 0.');
        return;
      }
      if (pRuta < cost) {
        toast.error(`El Precio de Ruta (C$ ${pRuta.toFixed(2)}) no puede ser menor que el costo (C$ ${cost.toFixed(2)}).`);
        return;
      }
    }

    try {
      await updateMayoristaConfigApi(product.id_producto, {
        precio_ruta: isNaN(pRuta) ? 0 : pRuta,
        descuento_mayorista: parseFloat(descuento_mayorista || 0),
        promocion_mayorista,
        combo_mayorista,
        catalogo_mayorista
      }, token);

      toast.success('Configuración mayorista guardada con éxito.');
      setConfigModal({ isOpen: false, product: null });
      loadData();
    } catch (err) {
      toast.error(err.message || 'Error al guardar configuración');
    }
  };

  /* =========================================================================
     MANEJADORES: CARGAS A RUTA (DESPACHO AL MUCHACHO)
  ========================================================================= */

  const handleOpenDetalleCarga = async (carga) => {
    try {
      const data = await fetchDetalleCargaRuta(carga.id_carga, token);
      const initialDevoluciones = {};
      data.items.forEach(it => {
        initialDevoluciones[it.id_producto] = 0;
      });
      setDetalleCargaModal({
        isOpen: true,
        carga: data.carga,
        items: data.items,
        devoluciones: initialDevoluciones
      });
    } catch (err) {
      toast.error('Error al obtener detalle de la carga.');
    }
  };

  const handleImprimirComprobante = async (carga) => {
    try {
      const data = await fetchDetalleCargaRuta(carga.id_carga, token);
      setComprobanteDespachoModal({
        isOpen: true,
        carga: data.carga,
        items: data.items
      });
    } catch (err) {
      toast.error('Error al generar comprobante de despacho.');
    }
  };

  const handleLiquidarCarga = async () => {
    const { carga, items, devoluciones, pagar_comision } = detalleCargaModal;
    if (!carga) return;

    if (!window.confirm(`¿Confirmar liquidación de la ruta para ${carga.nombre_rutero}? Los productos sobrantes devueltos serán reintegrados al inventario de tienda.`)) {
      return;
    }

    try {
      const devArray = Object.keys(devoluciones).map(pid => ({
        id_producto: parseInt(pid, 10),
        cantidad_devuelta: parseInt(devoluciones[pid] || 0, 10)
      }));

      await liquidarCargaRuta(carga.id_carga, {
        devoluciones: devArray,
        comision_pagada: pagar_comision
      }, token);

      toast.success('Carga liquidada, sobrantes reintegrados y comisión procesada.');
      setDetalleCargaModal({ isOpen: false, carga: null, items: [], devoluciones: {}, pagar_comision: true });
      loadData();
    } catch (err) {
      toast.error(err.message || 'Error al liquidar la carga.');
    }
  };

  const handleToggleComisionPagada = async (carga) => {
    const nuevoEstado = !carga.comision_pagada;
    try {
      await updateComisionPagadaApi(carga.id_carga, nuevoEstado, token);
      toast.success(`Comisión marcada como ${nuevoEstado ? 'PAGADA' : 'PENDIENTE'}`);
      loadData();
    } catch (err) {
      toast.error('Error al actualizar estado de la comisión');
    }
  };

  const handleCrearCarga = async (e) => {
    e.preventDefault();
    if (!nuevaCarga.id_empleado) {
      toast.error('Debe seleccionar un empleado registrado como rutero. Si no aparece, regístrelo primero en el módulo de Empleados.');
      return;
    }
    if (nuevaCarga.items.length === 0) {
      toast.error('Agregue al menos un producto a la carga.');
      return;
    }

    try {
      const res = await createCargaRuta(nuevaCarga, token);
      toast.success('¡Carga despachada al rutero con éxito!');
      setIsCargaModalOpen(false);
      setNuevaCarga({
        nombre_rutero: '',
        id_empleado: '',
        vehiculo_ruta: '',
        zona: '',
        porcentaje_comision: '5',
        notas: '',
        items: []
      });
      loadData();
    } catch (err) {
      toast.error(err.message || 'Error al crear la carga de ruta.');
    }
  };

  /* =========================================================================
     CREACIÓN RÁPIDA DE EMPLEADO (RUTERO)
  ========================================================================= */
  const handleQuickCreateEmployee = async (e) => {
    e.preventDefault();
    if (!quickEmployee.nombre.trim()) {
      toast.error('El nombre del empleado o rutero es obligatorio.');
      return;
    }
    try {
      const res = await createEmployeeApi({
        nombre: quickEmployee.nombre.trim(),
        telefono: quickEmployee.telefono || null,
        cargo: quickEmployee.cargo || 'Rutero / Repartidor'
      }, token);

      const newId = res.id || res.id_empleado || res.insertId;
      const created = {
        id_empleado: newId,
        nombre: quickEmployee.nombre.trim(),
        telefono: quickEmployee.telefono,
        cargo: quickEmployee.cargo || 'Rutero / Repartidor',
        activo: 1
      };

      setEmployees(prev => [...prev, created]);
      setNuevaCarga(prev => ({
        ...prev,
        id_empleado: String(newId),
        nombre_rutero: quickEmployee.nombre.trim()
      }));

      toast.success(`¡Empleado "${quickEmployee.nombre}" registrado y asignado como rutero! 🎉`);
      setIsQuickEmployeeModalOpen(false);
      setQuickEmployee({ nombre: '', telefono: '', cargo: 'Rutero / Repartidor' });
    } catch (err) {
      toast.error(err.message || 'Error al registrar empleado.');
    }
  };

  /* =========================================================================
     MANEJADORES: CLIENTE DE RUTA
  ========================================================================= */
  const handleCrearCliente = async (e) => {
    e.preventDefault();
    if (!nuevoCliente.nombre.trim()) {
      toast.error('El nombre del cliente o taller es obligatorio.');
      return;
    }

    try {
      await createClienteRuta(nuevoCliente, token);
      toast.success('Cliente de ruta registrado.');
      setIsClienteModalOpen(false);
      setNuevoCliente({ nombre: '', telefono: '', direccion: '', zona_ruta: '', limite_credito: '' });
      loadData();
    } catch (err) {
      toast.error(err.message || 'Error al registrar cliente.');
    }
  };

  /* =========================================================================
     MANEJADORES: FACTURACIÓN DE RUTA MAYORISTA
  ========================================================================= */
  useEffect(() => {
    if (nuevaFactura.id_carga) {
      setLoadingCargaProducts(true);
      fetchDetalleCargaRuta(nuevaFactura.id_carga, token)
        .then(res => {
          const availableInTruck = (res.items || []).map(it => ({
            ...it,
            disponible: Math.max(0, it.cantidad_cargada - it.cantidad_vendida - it.cantidad_devuelta)
          })).filter(it => it.disponible > 0);
          setCargaProductsForInvoice(availableInTruck);
        })
        .catch(err => {
          console.error(err);
          toast.error('Error al cargar inventario del camión seleccionado.');
          setCargaProductsForInvoice([]);
        })
        .finally(() => setLoadingCargaProducts(false));
    } else {
      setCargaProductsForInvoice([]);
    }
  }, [nuevaFactura.id_carga, token]);

  const handleAddItemToFactura = (itemData) => {
    const { id_producto, nombre, codigo, precio, stockMax } = itemData;
    const existingIndex = nuevaFactura.items.findIndex(it => it.id_producto === id_producto);

    if (existingIndex >= 0) {
      const updated = [...nuevaFactura.items];
      if (updated[existingIndex].cantidad + 1 > stockMax) {
        toast.error(`Stock máximo disponible en furgón/tienda alcanzado (${stockMax} un.).`);
        return;
      }
      updated[existingIndex].cantidad += 1;
      setNuevaFactura(prev => ({ ...prev, items: updated }));
    } else {
      if (1 > stockMax) {
        toast.error('No hay stock disponible para este producto.');
        return;
      }
      setNuevaFactura(prev => ({
        ...prev,
        items: [
          ...prev.items,
          {
            id_producto,
            nombre,
            codigo,
            cantidad: 1,
            precio_unitario: precio,
            descuento: 0,
            stockMax
          }
        ]
      }));
    }
  };

  const handleUpdateItemFactura = (id_producto, field, val) => {
    setNuevaFactura(prev => ({
      ...prev,
      items: prev.items.map(it => {
        if (it.id_producto === id_producto) {
          if (field === 'cantidad') {
            const q = Math.max(1, Math.min(it.stockMax, parseInt(val, 10) || 1));
            return { ...it, cantidad: q };
          }
          if (field === 'precio_unitario') {
            return { ...it, precio_unitario: Math.max(0, parseFloat(val) || 0) };
          }
          if (field === 'descuento') {
            return { ...it, descuento: Math.max(0, parseFloat(val) || 0) };
          }
        }
        return it;
      })
    }));
  };

  const handleRemoveItemFactura = (id_producto) => {
    setNuevaFactura(prev => ({
      ...prev,
      items: prev.items.filter(it => it.id_producto !== id_producto)
    }));
  };

  const totalsFactura = useMemo(() => {
    let subtotal = 0;
    let descItems = 0;
    nuevaFactura.items.forEach(it => {
      subtotal += (it.precio_unitario * it.cantidad);
      descItems += (Number(it.descuento || 0) * it.cantidad);
    });
    const descGeneral = Number(nuevaFactura.descuento_general || 0);
    const total = Math.max(0, subtotal - descItems - descGeneral);
    return { subtotal, descItems, descGeneral, total };
  }, [nuevaFactura.items, nuevaFactura.descuento_general]);

  const handleCrearFactura = async (e) => {
    e.preventDefault();
    if (!nuevaFactura.id_cliente) {
      toast.error('Seleccione el cliente o taller mayorista.');
      return;
    }
    if (nuevaFactura.items.length === 0) {
      toast.error('Agregue al menos un producto a la factura.');
      return;
    }

    try {
      const payload = {
        id_cliente: nuevaFactura.id_cliente,
        id_carga: nuevaFactura.id_carga || null,
        metodo_pago: nuevaFactura.metodo_pago,
        tipo_pago: nuevaFactura.tipo_pago,
        descuento_general: parseFloat(nuevaFactura.descuento_general || 0),
        notas: nuevaFactura.notas,
        items: nuevaFactura.items.map(it => ({
          id_producto: it.id_producto,
          cantidad: it.cantidad,
          precio_unitario: it.precio_unitario,
          descuento: it.descuento || 0
        }))
      };

      const res = await createFacturaRuta(payload, token);
      toast.success(res.msg || 'Factura de ruta emitida exitosamente.');
      setIsFacturaModalOpen(false);
      setNuevaFactura({
        id_cliente: '',
        id_carga: '',
        metodo_pago: 'EFECTIVO',
        tipo_pago: 'Contado',
        descuento_general: 0,
        notas: '',
        items: []
      });
      loadData();
    } catch (err) {
      toast.error(err.message || 'Error al emitir factura de ruta.');
    }
  };

  const handleVerFactura = async (factura) => {
    setFacturaDetalleModal({ isOpen: true, factura, items: [], loading: true });
    try {
      const res = await fetchDetalleFacturaRuta(factura.id_venta, token);
      setFacturaDetalleModal({
        isOpen: true,
        factura: res.factura || factura,
        items: res.items || [],
        loading: false
      });
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar detalle de la factura de ruta.');
      setFacturaDetalleModal(prev => ({ ...prev, loading: false }));
    }
  };

  /* =========================================================================
     EXPORTACIÓN DE CATÁLOGO A EXCEL (CSV)
  ========================================================================= */
  const handleExportExcel = () => {
    if (catalogProducts.length === 0) {
      toast.error('No hay productos activos en el catálogo para exportar.');
      return;
    }

    const dataToExport = catalogProducts.map(p => ({
      'Código': p.codigo,
      'Descripción / Producto': p.nombre,
      'Categoría': p.nombre_categoria || 'Varios',
      'Precio Regular (C$)': Number(p.venta || 0).toFixed(2),
      'Precio de Ruta (C$)': Number(p.precio_ruta || p.mayorista || 0).toFixed(2),
      'Descuento Ruta (%)': p.descuento_mayorista ? `${p.descuento_mayorista}%` : '0%',
      'Promoción Activa': p.promocion_mayorista || 'Ninguna',
      'Combo / Paquete': p.combo_mayorista || 'Ninguno',
      'Stock en Tienda': p.existencia
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Catalogo_Mayorista_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Catálogo exportado en formato Excel (CSV) exitosamente.');
  };

  /* =========================================================================
     GENERACIÓN DE CATÁLOGO PDF
  ========================================================================= */
  const handleDownloadPDF = async () => {
    if (!printableCatalogRef.current) return;
    setGeneratingPDF(true);
    toast.loading('Generando documento PDF del Catálogo Mayorista...', { id: 'pdf-toast' });

    try {
      const element = printableCatalogRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const dateStr = new Date().toISOString().slice(0, 10);
      pdf.save(`Catalogo_Mayorista_MultirepuestosRG_${dateStr}.pdf`);
      toast.success('Catálogo PDF descargado con éxito.', { id: 'pdf-toast' });
    } catch (err) {
      console.error(err);
      toast.error('Error al generar PDF.', { id: 'pdf-toast' });
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handlePrintCatalog = () => {
    window.print();
  };

  return (
    <PageWrapper>
      <Content>
        <BackLink to="/dashboard">
          <FaArrowLeft /> Volver al Menú Principal
        </BackLink>

        {/* BANNER PRINCIPAL */}
        <HeaderBanner>
          <BannerText>
            <h1><FaWarehouse /> Sub-Sistema Mayorista & Rutas</h1>
            <p>Plataforma integral e independiente de métricas, catálogo de rutas, despacho a vendedores y facturación.</p>
          </BannerText>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <ActionBtn $excel onClick={handleExportExcel}>
              <FaFileExcel /> Exportar Excel
            </ActionBtn>
            <ActionBtn $secondary onClick={() => setActiveTab('pdf_preview')}>
              <FaFilePdf /> Imprimir Catálogo PDF
            </ActionBtn>
            <ActionBtn onClick={() => setIsCargaModalOpen(true)}>
              <FaTruck /> Cargar a Rutero
            </ActionBtn>
          </div>
        </HeaderBanner>

        {/* NAVEGACIÓN POR PESTAÑAS */}
        <TabNav>
          <TabButton $active={activeTab === 'metricas'} onClick={() => setActiveTab('metricas')}>
            <FaChartLine /> Métricas & Rendimiento
          </TabButton>
          <TabButton $active={activeTab === 'catalogo'} onClick={() => setActiveTab('catalogo')}>
            <FaBoxes /> Catálogo Mayorista ({catalogProducts.length} Activos)
          </TabButton>
          <TabButton $active={activeTab === 'inventario_ruta'} onClick={() => setActiveTab('inventario_ruta')}>
            <FaTruck /> Inventario en Ruta ({cargas.filter(c => c.estado === 'EN_RUTA').length} Activas)
          </TabButton>
          <TabButton $active={activeTab === 'clientes'} onClick={() => setActiveTab('clientes')}>
            <FaUsers /> Clientes de Ruta ({clientesRuta.length})
          </TabButton>
          <TabButton $active={activeTab === 'facturas'} onClick={() => setActiveTab('facturas')}>
            <FaFileInvoiceDollar /> Facturas de Ruta ({facturasRuta.length})
          </TabButton>
          <TabButton $active={activeTab === 'pdf_preview'} onClick={() => setActiveTab('pdf_preview')}>
            <FaFilePdf /> Vista & Exportación PDF
          </TabButton>
        </TabNav>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <FaSpinner className="fa-spin" style={{ fontSize: '2.5rem', color: '#059669', marginBottom: '1rem' }} />
            <p style={{ fontWeight: 600 }}>Cargando métricas y catálogo del subsistema mayorista...</p>
          </div>
        ) : (
          <>
            {/* =========================================================================
                PESTAÑA 0: MÉTRICAS & BUSINESS INTELLIGENCE DEL SISTEMA MAYORISTA
            ========================================================================= */}
            {activeTab === 'metricas' && (
              <div>
                <KpiGrid>
                  <KpiCard>
                    <KpiIcon $bg="#ecfdf5" $color="#059669"><FaMoneyBillWave /></KpiIcon>
                    <KpiInfo>
                      <span>Ventas de Ruta Mayorista</span>
                      <strong>C$ {Number(metrics?.ventas?.total_ventas || 0).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</strong>
                      <small>{metrics?.ventas?.total_facturas || 0} facturas de ruta emitidas</small>
                    </KpiInfo>
                  </KpiCard>

                  <KpiCard>
                    <KpiIcon $bg="#eff6ff" $color="#2563eb"><FaChartLine /></KpiIcon>
                    <KpiInfo>
                      <span>Ganancia Neta en Rutas</span>
                      <strong>C$ {Number(metrics?.finanzas?.ganancia_neta || 0).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</strong>
                      <small>Margen bruto calculado</small>
                    </KpiInfo>
                  </KpiCard>

                  <KpiCard>
                    <KpiIcon $bg="#fef3c7" $color="#d97706"><FaTruck /></KpiIcon>
                    <KpiInfo>
                      <span>Mercancía en Furgones</span>
                      <strong>C$ {Number(metrics?.inventario_ruta?.valor_en_ruta || 0).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</strong>
                      <small>{metrics?.inventario_ruta?.cargas_activas || 0} furgones actualmente rodando</small>
                    </KpiInfo>
                  </KpiCard>

                  <KpiCard>
                    <KpiIcon $bg="#fee2e2" $color="#dc2626"><FaUsers /></KpiIcon>
                    <KpiInfo>
                      <span>Cuentas por Cobrar (Ruta)</span>
                      <strong>C$ {Number(metrics?.cartera_clientes?.saldo_por_cobrar || 0).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</strong>
                      <small>{metrics?.cartera_clientes?.total_clientes_ruta || 0} clientes mayoristas registrados</small>
                    </KpiInfo>
                  </KpiCard>
                </KpiGrid>

                {/* TABLAS DE RENDIMIENTO Y TOP PRODUCTOS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                  {/* Ranking de Ruteros con Comisiones */}
                  <div>
                    <h3 style={{ margin: '0 0 0.85rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                      <FaUserTie color="#059669" /> Rendimiento & Comisiones por Rutero
                    </h3>
                    <TableWrap>
                      <table>
                        <thead>
                          <tr>
                            <th>Rutero</th>
                            <th>Viajes</th>
                            <th>Total Vendido</th>
                            <th>Recaudado</th>
                            <th>Comisión Ganada</th>
                            <th>Estado Comisión</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(!metrics?.ranking_ruteros || metrics.ranking_ruteros.length === 0) ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8' }}>Aún no hay despachos a ruteros registrados.</td></tr>
                          ) : (
                            metrics.ranking_ruteros.map((r, i) => (
                              <tr key={i}>
                                <td style={{ fontWeight: 700 }}>{r.nombre_rutero}</td>
                                <td>{r.total_viajes} viajes</td>
                                <td style={{ fontWeight: 800, color: '#059669' }}>C$ {Number(r.total_vendido).toFixed(2)}</td>
                                <td style={{ fontWeight: 700, color: '#2563eb' }}>C$ {Number(r.total_recaudado).toFixed(2)}</td>
                                <td style={{ fontWeight: 800, color: '#16a34a' }}>C$ {Number(r.total_comisiones || 0).toFixed(2)}</td>
                                <td>
                                  {Number(r.comisiones_pendientes || 0) > 0 ? (
                                    <span style={{ color: '#d97706', fontWeight: 800 }}>
                                      C$ {Number(r.comisiones_pendientes).toFixed(2)} ⏳ Pendiente
                                    </span>
                                  ) : (
                                    <span style={{ color: '#059669', fontWeight: 700 }}>
                                      Al día ✅
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </TableWrap>
                  </div>

                  {/* Top 10 Productos Más Vendidos en Ruta */}
                  <div>
                    <h3 style={{ margin: '0 0 0.85rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                      <FaBoxes color="#059669" /> Top 10 Productos Más Vendidos en Ruta
                    </h3>
                    <TableWrap>
                      <table>
                        <thead>
                          <tr>
                            <th>Código</th>
                            <th>Producto</th>
                            <th>Unidades</th>
                            <th>Total Recaudado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(!metrics?.top_productos || metrics.top_productos.length === 0) ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8' }}>Sin ventas de ruta registradas.</td></tr>
                          ) : (
                            metrics.top_productos.map((tp, i) => (
                              <tr key={i}>
                                <td style={{ fontWeight: 600, color: '#64748b' }}>{tp.codigo}</td>
                                <td style={{ fontWeight: 700 }}>{tp.nombre}</td>
                                <td>{tp.total_unidades} un.</td>
                                <td style={{ fontWeight: 800, color: '#059669' }}>C$ {Number(tp.total_ingresos).toFixed(2)}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </TableWrap>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                PESTAÑA 1: CATÁLOGO MAYORISTA (GESTIÓN DE ACTIVACIÓN Y PRECIOS)
            ========================================================================= */}
            {activeTab === 'catalogo' && (
              <div>
                <FilterBar>
                  <SearchInputWrap>
                    <FaSearch />
                    <input
                      type="text"
                      placeholder="Buscar por código o nombre del producto..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </SearchInputWrap>

                  <SelectBox value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="">Todas las Categorías</option>
                    {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </SelectBox>

                  <SelectBox value={catalogStatusFilter} onChange={(e) => setCatalogStatusFilter(e.target.value)}>
                    <option value="ALL">📦 Todos los Productos ({products.length})</option>
                    <option value="IN_CATALOG">⭐ Solo en Catálogo Activo ({products.filter(p => Number(p.catalogo_mayorista) === 1).length})</option>
                    <option value="OUT_CATALOG">⚪ Fuera de Catálogo ({products.filter(p => Number(p.catalogo_mayorista) === 0).length})</option>
                  </SelectBox>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <ActionBtn $secondary onClick={loadData} title="Recargar datos">
                      <FaRedo /> Refrescar
                    </ActionBtn>
                    <ActionBtn $excel onClick={handleExportExcel} title="Exportar a archivo de Excel">
                      <FaFileExcel /> Excel
                    </ActionBtn>
                    <ActionBtn onClick={() => setActiveTab('pdf_preview')}>
                      <FaPrint /> Imprimir Catálogo PDF
                    </ActionBtn>
                  </div>
                </FilterBar>

                {/* Botones de Píldoras Rápidas para Filtrar */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setCatalogStatusFilter('IN_CATALOG')}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '20px',
                      border: '1px solid #10b981',
                      background: catalogStatusFilter === 'IN_CATALOG' ? '#10b981' : '#ecfdf5',
                      color: catalogStatusFilter === 'IN_CATALOG' ? '#ffffff' : '#065f46',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    ⭐ Solo en Catálogo ({products.filter(p => Number(p.catalogo_mayorista) === 1).length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setCatalogStatusFilter('ALL')}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '20px',
                      border: '1px solid #cbd5e1',
                      background: catalogStatusFilter === 'ALL' ? '#334155' : '#f8fafc',
                      color: catalogStatusFilter === 'ALL' ? '#ffffff' : '#334155',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    📦 Todos los Productos ({products.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setCatalogStatusFilter('OUT_CATALOG')}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '20px',
                      border: '1px solid #cbd5e1',
                      background: catalogStatusFilter === 'OUT_CATALOG' ? '#64748b' : '#f8fafc',
                      color: catalogStatusFilter === 'OUT_CATALOG' ? '#ffffff' : '#64748b',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    ⚪ Sin Catálogo ({products.filter(p => Number(p.catalogo_mayorista) === 0).length})
                  </button>
                </div>

                <div style={{ marginBottom: '1rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span>Mostrando {filteredProducts.length} productos | {catalogProducts.length} listos para el catálogo impreso.</span>
                  <span style={{ color: '#059669' }}>💡 Para activar en catálogo, el Precio de Ruta debe ser mayor a 0 y superior al costo.</span>
                </div>

                {filteredProducts.length === 0 ? (
                  <div style={{ background: '#ffffff', borderRadius: '16px', padding: '3rem 1.5rem', textAlign: 'center', border: '1px dashed #cbd5e1', marginTop: '1rem' }}>
                    <FaBoxes style={{ fontSize: '3rem', color: '#94a3b8', marginBottom: '1rem' }} />
                    <h3 style={{ margin: '0 0 0.5rem', color: '#1e293b' }}>No se encontraron productos</h3>
                    <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto 1.5rem', fontSize: '0.92rem' }}>
                      {catalogStatusFilter === 'IN_CATALOG'
                        ? 'Aún no has activado productos en el catálogo mayorista. Cambia el filtro a "Todos los Productos" para activarlos asignándoles su Precio de Ruta.'
                        : 'No hay productos que coincidan con la búsqueda o categoría seleccionada.'}
                    </p>
                    {catalogStatusFilter === 'IN_CATALOG' && (
                      <ActionBtn onClick={() => setCatalogStatusFilter('ALL')} style={{ margin: '0 auto' }}>
                        📦 Ver Todos los Productos para Activar
                      </ActionBtn>
                    )}
                  </div>
                ) : (

                <CatalogGrid>
                  {filteredProducts.map(p => {
                    const inCatalog = Number(p.catalogo_mayorista) === 1;
                    const routePrice = Number(p.precio_ruta || p.mayorista || 0);

                    return (
                      <ProductCard key={p.id_producto} $inCatalog={inCatalog}>
                        <LazyMayoristaImage
                          productId={p.id_producto}
                          productName={p.nombre}
                          inCatalog={inCatalog}
                        />

                        <CardBody>
                          <ProductCode>{p.codigo} • {p.nombre_categoria || 'Sin Categoría'}</ProductCode>
                          <ProductTitle title={p.nombre}>{p.nombre}</ProductTitle>

                          <PriceRow>
                            <PriceItem>
                              <span>Precio Venta</span>
                              <strong>C$ {Number(p.venta || 0).toFixed(2)}</strong>
                            </PriceItem>
                            <PriceItem $highlight>
                              <span>Precio Ruta ⭐</span>
                              <strong>C$ {routePrice.toFixed(2)}</strong>
                            </PriceItem>
                          </PriceRow>

                          {Number(p.descuento_mayorista) > 0 && (
                            <PromoTag>
                              <FaPercent /> Descuento autorizado: {p.descuento_mayorista}%
                            </PromoTag>
                          )}

                          {p.promocion_mayorista && (
                            <PromoTag>
                              <FaGift /> {p.promocion_mayorista}
                            </PromoTag>
                          )}

                          {p.combo_mayorista && (
                            <ComboTag>
                              <FaBoxes /> {p.combo_mayorista}
                            </ComboTag>
                          )}

                          <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Stock en Tienda:</span>
                            <strong style={{ color: p.existencia > 0 ? '#059669' : '#dc2626' }}>{p.existencia} un.</strong>
                          </div>
                        </CardBody>

                        <CardFooter>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ToggleSwitch title={inCatalog ? "Desactivar de Catálogo" : "Activar para Catálogo"}>
                              <input
                                type="checkbox"
                                checked={inCatalog}
                                onChange={() => handleToggleCatalog(p)}
                              />
                              <span />
                            </ToggleSwitch>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: inCatalog ? '#059669' : '#64748b' }}>
                              {inCatalog ? 'Visible' : 'Oculto'}
                            </span>
                          </div>

                          <ActionBtn $secondary style={{ padding: '0.45rem 0.8rem', fontSize: '0.82rem' }} onClick={() => handleOpenConfig(p)}>
                            <FaEdit /> Precios
                          </ActionBtn>
                        </CardFooter>
                      </ProductCard>
                    );
                  })}
                </CatalogGrid>
              )}
              </div>
            )}

            {/* =========================================================================
                PESTAÑA 2: INVENTARIO EN RUTA (CARGAS AL MUCHACHO)
            ========================================================================= */}
            {activeTab === 'inventario_ruta' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#1e293b' }}>Inventario Despachado a Ruteros</h2>
                    <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>Controla en tiempo real los productos que lleva cada vendedor/repartidor en el camión o moto.</p>
                  </div>
                  <ActionBtn onClick={() => setIsCargaModalOpen(true)}>
                    <FaPlus /> Nueva Carga a Rutero
                  </ActionBtn>
                </div>

                <TableWrap>
                  <table>
                    <thead>
                      <tr>
                        <th># Carga</th>
                        <th>Rutero / Muchacho</th>
                        <th>Vehículo / Moto</th>
                        <th>Zona de Ruta</th>
                        <th>Fecha Salida</th>
                        <th>Total Items</th>
                        <th>Vendido</th>
                        <th>Comisión Muchacho</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cargas.length === 0 ? (
                        <tr>
                          <td colSpan="10" style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                            No hay cargas registradas. Haz clic en "Nueva Carga a Rutero" para despachar mercancía.
                          </td>
                        </tr>
                      ) : (
                        cargas.map(c => {
                          const pct = Number(c.porcentaje_comision || 0);
                          const montoCom = Number(c.monto_comision || ((Number(c.total_vendido || 0) * pct) / 100));
                          const pagada = Boolean(c.comision_pagada);

                          return (
                            <tr key={c.id_carga}>
                              <td style={{ fontWeight: 800, color: '#059669' }}>#{c.id_carga}</td>
                              <td style={{ fontWeight: 700 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <FaUserTie color="#059669" /> {c.nombre_rutero}
                                </div>
                              </td>
                              <td>{c.vehiculo_ruta || 'N/A'}</td>
                              <td>{c.zona || 'Ruta General'}</td>
                              <td>{new Date(c.fecha_salida).toLocaleString('es-NI')}</td>
                              <td style={{ fontWeight: 700 }}>{c.total_items} un.</td>
                              <td style={{ fontWeight: 800, color: '#059669' }}>C$ {Number(c.total_vendido || 0).toFixed(2)}</td>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <div style={{ fontWeight: 800, color: '#16a34a', fontSize: '0.88rem' }}>
                                    {pct}% • C$ {montoCom.toFixed(2)}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleComisionPagada(c)}
                                    title="Haz clic para marcar como Pagada o Pendiente"
                                    style={{
                                      border: 'none',
                                      cursor: 'pointer',
                                      padding: '2px 8px',
                                      borderRadius: '10px',
                                      fontSize: '0.72rem',
                                      fontWeight: 800,
                                      width: 'fit-content',
                                      background: pagada ? '#dcfce7' : '#fef3c7',
                                      color: pagada ? '#166534' : '#92400e'
                                    }}
                                  >
                                    {pagada ? '✅ Pagada' : '⏳ Pendiente'}
                                  </button>
                                </div>
                              </td>
                              <td>
                                <span style={{
                                  padding: '4px 10px',
                                  borderRadius: '12px',
                                  fontSize: '0.78rem',
                                  fontWeight: 800,
                                  background: c.estado === 'EN_RUTA' ? '#fef3c7' : '#dcfce7',
                                  color: c.estado === 'EN_RUTA' ? '#92400e' : '#166534'
                                }}>
                                  {c.estado === 'EN_RUTA' ? '🚚 EN RUTA' : '✅ LIQUIDADA'}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <ActionBtn $secondary style={{ padding: '0.4rem 0.7rem', fontSize: '0.82rem' }} onClick={() => handleOpenDetalleCarga(c)}>
                                    <FaBoxes /> Stock / Liquidar
                                  </ActionBtn>
                                  <ActionBtn $secondary style={{ padding: '0.4rem 0.7rem', fontSize: '0.82rem' }} onClick={() => handleImprimirComprobante(c)} title="Imprimir Comprobante de Despacho">
                                    <FaPrint /> Hoja Salida
                                  </ActionBtn>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </TableWrap>
              </div>
            )}

            {/* =========================================================================
                PESTAÑA 3: CLIENTES DE RUTA MAYORISTA
            ========================================================================= */}
            {activeTab === 'clientes' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#1e293b' }}>Clientes y Talleres de Ruta Mayorista</h2>
                    <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>Clientes que compran con precios de ruta y condiciones mayoristas.</p>
                  </div>
                  <ActionBtn onClick={() => setIsClienteModalOpen(true)}>
                    <FaPlus /> Registrar Cliente de Ruta
                  </ActionBtn>
                </div>

                <TableWrap>
                  <table>
                    <thead>
                      <tr>
                        <th># ID</th>
                        <th>Nombre / Taller</th>
                        <th>Teléfono</th>
                        <th>Zona de Ruta</th>
                        <th>Dirección</th>
                        <th>Límite de Crédito</th>
                        <th>Saldo Pendiente</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientesRuta.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                            No hay clientes de ruta registrados todavía.
                          </td>
                        </tr>
                      ) : (
                        clientesRuta.map(cli => (
                          <tr key={cli.id_cliente}>
                            <td style={{ fontWeight: 700, color: '#64748b' }}>#{cli.id_cliente}</td>
                            <td style={{ fontWeight: 800, color: '#1e293b' }}>{cli.nombre}</td>
                            <td>{cli.telefono || 'Sin teléfono'}</td>
                            <td>
                              <span style={{ background: '#ecfdf5', color: '#065f46', padding: '3px 8px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
                                {cli.zona_ruta || 'General'}
                              </span>
                            </td>
                            <td>{cli.direccion || 'Sin dirección'}</td>
                            <td style={{ fontWeight: 700 }}>C$ {Number(cli.limite_credito || 0).toFixed(2)}</td>
                            <td style={{ fontWeight: 800, color: Number(cli.saldo_pendiente) > 0 ? '#dc2626' : '#059669' }}>
                              C$ {Number(cli.saldo_pendiente || 0).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </TableWrap>
              </div>
            )}

            {/* =========================================================================
                PESTAÑA 4: FACTURAS DE RUTA MAYORISTA
            ========================================================================= */}
            {activeTab === 'facturas' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#1e293b' }}>Facturas Emitidas en Ruta Mayorista</h2>
                    <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>Ventas realizadas exclusivamente en ruta mayorista con precios preferenciales.</p>
                  </div>
                  <ActionBtn onClick={() => setIsFacturaModalOpen(true)}>
                    <FaPlus /> Emitir Factura de Ruta
                  </ActionBtn>
                </div>

                <TableWrap>
                  <table>
                    <thead>
                      <tr>
                        <th>N° Factura</th>
                        <th>Fecha</th>
                        <th>Cliente / Taller</th>
                        <th>Rutero</th>
                        <th>Método Pago</th>
                        <th>Total Factura</th>
                        <th>Estado</th>
                        <th style={{ textAlign: 'center' }}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {facturasRuta.length === 0 ? (
                        <tr>
                          <td colSpan="8" style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                            No hay facturas de ruta emitidas todavía. Haz clic en "Emitir Factura de Ruta" para registrar una venta.
                          </td>
                        </tr>
                      ) : (
                        facturasRuta.map(f => (
                          <tr key={f.id_venta}>
                            <td style={{ fontWeight: 800, color: '#059669' }}>{f.numero_factura}</td>
                            <td>{new Date(f.fecha).toLocaleString('es-NI')}</td>
                            <td style={{ fontWeight: 700 }}>{f.nombre_cliente || 'Cliente de Ruta'}</td>
                            <td>{f.nombre_rutero || f.vendedor || 'Ruta'}</td>
                            <td>
                              <span style={{
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                background: f.tipo_pago === 'Crédito' || f.metodo_pago === 'CREDITO' ? '#fee2e2' : '#f1f5f9',
                                color: f.tipo_pago === 'Crédito' || f.metodo_pago === 'CREDITO' ? '#b91c1c' : '#334155'
                              }}>
                                {f.tipo_pago || f.metodo_pago}
                              </span>
                            </td>
                            <td style={{ fontWeight: 800, fontSize: '1rem', color: '#059669' }}>
                              C$ {Number(f.total_venta || 0).toFixed(2)}
                            </td>
                            <td>
                              <span style={{ background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
                                {f.estado}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <ActionBtn $secondary style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem' }} onClick={() => handleVerFactura(f)}>
                                <FaPrint /> Ver Factura
                              </ActionBtn>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </TableWrap>
              </div>
            )}

            {/* =========================================================================
                PESTAÑA 5: VISTA PREVIA Y EXPORTACIÓN DEL CATÁLOGO PDF
            ========================================================================= */}
            {activeTab === 'pdf_preview' && (
              <div>
                <div style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#1e293b' }}>Catálogo Listo para Impresión & PDF</h3>
                    <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.88rem' }}>
                      Incluye todos los {catalogProducts.length} productos activos con sus Precios de Ruta, fotos, promociones y combos.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <SelectBox value={catalogPdfFormat} onChange={(e) => setCatalogPdfFormat(e.target.value)}>
                      <option value="VISUAL">Formato Visual con Fotos</option>
                      <option value="COMPACT">Lista de Precios Compacta</option>
                    </SelectBox>

                    <ActionBtn $excel onClick={handleExportExcel}>
                      <FaFileExcel /> Exportar Excel (CSV)
                    </ActionBtn>

                    <ActionBtn $secondary onClick={handlePrintCatalog}>
                      <FaPrint /> Imprimir Directo
                    </ActionBtn>

                    <ActionBtn onClick={handleDownloadPDF} disabled={generatingPDF}>
                      <FaFilePdf /> {generatingPDF ? 'Generando PDF...' : 'Descargar PDF del Catálogo'}
                    </ActionBtn>
                  </div>
                </div>

                {/* CONTENEDOR DEL CATÁLOGO A CAPTURAR / IMPRIMIR */}
                <div
                  ref={printableCatalogRef}
                  style={{
                    background: '#ffffff',
                    padding: '30px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    maxWidth: '1000px',
                    margin: '0 auto'
                  }}
                >
                  {/* MEMBRETE */}
                  <div style={{ borderBottom: '3px solid #059669', paddingBottom: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 900, color: '#065f46', letterSpacing: '-0.5px' }}>
                        MULTIREPUESTOS RG & ARAGÓN
                      </h1>
                      <div style={{ fontSize: '13px', color: '#475569', fontWeight: 600, marginTop: '3px' }}>
                        CATÁLOGO EXCLUSIVO DE RUTAS Y PRECIOS MAYORISTAS
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        Juigalpa, Chontales, Nicaragua • Tel: +505 8888-8888
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ background: '#ecfdf5', color: '#065f46', padding: '6px 14px', borderRadius: '8px', fontWeight: 800, fontSize: '13px', display: 'inline-block' }}>
                        VIGENCIA: {new Date().toLocaleDateString('es-NI', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  {/* FORMATO 1: VISUAL CON FOTOS */}
                  {catalogPdfFormat === 'VISUAL' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                      {catalogProducts.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                          No hay productos activos en el catálogo. Ve a la pestaña "Catálogo Mayorista" y activa los productos deseados con su Precio de Ruta.
                        </div>
                      ) : (
                        catalogProducts.map(p => (
                          <div
                            key={p.id_producto}
                            style={{
                              border: '1px solid #e2e8f0',
                              borderRadius: '10px',
                              padding: '12px',
                              display: 'flex',
                              gap: '12px',
                              background: '#fafafa',
                              breakInside: 'avoid'
                            }}
                          >
                            <div style={{ width: '90px', height: '90px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <LazyPdfCatalogItemImage productId={p.id_producto} productName={p.nombre} fallbackSrc={p.imagen} />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                              <div>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
                                  CÓDIGO: {p.codigo}
                                </div>
                                <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b', marginTop: '2px', lineHeight: 1.2 }}>
                                  {p.nombre}
                                </div>
                                {p.promocion_mayorista && (
                                  <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 700, marginTop: '3px' }}>
                                    🎁 Promo: {p.promocion_mayorista}
                                  </div>
                                )}
                                {p.combo_mayorista && (
                                  <div style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 700, marginTop: '2px' }}>
                                    📦 Combo: {p.combo_mayorista}
                                  </div>
                                )}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '6px' }}>
                                <div style={{ fontSize: '10px', color: '#64748b' }}>
                                  Cat: {p.nombre_categoria || 'Varios'}
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Precio Ruta</div>
                                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#065f46' }}>
                                    C$ {Number(p.precio_ruta || p.mayorista || 0).toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    /* FORMATO 2: LISTA DE PRECIOS COMPACTA TIPO TARIFARIO */
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ background: '#059669', color: 'white', textAlign: 'left' }}>
                          <th style={{ padding: '8px' }}>CÓDIGO</th>
                          <th style={{ padding: '8px' }}>DESCRIPCIÓN</th>
                          <th style={{ padding: '8px' }}>CATEGORÍA</th>
                          <th style={{ padding: '8px' }}>PRECIO RUTA (C$)</th>
                          <th style={{ padding: '8px' }}>PROMOCIÓN / COMBO</th>
                        </tr>
                      </thead>
                      <tbody>
                        {catalogProducts.map((p, idx) => (
                          <tr key={p.id_producto} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#f8fafc' : '#ffffff' }}>
                            <td style={{ padding: '8px', fontWeight: 700 }}>{p.codigo}</td>
                            <td style={{ padding: '8px', fontWeight: 800 }}>{p.nombre}</td>
                            <td style={{ padding: '8px', color: '#64748b' }}>{p.nombre_categoria || 'Varios'}</td>
                            <td style={{ padding: '8px', fontWeight: 900, color: '#065f46', fontSize: '14px' }}>
                              C$ {Number(p.precio_ruta || p.mayorista || 0).toFixed(2)}
                            </td>
                            <td style={{ padding: '8px', color: '#92400e', fontWeight: 700 }}>
                              {p.promocion_mayorista || p.combo_mayorista || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* PIE DE PÁGINA DEL CATÁLOGO */}
                  <div style={{ marginTop: '25px', paddingTop: '15px', borderTop: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                    <span>* Precios de ruta sujetos a disponibilidad y confirmación del vendedor.</span>
                    <span>Multirepuestos RG - Calidad y Confianza al Mejor Precio</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* =========================================================================
            MODAL 1: CONFIGURAR PRECIO DE RUTA, DESCUENTO Y CATÁLOGO
        ========================================================================= */}
        <AnimatePresence>
          {configModal.isOpen && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfigModal({ isOpen: false, product: null })}
            >
              <ModalBox
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaWarehouse color="#059669" /> Configurar Precio de Ruta & Catálogo
                  </h3>
                  <button
                    onClick={() => setConfigModal({ isOpen: false, product: null })}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}
                  >
                    <FaTimes />
                  </button>
                </div>

                {configModal.requireReason && (
                  <div style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', padding: '10px 14px', borderRadius: '10px', fontSize: '0.88rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', gap: '8px' }}>
                    <FaExclamationTriangle style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{configModal.requireReason}</span>
                  </div>
                )}

                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', marginBottom: '1.2rem', fontSize: '0.9rem' }}>
                  <div><strong>Producto:</strong> {configModal.product?.nombre}</div>
                  <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '3px' }}>
                    Código: {configModal.product?.codigo} | Costo: C$ {Number(configModal.product?.costo || 0).toFixed(2)} | Venta Tienda: C$ {Number(configModal.product?.venta || 0).toFixed(2)}
                  </div>
                </div>

                <form onSubmit={handleSaveConfig}>
                  <FormGroup>
                    <label>Precio de Ruta (C$) <span style={{ color: '#dc2626' }}>* Obligatorio para Catálogo</span></label>
                    <input
                      type="number"
                      step="0.01"
                      required={configModal.catalogo_mayorista}
                      placeholder="Ingrese el precio especial de ruta..."
                      value={configModal.precio_ruta}
                      onChange={(e) => setConfigModal(prev => ({ ...prev, precio_ruta: e.target.value }))}
                    />
                    <small>No puede ser inferior al costo (C$ {Number(configModal.product?.costo || 0).toFixed(2)}).</small>
                  </FormGroup>

                  <FormGroup>
                    <label>% Descuento Máximo Autorizado en Ruta</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="ej: 10 (porcentaje que puede rebajar el rutero)"
                      value={configModal.descuento_mayorista}
                      onChange={(e) => setConfigModal(prev => ({ ...prev, descuento_mayorista: e.target.value }))}
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Promoción Especial Mayorista</label>
                    <input
                      type="text"
                      placeholder="ej: Por compra de 10+ llantas: C$ 1,200 c/u"
                      value={configModal.promocion_mayorista}
                      onChange={(e) => setConfigModal(prev => ({ ...prev, promocion_mayorista: e.target.value }))}
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Combo / Paquete Mayorista</label>
                    <input
                      type="text"
                      placeholder="ej: Combo con cámara y tuercas gratis"
                      value={configModal.combo_mayorista}
                      onChange={(e) => setConfigModal(prev => ({ ...prev, combo_mayorista: e.target.value }))}
                    />
                  </FormGroup>

                  <div style={{ background: '#ecfdf5', padding: '12px 14px', borderRadius: '12px', border: '1px solid #a7f3d0', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      id="modal_catalogo_active"
                      checked={configModal.catalogo_mayorista}
                      onChange={(e) => setConfigModal(prev => ({ ...prev, catalogo_mayorista: e.target.checked }))}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="modal_catalogo_active" style={{ cursor: 'pointer', fontWeight: 800, fontSize: '0.92rem', color: '#065f46', margin: 0 }}>
                      ⭐ Mostrar este producto en el Catálogo Mayorista y PDF
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <ActionBtn $secondary type="button" onClick={() => setConfigModal({ isOpen: false, product: null })}>
                      Cancelar
                    </ActionBtn>
                    <ActionBtn type="submit">
                      Guardar Configuración
                    </ActionBtn>
                  </div>
                </form>
              </ModalBox>
            </ModalOverlay>
          )}
        </AnimatePresence>

        {/* =========================================================================
            MODAL 2: NUEVA CARGA A RUTERO (DESPACHO A RUTA)
        ========================================================================= */}
        <AnimatePresence>
          {isCargaModalOpen && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCargaModalOpen(false)}
            >
              <ModalBox
                $large
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaTruck color="#059669" /> Nueva Carga a Rutero / Muchacho en Ruta
                  </h3>
                  <button onClick={() => setIsCargaModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}>
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleCrearCarga}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <FormGroup>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{ fontWeight: 700, color: '#dc2626' }}>🧑‍💼 Empleado / Rutero *</label>
                        <button
                          type="button"
                          onClick={() => setIsQuickEmployeeModalOpen(true)}
                          style={{
                            background: '#059669',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '3px 8px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Registrar nuevo empleado para asignarle la ruta"
                        >
                          <FaUserPlus /> + Nuevo
                        </button>
                      </div>
                      <select
                        required
                        value={nuevaCarga.id_empleado}
                        onChange={(e) => {
                          const emp = employees.find(em => String(em.id_empleado) === e.target.value);
                          setNuevaCarga(prev => ({
                            ...prev,
                            id_empleado: e.target.value,
                            nombre_rutero: emp ? emp.nombre : ''
                          }));
                        }}
                        style={{ border: !nuevaCarga.id_empleado ? '2px solid #fca5a5' : undefined }}
                      >
                        <option value="">-- Seleccionar Empleado Registrado --</option>
                        {employees.map(em => (
                          <option key={em.id_empleado} value={em.id_empleado}>{em.nombre} ({em.cargo || 'Personal'})</option>
                        ))}
                      </select>
                      {employees.length === 0 ? (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '6px 10px', marginTop: '4px', color: '#b91c1c', fontSize: '0.8rem' }}>
                          ⚠️ No hay empleados registrados. Presione el botón verde <strong>"+ Nuevo"</strong> arriba para registrarlo de inmediato.
                        </div>
                      ) : (
                        <small style={{ color: '#dc2626' }}>⚠️ Solo empleados registrados pueden ser ruteros.</small>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <label>Nombre del Rutero</label>
                      <input
                        type="text"
                        readOnly
                        placeholder="Se auto-llena al seleccionar empleado"
                        value={nuevaCarga.nombre_rutero}
                        style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                      />
                    </FormGroup>

                    <FormGroup>
                      <label>Vehículo / Furgón / Moto</label>
                      <input
                        type="text"
                        placeholder="ej: Camión Isuzu Placa CT-1234"
                        value={nuevaCarga.vehiculo_ruta}
                        onChange={(e) => setNuevaCarga(prev => ({ ...prev, vehiculo_ruta: e.target.value }))}
                      />
                    </FormGroup>

                    <FormGroup>
                      <label>Zona o Ruta Asignada</label>
                      <input
                        type="text"
                        placeholder="ej: Ruta Juigalpa - Acoyapa"
                        value={nuevaCarga.zona}
                        onChange={(e) => setNuevaCarga(prev => ({ ...prev, zona: e.target.value }))}
                      />
                    </FormGroup>

                    <FormGroup>
                      <label>Comisión del Rutero (%)</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="100"
                        placeholder="ej: 5 (%)"
                        value={nuevaCarga.porcentaje_comision}
                        onChange={(e) => setNuevaCarga(prev => ({ ...prev, porcentaje_comision: e.target.value }))}
                      />
                      <small>% que gana el rutero sobre el total vendido en este viaje.</small>
                    </FormGroup>
                  </div>

                  {/* SELECCIONAR PRODUCTOS A CARGAR */}
                  <div style={{ borderTop: '2px dashed #e2e8f0', paddingTop: '1rem', marginTop: '0.5rem' }}>
                    <h4 style={{ margin: '0 0 0.75rem', color: '#065f46' }}>📦 Agregar Productos a la Carga</h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'flex-end', marginBottom: '1rem' }}>
                      <FormGroup style={{ margin: 0 }}>
                        <label>Producto a Cargar</label>
                        <select id="select_producto_carga" defaultValue="">
                          <option value="" disabled>-- Seleccione un Producto --</option>
                          {products.map(p => (
                            <option key={p.id_producto} value={p.id_producto}>
                              {p.codigo} - {p.nombre} (Disp: {p.existencia} un. | Ruta: C$ {Number(p.precio_ruta || p.mayorista || 0).toFixed(2)})
                            </option>
                          ))}
                        </select>
                      </FormGroup>

                      <FormGroup style={{ margin: 0 }}>
                        <label>Cantidad</label>
                        <input type="number" id="cantidad_producto_carga" defaultValue="1" min="1" />
                      </FormGroup>

                      <FormGroup style={{ margin: 0 }}>
                        <label>Precio Ruta (C$)</label>
                        <input type="number" id="precio_producto_carga" step="0.01" placeholder="Auto" />
                      </FormGroup>

                      <ActionBtn
                        type="button"
                        style={{ height: '42px' }}
                        onClick={() => {
                          const sel = document.getElementById('select_producto_carga');
                          const qtyInput = document.getElementById('cantidad_producto_carga');
                          const priceInput = document.getElementById('precio_producto_carga');

                          const pid = parseInt(sel.value, 10);
                          const qty = parseInt(qtyInput.value, 10);
                          if (!pid || isNaN(qty) || qty <= 0) {
                            toast.error('Seleccione un producto y cantidad válida.');
                            return;
                          }

                          const prod = products.find(p => p.id_producto === pid);
                          if (qty > prod.existencia) {
                            toast.error(`Stock insuficiente en tienda (Disponible: ${prod.existencia} un.)`);
                            return;
                          }

                          const defaultPrice = Number(prod.precio_ruta || prod.mayorista || prod.venta || 0);
                          const finalPrice = priceInput.value ? parseFloat(priceInput.value) : defaultPrice;

                          setNuevaCarga(prev => {
                            const exists = prev.items.find(i => i.id_producto === pid);
                            if (exists) {
                              return {
                                ...prev,
                                items: prev.items.map(i => i.id_producto === pid ? { ...i, cantidad: i.cantidad + qty } : i)
                              };
                            }
                            return {
                              ...prev,
                              items: [...prev.items, {
                                id_producto: pid,
                                codigo: prod.codigo,
                                nombre: prod.nombre,
                                cantidad: qty,
                                precio_ruta: finalPrice
                              }]
                            };
                          });

                          sel.value = '';
                          qtyInput.value = '1';
                          priceInput.value = '';
                        }}
                      >
                        <FaPlus /> Agregar
                      </ActionBtn>
                    </div>

                    {/* LISTA DE ITEMS A CARGAR */}
                    <TableWrap style={{ maxHeight: '240px' }}>
                      <table>
                        <thead>
                          <tr>
                            <th>Código</th>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Ruta</th>
                            <th>Total Línea</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {nuevaCarga.items.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8' }}>Aún no has agregado productos a esta carga.</td></tr>
                          ) : (
                            nuevaCarga.items.map((it, idx) => (
                              <tr key={it.id_producto}>
                                <td>{it.codigo}</td>
                                <td style={{ fontWeight: 700 }}>{it.nombre}</td>
                                <td>{it.cantidad} un.</td>
                                <td>C$ {Number(it.precio_ruta).toFixed(2)}</td>
                                <td style={{ fontWeight: 800, color: '#059669' }}>C$ {(it.cantidad * it.precio_ruta).toFixed(2)}</td>
                                <td>
                                  <button
                                    type="button"
                                    onClick={() => setNuevaCarga(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }))}
                                    style={{ border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer' }}
                                  >
                                    <FaTimes />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </TableWrap>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <ActionBtn $secondary type="button" onClick={() => setIsCargaModalOpen(false)}>
                      Cancelar
                    </ActionBtn>
                    <ActionBtn type="submit">
                      Confirmar Despacho a Ruta
                    </ActionBtn>
                  </div>
                </form>
              </ModalBox>
            </ModalOverlay>
          )}
        </AnimatePresence>

        {/* =========================================================================
            MODAL 3: DETALLE Y LIQUIDACIÓN DE CARGA DE RUTA
        ========================================================================= */}
        <AnimatePresence>
          {detalleCargaModal.isOpen && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetalleCargaModal({ isOpen: false, carga: null, items: [], devoluciones: {} })}
            >
              <ModalBox
                $large
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#1e293b' }}>
                      Carga de Ruta #{detalleCargaModal.carga?.id_carga} - {detalleCargaModal.carga?.nombre_rutero}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '3px' }}>
                      Vehículo: {detalleCargaModal.carga?.vehiculo_ruta || 'N/A'} | Zona: {detalleCargaModal.carga?.zona || 'General'}
                    </div>
                  </div>
                  <button onClick={() => setDetalleCargaModal({ isOpen: false, carga: null, items: [], devoluciones: {} })} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}>
                    <FaTimes />
                  </button>
                </div>

                <TableWrap style={{ maxHeight: '350px', marginBottom: '1.5rem' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Producto</th>
                        <th>Cargado</th>
                        <th>Vendido</th>
                        <th>Stock en Furgón</th>
                        {detalleCargaModal.carga?.estado === 'EN_RUTA' && <th>Devolver a Tienda</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {detalleCargaModal.items.map(it => {
                        const enFurgon = it.cantidad_cargada - it.cantidad_vendida - it.cantidad_devuelta;
                        return (
                          <tr key={it.id_producto}>
                            <td>{it.codigo}</td>
                            <td style={{ fontWeight: 700 }}>{it.nombre_producto}</td>
                            <td>{it.cantidad_cargada} un.</td>
                            <td style={{ color: '#059669', fontWeight: 700 }}>{it.cantidad_vendida} un.</td>
                            <td style={{ fontWeight: 800, color: enFurgon > 0 ? '#1e293b' : '#64748b' }}>
                              {enFurgon} un.
                            </td>
                            {detalleCargaModal.carga?.estado === 'EN_RUTA' && (
                              <td>
                                <input
                                  type="number"
                                  min="0"
                                  max={enFurgon}
                                  value={detalleCargaModal.devoluciones[it.id_producto] || 0}
                                  onChange={(e) => {
                                    const val = Math.min(enFurgon, Math.max(0, parseInt(e.target.value || 0, 10)));
                                    setDetalleCargaModal(prev => ({
                                      ...prev,
                                      devoluciones: { ...prev.devoluciones, [it.id_producto]: val }
                                    }));
                                  }}
                                  style={{ width: '80px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                />
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </TableWrap>

                {/* TARJETA DE RESUMEN DE VENTAS Y COMISIÓN DEL RUTERO */}
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  alignItems: 'center'
                }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>Total Vendido en el Viaje:</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#065f46' }}>
                      C$ {Number(detalleCargaModal.carga?.total_vendido || 0).toFixed(2)}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>Comisión Acordada:</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#15803d' }}>
                      {Number(detalleCargaModal.carga?.porcentaje_comision || 0)}%
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>Monto Comisión del Rutero:</span>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#047857' }}>
                      C$ {((Number(detalleCargaModal.carga?.total_vendido || 0) * Number(detalleCargaModal.carga?.porcentaje_comision || 0)) / 100).toFixed(2)}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'white', padding: '10px 14px', borderRadius: '8px', border: '1px solid #86efac' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(detalleCargaModal.pagar_comision)}
                        onChange={(e) => setDetalleCargaModal(prev => ({ ...prev, pagar_comision: e.target.checked }))}
                        style={{ width: '18px', height: '18px', accentColor: '#059669' }}
                      />
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#166534' }}>
                        {detalleCargaModal.carga?.comision_pagada ? 'Comisión entregada ✅' : 'Entregar comisión hoy'}
                      </span>
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <ActionBtn $secondary onClick={() => setDetalleCargaModal({ isOpen: false, carga: null, items: [], devoluciones: {}, pagar_comision: true })}>
                    Cerrar
                  </ActionBtn>
                  {detalleCargaModal.carga?.estado === 'EN_RUTA' && (
                    <ActionBtn onClick={handleLiquidarCarga}>
                      <FaCheck /> Liquidar y Reintegrar Sobrantes
                    </ActionBtn>
                  )}
                </div>
              </ModalBox>
            </ModalOverlay>
          )}
        </AnimatePresence>

        {/* =========================================================================
            MODAL 4: REGISTRAR CLIENTE DE RUTA MAYORISTA
        ========================================================================= */}
        <AnimatePresence>
          {isClienteModalOpen && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsClienteModalOpen(false)}
            >
              <ModalBox
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaUsers color="#059669" /> Registrar Cliente de Ruta Mayorista
                  </h3>
                  <button onClick={() => setIsClienteModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}>
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleCrearCliente}>
                  <FormGroup>
                    <label>Nombre del Cliente o Taller *</label>
                    <input
                      type="text"
                      required
                      placeholder="ej: Taller Motos El Chele"
                      value={nuevoCliente.nombre}
                      onChange={(e) => setNuevoCliente(prev => ({ ...prev, nombre: e.target.value }))}
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Teléfono</label>
                    <input
                      type="text"
                      placeholder="ej: 8888-1234"
                      value={nuevoCliente.telefono}
                      onChange={(e) => setNuevoCliente(prev => ({ ...prev, telefono: e.target.value }))}
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Zona o Ruta de Visita</label>
                    <input
                      type="text"
                      placeholder="ej: Ruta Juigalpa - Acoyapa"
                      value={nuevoCliente.zona_ruta}
                      onChange={(e) => setNuevoCliente(prev => ({ ...prev, zona_ruta: e.target.value }))}
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Dirección Exacta</label>
                    <textarea
                      rows="2"
                      placeholder="ej: Frente a la gasolinera, mano derecha"
                      value={nuevoCliente.direccion}
                      onChange={(e) => setNuevoCliente(prev => ({ ...prev, direccion: e.target.value }))}
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Límite de Crédito Autorizado (C$)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="ej: 15000.00"
                      value={nuevoCliente.limite_credito}
                      onChange={(e) => setNuevoCliente(prev => ({ ...prev, limite_credito: e.target.value }))}
                    />
                  </FormGroup>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <ActionBtn $secondary type="button" onClick={() => setIsClienteModalOpen(false)}>
                      Cancelar
                    </ActionBtn>
                    <ActionBtn type="submit">
                      Guardar Cliente de Ruta
                    </ActionBtn>
                  </div>
                </form>
              </ModalBox>
            </ModalOverlay>
          )}
        </AnimatePresence>

        {/* =========================================================================
            MODAL 5: COMPROBANTE / HOJA DE DESPACHO A RUTA (IMPRESIÓN)
        ========================================================================= */}
        <AnimatePresence>
          {comprobanteDespachoModal.isOpen && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setComprobanteDespachoModal({ isOpen: false, carga: null, items: [] })}
            >
              <ModalBox
                $large
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, color: '#1e293b' }}>Hoja de Despacho a Ruta</h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <ActionBtn onClick={() => window.print()}><FaPrint /> Imprimir Hoja</ActionBtn>
                    <button onClick={() => setComprobanteDespachoModal({ isOpen: false, carga: null, items: [] })} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}>
                      <FaTimes />
                    </button>
                  </div>
                </div>

                <div
                  ref={comprobanteRef}
                  style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '24px',
                    background: '#ffffff'
                  }}
                >
                  <div style={{ borderBottom: '2px solid #059669', paddingBottom: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <h2 style={{ margin: 0, color: '#065f46', fontSize: '20px' }}>MULTIREPUESTOS RG & ARAGÓN</h2>
                      <div style={{ fontSize: '12px', color: '#475569', fontWeight: 700 }}>COMPROBANTE DE SALIDA / DESPACHO A RUTA MAYORISTA</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: '#059669' }}>CARGA #{comprobanteDespachoModal.carga?.id_carga}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{new Date(comprobanteDespachoModal.carga?.fecha_salida).toLocaleString('es-NI')}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', background: '#f8fafc', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '12px' }}>
                    <div><strong>Rutero / Conductor:</strong> {comprobanteDespachoModal.carga?.nombre_rutero}</div>
                    <div><strong>Vehículo:</strong> {comprobanteDespachoModal.carga?.vehiculo_ruta || 'N/A'}</div>
                    <div><strong>Zona Asignada:</strong> {comprobanteDespachoModal.carga?.zona || 'Ruta General'}</div>
                    <div><strong>Comisión de Ruta:</strong> <span style={{ color: '#059669', fontWeight: 800 }}>{Number(comprobanteDespachoModal.carga?.porcentaje_comision || 0)}% de venta</span></div>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginBottom: '25px' }}>
                    <thead>
                      <tr style={{ background: '#059669', color: 'white', textAlign: 'left' }}>
                        <th style={{ padding: '6px' }}>CÓDIGO</th>
                        <th style={{ padding: '6px' }}>PRODUCTO</th>
                        <th style={{ padding: '6px', textAlign: 'center' }}>CANTIDAD CARGADA</th>
                        <th style={{ padding: '6px', textAlign: 'right' }}>PRECIO RUTA</th>
                        <th style={{ padding: '6px', textAlign: 'right' }}>TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comprobanteDespachoModal.items.map(it => (
                        <tr key={it.id_producto} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '6px' }}>{it.codigo}</td>
                          <td style={{ padding: '6px', fontWeight: 700 }}>{it.nombre_producto}</td>
                          <td style={{ padding: '6px', textAlign: 'center', fontWeight: 800 }}>{it.cantidad_cargada} un.</td>
                          <td style={{ padding: '6px', textAlign: 'right' }}>C$ {Number(it.precio_ruta_unitario).toFixed(2)}</td>
                          <td style={{ padding: '6px', textAlign: 'right', fontWeight: 800 }}>C$ {(it.cantidad_cargada * it.precio_ruta_unitario).toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr style={{ background: '#f1f5f9', fontWeight: 900 }}>
                        <td colSpan="2" style={{ padding: '8px' }}>TOTALES</td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>{comprobanteDespachoModal.carga?.total_items} un.</td>
                        <td></td>
                        <td style={{ padding: '8px', textAlign: 'right', color: '#065f46', fontSize: '13px' }}>
                          C$ {Number(comprobanteDespachoModal.carga?.total_valor_ruta || 0).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* FIRMAS DE RESPONSABILIDAD */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '40px', textAlign: 'center', fontSize: '11px' }}>
                    <div>
                      <div style={{ borderTop: '1px solid #94a3b8', paddingTop: '6px' }}>
                        <strong>Firma de Despacho (Inventario)</strong>
                        <div style={{ color: '#64748b' }}>Entregado Conforme</div>
                      </div>
                    </div>
                    <div>
                      <div style={{ borderTop: '1px solid #94a3b8', paddingTop: '6px' }}>
                        <strong>Firma del Rutero / Muchacho</strong>
                        <div style={{ color: '#64748b' }}>Recibido Conforme y Responsable</div>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBox>
            </ModalOverlay>
          )}
        </AnimatePresence>

        {/* =========================================================================
            MODAL 6: EMISIÓN DE FACTURA DE RUTA MAYORISTA
        ========================================================================= */}
        <AnimatePresence>
          {isFacturaModalOpen && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFacturaModalOpen(false)}
            >
              <ModalBox
                $xlarge
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, color: '#065f46', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaFileInvoiceDollar /> Nueva Factura de Venta en Ruta Mayorista
                  </h3>
                  <button onClick={() => setIsFacturaModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}>
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleCrearFactura}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    {/* Seleccionar Cliente de Ruta */}
                    <FormGroup>
                      <label>Cliente / Taller Mayorista *</label>
                      <select
                        required
                        value={nuevaFactura.id_cliente}
                        onChange={(e) => setNuevaFactura(prev => ({ ...prev, id_cliente: e.target.value }))}
                      >
                        <option value="" disabled>-- Seleccione Cliente de Ruta --</option>
                        {clientesRuta.map(c => (
                          <option key={c.id_cliente} value={c.id_cliente}>
                            {c.nombre} (Zona: {c.zona_ruta || 'General'} | Saldo: C$ {Number(c.saldo_pendiente || 0).toFixed(2)})
                          </option>
                        ))}
                      </select>
                    </FormGroup>

                    {/* Origen de los Productos: Carga en Camión o Despacho Almacén */}
                    <FormGroup>
                      <label>Origen del Despacho / Furgón</label>
                      <select
                        value={nuevaFactura.id_carga}
                        onChange={(e) => {
                          setNuevaFactura(prev => ({ ...prev, id_carga: e.target.value, items: [] }));
                        }}
                      >
                        <option value="">🏬 Almacén Directo (Precios de Ruta)</option>
                        {cargas.filter(c => c.estado === 'EN_RUTA').map(c => (
                          <option key={c.id_carga} value={c.id_carga}>
                            🚚 Carga #{c.id_carga} - Rutero: {c.nombre_rutero} ({c.zona || 'Ruta'})
                          </option>
                        ))}
                      </select>
                      <small>Si selecciona una carga activa, el inventario se descontará del camión del rutero.</small>
                    </FormGroup>

                    {/* Tipo / Método de Pago */}
                    <FormGroup>
                      <label>Condición de Pago</label>
                      <select
                        value={nuevaFactura.tipo_pago}
                        onChange={(e) => {
                          const tp = e.target.value;
                          setNuevaFactura(prev => ({
                            ...prev,
                            tipo_pago: tp,
                            metodo_pago: tp === 'Crédito' ? 'CREDITO' : 'EFECTIVO'
                          }));
                        }}
                      >
                        <option value="Contado">Contado</option>
                        <option value="Crédito">Crédito</option>
                      </select>
                    </FormGroup>

                    {nuevaFactura.tipo_pago === 'Contado' && (
                      <FormGroup>
                        <label>Método de Pago</label>
                        <select
                          value={nuevaFactura.metodo_pago}
                          onChange={(e) => setNuevaFactura(prev => ({ ...prev, metodo_pago: e.target.value }))}
                        >
                          <option value="EFECTIVO">Efectivo (Córdobas)</option>
                          <option value="TRANSFERENCIA">Transferencia Bancaria</option>
                          <option value="TARJETA">Tarjeta / POS Móvil</option>
                        </select>
                      </FormGroup>
                    )}
                  </div>

                  {/* SELECCIÓN DE PRODUCTOS */}
                  <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h4 style={{ margin: 0, color: '#065f46', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaBoxes /> {nuevaFactura.id_carga ? 'Productos Disponibles en el Furgón' : 'Catálogo Mayorista de Almacén'}
                      </h4>
                      {loadingCargaProducts && <span style={{ fontSize: '0.85rem', color: '#64748b' }}><FaSpinner className="fa-spin" /> Cargando furgón...</span>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '0.75rem', alignItems: 'flex-end' }}>
                      <FormGroup style={{ margin: 0 }}>
                        <label>Seleccionar Producto</label>
                        <select id="select_factura_item" defaultValue="">
                          <option value="" disabled>-- Seleccione un Producto --</option>
                          {nuevaFactura.id_carga ? (
                            cargaProductsForInvoice.map(it => (
                              <option key={it.id_producto} value={it.id_producto}>
                                {it.codigo} - {it.nombre_producto} (En Furgón: {it.disponible} un. | Precio: C$ {Number(it.precio_ruta_unitario).toFixed(2)})
                              </option>
                            ))
                          ) : (
                            catalogProducts.map(p => (
                              <option key={p.id_producto} value={p.id_producto}>
                                {p.codigo} - {p.nombre} (En Tienda: {p.existencia} un. | Ruta: C$ {Number(p.precio_ruta || p.mayorista || 0).toFixed(2)})
                              </option>
                            ))
                          )}
                        </select>
                      </FormGroup>

                      <FormGroup style={{ margin: 0 }}>
                        <label>Cantidad</label>
                        <input type="number" id="input_factura_qty" min="1" defaultValue="1" />
                      </FormGroup>

                      <ActionBtn
                        type="button"
                        style={{ height: '42px' }}
                        onClick={() => {
                          const sel = document.getElementById('select_factura_item');
                          const qtyIn = document.getElementById('input_factura_qty');
                          const pid = parseInt(sel.value, 10);
                          const qty = parseInt(qtyIn.value, 10) || 1;

                          if (!pid) {
                            toast.error('Seleccione un producto.');
                            return;
                          }

                          if (nuevaFactura.id_carga) {
                            const found = cargaProductsForInvoice.find(i => i.id_producto === pid);
                            if (!found) return;
                            handleAddItemToFactura({
                              id_producto: found.id_producto,
                              nombre: found.nombre_producto,
                              codigo: found.codigo,
                              precio: Number(found.precio_ruta_unitario),
                              stockMax: found.disponible
                            });
                          } else {
                            const found = catalogProducts.find(p => p.id_producto === pid);
                            if (!found) return;
                            handleAddItemToFactura({
                              id_producto: found.id_producto,
                              nombre: found.nombre,
                              codigo: found.codigo,
                              precio: Number(found.precio_ruta || found.mayorista || found.venta || 0),
                              stockMax: found.existencia
                            });
                          }
                        }}
                      >
                        <FaPlus /> Agregar
                      </ActionBtn>
                    </div>
                  </div>

                  {/* TABLA DE ÍTEMS EN LA FACTURA */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <TableWrap>
                      <table>
                        <thead>
                          <tr>
                            <th>Código</th>
                            <th>Producto</th>
                            <th style={{ width: '100px' }}>Cantidad</th>
                            <th style={{ width: '130px' }}>Precio Ruta (C$)</th>
                            <th style={{ width: '120px' }}>Desc. Unit (C$)</th>
                            <th style={{ textAlign: 'right' }}>Subtotal</th>
                            <th style={{ width: '50px' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {nuevaFactura.items.length === 0 ? (
                            <tr>
                              <td colSpan="7" style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8' }}>
                                No has agregado productos a esta factura todavía.
                              </td>
                            </tr>
                          ) : (
                            nuevaFactura.items.map(it => (
                              <tr key={it.id_producto}>
                                <td style={{ fontWeight: 600, color: '#64748b' }}>{it.codigo}</td>
                                <td style={{ fontWeight: 700 }}>{it.nombre}</td>
                                <td>
                                  <input
                                    type="number"
                                    min="1"
                                    max={it.stockMax}
                                    value={it.cantidad}
                                    style={{ width: '70px', padding: '4px 6px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                                    onChange={(e) => handleUpdateItemFactura(it.id_producto, 'cantidad', e.target.value)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={it.precio_unitario}
                                    style={{ width: '100px', padding: '4px 6px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                                    onChange={(e) => handleUpdateItemFactura(it.id_producto, 'precio_unitario', e.target.value)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={it.descuento}
                                    style={{ width: '90px', padding: '4px 6px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                                    onChange={(e) => handleUpdateItemFactura(it.id_producto, 'descuento', e.target.value)}
                                  />
                                </td>
                                <td style={{ textAlign: 'right', fontWeight: 800, color: '#065f46' }}>
                                  C$ {((it.precio_unitario - (Number(it.descuento) || 0)) * it.cantidad).toFixed(2)}
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '1rem' }}
                                    onClick={() => handleRemoveItemFactura(it.id_producto)}
                                    title="Quitar"
                                  >
                                    <FaTimes />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </TableWrap>
                  </div>

                  {/* DESCUENTO GENERAL Y TOTALES */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <div>
                      <FormGroup>
                        <label>Observaciones / Notas de la Factura de Ruta</label>
                        <textarea
                          rows="2"
                          placeholder="ej: Entrega en taller principal, pago al contado..."
                          value={nuevaFactura.notas}
                          onChange={(e) => setNuevaFactura(prev => ({ ...prev, notas: e.target.value }))}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label>Descuento General Autorizado (C$)</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={nuevaFactura.descuento_general}
                          onChange={(e) => setNuevaFactura(prev => ({ ...prev, descuento_general: e.target.value }))}
                        />
                      </FormGroup>
                    </div>

                    <div style={{ background: '#f1f5f9', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem', color: '#475569' }}>
                        <span>Subtotal de Productos:</span>
                        <strong>C$ {totalsFactura.subtotal.toFixed(2)}</strong>
                      </div>
                      {totalsFactura.descItems > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem', color: '#dc2626' }}>
                          <span>Descuentos por Ítem:</span>
                          <strong>- C$ {totalsFactura.descItems.toFixed(2)}</strong>
                        </div>
                      )}
                      {totalsFactura.descGeneral > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem', color: '#dc2626' }}>
                          <span>Descuento General:</span>
                          <strong>- C$ {totalsFactura.descGeneral.toFixed(2)}</strong>
                        </div>
                      )}
                      <div style={{ borderTop: '2px solid #cbd5e1', paddingTop: '10px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>Total a Pagar:</span>
                        <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#059669' }}>
                          C$ {totalsFactura.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <ActionBtn $secondary type="button" onClick={() => setIsFacturaModalOpen(false)}>
                      Cancelar
                    </ActionBtn>
                    <ActionBtn type="submit" disabled={nuevaFactura.items.length === 0}>
                      <FaCheck /> Confirmar y Emitir Factura
                    </ActionBtn>
                  </div>
                </form>
              </ModalBox>
            </ModalOverlay>
          )}
        </AnimatePresence>

        {/* =========================================================================
            MODAL 7: DETALLE / VOUCHER IMPRIMIBLE DE FACTURA DE RUTA
        ========================================================================= */}
        <AnimatePresence>
          {facturaDetalleModal.isOpen && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFacturaDetalleModal({ isOpen: false, factura: null, items: [], loading: false })}
            >
              <ModalBox
                $large
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, color: '#065f46' }}>Comprobante de Venta en Ruta Mayorista</h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <ActionBtn onClick={() => window.print()}><FaPrint /> Imprimir Factura</ActionBtn>
                    <button onClick={() => setFacturaDetalleModal({ isOpen: false, factura: null, items: [], loading: false })} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}>
                      <FaTimes />
                    </button>
                  </div>
                </div>

                {facturaDetalleModal.loading ? (
                  <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <FaSpinner className="fa-spin" style={{ fontSize: '2rem', color: '#059669' }} />
                    <p style={{ marginTop: '0.5rem', color: '#64748b' }}>Cargando factura...</p>
                  </div>
                ) : (
                  <div
                    ref={facturaTicketRef}
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      padding: '24px',
                      background: '#ffffff'
                    }}
                  >
                    <div style={{ borderBottom: '2px solid #059669', paddingBottom: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <h2 style={{ margin: 0, color: '#065f46', fontSize: '20px' }}>MULTIREPUESTOS RG & ARAGÓN</h2>
                        <div style={{ fontSize: '12px', color: '#475569', fontWeight: 700 }}>VENTA ESPECIAL DE RUTA MAYORISTA</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Juigalpa, Chontales, Nicaragua • Tel: +505 8888-8888</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '16px', fontWeight: 900, color: '#059669' }}>FACTURA #{facturaDetalleModal.factura?.numero_factura}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{new Date(facturaDetalleModal.factura?.fecha).toLocaleString('es-NI')}</div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '12px' }}>
                      <div>
                        <div><strong>Cliente / Taller:</strong> {facturaDetalleModal.factura?.nombre_cliente || 'Cliente de Ruta'}</div>
                        <div><strong>Teléfono:</strong> {facturaDetalleModal.factura?.telefono_cliente || 'N/A'}</div>
                        <div><strong>Zona:</strong> {facturaDetalleModal.factura?.zona_ruta || 'Ruta General'}</div>
                      </div>
                      <div>
                        <div><strong>Condición de Pago:</strong> <span style={{ fontWeight: 800, color: facturaDetalleModal.factura?.tipo_pago === 'Crédito' ? '#dc2626' : '#059669' }}>{facturaDetalleModal.factura?.tipo_pago || 'Contado'} ({facturaDetalleModal.factura?.metodo_pago || 'EFECTIVO'})</span></div>
                        <div><strong>Rutero / Repartidor:</strong> {facturaDetalleModal.factura?.nombre_rutero || facturaDetalleModal.factura?.vendedor || 'Ruta'}</div>
                        <div><strong>Vehículo:</strong> {facturaDetalleModal.factura?.vehiculo_ruta || 'Almacén'}</div>
                      </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginBottom: '20px' }}>
                      <thead>
                        <tr style={{ background: '#059669', color: 'white', textAlign: 'left' }}>
                          <th style={{ padding: '6px' }}>CÓDIGO</th>
                          <th style={{ padding: '6px' }}>DESCRIPCIÓN</th>
                          <th style={{ padding: '6px', textAlign: 'center' }}>CANT.</th>
                          <th style={{ padding: '6px', textAlign: 'right' }}>PRECIO RUTA</th>
                          <th style={{ padding: '6px', textAlign: 'right' }}>SUBTOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {facturaDetalleModal.items.map(it => (
                          <tr key={it.id_detalle || it.id_producto} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '6px' }}>{it.codigo}</td>
                            <td style={{ padding: '6px', fontWeight: 700 }}>{it.nombre_producto}</td>
                            <td style={{ padding: '6px', textAlign: 'center', fontWeight: 800 }}>{it.cantidad}</td>
                            <td style={{ padding: '6px', textAlign: 'right' }}>C$ {Number(it.precio_unitario).toFixed(2)}</td>
                            <td style={{ padding: '6px', textAlign: 'right', fontWeight: 800 }}>C$ {(it.cantidad * it.precio_unitario).toFixed(2)}</td>
                          </tr>
                        ))}
                        {Number(facturaDetalleModal.factura?.descuento || 0) > 0 && (
                          <tr style={{ color: '#dc2626', fontWeight: 700 }}>
                            <td colSpan="4" style={{ padding: '6px', textAlign: 'right' }}>DESCUENTO:</td>
                            <td style={{ padding: '6px', textAlign: 'right' }}>- C$ {Number(facturaDetalleModal.factura.descuento).toFixed(2)}</td>
                          </tr>
                        )}
                        <tr style={{ background: '#f1f5f9', fontWeight: 900 }}>
                          <td colSpan="4" style={{ padding: '8px', textAlign: 'right', fontSize: '12px' }}>TOTAL FACTURA:</td>
                          <td style={{ padding: '8px', textAlign: 'right', color: '#065f46', fontSize: '14px' }}>
                            C$ {Number(facturaDetalleModal.factura?.total_venta || 0).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '35px', textAlign: 'center', fontSize: '11px' }}>
                      <div>
                        <div style={{ borderTop: '1px solid #94a3b8', paddingTop: '6px' }}>
                          <strong>Firma del Vendedor / Rutero</strong>
                        </div>
                      </div>
                      <div>
                        <div style={{ borderTop: '1px solid #94a3b8', paddingTop: '6px' }}>
                          <strong>Firma del Cliente / Recibido Conforme</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBox>
            </ModalOverlay>
          )}

          {/* =========================================================================
              MODAL RÁPIDO: REGISTRAR NUEVO EMPLEADO (RUTERO)
          ========================================================================= */}
          {isQuickEmployeeModalOpen && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuickEmployeeModalOpen(false)}
            >
              <ModalBox
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '440px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaUserPlus color="#059669" /> Registrar Nuevo Empleado
                  </h3>
                  <button onClick={() => setIsQuickEmployeeModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}>
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleQuickCreateEmployee}>
                  <FormGroup>
                    <label style={{ fontWeight: 700 }}>Nombre Completo del Trabajador *</label>
                    <input
                      type="text"
                      required
                      placeholder="ej: Carlos Alberto Pérez"
                      value={quickEmployee.nombre}
                      onChange={(e) => setQuickEmployee(prev => ({ ...prev, nombre: e.target.value }))}
                      autoFocus
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Teléfono / Celular</label>
                    <input
                      type="text"
                      placeholder="ej: 8888-1234"
                      value={quickEmployee.telefono}
                      onChange={(e) => setQuickEmployee(prev => ({ ...prev, telefono: e.target.value }))}
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Cargo / Función</label>
                    <input
                      type="text"
                      placeholder="ej: Rutero / Repartidor Mayorista"
                      value={quickEmployee.cargo}
                      onChange={(e) => setQuickEmployee(prev => ({ ...prev, cargo: e.target.value }))}
                    />
                  </FormGroup>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <ActionBtn $secondary type="button" onClick={() => setIsQuickEmployeeModalOpen(false)}>
                      Cancelar
                    </ActionBtn>
                    <ActionBtn type="submit">
                      Guardar y Asignar
                    </ActionBtn>
                  </div>
                </form>
              </ModalBox>
            </ModalOverlay>
          )}
        </AnimatePresence>
      </Content>
    </PageWrapper>
  );
};

export default MayoristaManagement;
