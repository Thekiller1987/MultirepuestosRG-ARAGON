import React, { useState, useCallback, useEffect } from 'react';
import { FaFileInvoice, FaPrint, FaWindowClose, FaReceipt } from 'react-icons/fa';
import styled, { css, createGlobalStyle } from 'styled-components';
import { ModalOverlay, ModalContent, Button, TotalsRow } from '../POS.styles.jsx';
import AlertModal from './AlertModal.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useSettings } from '../../../context/SettingsContext.jsx'; // NEW hook

/* ========= ESTILO GLOBAL (NO usa @import) ========= */
const GlobalPrintStyle = createGlobalStyle`
  @media print {
    body { visibility: hidden; margin: 0; padding: 0; }
    .print-area, .print-area * { visibility: visible !important; }
    .print-area {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      z-index: 999999 !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    .no-print { display: none !important; }
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
  }
`;

/* ======================= ESTILOS DE TICKET/VISUALIZACIÓN ======================= */
const PrintWrapper = styled.div`
  font-family: 'Consolas','Courier New',monospace;
  color: #000;
  background: #fff;
  width: 310px;
  margin: 0 auto;
  padding: 12px 10px;
  box-shadow: 0 0 10px rgba(0,0,0,.08);
  border: 1px solid #eee;
  border-radius: 8px;

  &.compact { padding: 8px 6px; }

  /* Encabezado */
  .brand {
    text-align: center;
    border-bottom: 1px dashed #333;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  .brand h1 { margin: 6px 0 2px; font-size: 1.35rem; font-weight: 700; color: #0b72b9; line-height: 1.25; }
  .brand small { color: #555; display: block; margin: 3px 0; line-height: 1.35; white-space: normal; word-break: break-word; }

  /* Meta */
  .meta { font-size: .9rem; margin-bottom: 12px; border-bottom: 1px dashed #ccc; padding-bottom: 8px; }
  .meta p { margin: 2px 0; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 4px 8px; font-weight: 400; }
  .meta-label { font-weight: 700; }
  .meta-value { font-weight: 400; }

  /* Tabla */
  table.items { width: 100%; border-collapse: collapse; font-size: .9rem; table-layout: fixed; }
  table.items th, table.items td { padding: 6px 4px; vertical-align: top; word-wrap: break-word; }
  table.items th { border-bottom: 2px solid #333; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; color: #1e3a8a; }
  &.compact table.items th, &.compact table.items td { padding: 4px 2px; }
  .text-right { text-align: right; }
  .col-qty { width: 15%; text-align: center; }
  .col-unit { width: 25%; text-align: right; }
  .col-total { width: 25%; text-align: right; }
  table.items td:nth-child(2) { white-space: normal; text-align: left; }

  /* Totales */
  .totals { border-top: 2px solid #333; padding-top: 6px; margin-top: 12px; }
  .badge { display: inline-block; font-weight: 700; letter-spacing: .5px; padding: 6px 10px; border: 2px solid #0b72b9; border-radius: 4px; margin: 10px auto; text-align: center; color: #0b72b9; font-size: 0.8rem; }
  .thanks { text-align: center; font-size: .85rem; border-top: 1px dashed #333; padding-top: 10px; margin-top: 12px; color: #444; line-height: 1.4; }

  /* ====== A4 SPECIFIC LAYOUT ====== */
  &.print-a4 {
    .brand { display: flex; justify-content: space-between; align-items: flex-start; text-align: left; border-bottom: 3px solid #1e3a8a; margin-bottom: 2rem; padding-bottom: 1rem; }
    .brand-logo-container { width: 150px; }
    .brand-info { text-align: right; max-width: 60%; }
    .brand h1 { font-size: 20pt; color: #1e3a8a; margin-bottom: 5px; }
    .brand small { font-size: 9pt; color: #444; margin: 1px 0; }
    
    .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; border: 1px solid #ddd; padding: 15px; background: #f8fafc; border-radius: 6px; margin-bottom: 25px; }
    .meta-col { display: flex; flex-direction: column; gap: 5px; }
    .meta-title { font-weight: bold; text-transform: uppercase; color: #1e3a8a; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 6px; font-size: 9pt; }
    .meta p { justify-content: flex-start; gap: 8px; border-bottom: none; width: 100%; display: grid; grid-template-columns: 100px 1fr; }
    
    table.items th { background: #f1f5f9; color: #334155; padding: 10px; border-bottom: 2px solid #cbd5e1; font-size: 9pt; }
    table.items td { padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 10pt; color: #334155; }
    .col-qty { width: 10%; }
    .col-unit { width: 15%; }
    .col-total { width: 15%; }
    
    .totals { border-top: none; margin-top: 0; display: flex; justify-content: flex-end; padding-top: 20px; }
    .totals-box { width: 250px; }
    
    .thanks { border-top: none; margin-top: 50px; font-style: italic; color: #94a3b8; }
  }

  @media print {
    &.print-80 {
      width: 80mm !important; font-family: 'Consolas', monospace !important; padding: 6px 4px !important; border: none !important; box-shadow: none !important; font-size: 8pt;
    }
    &.print-a4 {
      width: 190mm !important; font-size: 10pt !important; padding: 0 !important; margin: 0 !important; border: none !important; box-shadow: none !important; max-height: 277mm !important; overflow: hidden !important; font-family: 'Inter', Helvetica, Arial, sans-serif !important;
    }
    &.compact { font-size: 7.5pt; }
  }
`;

