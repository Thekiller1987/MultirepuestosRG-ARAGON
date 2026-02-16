import React, { useMemo } from 'react';
import { FaReceipt, FaWindowClose, FaFileInvoice } from 'react-icons/fa';
import styled, { css, createGlobalStyle } from 'styled-components';
import { ModalOverlay, Button, TotalsRow, ModalContent } from '../POS.styles.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useSettings } from '../../../context/SettingsContext.jsx';

/* ========= CANDADO GLOBAL DE IMPRESIÓN ========= */
let __PRINT_LOCK = false;
let __PRINT_KEY = null;
const lockPrintOnce = (key, fn) => {
  if (__PRINT_LOCK && __PRINT_KEY === key) return;
  __PRINT_LOCK = true;
  __PRINT_KEY = key;
  try { fn(); } finally {
    setTimeout(() => { __PRINT_LOCK = false; }, 1500);
  }
};

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

/* ======================= ESTILOS BASE (vista previa) ======================= */
const PrintWrapper = styled.div`
  font-family: 'Consolas','Courier New',monospace;
  color: #000;
  background: #fff;
  width: 310px; /* Default for preview */
  margin: 0 auto;
  padding: 12px 10px;
  box-shadow: 0 0 10px rgba(0,0,0,.08);
  border: 1px solid #eee;
  border-radius: 8px;

  &.compact { padding: 8px 6px; }

  /* --- BRAND --- */
  .brand {
    text-align: center;
    border-bottom: 1px dashed #333;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  .brand h1 { margin: 6px 0 2px; font-size: 1.35rem; font-weight: 700; color: #1e3a8a; line-height: 1.25; }
  .brand small { color: #555; display: block; margin: 3px 0; line-height: 1.35; white-space: normal; word-break: break-word; }

  /* --- META --- */
  .meta { font-size: .9rem; margin-bottom: 12px; border-bottom: 1px dashed #ccc; padding-bottom: 8px; }
  .meta p { margin: 2px 0; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 4px 8px; font-weight: 400; }
  .meta-label { font-weight: 700; }
  .meta-value { font-weight: 400; text-align: right; }

  /* --- ITEMS --- */
  table.items { width: 100%; border-collapse: collapse; font-size: .9rem; table-layout: fixed; }
  table.items th, table.items td { padding: 6px 4px; vertical-align: top; word-wrap: break-word; }
  table.items th { border-bottom: 2px solid #333; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; color: #1e3a8a; }
  &.compact table.items th, &.compact table.items td { padding: 4px 2px; }
  .text-right { text-align: right; }
  .col-qty { width: 15%; text-align: center; }
  .col-unit { width: 25%; text-align: right; }
  .col-total { width: 25%; text-align: right; }
  table.items td:nth-child(2) { white-space: normal; text-align: left; }

  /* --- TOTALS --- */
  .totals { border-top: 2px solid #333; padding-top: 6px; margin-top: 12px; }
  .badge { display: inline-block; font-weight: 700; letter-spacing: .5px; padding: 6px 10px; border: 2px solid #0b72b9; border-radius: 4px; margin: 10px auto; text-align: center; color: #0b72b9; }
  .thanks { text-align: center; font-size: .85rem; border-top: 1px dashed #333; padding-top: 10px; margin-top: 12px; color: #444; line-height: 1.4; }

  /* ====== A4 SPECIFIC LAYOUT ====== */
  &.print-a4 {
    /* Layout A4 Professional */
    .brand {
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: left;
        border-bottom: 3px solid #1e3a8a;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
    }
    .brand-logo-container { width: 150px; }
    .brand-info { text-align: right; max-width: 60%; }
    .brand h1 { font-size: 20pt; color: #1e3a8a; margin-bottom: 5px; }
    .brand small { font-size: 9pt; color: #444; margin: 1px 0; }
    
    .meta { 
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        border: 1px solid #ddd;
        padding: 15px;
        background: #f8fafc;
        border-radius: 6px;
        margin-bottom: 25px;
    }
    .meta-col { display: flex; flex-direction: column; gap: 5px; }
    .meta-title { font-weight: bold; text-transform: uppercase; color: #1e3a8a; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 6px; font-size: 9pt; }
    .meta p { justify-content: flex-start; gap: 8px; border-bottom: none; width: 100%; display: grid; grid-template-columns: 120px 1fr; }
    .meta-label { text-align: left; color: #64748b; font-weight: 500; }
    .meta-value { text-align: left; color: #0f172a; font-weight: 600; }

    table.items th { background: #f1f5f9; color: #334155; padding: 10px; border-bottom: 2px solid #cbd5e1; font-size: 9pt; }
    table.items td { padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 10pt; color: #334155; }
    .col-qty { width: 10%; }
    .col-unit { width: 15%; }
    .col-total { width: 15%; }
    
    .totals { border-top: none; margin-top: 0; display: flex; justify-content: flex-end; padding-top: 20px; }
    .totals-box { width: 250px; }
    
    .thanks { border-top: none; margin-top: 50px; font-style: italic; color: #94a3b8; }
    
    .footer-sign {
        margin-top: 60px;
        display: flex;
        justify-content: space-between;
        padding: 0 40px;
    }
    .sign-box {
        border-top: 1px solid #94a3b8;
        width: 40%;
        text-align: center;
        padding-top: 10px;
        color: #64748b;
        font-size: 9pt;
    }
  }

  @media print {
    &.print-80 {
      width: 80mm !important;
      font-family: 'Consolas', monospace !important;
      padding: 6px 4px !important;
      border: none !important;
      box-shadow: none !important;
      font-size: 8pt;
    }
    &.print-a4 {
      width: 190mm !important;
      font-size: 10pt !important;
      padding: 10mm !important;
      margin: 0 !important;
      border: none !important;
      box-shadow: none !important;
      max-height: 277mm !important;
      overflow: hidden !important;
      font-family: 'Inter', Helvetica, Arial, sans-serif !important;
    }
    &.compact { font-size: 7.5pt; }
  }
`;

