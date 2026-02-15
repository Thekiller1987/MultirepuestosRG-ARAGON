import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom'; // <--- Para el botón de regresar
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaArrowLeft, FaPrint, FaCalendarAlt, FaChartBar, FaStar, FaUserFriends, FaWarehouse, FaFileInvoiceDollar, FaChartLine } from 'react-icons/fa';

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
    body * {
      visibility: hidden;
    }
    #printableArea, #printableArea * {
      visibility: visible;
    }
    #printableArea {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
  }
`;

// --- ANIMACIONES Y ESTILOS MEJORADOS ---

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

  /* Ocultar en impresión */
  @media print {
    display: none;
  }
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

  /* Ocultar en impresión */
  @media print {
    display: none;
  }
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
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.6s ease-out forwards;
  border-top: 4px solid ${props => props.accentColor || 'var(--primary-color)'};
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #4b5563;
  font-weight: 600;
`;

const CardValue = styled.p`
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin: auto 0 0 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0.2rem;
  border-bottom: 1px solid #f3f4f6;
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-out forwards;
  animation-delay: ${props => props.delay * 100}ms; // Animación escalonada
  &:last-child { border-bottom: none; }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
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

// --- COMPONENTE PRINCIPAL ---

const Reports = () => {
  const navigate = useNavigate(); // Hook para la navegación
  const getInitialStartDate = () => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  
  const [startDate, setStartDate] = useState(getInitialStartDate);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const [salesSummary, setSalesSummary] = useState({ ventas_brutas: 0, ganancia_total: 0 });
  const [inventoryValue, setInventoryValue] = useState(0);
  const [salesByUser, setSalesByUser] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  
  const [isLoading, setIsLoading] = useState(true);
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, title: '', message: '' });

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
      setInventoryValue(inventory.valor_total_inventario);
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

  // --- FUNCIÓN PARA IMPRIMIR ---
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
            <ReportCard style={{ gridColumn: '1 / -1' }} accentColor="var(--primary-color)">
              <CardHeader><FaChartBar /> Rendimiento de Ventas en el Período</CardHeader>
              <div style={{ position: 'relative', height: '350px' }}>
                <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </div>
            </ReportCard>

            <ReportCard accentColor="#10b981">
              <CardHeader><FaFileInvoiceDollar /> Ventas Totales</CardHeader>
              <CardValue>{formatCurrency(salesSummary.ventas_brutas)}</CardValue>
            </ReportCard>

            <ReportCard accentColor="#f59e0b">
              <CardHeader><FaChartLine /> Ganancias Totales</CardHeader>
              <CardValue>{formatCurrency(salesSummary.ganancia_total)}</CardValue>
            </ReportCard>

            <ReportCard accentColor="#6366f1">
              <CardHeader><FaWarehouse /> Capital en Inventario</CardHeader>
              <CardValue>{formatCurrency(inventoryValue)}</CardValue>
            </ReportCard>

            <ReportCard style={{ gridColumn: 'span 1 / auto' }}>
              <CardHeader><FaUserFriends /> 🏆 Top Vendedores</CardHeader>
              <ul>
                {salesByUser.length > 0 ? salesByUser.map((user, i) => (
                  <ListItem key={i} delay={i + 1}>
                    <span>{i + 1}. {user.nombre_usuario}</span>
                    <strong>{formatCurrency(user.total_vendido)}</strong>
                  </ListItem>
                )) : <EmptyState>No hay datos de vendedores.</EmptyState>}
              </ul>
            </ReportCard>
            
            <ReportCard style={{ gridColumn: 'span 1 / auto' }}>
              <CardHeader><FaStar /> ⭐ Productos Más Vendidos</CardHeader>
              <ul>
                {topProducts.length > 0 ? topProducts.map((prod, i) => (
                  <ListItem key={i} delay={i + 1}>
                    <span>{i + 1}. {prod.nombre}</span>
                    <strong>{prod.total_unidades_vendidas} und.</strong>
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