const Wrapper = styled.div`
  display: flex; flex-direction: column; gap: 12px;
`;

const TicketLogo = styled.img`
  width: 100%; max-width: 160px; height: auto; display: block; margin: 0 auto 6px; border-radius: 6px;
  &.a4-logo { margin: 0; max-width: 140px; }
`;

const Tag = styled.span`
  display: inline-flex; align-items: center; gap: 6px; font-weight: 700; letter-spacing: .4px; padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; background: #e8f4ff; color: #0b72b9; border: 1px solid #b9defc;
`;

const HeaderBar = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: .75rem;
`;

/* =================================================================
 * COMPONENTE PRINCIPAL (ProformaModal)
 * ================================================================= */
const ProformaModal = ({
  cart = [],
  total = 0,
  subtotal = 0,
  discount = 0,
  proformaFor = '',
  onClose,
  currentUser,
  client
}) => {
  const { user: authUser } = (typeof useAuth === 'function' ? useAuth() : { user: null });
  const { settings } = useSettings(); // Hook config

  // Resolver nombre de quien emite
  const getName = (u) => u?.usuarioNombre || u?.nombre_usuario || u?.name || u?.nombre || u?.username || null;
  let lsUser = null;
  try { lsUser = JSON.parse(localStorage.getItem('authUser') || 'null'); } catch { }
  const userName = getName(currentUser) || getName(authUser) || getName(lsUser) || 'Cajero POS';

  // Datos cliente
  const clientName = client?.nombre || 'Consumidor Final';
  const clientCedula = client?.cedula || ''; // CEDULA SUPPORT
  const proformaDate = new Date().toLocaleString('es-NI');

  // Helpers de formato
  const fmt = (n) => new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n || 0));

  // ====== Configuración Dinámica ======
  const companyInfo = {
    name: settings?.empresa_nombre || 'Multirepuestos RG',
    ruc: settings?.empresa_ruc || '1211812770001E',
    phone: settings?.empresa_telefono || '84031936 / 84058142',
    address: settings?.empresa_direccion || 'Del portón de la normal 75 varas al este. Juigalpa, Chontales.',
    slogan: settings?.empresa_eslogan || 'Repuestos de confianza al mejor precio',
    logo: settings?.empresa_logo_url
      ? (settings.empresa_logo_url.startsWith('http') ? settings.empresa_logo_url : `${import.meta.env.VITE_API_URL}${settings.empresa_logo_url}`)
      : new URL('/icons/logo.png', window.location.origin).toString()
  };

  // Lógica Imprimir
  const doPrint = useCallback((mode = '80') => {
    const node = document.getElementById('print-wrapper-proforma');
    if (!node) return;
    const htmlToPrint = node.outerHTML;

    const printStyles = `
      @charset "UTF-8";
      @page { size: ${mode === 'A4' ? 'A4 portrait' : '80mm auto'}; margin: ${mode === 'A4' ? '12mm' : '0'}; }
      html, body {
        background: #fff; margin: 0 !important; padding: 0 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color: #000 !important; font-family: ${mode === 'A4' ? "'Inter', Helvetica, Arial, sans-serif" : "'Consolas', monospace"};
      }
      
      #print-wrapper-proforma {
        box-shadow: none !important; border: none !important; margin: 0 !important;
        ${mode === 'A4'
        ? `width: 100% !important; padding: 0 !important; font-size: 10pt !important;`
        : `width: 80mm !important; padding: 6px 4px !important; font-size: 8pt !important;`
      }
      }

      ${mode === 'A4' ? `
        #print-wrapper-proforma .brand { display: flex !important; justify-content: space-between !important; align-items: flex-start !important; text-align: left !important; border-bottom: 3px solid #1e3a8a !important; margin-bottom: 25px !important; padding-bottom: 15px !important; }
        #print-wrapper-proforma .brand-logo-container { width: 140px !important; order: 1 !important; }
        #print-wrapper-proforma .brand-info { flex: 1 !important; text-align: right !important; order: 2 !important; }
        #print-wrapper-proforma .brand h1 { font-size: 22pt !important; color: #1e3a8a !important; margin: 0 0 5px 0 !important; }
        #print-wrapper-proforma .brand small { display: block !important; font-size: 9pt !important; margin: 2px 0 !important; color: #334155 !important; }
        
        #print-wrapper-proforma .meta { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 30px !important; background: #f8fafc !important; border: 1px solid #e2e8f0 !important; padding: 15px !important; margin-bottom: 30px !important; border-radius: 8px !important; }
        #print-wrapper-proforma .meta p { display: grid !important; grid-template-columns: 100px 1fr !important; width: 100% !important; border-bottom: 1px dashed #e2e8f0 !important; padding-bottom: 4px !important; margin-bottom: 4px !important; }
        #print-wrapper-proforma .meta-title { font-weight: 800 !important; text-transform: uppercase !important; color: #1e3a8a !important; border-bottom: 2px solid #cbd5e1 !important; margin-bottom: 10px !important; padding-bottom: 5px !important; display: block !important; width: 100% !important; }

        #print-wrapper-proforma table.items { width: 100% !important; border-collapse: collapse !important; border: 1px solid #e2e8f0 !important; }
        #print-wrapper-proforma table.items th { background: #f1f5f9 !important; color: #334155 !important; padding: 12px 8px !important; border-bottom: 2px solid #cbd5e1 !important; font-size: 9pt !important; text-align: left !important; }
        #print-wrapper-proforma table.items td { padding: 10px 8px !important; border-bottom: 1px solid #f1f5f9 !important; font-size: 9.5pt !important; vertical-align: top !important; }
        #print-wrapper-proforma .col-qty { text-align: center !important; }
        #print-wrapper-proforma .col-unit, #print-wrapper-proforma .col-total { text-align: right !important; }
        
        #print-wrapper-proforma .totals { display: flex !important; justify-content: flex-end !important; margin-top: 20px !important; border-top: none !important; }
        #print-wrapper-proforma .totals-box { width: 300px !important; background: #f8fafc !important; padding: 15px !important; border: 1px solid #e2e8f0 !important; border-radius: 8px !important; }
      ` : `
        #print-wrapper-proforma .brand { text-align: center !important; border-bottom: 1px dashed #333 !important; }
        #print-wrapper-proforma .meta p { display: flex !important; justify-content: space-between !important; }
      `}
    `;

    const w = window.open('', '_blank', 'width=900,height=700');
    if (!w) return;
    w.document.write(`<html><head><title>PROFORMA - ${companyInfo.name}</title><style>${printStyles}</style></head><body>${htmlToPrint}</body></html>`);
    w.document.close();
    w.focus();
    w.onload = function () { setTimeout(() => { w.print(); }, 250); };
  }, [companyInfo]);

  const compact = cart.length <= 2;

  return (
    <ModalOverlay className="no-print">
      <GlobalPrintStyle />
      <ModalContent className="no-print" style={{ maxWidth: 520, width: '96%', padding: '1.2rem', background: '#fff' }}>
        <HeaderBar>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}><FaReceipt /> Vista Proforma</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={() => doPrint('80')}>Ticket 80mm</Button>
            <Button onClick={() => doPrint('A4')}><FaFileInvoice /> A4</Button>
            <Button $cancel onClick={onClose}><FaWindowClose /></Button>
          </div>
        </HeaderBar>

        <Wrapper>
          <PrintWrapper id="print-wrapper-proforma" className={`print-area print-80 ${compact ? 'compact' : ''}`}>

            {/* BRAND HEADER */}
            <div className="brand">
              <div className="brand-logo-container">
                <TicketLogo className="a4-logo" src={companyInfo.logo} alt="Logo" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
              <div className="brand-info">
                <h1>{companyInfo.name}</h1>
                <small>{companyInfo.slogan}</small>
                <small>RUC: {companyInfo.ruc}</small>
                <small>Tel: {companyInfo.phone}</small>
                <small>{companyInfo.address}</small>
                <div style={{ marginTop: 8 }}>
                  <Tag><FaFileInvoice /> PROFORMA</Tag>
                </div>
              </div>
            </div>

            {/* META */}
            <div className="meta">
              <div className="meta-col">
                <span className="meta-title">Detalles</span>
                <p><span className="meta-label">Fecha:</span><span className="meta-value">{proformaDate}</span></p>
                <p><span className="meta-label">ID Temp:</span><span className="meta-value">{Date.now().toString().slice(-6)}</span></p>
                <p><span className="meta-label">Atendido por:</span><span className="meta-value">{userName}</span></p>
              </div>
              <div className="meta-col">
                <span className="meta-title">Cliente</span>
                <p><span className="meta-label">Nombre:</span><span className="meta-value">{proformaFor || clientName}</span></p>
                {clientCedula && <p><span className="meta-label">Cédula:</span><span className="meta-value">{clientCedula}</span></p>}
              </div>
            </div>

            {/* ITEMS */}
            <table className="items">
              <thead>
                <tr>
                  <th className="col-qty">Cant.</th>
                  <th>Descripción</th>
                  <th className="text-right col-unit">P. Unit.</th>
                  <th className="text-right col-total">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', color: '#777' }}>Sin ítems</td></tr>
                ) : (
                  cart.map((item, idx) => {
                    const unit = Number(item.precio_venta ?? item.precio ?? 0);
                    const qty = Number(item.quantity ?? 0);
                    const rowTotal = unit * qty;
                    return (
                      <tr key={idx}>
                        <td className="col-qty">{qty}</td>
                        <td>{item.nombre || item.descripcion || 'Item'}</td>
                        <td className="text-right col-unit">C${fmt(unit)}</td>
                        <td className="text-right col-total">C${fmt(rowTotal)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* TOTALS */}
            <div className="totals">
              <div className="totals-box">
                <TotalsRow><span>Subtotal:</span><span>C${fmt(subtotal)}</span></TotalsRow>
                {discount > 0 && <TotalsRow style={{ color: '#dc3545' }}><span>Descuento:</span><span>- C${fmt(discount)}</span></TotalsRow>}
                <TotalsRow className="grand-total" style={{ fontWeight: 'bold', fontSize: '1.2rem', marginTop: 5, borderTop: '2px solid black' }}>
                  <span>TOTAL:</span><span>C${fmt(total)}</span>
                </TotalsRow>

                <div style={{ marginTop: 12, textAlign: 'center' }}>
                  <span className="badge">DOCUMENTO NO VÁLIDO COMO FACTURA</span>
                  <p style={{ margin: '5px 0 0', fontSize: '0.75rem', color: '#666' }}>Precios sujetos a cambio. Válido por 3 días.</p>
                </div>
              </div>
            </div>

            <div className="thanks">
              <p>"{companyInfo.slogan}"</p>
              <p style={{ whiteSpace: 'pre-line', marginTop: '5px' }}>
                {settings?.ticket_proforma_footer || '¡Gracias por cotizar con nosotros!'}
              </p>
            </div>
          </PrintWrapper>
        </Wrapper>

      </ModalContent>
    </ModalOverlay>
  );
};

export default ProformaModal;
