import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaArrowLeft, FaPrint, FaCalendarAlt, FaChartBar, FaStar, FaUserFriends, FaWarehouse, FaFileInvoiceDollar, FaChartLine, FaEye, FaTimes } from 'react-icons/fa';

import {
  fetchSalesSummaryReport,
  fetchInventoryValueReport,
  fetchSalesByUserReport,
  fetchTopProductsReport,
  fetchSalesChartReport
} from '../service/api.js';

import AlertModal from './pos/components/AlertModal';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- ESTILOS GLOBALES PARA IMPRESIÓN ---
const PrintStyles = createGlobalStyle`
  @media print {
    body * { visibility: hidden; }
    #printableArea, #printableArea * { visibility: visible; }
    #printableArea { position: absolute; left: 0; top: 0; width: 100%; }
    .no-print { display: none !important; }
  }
`;

// --- ANIMACIONES Y ESTILOS ---
const fadeIn = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;

const PageWrapper = styled.div`
  padding: 1.5rem;
  background-color: #f0f2f5;
  min-height: 100vh;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  --primary-color: #3b82f6;
  --secondary-color: #10b981;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 0.4s ease-out;
  @media print { display: none; }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 7px 10px rgba(0, 0, 0, 0.1);
  }
`;

const BackButton = styled(ActionButton)`
  background: #6b7280;
  &:hover { background: #4b5563; }
`;

const PrintButton = styled(ActionButton)`
  background: var(--secondary-color);
  &:hover { background: #059669; }
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.5s ease-out;
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  @media print { display: none; }
`;

const TitleHeader = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background-color: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const DateInput = styled.input`
  padding: 0.6rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  background-color: #f9fafb;
`;

const ReportButton = styled(ActionButton)`
  background: var(--primary-color);
  &:hover { background: #2563eb; }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const ReportCard = styled.div`
  background: ${props => props.bgGradient ? props.bgGradient : '#fff'};
  color: ${props => props.bgGradient ? '#fff' : '#111827'};
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.6s ease-out forwards;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  opacity: 0.9;
  font-size: 1.1rem;
`;

const CardValue = styled.p`
  font-size: 2.2rem;
  font-weight: 800;
  margin: auto 0 0 0;
  text-shadow: ${props => props.textShadow ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'};
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-out forwards;
  animation-delay: ${props => props.delay * 100}ms;
  &:last-child { border-bottom: none; }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  opacity: 0.7;
`;

// --- INDICADOR DE CARGA MEJORADO ---
const spinnerAnimation = keyframes`to { transform: rotate(360deg); }`;
const LoadingSpinner = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  &::after {
    content: '';
    width: 50px;
    height: 50px;
    border: 5px solid #d1d5db;
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: ${spinnerAnimation} 0.8s linear infinite;
  }
`;

// --- MODAL DETALLES CAPITAL ---
const ModalOverlay = styled.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5); z-index: 2000;
    display: flex; justify-content: center; align-items: center;
    backdrop-filter: blur(5px);
`;
const ModalContent = styled.div`
    background: white; padding: 25px; border-radius: 12px;
    width: 90%; max-width: 800px; max-height: 85vh;
    overflow-y: auto; position: relative;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
