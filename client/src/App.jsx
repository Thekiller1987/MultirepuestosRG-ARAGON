import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Páginas
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Lazy Load Pages for Performance ("Instant" feeling)
const Login = React.lazy(() => import('./pages/login.jsx'));
const Dashboard = React.lazy(() => import('./pages/Dashboard.jsx'));
const UserManagement = React.lazy(() => import('./pages/UserManagement.jsx'));
const InventoryManagement = React.lazy(() => import('./pages/InventoryManagement.jsx'));
const PedidosYApartados = React.lazy(() => import('./pages/PedidosYApartados.jsx'));
const ClientesYCreditos = React.lazy(() => import('./pages/ClientesYCreditos.jsx'));
const Finances = React.lazy(() => import('./pages/Finances.jsx'));
const POS = React.lazy(() => import('./pages/pos/POS.jsx'));
const Reports = React.lazy(() => import('./pages/Reports.jsx'));
const Unauthorized = React.lazy(() => import('./components/Unauthorized.jsx'));
const InventoryUpload = React.lazy(() => import('./pages/InventoryUpload.jsx'));
const CashReport = React.lazy(() => import('./pages/CashReport.jsx'));
const FacturasProveedores = React.lazy(() => import('./pages/FacturasProveedores.jsx'));
const Solicitudes = React.lazy(() => import('./pages/Solicitudes.jsx'));
const InventoryOutflowPage = React.lazy(() => import('./pages/InventoryOutflowPage.jsx'));
const DetailedSalesReport = React.lazy(() => import('./pages/DetailedSalesReport.jsx'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage.jsx'));

// Simple fallback component
const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#64748b' }}>
    Cargando...
  </div>
);

// Mapa de roles
const ROLES = {
  ADMIN: 'Administrador',
  VENDEDOR: 'Vendedor',
  INVENTARIO: 'Encargado de Inventario',
  FINANZAS: 'Encargado de Finanzas',
  GERENTE: 'Gerente',
  EMPLEADO: 'Empleado',
};

function App() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Evitar parpadeo mientras auth carga
  if (isLoading) return <Loading />;

  const pageTransition = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 },
    transition: { duration: 0.2, ease: "easeOut" }
  };

  return (
    <React.Suspense fallback={<Loading />}>
      <Toaster position="top-center" reverseOrder={false} />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Públicas */}
          <Route path="/login" element={
            <motion.div {...pageTransition}><Login /></motion.div>
          } />
          <Route path="/unauthorized" element={
            <motion.div {...pageTransition}><Unauthorized /></motion.div>
          } />

          {/* Protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <motion.div {...pageTransition}><Dashboard /></motion.div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/pos"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.VENDEDOR]}>
                <motion.div {...pageTransition}><POS /></motion.div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventory"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.INVENTARIO]}>
                <motion.div {...pageTransition}><InventoryManagement /></motion.div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.VENDEDOR, ROLES.EMPLEADO]}>
                <motion.div {...pageTransition}><PedidosYApartados /></motion.div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/credits"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.VENDEDOR, ROLES.FINANZAS]}>
                <motion.div {...pageTransition}><ClientesYCreditos /></motion.div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/finances"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FINANZAS]}>
                <motion.div {...pageTransition}><Finances /></motion.div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GERENTE, ROLES.FINANZAS]}>
                <motion.div {...pageTransition}><Reports /></motion.div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <motion.div {...pageTransition}><UserManagement /></motion.div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload/inventory"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.INVENTARIO]}>
                <motion.div {...pageTransition}><InventoryUpload /></motion.div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/cash-report"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GERENTE, ROLES.FINANZAS]}>
                <motion.div {...pageTransition}><CashReport /></motion.div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/traslados"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.INVENTARIO]}>
                <motion.div {...pageTransition}><InventoryOutflowPage /></motion.div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/detailed-sales-report"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GERENTE, ROLES.FINANZAS]}>
                <motion.div {...pageTransition}><DetailedSalesReport /></motion.div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/invoices"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FINANZAS]}>
                <motion.div {...pageTransition}><FacturasProveedores /></motion.div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/solicitudes"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.VENDEDOR, ROLES.INVENTARIO, ROLES.FINANZAS, ROLES.GERENTE]}>
                <motion.div {...pageTransition}><Solicitudes /></motion.div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GERENTE]}>
                <motion.div {...pageTransition}><SettingsPage /></motion.div>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </AnimatePresence>
    </React.Suspense>
  );
}

export default App;