const Wrapper = styled.div`
  display: flex; flex-direction: column; gap: 12px;
`;

const TicketLogo = styled.img`
  width: 100%;
  max-width: 160px;
  height: auto;
  display: block;
  margin: 0 auto; 
  border-radius: 6px;
  &.a4-logo { margin: 0; max-width: 140px; }

  @media print {
    filter: grayscale(100%) contrast(150%);
    opacity: 1 !important;
  }
`;

const Tag = styled.span`
  display: inline-flex; align-items: center; gap: 6px;
  font-weight: 700; letter-spacing: .4px; padding: 4px 8px; border-radius: 4px;
  font-size: 0.85rem;
  ${({ $type }) => $type === 'proforma' && css`background: #e8f4ff; color: #0b72b9; border: 1px solid #b9defc;`}
  ${({ $type }) => $type === 'abono' && css`background: #fff3cd; color: #856404; border: 1px solid #ffeeba;`}
  ${({ $type }) => $type === 'venta' && css`background: #e8f7ee; color: #1c7d3a; border: 1px solid #bfe8cf;`}
  ${({ $type }) => $type === 'outflow' && css`background: #fee2e2; color: #991b1b; border: 1px solid #fecaca;`}
`;

const HeaderBar = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: .75rem;
`;

/* ======================= HELPERS ======================= */
const fmt = (n) => new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n || 0));
const coalesce = (...vals) => vals.find(v => v !== undefined && v !== null);

const extractName = (u) =>
  coalesce(
    u?.usuarioNombre,
    u?.nombre_usuario,
    u?.nombre,
    u?.name,
    u?.displayName,
    u?.fullName,
    u?.username,
    null
  );

function normalizeItems(itemsRaw = []) {
  return itemsRaw.map((it, idx) => {
    const quantity = Number(coalesce(it.quantity, it.cantidad, it.qty, 0));
    const nombre = coalesce(it.nombre, it.descripcion, it.description, it.producto, `Item ${idx + 1}`);
    const unit = Number(coalesce(it.precio_unitario, it.precio_venta, it.precio, it.unitPrice, 0));
    const id = coalesce(it.id_producto, it.id, `it-${idx}`);
    return { id, nombre, quantity, unit, total: quantity * unit };
  });
}