`;

const CapitalDetailsModal = ({ isOpen, onClose, breakdown = [] }) => {
  if (!isOpen) return null;
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, color: '#1e293b' }}>💰 Top 50 Productos (Mayor Valor)</h2>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}><FaTimes /></button>
        </div>
        <p style={{ color: '#64748b', marginBottom: '1rem' }}>
          Estos son los productos que más contribuyen al valor total del inventario.
          Revisa si hay errores (ej. costo de una caja pero existencia en unidades).
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '10px' }}>Producto</th>
                <th style={{ padding: '10px' }}>Costo Unit.</th>
                <th style={{ padding: '10px' }}>Existencia</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((item, idx) => (
                <tr key={item.id_producto || idx} style={{ borderBottom: '1px solid #e2e8f0', background: item.valor_total > 100000 ? '#fff1f2' : 'transparent' }}>
                  <td style={{ padding: '10px' }}>
                    <div style={{ fontWeight: 'bold', color: '#334155' }}>{item.nombre}</div>
                    <div style={{ fontSize: '0.8em', color: '#94a3b8' }}>{item.codigo}</div>
                  </td>
                  <td style={{ padding: '10px' }}>C${Number(item.costo).toLocaleString('en-US')}</td>
                  <td style={{ padding: '10px' }}>{item.existencia}</td>
                  <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#0f172a' }}>
                    C${Number(item.valor_total).toLocaleString('en-US')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <ActionButton style={{ background: '#64748b', display: 'inline-flex' }} onClick={onClose}>Cerrar</ActionButton>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

// --- COMPONENTE PRINCIPAL ---
const Reports = () => {
  const navigate = useNavigate();
  const getInitialStartDate = () => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(getInitialStartDate);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const [salesSummary, setSalesSummary] = useState({ ventas_brutas: 0, ganancia_total: 0 });
  const [inventoryValue, setInventoryValue] = useState({ total: 0, breakdown: [] });
  const [salesByUser, setSalesByUser] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const [isLoading, setIsLoading] = useState(true);
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, title: '', message: '' });
  const [showCapitalModal, setShowCapitalModal] = useState(false);

  const formatCurrency = (value) => new Intl.NumberFormat('es-NI', { style: 'currency', currency: 'NIO' }).format(value || 0);

  const fetchAllReports = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setAlertInfo({ isOpen: true, title: 'Error de Autenticación', message: 'No se encontró tu sesión.' });
      setIsLoading(false);
      return;
    }
    try {
      const params = { startDate, endDate };
      const [summary, inventory, userSales, topProds, chart] = await Promise.all([
        fetchSalesSummaryReport(token, params),
        fetchInventoryValueReport(token),
        fetchSalesByUserReport(token, params),
        fetchTopProductsReport(token, params),
        fetchSalesChartReport(token, params)
      ]);
      setSalesSummary(summary);

      // Update inventory to handle new object structure
      if (inventory.breakdown) {
        setInventoryValue({ total: inventory.valor_total_inventario, breakdown: inventory.breakdown });
      } else {
        // Fallback logic
        setInventoryValue({ total: inventory.valor_total_inventario || inventory, breakdown: [] });
      }

      setSalesByUser(userSales);
      setTopProducts(topProds);
      setChartData({
        labels: chart.map(d => new Date(d.dia).toLocaleDateString('es-NI', { day: 'numeric', month: 'short' })),
        datasets: [{
          label: 'Ventas por Día',
          data: chart.map(d => d.total_diario),
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
          borderRadius: 4,
          hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
        }]
      });
    } catch (error) {
      setAlertInfo({ isOpen: true, title: 'Error de Conexión', message: error.message });
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchAllReports();
  }, [fetchAllReports]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <PrintStyles />
      <PageWrapper>
        {isLoading && <LoadingSpinner />}
        <AlertModal
          isOpen={alertInfo.isOpen}
          onClose={() => setAlertInfo({ isOpen: false, title: '', message: '' })}
          title={alertInfo.title}
          message={alertInfo.message}
        />

        <CapitalDetailsModal
          isOpen={showCapitalModal}
          onClose={() => setShowCapitalModal(false)}
          breakdown={inventoryValue.breakdown}
        />

        <TopBar>
          <BackButton onClick={() => navigate(-1)}>
            <FaArrowLeft /> Regresar
          </BackButton>
          <PrintButton onClick={handlePrint}>
            <FaPrint /> Imprimir Reporte
          </PrintButton>
        </TopBar>

        <Header>
          <TitleHeader>Dashboard de Reportes</TitleHeader>
          <FilterContainer>
            <label><FaCalendarAlt /></label>
            <DateInput type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <DateInput type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            <ReportButton onClick={fetchAllReports}>Generar</ReportButton>
          </FilterContainer>
        </Header>

        <div id="printableArea">
          <DashboardGrid>
            {/* Sales Chart */}
            <ReportCard style={{ gridColumn: '1 / -1' }} bgGradient="linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)">
              <CardHeader style={{ color: '#1e293b' }}><FaChartBar style={{ color: '#3b82f6' }} /> Rendimiento de Ventas</CardHeader>
              <div style={{ position: 'relative', height: '350px' }}>
                <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </div>
            </ReportCard>

            {/* Ventas Totales */}
            <ReportCard bgGradient="linear-gradient(135deg, #10b981 0%, #059669 100%)">
              <CardHeader style={{ color: 'white' }}><FaFileInvoiceDollar /> Ventas Totales</CardHeader>
              <CardValue style={{ color: 'white' }} textShadow>{formatCurrency(salesSummary.ventas_brutas)}</CardValue>
            </ReportCard>

            {/* Ganancias */}
            <ReportCard bgGradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
              <CardHeader style={{ color: 'white' }}><FaChartLine /> Ganancias</CardHeader>
              <CardValue style={{ color: 'white' }} textShadow>{formatCurrency(salesSummary.ganancia_total)}</CardValue>
            </ReportCard>

            {/* Capital en Inventario */}
            <ReportCard bgGradient="linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)">
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
                <CardHeader style={{ color: 'white', margin: 0 }}><FaWarehouse /> Capital</CardHeader>
                <button
                  onClick={() => setShowCapitalModal(true)}
                  style={{
                    background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
                    padding: '5px 10px', borderRadius: '15px', cursor: 'pointer', fontSize: '0.8rem',
                    display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '700',
                    marginTop: '-5px', marginRight: '-5px'
                  }}
                  className="no-print"
                >
                  <FaEye /> Detalles
                </button>
              </div>
              <CardValue style={{ color: 'white' }} textShadow>{formatCurrency(inventoryValue.total)}</CardValue>
            </ReportCard>

            {/* Top Vendedores */}
            <ReportCard style={{ gridColumn: 'span 1 / auto' }}>
              <CardHeader><FaUserFriends style={{ color: '#8b5cf6' }} /> Top Vendedores</CardHeader>
              <ul>
                {salesByUser.length > 0 ? salesByUser.map((user, i) => (
                  <ListItem key={i} delay={i + 1}>
                    <span>{i + 1}. {user.nombre_usuario}</span>
                    <strong style={{ color: '#1e293b' }}>{formatCurrency(user.total_vendido)}</strong>
                  </ListItem>
                )) : <EmptyState>No hay datos de vendedores.</EmptyState>}
              </ul>
            </ReportCard>

            {/* Top Productos */}
            <ReportCard style={{ gridColumn: 'span 1 / auto' }}>
              <CardHeader><FaStar style={{ color: '#f59e0b' }} /> Más Vendidos</CardHeader>
              <ul>
                {topProducts.length > 0 ? topProducts.map((prod, i) => (
                  <ListItem key={i} delay={i + 1}>
                    <span>{i + 1}. {prod.nombre}</span>
                    <strong style={{ color: '#1e293b' }}>{prod.total_unidades_vendidas} und.</strong>
                  </ListItem>
                )) : <EmptyState>No hay datos de productos.</EmptyState>}
              </ul>
            </ReportCard>
          </DashboardGrid>
        </div>
      </PageWrapper>
    </>
  );
};

export default Reports;