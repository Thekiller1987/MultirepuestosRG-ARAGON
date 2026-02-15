import React, { useRef } from 'react';
import { FaFileInvoice, FaDownload, FaWindowClose, FaSpinner, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import styled, { keyframes } from 'styled-components';

// IMPORTAR LIBRERÍAS NECESARIAS
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { fetchActiveCajaSessions, getCart, saveCart } from '../../../service/api'; // Import API functions

// --- ESTILOS DE BASE (Requeridos para el funcionamiento del Modal) ---
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const scaleIn = keyframes`from { transform: scale(0.95); } to { transform: scale(1); }`;
const LoadingSpinner = keyframes`0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }`;

const ModalOverlay = styled.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
    display: flex; justify-content: center; align-items: center; z-index: 1100;
    animation: ${fadeIn} 0.2s;
`;
const ModalContent = styled.div`
    background: white; padding: 2.5rem; border-radius: 24px;
    width: 95%; max-width: 680px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    animation: ${scaleIn} 0.3s;
    max-height: 90vh; overflow-y: auto;

    @media (max-width: 768px) {
        padding: 1rem;
        border-radius: 12px;
    }
`;
const Button = styled.button`
    padding: 1rem 1.5rem; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s;
    background: ${props => props.$cancel ? '#e2e8f0' : '#2563eb'};
    color: ${props => props.$cancel ? '#475569' : 'white'};
    &:hover { background: ${props => props.$cancel ? '#cbd5e1' : '#1d4ed8'}; }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
const TotalsRow = styled.div`
    display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.95rem;
    font-weight: ${props => props.$bold ? 'bold' : 'normal'};
    &.grand-total { border-top: 2px solid #333; font-size: 1.1rem; margin-top: 8px; padding-top: 10px; }
    .text-right { text-align: right; }
`;
const FaSpinnerAnimated = styled(FaSpinner)`animation: ${LoadingSpinner} 1s linear infinite;`;

/* =================================================================
 * DATOS DE TU NEGOCIO 
 * ================================================================= */
const COMPANY = {
    NAME: 'Multirepuestos RG',
    RUC: '1211812770001E',
    PHONE: '84031936 / 84058142',
    ADDRESS: 'Del portón de la normal 75 varas al este. Juigalpa, Chontales.',
    SLOGAN: 'Tu mejor opción en repuestos de moto y carro',
    LOGO_URL: '/icons/logo.png',
};

/* =================================================================
 * ESTILOS ESPECÍFICOS DE PROFORMA (Adaptados para Mobile/PWA)
 * ================================================================= */
const ProformaWrapper = styled.div`
    width: 100%; max-width: 650px; padding: 1.5rem; background: #fff; border-radius: 8px; display: flex; flex-direction: column; gap: 1.5rem;

    /* Estilo CLAVE para ocultar los botones al generar el PDF */
    &.proforma-to-print .footer-actions {
        display: none;
    }
    @media (max-width: 768px) { padding: 1rem; gap: 1rem; }
`;

const ProformaHeader = styled.div`
    text-align: center; border-bottom: 2px solid #ccc; padding-bottom: 1rem;
    display: flex; flex-direction: column; align-items: center;

    .logo {
        max-width: 120px; max-height: 80px; object-fit: contain; margin-bottom: 8px;
    }
    h2 { margin: 0; font-size: 1.5rem; color: #0b72b9; }
    p { margin: 0.25rem 0; font-size: 0.9rem; }
`;

const CompanyDetails = styled.div`
    font-size: 0.9rem; color: #555; border-bottom: 1px solid #eee; padding-bottom: 1rem;
    strong { color: #333; }
    @media (max-width: 768px) { font-size: 0.8rem; }
`;

const ClientDetails = styled.div`
    display: flex; justify-content: space-between; padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 4px; background-color: #f9f9f9; gap: 0.5rem; flex-wrap: wrap;
    @media (max-width: 768px) { flex-direction: column; padding: 0.5rem; gap: 0.25rem; }
`;

const ClientDetailItem = styled.div`
    flex: 1 1 45%; 
    p { margin: 3px 0; font-size: 0.9rem; } 
    span { font-weight: bold; color: #000; }
    @media (max-width: 768px) { flex-basis: 100%; p { font-size: 0.85rem; } }
`;

const ProformaTable = styled.table`
    width: 100%; border-collapse: collapse;
    th, td { padding: 8px 12px; text-align: left; font-size: 0.95rem; border-bottom: 1px dashed #eee; }
    th { background-color: #f7f7f7; font-weight: bold; color: #333; }
    .text-right { text-align: right; }
    @media (max-width: 768px) {
        th, td { padding: 6px 8px; font-size: 0.8rem; }
        th:nth-child(2), td:nth-child(2) { max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    }
`;

const FooterDetails = styled.div`
    display: flex; justify-content: space-between; align-items: flex-start; padding-top: 1rem; gap: 1rem; flex-wrap: wrap;
    @media (max-width: 768px) { flex-direction: column; }
`;

const TotalsArea = styled.div`
    width: 260px; max-width: 100%;
    ${TotalsRow} { padding: 4px 0; }
    ${TotalsRow}.grand-total { border-top: 2px solid #333; font-size: 1.1rem; }
`;

// --- CUSTOM ALERT COMPONENT ---
const AlertModal = ({ title, message, type = 'info', onClose }) => {
    const getColor = () => {
        if (type === 'error') return '#ef4444';
        if (type === 'success') return '#10b981';
        return '#3b82f6';
    };
    const getIcon = () => {
        if (type === 'error') return <FaTimesCircle size={40} color={getColor()} />;
        if (type === 'success') return <FaCheckCircle size={40} color={getColor()} />;
        return <FaExclamationTriangle size={40} color={getColor()} />;
    };

    return (
        <ModalOverlay style={{ zIndex: 2000 }}>
            <ModalContent style={{ maxWidth: '350px', textAlign: 'center', padding: '2rem' }}>
                <div style={{ marginBottom: '1rem' }}>{getIcon()}</div>
                <h3 style={{ color: '#1e293b', margin: '0 0 10px 0' }}>{title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 20px 0' }}>{message}</p>
                <Button onClick={onClose} style={{ width: '100%', padding: '12px' }}>Entendido</Button>
            </ModalContent>
        </ModalOverlay>
    );
};

/* =================================================================
 * COMPONENTE PRINCIPAL: ProformaEmpleadoModal
 * ================================================================= */
const ProformaEmpleadoModal = ({
    cart = [],
    total = 0,
    subtotal = 0,
    discount = 0,
    proformaFor = '',
    proformaNumber = '',
    onClose,
    setTicketData,
    currentUser,
    client
}) => {
    const [loadingPDF, setLoadingPDF] = React.useState(false);
    const proformaRef = useRef(null);

    // --- SEND TO CASHIER STATE ---
    const [isSending, setIsSending] = React.useState(false);
    const [showSessionSelector, setShowSessionSelector] = React.useState(false);
    const [activeSessions, setActiveSessions] = React.useState([]);
    const [ticketName, setTicketName] = React.useState('');
    const [selectedSessionId, setSelectedSessionId] = React.useState(null);

    // --- CUSTOM ALERT STATE ---
    const [alertState, setAlertState] = React.useState({ isOpen: false, title: '', message: '', type: 'info' });

    const showAlert = (title, message, type = 'info') => {
        setAlertState({ isOpen: true, title, message, type });
    };
    const closeAlert = () => {
        setAlertState(prev => ({ ...prev, isOpen: false }));
        // If success sending ticket (type is success), close main modal too and clear data
        if (alertState.type === 'success') {
            setTicketData(); // This clears the cart in parent
            onClose && onClose(); // This closes ProformaModal
        }
    };

    const fmt = (n) =>
        new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            .format(Number(n || 0));

    const getName = (u) =>
        u?.usuarioNombre || u?.nombre || 'Empleado';

    const userName = getName(currentUser);
    const clientName = client?.nombre || proformaFor || 'Consumidor Final';
    const clientPhone = client?.telefono || 'N/D';

    // Initial ticket name based on client
    React.useEffect(() => {
        setTicketName(`Pedido - ${clientName}`);
    }, [clientName]);

    /**
     * FUNCIÓN CLAVE: Genera el PDF real usando html2canvas y jsPDF
     */
    const handleDownloadPDF = async () => {
        // ... (Existing PDF logic remains unchanged, just copying it for context or ensuring it's preserved if using replace) ...
        if (cart.length === 0) return;

        setLoadingPDF(true);

        const input = proformaRef.current;
        const clientCleaned = proformaFor.replace(/\s/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
        const numberSuffix = proformaNumber.trim() ? `N${proformaNumber.trim()}` : `TEMP`;
        const filename = `PROFORMA_${clientCleaned}_${numberSuffix}.pdf`;

        const elementToCapture = input.cloneNode(true);
        elementToCapture.classList.add('proforma-to-print');
        document.body.appendChild(elementToCapture);

        try {
            const canvas = await html2canvas(elementToCapture, {
                scale: 2,
                useCORS: true,
                windowWidth: elementToCapture.offsetWidth,
                windowHeight: elementToCapture.offsetHeight,
            });

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = canvas.height * imgWidth / canvas.width;

            pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
            pdf.save(filename);

            setTicketData();

        } catch (error) {
            console.error("Error al generar PDF:", error);
            showAlert("Error", "❌ Error al generar y descargar el PDF.", "error");
        } finally {
            if (document.body.contains(elementToCapture)) {
                document.body.removeChild(elementToCapture);
            }
            setLoadingPDF(false);
            onClose && onClose();
        }
    };

    // --- LOGIC FOR SENDING TO CASHIER ---
    const handleStartSend = async () => {
        if (cart.length === 0) return;
        setIsSending(true);
        try {
            const response = await fetchActiveCajaSessions();
            const sessions = response?.abiertas || [];

            if (sessions.length === 0) {
                showAlert("Atención", "⚠️ No hay cajas abiertas en este momento. No se puede enviar el pedido.", "warning");
                setIsSending(false);
                return;
            }

            // Filter out purely system sessions if needed, or just show all
            setActiveSessions(sessions);

            // If only one session, pre-select it but still show dialog for name confirmation? 
            // User requested "que les pida solo el nombre del ticket", so let's show dialog always for name input.
            if (sessions.length > 0) {
                setSelectedSessionId(sessions[0].openedBy.id);
            }

            setShowSessionSelector(true);
            setIsSending(false);

        } catch (error) {
            console.error("Error fetching sessions:", error);
            showAlert("Error", "❌ Error al buscar cajas activas.", "error");
            setIsSending(false);
        }
    };

    const confirmSendToCashier = async () => {
        if (!selectedSessionId) return showAlert("Atención", "Seleccione una caja.", "warning");
        if (!ticketName.trim()) return showAlert("Atención", "Ingrese un nombre para el ticket.", "warning");

        setIsSending(true);
        try {
            // 1. Get current cart of target user
            const targetCart = await getCart(selectedSessionId) || [];

            // 2. Create new ticket object
            const newTicket = {
                id: Date.now(), // timestamp as ID
                name: ticketName,
                items: cart,
                createdAt: new Date().toISOString(),
                createdBy: userName
            };

            // 3. Append and Save
            // Ensure targetCart is array
            const validCart = Array.isArray(targetCart) ? targetCart : [];
            const updatedCart = [...validCart, newTicket];

            await saveCart(selectedSessionId, updatedCart);

            setShowSessionSelector(false); // Close selector first
            showAlert("Éxito", `✅ Ticket "${ticketName}" enviado exitosamente a la caja.`, "success");

            // Note: Data clearing happens in closeAlert now for better UX

        } catch (error) {
            console.error("Error sending ticket:", error);
            showAlert("Error", "❌ Error al enviar el ticket a la caja. Intente de nuevo.", "error");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <React.Fragment>
            <ModalOverlay style={{ zIndex: (showSessionSelector || alertState.isOpen) ? 1099 : 1100 }}>
                <ModalContent>
                    {/* Asignar la referencia al wrapper que queremos capturar */}
                    <ProformaWrapper ref={proformaRef}>
                        {/* ... (Existing Proforma Content: Header, Details, Tables, etc.) ... */}
                        <ProformaHeader>
                            <img src={COMPANY.LOGO_URL} alt="Logo del Negocio" className="logo" />
                            <FaFileInvoice size={32} style={{ color: '#0b72b9', marginBottom: 8 }} />
                            <h2>PROFORMA {proformaNumber && `N° ${proformaNumber}`}</h2>
                            <p>Documento No Válido como Factura Fiscal</p>
                        </ProformaHeader>

                        <CompanyDetails>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>{COMPANY.NAME} - {COMPANY.SLOGAN}</p>
                            <p style={{ margin: '3px 0' }}>{COMPANY.ADDRESS}</p>
                            <p style={{ margin: 0 }}>Teléfonos: {COMPANY.PHONE} &nbsp;|&nbsp; RUC: {COMPANY.RUC}</p>
                        </CompanyDetails>

                        <ClientDetails>
                            <ClientDetailItem>
                                <p>Emitida a: <span>{proformaFor || 'Consumidor Final'}</span></p>
                                <p>Por: <span>{userName}</span></p>
                            </ClientDetailItem>
                            <ClientDetailItem>
                                <p>Teléfono: <span>{clientPhone}</span></p>
                                <p>Fecha: <span>{new Date().toLocaleDateString('es-NI')}</span></p>
                            </ClientDetailItem>
                        </ClientDetails>

                        <ProformaTable>
                            <thead>
                                <tr>
                                    <th style={{ width: '10%' }}>CANT.</th>
                                    <th style={{ width: '45%' }}>DESCRIPCIÓN</th>
                                    <th className="text-right" style={{ width: '25%' }}>PRECIO UNIT.</th>
                                    <th className="text-right" style={{ width: '20%' }}>TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.length === 0 ? (
                                    <tr><td colSpan="4" style={{ textAlign: 'center', color: '#777' }}>No hay artículos.</td></tr>
                                ) : cart.map((item, idx) => {
                                    const unit = parseFloat(item.precio_venta ?? item.precio ?? 0);
                                    const qty = parseFloat(item.quantity ?? 0);
                                    return (
                                        <tr key={idx}>
                                            <td>{qty}</td>
                                            <td>{item.nombre || 'Artículo sin nombre'}</td>
                                            <td className="text-right">C${fmt(unit)}</td>
                                            <td className="text-right">C${fmt(qty * unit)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </ProformaTable>

                        <FooterDetails>
                            <div>
                                <p style={{ fontWeight: 'bold' }}>Nota:</p>
                                <p style={{ fontSize: '0.85rem' }}>{COMPANY.SLOGAN}</p>
                                <p style={{ fontSize: '0.85rem' }}>Precios sujetos a cambios y stock.</p>
                            </div>
                            <TotalsArea>
                                <TotalsRow><span>Subtotal:</span><span className="text-right">C${fmt(subtotal)}</span></TotalsRow>
                                {discount > 0 && <TotalsRow><span>Descuento:</span><span className="text-right">- C${fmt(discount)}</span></TotalsRow>}
                                <TotalsRow $bold className="grand-total"><span>TOTAL:</span><span className="text-right">C${fmt(total)}</span></TotalsRow>
                            </TotalsArea>
                        </FooterDetails>

                        {/* Sección de botones */}
                        <div className="footer-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                            <Button $cancel onClick={onClose} style={{ flex: 1 }} disabled={loadingPDF || isSending}>
                                <FaWindowClose /> Cerrar
                            </Button>
                            <Button
                                onClick={handleStartSend}
                                disabled={cart.length === 0 || loadingPDF || isSending}
                                style={{ flex: 1, background: '#f59e0b' }} // Ambar for "Send"
                            >
                                {isSending ? <FaSpinnerAnimated /> : <FaFileInvoice />}
                                ENVIAR A CAJA
                            </Button>
                            <Button
                                onClick={handleDownloadPDF}
                                disabled={cart.length === 0 || loadingPDF || isSending}
                                style={{ flex: 1, background: '#059669' }}
                            >
                                {loadingPDF ? <FaSpinnerAnimated /> : <FaDownload />}
                                PDF
                            </Button>
                        </div>

                    </ProformaWrapper>
                </ModalContent>
            </ModalOverlay>

            {/* --- SESSION SELECTION MODAL --- */}
            {showSessionSelector && (
                <ModalOverlay style={{ zIndex: 1200 }}>
                    <ModalContent style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <h3 style={{ color: '#0f172a', marginBottom: '1rem' }}>Enviar Pedido a Caja</h3>

                        <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Nombre del Ticket:</label>
                            <input
                                type="text"
                                value={ticketName}
                                onChange={(e) => setTicketName(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                            />
                        </div>

                        <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Seleccionar Caja:</label>
                            <select
                                value={selectedSessionId || ''}
                                onChange={(e) => setSelectedSessionId(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                            >
                                {activeSessions.map(s => (
                                    <option key={s.openedBy.id} value={s.openedBy.id}>
                                        {s.openedBy.name} - (Abierta: {new Date(s.openedAt).toLocaleTimeString()})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button $cancel onClick={() => setShowSessionSelector(false)} style={{ flex: 1 }}>Cancelar</Button>
                            <Button onClick={confirmSendToCashier} disabled={isSending} style={{ flex: 1 }}>
                                {isSending ? <FaSpinnerAnimated /> : 'Enviar Ticket'}
                            </Button>
                        </div>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* --- CUSTOM ALERT MODAL --- */}
            {alertState.isOpen && (
                <AlertModal
                    title={alertState.title}
                    message={alertState.message}
                    type={alertState.type}
                    onClose={closeAlert}
                />
            )}
        </React.Fragment>
    );
};

export default ProformaEmpleadoModal;