function labelMetodoPago(pd = {}) {
  const eff = Number(pd.efectivo || 0);
  const tar = Number(pd.tarjeta || 0);
  const trf = Number(pd.transferencia || 0);
  const usd = Number(pd.dolares || 0);
  const cred = Number(pd.credito || 0);
  if (cred > 0) return 'Crédito';
  const methods = [];
  if (eff > 0) methods.push('Efectivo');
  if (tar > 0) methods.push('Tarjeta');
  if (trf > 0) methods.push('Transferencia');
  if (usd > 0) methods.push('Dólares');
  if (methods.length === 0) return 'Contado';
  if (methods.length === 1) return methods[0];
  return 'Mixto';
}

function montoPagado(pd = {}, fallback = 0) {
  const efectivo = Number(pd.efectivo || 0);
  const tarjeta = Number(pd.tarjeta || 0);
  const transferencia = Number(pd.transferencia || 0);
  const otro = Number(pd.otro || 0);
  const dolaresMonto = Number(pd.dolares || 0);
  const tasa = Number(pd.tasaDolarAlMomento || pd.tasaObtenida || 1);
  const dolaresConvertido = dolaresMonto * (tasa > 1 ? tasa : 1);
  const totalCalculado = efectivo + tarjeta + transferencia + otro + dolaresConvertido;
  return totalCalculado > 0 ? totalCalculado : Number(pd.montoRecibido || fallback || 0);
}

function toDateString(maybeDate) {
  const src = coalesce(maybeDate?.fecha, maybeDate?.createdAt, maybeDate?.created_at, maybeDate?.date, maybeDate);
  try {
    const d = new Date(src);
    return isNaN(d) ? 'Fecha inválida' : d.toLocaleString('es-NI', { hour12: true });
  } catch { return 'Fecha inválida'; }
}

function ensureProformaId(tx) {
  const n = coalesce(tx.proformaId, tx.proformaNumero, tx.numeroProforma, tx.id);
  if (n) return n;
  const now = new Date();
  const fecha = now.toISOString().slice(2, 10).replace(/-/g, '');
  const hora = now.toTimeString().slice(0, 8).replace(/:/g, '');
  return `PF-${fecha}-${hora}`;
}

