import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
    FaSignOutAlt, FaShoppingCart, FaBoxOpen, FaFileInvoice,
    FaCreditCard, FaCloudUploadAlt, FaChartBar, FaBriefcase, FaUsers,
    FaFileInvoiceDollar, FaClipboardList, FaTruck, FaTags, FaCog
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';

import ConfirmationModal from './pos/components/ConfirmationModal.jsx';
import SettingsModal from './pos/components/SettingsModal.jsx';

// --- ESTILOS MEJORADOS Y RESPONSIVOS ---
const PageWrapper = styled.div`
    padding: clamp(1rem, 5vw, 2.5rem); 
    background-color: #f0f2f5; 
    min-height: 100vh;
    box-sizing: border-box;
`;
const Content = styled.div`
    width: 100%;
    max-width: 1300px;
    margin: 0 auto;
`;
const TopBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center; 
    margin-bottom: 3rem; 
    gap: 1.5rem;
    flex-wrap: wrap;
`;
const Header = styled.div`min-width: 0;`;
const WelcomeTitle = styled.h1`
    font-size: clamp(1.8rem, 4vw, 2.4rem); 
    color: #1e293b; 
    font-weight: 800;
    margin: 0;
    line-height: 1.2;
`;
const WelcomeSubtitle = styled.p`
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    color: #64748b;
    margin: 0.4rem 0 0;
`;
const LogoutButton = styled.button`
    padding: 0.7rem 1.4rem;
    border: none; 
    background: #fecaca; 
    color: #dc2626; 
    border-radius: 12px;
    cursor: pointer;
    font-weight: 700;
    font-size: 1rem;
    transition: all 0.2s ease;
    display: inline-flex;
    gap: 0.6rem;
    align-items: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); 
    
    &:hover, &:focus { 
        background: #dc2626; 
        color: #fff; 
        box-shadow: 0 6px 10px rgba(220, 38, 38, 0.3); 
        transform: translateY(-2px);
        outline: none; 
    }
`;
const GridContainer = styled.main`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
    gap: clamp(1rem, 2vw, 1.5rem);
`;
const Card = styled(Link)`
    background-color: #ffffff;
    border-radius: 16px; 
    padding: 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); 
    transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.25s ease; 
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    min-height: 130px;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 6px;
        height: 100%;
        background-color: ${props => props.color || '#007bff'};
    }

    &:hover, &:focus { 
        transform: translateY(-4px); 
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15); 
        outline: none; 
    }
    
    h2 { 
        margin: 0 0 .35rem 0; 
        font-size: 1.15rem; 
        color: #233547; 
        font-weight: 700; 
        letter-spacing: -0.5px;
    }
    p { 
        margin:0; 
        color:#6b7a86; 
        font-size: 1rem; 
    }
`;
const CardIcon = styled.div` 
    font-size: 2.2rem; 
    margin-bottom: 0.75rem; 
    line-height:1; 
    color: ${props => props.color || '#007bff'}; 
