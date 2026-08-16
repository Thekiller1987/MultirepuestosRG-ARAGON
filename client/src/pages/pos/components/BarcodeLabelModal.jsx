import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPrint, FaBarcode } from 'react-icons/fa';
import Barcode from 'react-barcode';
import { useSettings } from '../../../context/SettingsContext';

const ModalOverlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
  background: rgba(15, 23, 42, 0.6); z-index: 999; 
  display: flex; align-items: center; justify-content: center; padding: 1rem;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white; width: 100%; max-width: 450px; 
  border-radius: 20px; padding: 2rem; 
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex; flex-direction: column; gap: 1.5rem;
`;

const ModalTitle = styled.h2` 
  margin: 0; color: #1e293b; font-size: 1.5rem; display: flex; align-items: center; gap: 10px; 
  border-bottom: 2px solid #f1f5f9; padding-bottom: 1rem;
`;

const FormGroup = styled.div` display: flex; flex-direction: column; gap: 6px; `;
const Label = styled.label` font-size: 0.95rem; font-weight: 600; color: #475569; `;

const ButtonRow = styled.div` display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; `;
const CancelButton = styled.button`
  background: #f1f5f9; color: #475569; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s;
  &:hover { background: #e2e8f0; color: #1e293b; }
`;
const PrintButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; padding: 10px 24px; border-radius: 10px; font-weight: 600; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s;
  &:hover { opacity: 0.95; transform: translateY(-1px); box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }
`;

const PreviewBox = styled.div`
  background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 1rem;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px;
  overflow: hidden;