/* ======================= COMPONENTE ======================= */
const TicketModal = ({
  transaction,
  onClose,
  clients = [],
  users = [],
  isOpen = true,
  printMode = '80',
  currentUser = null,
  onPersistPrint = null,
}) => {
  const { user: authUser } = (typeof useAuth === 'function' ? useAuth() : { user: null });
  const { settings } = useSettings(); // NEW: Hook para configuración

  if (!isOpen || transaction == null) return null;

  const [resolved] = React.useState(typeof transaction === 'object' ? transaction : null);
  const [loading] = React.useState(false);
  const [error] = React.useState(null);

  if (loading || error || !resolved) {
    return (
      <ModalOverlay className="no-print">
        <ModalContent className="no-print" style={{ maxWidth: 420, padding: '1rem' }}>
          <h3 style={{ color: '#dc3545' }}>No se pudo imprimir</h3>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
            <Button onClick={onClose} $cancel><FaWindowClose /> Cerrar</Button>
          </div>
        </ModalContent>
      </ModalOverlay>
    );
  }

  // ====== Datos listos ======
  const tx = resolved;
  const isAbono = tx.estado === 'ABONO_CREDITO';
  const isProforma = Boolean(tx.isProforma || tx.proformaFor || tx.proformaNombre);
  const isOutflow = Boolean(tx.isOutflow);
  const isDevol = tx.estado === 'DEVOLUCION';

  const ticketId = isProforma ? ensureProformaId(tx) : coalesce(tx.id, tx.saleId, tx.numero, '-');
  const fechaStr = toDateString(coalesce(tx.fecha, tx.createdAt, tx.date));

  const clientId = coalesce(tx.clientId, tx.idCliente, tx.clienteId);
  const clienteObj = clients.find(c => String(c.id_cliente ?? c.id) === String(clientId));
  const clientName = isProforma && tx.proformaNombre
    ? tx.proformaNombre
    : coalesce(clienteObj?.nombre, tx.clienteNombre, 'Consumidor Final');

  // Campo cédula si aplica
  const clienteCedula = clienteObj?.cedula || tx.clienteCedula;

  const userId =
    coalesce(tx.userId, tx.idUsuario, tx.openedBy?.id) ??
    currentUser?.id_usuario ?? currentUser?.id ?? currentUser?.uid ??
    authUser?.id_usuario ?? authUser?.id ?? authUser?.uid;

  const fromLS = (() => {
    try { return JSON.parse(localStorage.getItem('authUser') || 'null'); }
    catch { return null; }
  })();

  const userObj = users.find(u =>
    String(u.id_usuario || u.id || u.uid) === String(userId)
  );

  const resolvedUserName = coalesce(
    tx.usuarioNombre,
    extractName(userObj),
    extractName(currentUser),
    extractName(authUser),
    extractName(fromLS),
    'Cajero POS'
  );

  const printedByName = isProforma
    ? coalesce(tx.usuarioNombre, extractName(currentUser), extractName(authUser), extractName(fromLS), resolvedUserName)
    : resolvedUserName;

  const items = normalizeItems(coalesce(tx.items, tx.detalle, []));
  const subtotalCalc = items.reduce((s, it) => s + Number(it.unit) * Number(it.quantity), 0);
  const subtotal = Number(coalesce(tx.subtotal, subtotalCalc));
  const descuento = Number(coalesce(tx.descuento, 0));
  const total = Number(coalesce(tx.totalVenta, tx.total_venta, subtotal - descuento, 0));

  const pd = tx.pagoDetalles || {};
  const metodo = (isProforma || isOutflow) ? 'N/A' : coalesce(tx.metodoPago, labelMetodoPago(pd));
  const pagado = (isProforma || isOutflow) ? 0 : montoPagado(pd, total);
  const cambio = (isProforma || isOutflow) ? 0 : Math.max(0, pagado - total);

  const abonoMonto = Math.abs(Number(coalesce(tx.totalVenta, tx.montoAbono, 0)));
  const nuevoSaldo = Number(clienteObj?.saldo_pendiente || 0);
  const saldoAnterior = nuevoSaldo + abonoMonto;
  const compact = items.length <= 2;

  // ====== Uso de Configuración Dinámica ======
  const companyInfo = {
    name: settings?.empresa_nombre || 'Multirepuestos RG',
    ruc: settings?.empresa_ruc || '1211812770001E',
    phone: settings?.empresa_telefono || '84031936 / 84058142',
    address: settings?.empresa_direccion || 'Del portón de la normal 75 varas al este. Juigalpa, Chontales.',
    slogan: settings?.empresa_eslogan || 'Repuestos de confianza al mejor precio',
    logo: settings?.empresa_logo_url
      ? (settings.empresa_logo_url.startsWith('http') ? settings.empresa_logo_url : settings.empresa_logo_url)
      : new URL('/icons/logo.png', window.location.origin).toString()
  };

  // ====== Persistencia de quién imprimió ======
  const persistPrintedMeta = React.useCallback(async (mode) => {
    /* ...same as before... */
  }, []);

  // ====== Impresión centralizada (A4/80 mm) ======
  const doPrint = React.useCallback((mode = '80') => {
    const node = document.getElementById('print-wrapper-ticket');
    if (!node) return;
    const htmlToPrint = node.outerHTML;

    // Estilos CSS inyectados para ventana de impresión
    const printStyles = `
      @charset "UTF-8";
      @page { size: ${mode === 'A4' ? 'A4 portrait' : '80mm auto'}; margin: ${mode === 'A4' ? '12mm' : '0'}; }
      html, body { background: #fff; margin: 0 !important; padding: 0 !important; font-family: ${mode === 'A4' ? "'Inter', Helvetica, Arial, sans-serif" : "'Consolas', monospace"}; color: #000 !important; }
      
      /* Reset para impresión */
      #print-wrapper-ticket {
        box-shadow: none !important; border: none !important; margin: 0 !important;
        ${mode === 'A4'
        ? `width: 100% !important; padding: 0 !important; font-size: 10pt !important;`
        : `width: 80mm !important; padding: 6px 4px !important; font-size: 8pt !important;`
      }
      }

      /* Estilos específicos A4 en impresión */
      ${mode === 'A4' ? `
        #print-wrapper-ticket .brand { display: flex !important; justify-content: space-between !important; align-items: flex-start !important; border-bottom: 3px solid #1e3a8a !important; margin-bottom: 25px !important; padding-bottom: 15px !important; text-align: left !important; }
        #print-wrapper-ticket .brand-logo-container { order: 1 !important; width: 140px !important; }
        #print-wrapper-ticket .brand-info { order: 2 !important; text-align: right !important; flex: 1 !important; }
        #print-wrapper-ticket .brand h1 { font-size: 22pt !important; color: #1e3a8a !important; margin: 0 0 5px 0 !important; }
        #print-wrapper-ticket .brand small { display: block !important; font-size: 9pt !important; margin: 2px 0 !important; color: #334155 !important; }
        
        #print-wrapper-ticket .meta { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 30px !important; background: #f8fafc !important; border: 1px solid #e2e8f0 !important; padding: 15px !important; border-radius: 8px !important; margin-bottom: 30px !important; }
        #print-wrapper-ticket .meta p { display: grid !important; grid-template-columns: 140px 1fr !important; width: 100% !important; border-bottom: 1px dashed #e2e8f0 !important; padding-bottom: 4px !important; margin-bottom: 4px !important; }
        #print-wrapper-ticket .meta-title { font-weight: 800 !important; text-transform: uppercase !important; color: #1e3a8a !important; border-bottom: 2px solid #cbd5e1 !important; margin-bottom: 10px !important; padding-bottom: 5px !important; display: block !important; width: 100% !important; }
        
        #print-wrapper-ticket table.items { width: 100% !important; border-collapse: collapse !important; border: 1px solid #e2e8f0 !important; }
        #print-wrapper-ticket table.items th { background: #f1f5f9 !important; color: #334155 !important; padding: 12px 8px !important; font-weight: 700 !important; text-transform: uppercase !important; font-size: 8pt !important; border-bottom: 2px solid #cbd5e1 !important; text-align: left !important; }
        #print-wrapper-ticket table.items td { padding: 10px 8px !important; border-bottom: 1px solid #f1f5f9 !important; font-size: 9.5pt !important; color: #334155 !important; vertical-align: top !important; }
        #print-wrapper-ticket .col-qty { text-align: center !important; }
        #print-wrapper-ticket .col-unit, #print-wrapper-ticket .col-total { text-align: right !important; }
        
        #print-wrapper-ticket .totals { display: flex !important; justify-content: flex-end !important; margin-top: 20px !important; border-top: none !important; }
        #print-wrapper-ticket .totals-box { width: 300px !important; background: #f8fafc !important; padding: 15px !important; border-radius: 8px !important; border: 1px solid #e2e8f0 !important; }
        #print-wrapper-ticket .footer-sign { display: flex !important; justify-content: space-between !important; margin-top: 80px !important; padding: 0 50px !important; }
        #print-wrapper-ticket .sign-box { border-top: 1px solid #94a3b8 !important; width: 40% !important; text-align: center !important; padding-top: 5px !important; font-size: 9pt !important; color: #64748b !important; }
      ` : `
        /* Estilos 80mm */
        #print-wrapper-ticket { font-family: 'Consolas', monospace !important; }
        #print-wrapper-ticket .brand { text-align: center !important; border-bottom: 1px dashed #000 !important; }
        #print-wrapper-ticket table.items th { border-bottom: 1px dashed #000 !important; }
        #print-wrapper-ticket .grand-total { font-size: 12pt !important; font-weight: 900 !important; }
      `}
    `;

    const w = window.open('', '_blank', 'width=900,height=700');
    if (!w) return;

    w.document.write(`<html><head><title>Impresión ${mode.toUpperCase()} - ${companyInfo.name}</title><style>${printStyles}</style></head><body>${htmlToPrint}</body></html>`);
    w.document.close();
    w.focus();
    w.onload = () => {
      setTimeout(() => {
        w.print();
        // Close after print dialog is dismissed
        w.onafterprint = () => { setTimeout(() => w.close(), 300); };
      }, 350);
    };
  }, [companyInfo]);

  return (
    <ModalOverlay className="no-print">
      <GlobalPrintStyle />
      <ModalContent className="no-print" style={{ maxWidth: 520, width: '96%', padding: '1.2rem', background: '#fff' }}>
        <HeaderBar>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}><FaReceipt /> Vista de Impresión ({printMode.toUpperCase()})</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={() => doPrint('80')}>Ticket 80mm</Button>
            <Button onClick={() => doPrint('A4')}><FaFileInvoice /> A4 (1 pág.)</Button>
            <Button $cancel onClick={onClose}><FaWindowClose /></Button>
          </div>
        </HeaderBar>

        {/* LOGIC FOR PREVIEW (Using same structure, classes handle layout changes) */}
        <Wrapper>
          <PrintWrapper id="print-wrapper-ticket" className={`print-area ${printMode === 'A4' ? 'print-a4' : 'print-80'} ${compact ? 'compact' : ''}`}>

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
                  {isProforma ? <Tag $type="proforma">PROFORMA</Tag> : isAbono ? <Tag $type="abono">RECIBO</Tag> : isOutflow ? <Tag $type="outflow">SALIDA</Tag> : <Tag $type="venta">{isDevol ? 'DEVOLUCIÓN' : 'FACTURA'}</Tag>}
                </div>
              </div>
            </div>

            {/* META INFO */}
            <div className="meta">
              <div className="meta-col">
                <span className="meta-title">Detalles del Documento</span>
                <p><span className="meta-label">Fecha:</span><span className="meta-value">{fechaStr}</span></p>
                <p><span className="meta-label">No. Documento:</span><span className="meta-value">{ticketId}</span></p>
                <p><span className="meta-label">Atendido por:</span><span className="meta-value">{printedByName}</span></p>
              </div>
              <div className="meta-col">
                <span className="meta-title">Datos del Cliente</span>
                <p><span className="meta-label">Cliente:</span><span className="meta-value">{clientName}</span></p>
                {clienteCedula && <p><span className="meta-label">Cédula/RUC:</span><span className="meta-value">{clienteCedula}</span></p>}
                {!isProforma && !isOutflow && <p><span className="meta-label">Pago:</span><span className="meta-value">{metodo}</span></p>}
                {/* Add Address if available in clientObj later */}
              </div>
            </div>

            {/* ITEMS TABLE */}
            <table className="items">
              <thead>
                <tr>
                  <th className="col-qty">Cant.</th>
                  <th>Descripción</th>
                  <th className="text-right col-unit">P. Unit</th>
                  <th className="text-right col-total">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? <tr><td colSpan="4" style={{ textAlign: 'center' }}>Sin ítems</td></tr> :
                  items.map(it => (
                    <tr key={it.id}>
                      <td className="col-qty">{it.quantity}</td>
                      <td>{it.nombre}</td>
                      <td className="text-right col-unit">C${fmt(it.unit)}</td>
                      <td className="text-right col-total">C${fmt(it.total)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>

            {/* TOTALS */}
            <div className="totals">
              <div className="totals-box">
                <TotalsRow><span>Subtotal:</span><span>C${fmt(subtotal)}</span></TotalsRow>
                {descuento > 0 && <TotalsRow style={{ color: '#dc3545' }}><span>Descuento:</span><span>- C${fmt(descuento)}</span></TotalsRow>}
                <TotalsRow className="grand-total" $bold style={{ fontSize: '1.2em', borderTop: '1px solid #ccc', marginTop: 5, paddingTop: 5 }}><span>TOTAL:</span><span>C${fmt(total)}</span></TotalsRow>
                {!isProforma && (
                  <>
                    <TotalsRow style={{ marginTop: 10, fontSize: '0.9em', color: '#666' }}><span>Pagado:</span><span>C${fmt(pagado)}</span></TotalsRow>
                    {cambio > 0 && <TotalsRow $bold style={{ color: '#dc3545' }}><span>Cambio:</span><span>C${fmt(cambio)}</span></TotalsRow>}
                  </>
                )}
              </div>
            </div>

            {/* A4 FOOTER SIGNATURES */}
            <div className="footer-sign no-show-80">
              <div className="sign-box">Entregado por</div>
              <div className="sign-box">Recibido por</div>
            </div>

            <div className="thanks">
              <p>"{companyInfo.slogan}"</p>
              <p style={{ whiteSpace: 'pre-line', marginTop: '5px' }}>
                {(() => {
                  if (isProforma) return settings?.ticket_proforma_footer || 'Cotización válida por 15 días.';
                  if (isOutflow) return settings?.ticket_transfer_footer || 'Salida de Inventario.';
                  return settings?.ticket_sales_footer || '¡Gracias por su compra!';
                })()}
              </p>
            </div>

          </PrintWrapper>
        </Wrapper>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TicketModal;