`;

// --- Componente Dashboard ---
const Dashboard = () => {
    const { user, logout } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    if (!user) {
        return (
            <PageWrapper>
                <Content><WelcomeTitle>Cargando...</WelcomeTitle></Content>
            </PageWrapper>
        );
    }

    // ----------------------------------------------------
    // LÓGICA DE ROLES AJUSTADA
    // ----------------------------------------------------
    const userRole = user.rol || 'N/A';

    // Roles base
    const isAdmin = userRole === 'Administrador' || userRole === 'Admin';
    const isVendedor = userRole === 'Vendedor';
    const isContador = userRole === 'Encargado de Finanzas' || userRole === 'Contador';
    const isInventoryManager = userRole === 'Encargado de Inventario';

    // --- DEFINICIÓN DE ACCESOS ---

    const canAccessPOS = isAdmin;
    const canAccessOrders = isAdmin || isVendedor;
    const canAccessCredits = isAdmin || isContador;
    const canAccessInventory = isAdmin || isInventoryManager;
    const canAccessMassUpload = isAdmin || isInventoryManager;
    const canAccessReports = isAdmin || userRole === 'Gerente' || isContador;
    const canAccessCashReports = isAdmin || userRole === 'Gerente' || isContador;
    const canAccessAdminUsers = isAdmin;

    // NUEVO ACCESO: Facturas de Proveedores (Solo Admin y Contador)
    const canAccessInvoices = isAdmin || isContador;

    const displayName = user.nombre_usuario || user.nombre || user.name || 'Usuario';
    // ----------------------------------------------------

    const handlePrepareLogout = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = () => {
        setShowLogoutModal(false);
        logout();
    };

    // --- PRE-FETCHING LOGIC FOR "INSTANT" FEEL ---
    const prefetch = (path) => {
        switch (path) {
            case '/pos': import('./pos/POS.jsx'); break;
            case '/inventory': import('./InventoryManagement.jsx'); break;
            case '/traslados': import('./InventoryOutflowPage.jsx'); break;
            case '/credits': import('./ClientesYCreditos.jsx'); break;
            case '/invoices': import('./FacturasProveedores.jsx'); break;
            case '/orders': import('./PedidosYApartados.jsx'); break;
            default: break;
        }
    };

    return (
        <PageWrapper>
            <Content>
                <TopBar>
                    <Header>
                        <WelcomeTitle>Bienvenido, {displayName} 👋</WelcomeTitle>
                        <WelcomeSubtitle>Rol: {userRole}. Selecciona un módulo para empezar.</WelcomeSubtitle>
                    </Header>
                    <LogoutButton aria-label="Cerrar sesión" onClick={handlePrepareLogout}>
                        <FaSignOutAlt /> Cerrar sesión
                    </LogoutButton>
                </TopBar>

                <GridContainer>
                    {/* 1. Punto de Venta */}
                    {canAccessPOS && (
                        <Card to="/pos" color="#007bff" onMouseEnter={() => prefetch('/pos')}>
                            <CardIcon color="#007bff"><FaShoppingCart /></CardIcon>
                            <h2>Punto de Venta</h2>
                            <p>Registra ventas y gestiona transacciones diarias.</p>
                        </Card>
                    )}

                    {/* Venta Mayorista (Próximamente) */}
                    {canAccessPOS && (
                        <Card to="#" onClick={(e) => e.preventDefault()} color="#8b5cf6" style={{ opacity: 0.9, cursor: 'not-allowed' }}>
                            <CardIcon color="#8b5cf6"><FaTags /></CardIcon>
                            <h2>Venta Mayorista</h2>
                            <p style={{ fontWeight: 'bold', color: '#8b5cf6', marginBottom: '5px' }}>PRÓXIMAMENTE</p>
                            <p>Portal exclusivo para ventas al por mayor.</p>
                        </Card>
                    )}

                    {/* 2. Pedidos y Apartados */}
                    {canAccessOrders && (
                        <Card to="/orders" color="#ffc107" onMouseEnter={() => prefetch('/orders')}>
                            <CardIcon color="#ffc107"><FaFileInvoice /></CardIcon>
                            <h2>Proformas y precios</h2>
                            <p>Crear Proformas y ver Productos</p>
                        </Card>
                    )}

                    {/* NUEVO: Facturas Proveedores */}
                    {canAccessInvoices && (
                        <Card to="/invoices" color="#e83e8c" onMouseEnter={() => prefetch('/invoices')}>
                            <CardIcon color="#e83e8c"><FaFileInvoiceDollar /></CardIcon>
                            <h2>Facturas Proveedores</h2>
                            <p>Gestionar pagos, vencimientos y proveedores.</p>
                        </Card>
                    )}

                    {/* 3. Clientes y Créditos */}
                    {canAccessCredits && (
                        <Card to="/credits" color="#17a2b8" onMouseEnter={() => prefetch('/credits')}>
                            <CardIcon color="#17a2b8"><FaCreditCard /></CardIcon>
                            <h2>Clientes y Créditos</h2>
                            <p>Gestiona clientes, saldos pendientes y abonos.</p>
                        </Card>
                    )}

                    {/* 4. Inventario */}
                    {canAccessInventory && (
                        <Card to="/inventory" color="#28a745" onMouseEnter={() => prefetch('/inventory')}>
                            <CardIcon color="#28a745"><FaBoxOpen /></CardIcon>
                            <h2>Inventario</h2>
                            <p>Controla el stock de tus productos y mercancía.</p>
                        </Card>
                    )}

                    {/* 5. Carga Masiva */}
                    {canAccessMassUpload && (
                        <Card to="/upload/inventory" color="#6f42c1">
                            <CardIcon color="#6f42c1"><FaCloudUploadAlt /></CardIcon>
                            <h2>Carga Masiva</h2>
                            <p>Actualiza inventario desde archivos CSV.</p>
                        </Card>
                    )}

                    {/* NUEVO: TRASLADOS / SALIDAS (Admin Only) */}
                    {canAccessInventory && (
                        <Card to="/traslados" color="#ef4444" onMouseEnter={() => prefetch('/traslados')}>
                            <CardIcon color="#ef4444"><FaTruck /></CardIcon>
                            <h2>Traslados / Salidas</h2>
                            <p>Descontar mercancía por traslados o merma.</p>
                        </Card>
                    )}

                    {/* 6. Reportes */}
                    {canAccessReports && (
                        <Card to="/reports" color="#6c757d">
                            <CardIcon color="#6c757d"><FaChartBar /></CardIcon>
                            <h2>Reportes</h2>
                            <p>Visualiza el rendimiento general.</p>
                        </Card>
                    )}

                    {/* 7. Gestión de Cajas */}
                    {canAccessCashReports && (
                        <Card to="/cash-report" color="#dc3545">
                            <CardIcon color="#dc3545"><FaBriefcase /></CardIcon>
                            <h2>Gestión de Cajas</h2>
                            <p>Cierres y arqueos de caja.</p>
                        </Card>
                    )}

                    {/* Reportes de Ventas Detallado (NUEVO) */}
                    {canAccessReports && (
                        <Card to="/detailed-sales-report" color="#6366f1">
                            <CardIcon color="#6366f1"><FaFileInvoiceDollar /></CardIcon>
                            <h2>Reportes de Ventas Detallado</h2>
                            <p>Ventas, devoluciones y rastreo por producto.</p>
                        </Card>
                    )}

                    {/* 8. Usuarios */}
                    {canAccessAdminUsers && (
                        <Card to="/admin/users" color="#ff6b6b">
                            <CardIcon color="#ff6b6b"><FaUsers /></CardIcon>
                            <h2>Usuarios</h2>
                            <p>Administra roles y accesos.</p>
                        </Card>
                    )}

                    {/* 9. Solicitudes (Para todos) */}
                    <Card to="/solicitudes" color="#fd7e14">
                        <CardIcon color="#fd7e14"><FaClipboardList /></CardIcon>
                        <h2>Solicitudes</h2>
                        <p>Realizar pedidos y requerimientos.</p>
                    </Card>

                    {/* 10. Configuración (Solo Admin) */}
                    {isAdmin && (
                        <Card as="button" onClick={() => setShowSettings(true)} color="#343a40" style={{ textAlign: 'left', border: 'none', cursor: 'pointer' }}>
                            <CardIcon color="#343a40"><FaCog /></CardIcon>
                            <h2>Configuración</h2>
                            <p>Datos de empresa y tickets.</p>
                        </Card>
                    )}
                </GridContainer>
            </Content>

            <ConfirmationModal
                isOpen={showLogoutModal}
                title="Confirmar Cierre de Sesión"
                message="¿Estás seguro de que quieres cerrar tu sesión actual?"
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleConfirmLogout}
            />

            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
            />
        </PageWrapper >
    );
};

export default Dashboard;