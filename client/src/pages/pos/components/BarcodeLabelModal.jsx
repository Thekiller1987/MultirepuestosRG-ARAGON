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
  const [quantity, setQuantity] = useState(1);
  const barcodeRef = useRef(null);

  if (!isOpen || !product) return null;

  const barcodeValue = product.codigo && String(product.codigo).trim().length > 0 ? String(product.codigo).trim() : '0000000';
  const companyName = settings?.empresa_nombre || 'MultirepuestosRG ARAGÓN';
  const logoUrl = settings?.empresa_logo_url || '/icons/logo.png';

  // Format price
  const fmt = (val) => Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handlePrint = () => {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) return alert("Por favor ingresa una cantidad válida mayor a 0.");

    // Extract the SVG element from our hidden barcode component
    let svgHtml = '';
    if (barcodeRef.current) {
      // Encontrar el SVG generado por react-barcode
      const svgElement = barcodeRef.current.querySelector('svg');
      if (svgElement) {
        svgHtml = svgElement.outerHTML;
      }
    }

    // Configuración CSS adaptada a etiquetas térmicas pequeñas ~50x25mm
    const printStyles = `
      @charset "UTF-8";
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
      
      @page { size: 101.6mm 152.4mm; margin: 0mm; }
      html, body { 
        margin: 0 !important; padding: 0 !important; 
        width: 100%; height: 100%; 
        background: #fff; color: #000; 
        font-family: 'Inter', sans-serif;
        overflow: hidden;
        -webkit-print-color-adjust: exact !important; 
        print-color-adjust: exact !important;
      }
      
      .label-container {
        width: 101.6mm; height: 150mm; /* strictly less than 152.4mm to avoid spilling */
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        box-sizing: border-box;
        padding: 5mm;
        page-break-after: always;
        overflow: hidden;
      }

      /* Ultimo elemento no necesita salto de pagina */
      .label-container:last-child {
        page-break-after: auto;
      }

      .l-brand { display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 5mm; font-size: 5mm; font-weight: 900; text-transform: uppercase; margin-bottom: 5mm; text-align: center; line-height: 1.2; letter-spacing: 0.5mm; width: 100%; }
      .l-brand img { height: 45mm; width: auto; filter: grayscale(100%) contrast(200%); }
      .l-name { font-size: 8mm; font-weight: 700; text-align: center; margin-bottom: 5mm; line-height: 1.2; width: 100%; white-space: normal; }
      .l-barcode { margin: 0; padding: 0; display: flex; justify-content: center; width: 100%; }
      .l-barcode svg { width: 90mm; height: 30mm; margin-bottom: 5mm;} 
      .l-price { font-size: 15mm; font-weight: 900; text-align: center; line-height: 1; margin: 0; letter-spacing: -0.5mm;}
    `;

    // Generar N contenedores de etiqueta
    let labelsHtml = '';
    const priceText = `C$${fmt(product.venta)}`;
    // Truncate name safely para etiquetas
    const shortName = product.nombre || '';

    for (let i = 0; i < qty; i++) {
      labelsHtml += `
        <div class="label-container">
            <div class="l-brand">
              <img src="${logoUrl}" alt="logo"/>
              <span>${companyName}</span>
            </div>
            <div class="l-name">${shortName}</div>
            <div class="l-barcode">${svgHtml}</div>
            <div class="l-price">${priceText}</div>
        </div>
        `;
    }

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

            <FormGroup>
              <Label>Cantidad de etiquetas a imprimir al mismo tiempo:</Label>
              <Input
                type="number"
                min="1"
                max="500"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                autoFocus
              />
            </FormGroup>

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
