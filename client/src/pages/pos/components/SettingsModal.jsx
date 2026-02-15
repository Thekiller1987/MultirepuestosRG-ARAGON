import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSave, FaWindowClose, FaBuilding, FaFileInvoice, FaCog } from 'react-icons/fa';
import { useSettings } from '../../../context/SettingsContext';
import { useAuthToken } from '../../../context/AuthContext'; // Helper if exists, or useAuth
import { toast } from 'react-hot-toast';
import * as settingsApi from '../../../service/settingsApi';

// --- STYLES ---
const ModalOverlay = styled.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
    animation: fadeIn 0.2s ease-out;
`;

const ModalContent = styled.div`
    background: white;
    width: 90%; max-width: 800px;
    max-height: 90vh; overflow-y: auto;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    display: flex; flex-direction: column;
`;

const Header = styled.div`
    padding: 1.25rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex; justify-content: space-between; align-items: center;
    h2 { margin: 0; font-size: 1.25rem; color: #1e293b; display: flex; align-items: center; gap: 10px; }
`;

const Content = styled.div`padding: 1.5rem;`;

const Tabs = styled.div`
    display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid #e2e8f0;
`;

const Tab = styled.button`
    padding: 0.75rem 1rem;
    background: none; border: none;
    border-bottom: 3px solid ${props => props.active ? '#007bff' : 'transparent'};
    color: ${props => props.active ? '#007bff' : '#64748b'};
    font-weight: 600; cursor: pointer;
    display: flex; align-items: center; gap: 8px;
    &:hover { color: #007bff; }
`;

const FormGroup = styled.div`
    margin-bottom: 1.2rem;
    label { display: block; margin-bottom: 0.4rem; font-weight: 500; color: #334155; }
    input, textarea {
        width: 100%; padding: 0.75rem;
        border: 1px solid #cbd5e1; border-radius: 6px;
        font-family: inherit; font-size: 0.95rem;
        transition: border-color 0.2s;
        &:focus { outline: none; border-color: #007bff; box-shadow: 0 0 0 3px rgba(0,123,255,0.1); }
    }
    textarea { min-height: 80px; resize: vertical; }
    small { display: block; margin-top: 0.25rem; color: #64748b; font-size: 0.85rem; }
`;

const ButtonGroup = styled.div`
    padding: 1.25rem; border-top: 1px solid #e2e8f0;
    display: flex; justify-content: flex-end; gap: 1rem;
    background: #f8fafc; border-radius: 0 0 12px 12px;
`;

const Button = styled.button`
    padding: 0.75rem 1.5rem;
    border-radius: 8px; border: none; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; gap: 0.5rem;
    background: ${props => props.primary ? '#007bff' : '#e2e8f0'};
    color: ${props => props.primary ? 'white' : '#475569'};
    &:hover { filter: brightness(0.95); }
    &:disabled { opacity: 0.7; cursor: not-allowed; }
`;

const SettingsModal = ({ isOpen, onClose }) => {
    const { settings, refreshSettings } = useSettings();
    const token = localStorage.getItem('token'); // Simplest way if useAuthToken not exported or complex

    const [formData, setFormData] = useState({
        empresa_nombre: '', empresa_ruc: '', empresa_telefono: '',
        empresa_direccion: '', empresa_eslogan: '', empresa_logo_url: '',
        ticket_sales_footer: '', ticket_proforma_footer: '', ticket_transfer_footer: ''
    });

    const [activeTab, setActiveTab] = useState('general'); // general | tickets
    const [saving, setSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [logoPreview, setLogoPreview] = useState(null);

    // Sync from settings context when opening
    useEffect(() => {
        if (isOpen && settings) {
            setFormData(prev => ({
                ...prev,
                ...settings
            }));
            // If settings contains a logo URL, set it
            if (settings.empresa_logo_url) {
                setLogoPreview(settings.empresa_logo_url);
            }
        }
    }, [isOpen, settings]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await settingsApi.updateSettings(token, formData);
            await refreshSettings();
            toast.success('Configuración actualizada correctamente');
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Error al guardar configuración');
        } finally {
            setSaving(false);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingLogo(true);
        try {
            const logoUrl = await settingsApi.uploadLogo(token, file);
            setLogoPreview(logoUrl);
            setFormData(prev => ({ ...prev, empresa_logo_url: logoUrl }));
            toast.success('Logo subido correctamente');
        } catch (error) {
            console.error(error);
            toast.error('Error al subir el logo');
        } finally {
            setUploadingLogo(false);
        }
    };

    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <Header>
                    <h2><FaCog /> Configuración del Sistema</h2>
                    <Button onClick={onClose} style={{ padding: '0.4rem' }}><FaWindowClose size={20} /></Button>
                </Header>

                <Content>
                    <Tabs>
                        <Tab active={activeTab === 'general'} onClick={() => setActiveTab('general')}>
                            <FaBuilding /> Datos Empresa
                        </Tab>
                        <Tab active={activeTab === 'tickets'} onClick={() => setActiveTab('tickets')}>
                            <FaFileInvoice /> Personalización Tickets
                        </Tab>
                    </Tabs>

                    {activeTab === 'general' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <FormGroup style={{ gridColumn: 'span 2' }}>
                                <label>Nombre de la Empresa</label>
                                <input name="empresa_nombre" value={formData.empresa_nombre || ''} onChange={handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <label>RUC/Identificación</label>
                                <input name="empresa_ruc" value={formData.empresa_ruc || ''} onChange={handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <label>Teléfono(s)</label>
                                <input name="empresa_telefono" value={formData.empresa_telefono || ''} onChange={handleChange} />
                            </FormGroup>
                            <FormGroup style={{ gridColumn: 'span 2' }}>
                                <label>Dirección</label>
                                <textarea name="empresa_direccion" value={formData.empresa_direccion || ''} onChange={handleChange} />
                            </FormGroup>
                            <FormGroup style={{ gridColumn: 'span 2' }}>
                                <label>Eslogan / Frase</label>
                                <input name="empresa_eslogan" value={formData.empresa_eslogan || ''} onChange={handleChange} />
                            </FormGroup>

                            <FormGroup style={{ gridColumn: 'span 2' }}>
                                <label>Logo del Negocio (Aparecerá en Tickets)</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{
                                        width: '100px', height: '100px', border: '1px dashed #cbd5e1',
                                        borderRadius: '12px', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', background: '#f8fafc', overflow: 'hidden'
                                    }}>
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <small style={{ color: '#94a3b8' }}>Sin Logo</small>
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            id="logo-upload"
                                            style={{ display: 'none' }}
                                        />
                                        <label
                                            htmlFor="logo-upload"
                                            style={{
                                                display: 'inline-block', padding: '8px 16px', background: '#f1f5f9',
                                                border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer',
                                                fontWeight: '600', fontSize: '0.9rem'
                                            }}
                                        >
                                            {uploadingLogo ? 'Subiendo...' : 'Seleccionar Imagen'}
                                        </label>
                                        <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                                            Recomendado: PNG fondo transparente (aprox 200x200px)
                                        </p>
                                    </div>
                                </div>
                            </FormGroup>
                        </div>
                    )}

                    {activeTab === 'tickets' && (
                        <div>
                            <p style={{ marginBottom: '1rem', color: '#64748b' }}>
                                Personaliza los mensajes que aparecen al final de tus documentos impresos.
                            </p>

                            <FormGroup>
                                <label>Pie de Página: Factura de Venta</label>
                                <textarea
                                    name="ticket_sales_footer"
                                    value={formData.ticket_sales_footer || ''}
                                    onChange={handleChange}
                                    placeholder="Ej: Gracias por su compra. No se aceptan devoluciones después de 30 días."
                                />
                                <small>Avisos legales, agradecimientos o políticas de devolución.</small>
                            </FormGroup>

                            <FormGroup>
                                <label>Pie de Página: Proforma</label>
                                <textarea
                                    name="ticket_proforma_footer"
                                    value={formData.ticket_proforma_footer || ''}
                                    onChange={handleChange}
                                    placeholder="Ej: Cotización válida por 15 días. Sujeta a disponibilidad."
                                />
                                <small>Condiciones de validez de la oferta.</small>
                            </FormGroup>

                            <FormGroup>
                                <label>Pie de Página: Traslado / Salida</label>
                                <textarea
                                    name="ticket_transfer_footer"
                                    value={formData.ticket_transfer_footer || ''}
                                    onChange={handleChange}
                                    placeholder="Ej: Salida autorizada por Gerencia."
                                />
                                <small>Notas internas o firmas requeridas.</small>
                            </FormGroup>
                        </div>
                    )}
                </Content>

                <ButtonGroup>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button primary onClick={handleSave} disabled={saving}>
                        <FaSave /> {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </ButtonGroup>
            </ModalContent>
        </ModalOverlay>
    );
};

export default SettingsModal;
