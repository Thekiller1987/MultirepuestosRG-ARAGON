import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { ModalOverlay, ModalContent, Button, SearchInput, TotalsRow } from '../POS.styles.jsx';
import { FaUserSecret, FaMask, FaMagic } from 'react-icons/fa';

const AdjustRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  
  label { font-weight: bold; color: #495057; }
  input { width: 120px; text-align: right; }
`;

const SecretAdjustModal = ({ isOpen, onClose, currentStats, onConfirm }) => {
    const [mode, setMode] = useState('manual'); // 'manual' | 'override'
    const [adjustments, setAdjustments] = useState({
        efectivo: '',
        credito: '',
        tarjeta: '',
        dolares: '' // For manual dollar adjustment if needed
    });

    // Override Mode States
    const [override, setOverride] = useState({
        cordobas: '',
        dolares: ''
    });

    const handleChange = (field, val) => {
        setAdjustments(prev => ({ ...prev, [field]: val }));
    };

    const handleOverrideChange = (field, val) => {
        setOverride(prev => ({ ...prev, [field]: val }));
    };

    const handleSave = () => {
        const activeAdjustments = [];

        if (mode === 'manual') {
            if (parseFloat(adjustments.efectivo)) activeAdjustments.push({ target: 'efectivo', amount: parseFloat(adjustments.efectivo) });
            if (parseFloat(adjustments.credito)) activeAdjustments.push({ target: 'credito', amount: parseFloat(adjustments.credito) });
            if (parseFloat(adjustments.tarjeta)) activeAdjustments.push({ target: 'tarjeta', amount: parseFloat(adjustments.tarjeta) });
            // Manual adjustment for dollars not requested but easy to add if needed.
        } else {
            // OVERRIDE MODE (Magic Fix)
            const targetC = parseFloat(override.cordobas);
            const targetD = parseFloat(override.dolares);

            if (!isNaN(targetC)) {
                // Diff = Target - Current => If I have 100, want 500, I need +400.
                const currentC = Number(currentStats?.netCordobas || 0);
                const diffC = targetC - currentC;
                if (Math.abs(diffC) > 0.01) {
                    activeAdjustments.push({ target: 'efectivo', amount: diffC });
                }
            }

            if (!isNaN(targetD)) {
                const currentD = Number(currentStats?.netDolares || 0);
                const diffD = targetD - currentD;
                if (Math.abs(diffD) > 0.01) {
                    activeAdjustments.push({ target: 'dolares', amount: diffD });
                }
            }
        }

        if (activeAdjustments.length > 0) {
            onConfirm(activeAdjustments);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <ModalOverlay style={{ background: 'rgba(0,0,0,0.95)', zIndex: 9999 }}>
            <ModalContent style={{ maxWidth: '450px', background: '#212529', color: '#fff', border: '1px solid #495057' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ margin: 0, color: '#ffc107', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FaUserSecret /> GOD MODE
                    </h2>
                    <Button $cancel onClick={onClose} style={{ background: 'transparent', color: '#6c757d', border: 'none' }}>✕</Button>
                </div>

                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                    <Button
                        onClick={() => setMode('manual')}
                        style={{ flex: 1, background: mode === 'manual' ? '#ffc107' : '#343a40', color: mode === 'manual' ? '#000' : '#fff', border: 'none' }}
                    >
                        Ajuste Manual (+/-)
                    </Button>
                    <Button
                        onClick={() => setMode('override')}
                        style={{ flex: 1, background: mode === 'override' ? '#ffc107' : '#343a40', color: mode === 'override' ? '#000' : '#fff', border: 'none' }}
                    >
                        Fijar Monto (=)
                    </Button>
                </div>

                {mode === 'manual' ? (
                    <>
                        <p style={{ color: '#adb5bd', fontSize: '0.85rem', marginBottom: 15 }}>
                            Suma o resta cantidades a los contadores ocultamente.
                        </p>
                        <AdjustRow style={{ background: '#343a40' }}>
                            <label style={{ color: '#fff' }}>Efectivo (C$)</label>
                            <SearchInput type="number" step="0.01" placeholder="+/- 0.00" value={adjustments.efectivo} onChange={e => handleChange('efectivo', e.target.value)} style={{ background: '#495057', color: '#fff' }} />
                        </AdjustRow>
                        <AdjustRow style={{ background: '#343a40' }}>
                            <label style={{ color: '#fff' }}>Crédito</label>
                            <SearchInput type="number" step="0.01" placeholder="+/- 0.00" value={adjustments.credito} onChange={e => handleChange('credito', e.target.value)} style={{ background: '#495057', color: '#fff' }} />
                        </AdjustRow>
                        <AdjustRow style={{ background: '#343a40' }}>
                            <label style={{ color: '#fff' }}>Tarjeta</label>
                            <SearchInput type="number" step="0.01" placeholder="+/- 0.00" value={adjustments.tarjeta} onChange={e => handleChange('tarjeta', e.target.value)} style={{ background: '#495057', color: '#fff' }} />
                        </AdjustRow>
                    </>
                ) : (
                    <>
                        <p style={{ color: '#adb5bd', fontSize: '0.85rem', marginBottom: 15 }}>
                            Define EXACTAMENTE cuánto dinero físico hay. El sistema creará un ajuste mágico para cuadrar.
                        </p>
                        <div style={{ background: '#343a40', padding: 10, borderRadius: 6, marginBottom: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#aaa', marginBottom: 5 }}>
                                <span>Sistema Actual:</span>
                                <span>C$ {Number(currentStats?.netCordobas || 0).toFixed(2)}</span>
                            </div>
                            <AdjustRow style={{ background: 'transparent', padding: 0, marginBottom: 0 }}>
                                <label style={{ color: '#fff' }}>Real en Caja (C$)</label>
                                <SearchInput type="number" step="0.01" placeholder="0.00" value={override.cordobas} onChange={e => handleOverrideChange('cordobas', e.target.value)} style={{ background: '#495057', color: '#fff', border: '1px solid #ffc107' }} />
                            </AdjustRow>
                        </div>

                        <div style={{ background: '#343a40', padding: 10, borderRadius: 6 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#aaa', marginBottom: 5 }}>
                                <span>Sistema Actual:</span>
                                <span>$ {Number(currentStats?.netDolares || 0).toFixed(2)}</span>
                            </div>
                            <AdjustRow style={{ background: 'transparent', padding: 0, marginBottom: 0 }}>
                                <label style={{ color: '#fff' }}>Real en Caja ($)</label>
                                <SearchInput type="number" step="0.01" placeholder="0.00" value={override.dolares} onChange={e => handleOverrideChange('dolares', e.target.value)} style={{ background: '#495057', color: '#fff', border: '1px solid #ffc107' }} />
                            </AdjustRow>
                        </div>
                    </>
                )}

                <div style={{ marginTop: 25, display: 'flex', gap: 10 }}>
                    <Button onClick={onClose} style={{ flex: 1, background: '#495057', border: 'none' }}>Cancelar</Button>
                    <Button onClick={handleSave} style={{ flex: 1, background: '#ffc107', color: '#000', fontWeight: 'bold', border: 'none' }}>
                        <FaMagic style={{ marginRight: 6 }} /> {mode === 'manual' ? 'APLICAR AJUSTE' : 'CUADRAR MÁGICAMENTE'}
                    </Button>
                </div>

            </ModalContent>
        </ModalOverlay>
    );
};

export default SecretAdjustModal;
