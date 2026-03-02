import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPrint, FaTimes, FaBarcode } from 'react-icons/fa';
import Barcode from 'react-barcode';

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
const Input = styled.input`
  padding: 12px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 1.1rem; color: #1e293b; text-align: center;
  &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
`;

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

const BarcodeLabelModal = ({ isOpen, onClose, product, settings }) => {
  const barcodeRef = useRef(null);

  if (!isOpen || !product) return null;

  const barcodeValue = product.codigo && String(product.codigo).trim().length > 0 ? String(product.codigo).trim() : '0000000';
  const companyName = settings?.empresa_nombre || 'MultirepuestosRG ARAGÓN';
  const logoUrl = settings?.empresa_logo_url || '/icons/logo.png';

  // Format price
  const fmt = (val) => Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handlePrint = () => {
    // Extract the SVG element from our hidden barcode component
    let svgHtml = '';
    if (barcodeRef.current) {
      // Encontrar el SVG generado por react-barcode
      const svgElement = barcodeRef.current.querySelector('svg');
      if (svgElement) {
        svgHtml = svgElement.outerHTML;
      }
    }

    // Configuramos medida fija según medidas físicas exactas: 53.09mm ancho y 25.15mm alto.
    const printStyles = `
      @charset "UTF-8";
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
      
      @page { size: 53.09mm 25.15mm; margin: 0; }
      html, body { 
        margin: 0 !important; padding: 0 !important; 
        width: 53.09mm; height: 25.15mm; 
        background: #fff; color: #000; 
        font-family: 'Inter', sans-serif;
        overflow: hidden;
      }
      
      .label-container {
        width: 53.09mm; height: 25.15mm; 
        display: flex; flex-direction: column; align-items: stretch; justify-content: space-between;
        box-sizing: border-box;
        padding: 1.5mm 2mm;
        overflow: hidden;
        page-break-inside: avoid;
      }

      .l-header { display: flex; align-items: center; justify-content: center; gap: 1mm; }
      .l-logo { height: 3.5mm; max-width: 10mm; object-fit: contain; filter: grayscale(100%); }
      .l-company { font-size: 5.5pt; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 40mm; }

      .l-name { font-size: 6pt; font-weight: 600; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; margin-top: 0.5mm; }
      
      .l-barcode-cont { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; overflow: hidden; margin-top: 1mm; }
      .l-barcode { display: flex; justify-content: center; height: 11mm; align-items: center; width: 100%; }
      .l-barcode svg { width: auto !important; height: 100% !important; max-width: 48mm; } 
      
      .l-bottom-row { 
         display: grid; 
         grid-template-columns: 1fr auto 1fr; 
         width: 100%; 
         align-items: center;
         margin-top: 1mm;
      }
      .l-barcode-val { grid-column: 2; font-size: 6pt; font-weight: 700; text-align: center; line-height: 1; }
      .l-price { grid-column: 3; font-size: 7.5pt; font-weight: 900; text-align: right; padding-right: 1mm; line-height: 1; }
    `;

    // Generar una única etiqueta
    const priceText = `C$${fmt(product.venta)}`;
    const shortName = product.nombre || '';

    const labelsHtml = `
      <div class="label-container">
        <div class="l-header">
           <img src="${logoUrl}" class="l-logo" alt="logo" />
           <span class="l-company">${companyName}</span>
        </div>
        <div class="l-name">${shortName}</div>
        <div class="l-barcode-cont">
          <div class="l-barcode">${svgHtml}</div>
          <div class="l-bottom-row">
            <span class="l-barcode-val">${product.codigo_barra || ''}</span>
            <span class="l-price">${priceText}</span>
          </div>
        </div>
      </div>
    `;

    const w = window.open('', '_blank', 'width=400,height=400');
    if (!w) {
      alert("El navegador bloqueó la ventana emergente.");
      return;
    }

    w.document.write(`<html><head><title>Etiqueta_${barcodeValue}</title><style>${printStyles}</style></head><body>${labelsHtml}</body></html>`);
    w.document.close();
    w.focus();

    // Mantenemos el cuadro de Chrome abierto para poder elegir la impresora correcta
    setTimeout(() => {
      w.print();
    }, 500);

    onClose(); // Cierra el modal reactivo verde, pero deja el cuadro de Chrome activo
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
                  <img src={logoUrl} alt="logo" style={{ height: '22px', filter: 'grayscale(100%)' }} />
                  {companyName}
                </div>
                <div style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{product.nombre}</div>
                {/* Oculto, pero en el DOM para extraer el SVG */}
                <div ref={barcodeRef}>
                  <Barcode value={barcodeValue} format="CODE128" width={2} height={40} displayValue={true} fontSize={14} background="transparent" margin={0} />
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: '900', marginTop: '2px' }}>C${fmt(product.venta)}</div>
              </PreviewBox>
            </FormGroup>

            <div style={{ fontSize: '0.9rem', color: '#64748b', textAlign: 'center', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
              La cantidad de copias se selecciona directamente en la ventana de impresión que se abrirá a continuación.
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