`;

const BarcodeLabelModal = ({ isOpen, onClose, product, settings: propSettings }) => {
  const { settings: contextSettings } = useSettings() || {};
  const settings = propSettings || contextSettings || {};
  const barcodeRef = useRef(null);

  if (!isOpen || !product) return null;

  const barcodeValue = product.codigo && String(product.codigo).trim().length > 0 ? String(product.codigo).trim() : '0000000';
  const companyName = settings?.empresa_nombre || 'MultirepuestosRG ARAGÓN';
  const logoUrl = settings?.empresa_logo_url || '/icons/logo.png';

  // Format price
  const fmt = (val) => Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handlePrint = () => {
    // Extraer la imagen del código de barras desde el canvas
    let barcodeImgSrc = '';
    if (barcodeRef.current) {
      const canvasElement = barcodeRef.current.querySelector('canvas');
      if (canvasElement) {
        barcodeImgSrc = canvasElement.toDataURL('image/png');
      } else {
        // Fallback a svg si hubiera
        const svgElement = barcodeRef.current.querySelector('svg');
        if (svgElement) {
          const svgData = new XMLSerializer().serializeToString(svgElement);
          barcodeImgSrc = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;
        }
      }
    }

    const priceText = `C$${fmt(product.venta)}`;
    const shortName = product.nombre || '';

    // Estilos de impresión con dimensiones exactas 53mm x 25mm en orientación apaisada
    const printStyles = `
      @charset "UTF-8";
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
      
      @page { 
        size: 53mm 25mm landscape; 
        margin: 0 !important; 
      }
      
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      html, body { 
        margin: 0 !important; 
        padding: 0 !important; 
        width: 53mm; 
        height: 25mm; 
        max-width: 53mm;
        max-height: 25mm;
        background: #fff; 
        color: #000; 
        font-family: 'Inter', Arial, sans-serif;
        overflow: hidden;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .label-container {
        width: 53mm; 
        height: 25mm; 
        display: flex; 
        flex-direction: column; 
        justify-content: space-between;
        padding: 1mm 2mm;
        box-sizing: border-box;
        overflow: hidden;
        page-break-inside: avoid;
        page-break-after: avoid;
      }

      .l-header { 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        gap: 1.5mm; 
        height: 3.5mm;
      }
      .l-logo { 
        height: 3.5mm; 
        max-width: 9mm; 
        object-fit: contain; 
        filter: grayscale(100%) brightness(0%); 
      }
      .l-company { 
        font-size: 5.5pt; 
        font-weight: 800; 
        white-space: nowrap; 
        overflow: hidden; 
        text-overflow: ellipsis; 
        max-width: 38mm; 
        text-transform: uppercase;
      }

      .l-name { 
        font-size: 5.5pt; 
        font-weight: 700; 
        width: 100%; 
        white-space: nowrap; 
        overflow: hidden; 
        text-overflow: ellipsis; 
        text-align: center; 
        line-height: 1.1;
      }
      
      .l-barcode-cont { 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center; 
        width: 100%; 
      }
      
      .l-barcode-img { 
        display: block;
        width: auto;
        max-width: 48mm;
        height: 10mm;
        object-fit: contain;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
        image-rendering: pixelated;
      }
      
      .l-bottom-row { 
        display: flex; 
        justify-content: space-between;
        align-items: center; 
        width: 100%; 
        padding: 0 1mm;
        margin-top: 0.2mm;
      }
      .l-barcode-val { 
        font-size: 6.5pt; 
        font-weight: 700; 
        letter-spacing: 0.5px;
        line-height: 1; 
      }
      .l-price { 
        font-size: 7.5pt; 
        font-weight: 900; 
        line-height: 1; 
      }
    `;

    const labelsHtml = `
      <div class="label-container">
        <div class="l-header">
           ${logoUrl ? `<img src="${logoUrl}" class="l-logo" alt="" />` : ''}
           <span class="l-company">${companyName}</span>
        </div>
        <div class="l-name">${shortName}</div>
        <div class="l-barcode-cont">
          ${barcodeImgSrc ? `<img src="${barcodeImgSrc}" class="l-barcode-img" alt="barcode" />` : ''}
        </div>
        <div class="l-bottom-row">
          <span class="l-barcode-val">${barcodeValue}</span>
          <span class="l-price">${priceText}</span>
        </div>
      </div>
    `;

    const w = window.open('', '_blank', 'width=500,height=300');
    if (!w) {
      alert("El navegador bloqueó la ventana emergente.");
      return;
    }

    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Etiqueta_${barcodeValue}</title><style>${printStyles}</style></head><body>${labelsHtml}</body></html>`);
    w.document.close();
    w.focus();

    setTimeout(() => {
      w.print();
    }, 400);

    onClose();
  };

  return (
    <AnimatePresence>
      <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle><FaBarcode style={{ color: '#10b981' }} /> Imprimir Etiqueta Térmica</ModalTitle>

            <FormGroup>
              <Label>Vista Previa de Generación</Label>
              <PreviewBox>
                <div style={{ fontSize: '0.8rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {logoUrl && <img src={logoUrl} alt="logo" style={{ height: '22px', filter: 'grayscale(100%)' }} />}
                  {companyName}
                </div>
                <div style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{product.nombre}</div>
                {/* Generador de código de barras usando Canvas para máxima nitidez */}
                <div ref={barcodeRef} style={{ background: '#fff', padding: '4px', borderRadius: '4px' }}>
                  <Barcode 
                    value={barcodeValue} 
                    format="CODE128" 
                    renderer="canvas" 
                    width={1.6} 
                    height={40} 
                    displayValue={false} 
                    margin={0} 
                    background="#ffffff" 
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 10px', fontSize: '0.9rem', fontWeight: '700' }}>
                  <span>{barcodeValue}</span>
                  <span style={{ color: '#059669' }}>C${fmt(product.venta)}</span>
                </div>
              </PreviewBox>
            </FormGroup>

            <div style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              ℹ️ Tamaño optimizado: <strong>53mm x 25mm</strong> (Horizontal / Landscape).
            </div>

            <ButtonRow>
              <CancelButton onClick={onClose}>Cancelar</CancelButton>
              <PrintButton onClick={handlePrint}><FaPrint /> Imprimir Etiquetas</PrintButton>
            </ButtonRow>
          </ModalContent>
        </motion.div>
      </ModalOverlay>
    </AnimatePresence>
  );
};

export default BarcodeLabelModal;
