import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { ModalOverlay, ModalContent, Button, SearchInput, TotalsRow } from '../POS.styles.jsx';
import {
  FaLockOpen, FaFileInvoiceDollar, FaRegCreditCard,
  FaMoneyBillWave, FaExchangeAlt, FaUserClock, FaPrint, FaExclamationCircle
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

/* =================================================================
 * ESTILOS DE IMPRESIÓN (Robusto, igual que TicketModal)
 * ================================================================= */
const GlobalPrintStyle = React.memo(() => (
  <style>{`
  /* Importar League Spartan */
  @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;600;800;900&display=swap');

  @media print {
    body { visibility: hidden; margin: 0; padding: 0; }
    .print-area, .print-area * { visibility: visible !important; }
    .print-area {
      position: absolute !important; left: 0 !important; top: 0 !important;
      z-index: 999999 !important; margin: 0 !important; padding: 0 !important;
    }
    .no-print { display: none !important; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-shadow: none !important; text-shadow: none !important; }
  }
  `}</style>
));

const PrintWrapper = styled.div`
  font-family: 'League Spartan', 'Consolas', sans-serif; color: #000; background: #fff;
  width: 310px; margin: 0 auto; padding: 12px 6px;
  box-shadow: 0 0 10px rgba(0,0,0,.08); border: 1px solid #eee; border-radius: 8px;

  /* Encabezado */
  .brand { text-align: center; border-bottom: 3px solid #000; padding-bottom: 12px; margin-bottom: 15px; }
  .brand img { max-width: 120px; display: block; margin: 0 auto 10px; }
  .brand h2 { margin: 0 0 6px; font-size: 1.6rem; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }
  .brand p { margin: 3px 0; font-size: 1rem; font-weight: 700; }

  /* Secciones y Filas */
  .section { margin-bottom: 18px; border-bottom: 1px dashed #000; padding-bottom: 12px; }
  .section:last-child { border-bottom: none; }
  .section-title { font-weight: 900; text-align: center; text-transform: uppercase; font-size: 1.2rem; margin-bottom: 10px; text-decoration: underline; letter-spacing: 0.5px; }
  
  .row { display: flex; justify-content: space-between; font-size: 1.1rem; margin-bottom: 6px; align-items: baseline; font-weight: 600; }
  .row.big { font-size: 1.5rem; font-weight: 900; margin-top: 12px; border-top: 3px solid #000; padding-top: 8px; }
  .row.sub { font-size: 0.9rem; color: #333; font-style: italic; padding-left: 10px; margin-bottom: 4px; font-weight: 400; }
  .row.alert { background: #eee; padding: 8px; font-weight: 900; text-align: center; justify-content: center; gap: 10px; border: 2px solid #000; margin-top: 12px; font-size: 1.4rem; }

  /* Tablas simples */
  table { width: 100%; border-collapse: collapse; font-size: 1rem; margin-top: 8px; }
  th { border-bottom: 2px solid #000; text-align: left; font-weight: 900; padding: 4px 2px; }
  td { border-bottom: 1px dashed #ccc; padding: 4px 2px; }
  .text-right { text-align: right; }

  /* Firma */
  .signature { margin-top: 60px; text-align: center; page-break-inside: avoid; }
  .signature-line { border-top: 2px solid #000; width: 80%; margin: 0 auto 8px; }
  .signature p { font-size: 1.1rem; font-weight: 700; }

  @media print {
    &.print-80 {
      width: 80mm !important; 
      font-family: 'League Spartan', sans-serif !important; 
      padding: 0px !important; border: none !important; box-shadow: none !important;
    }
  }
`;

/**
 * Props esperadas:
 * - currentUser, isCajaOpen, session, onOpenCaja, onCloseCaja, onClose, isAdmin, etc.
 */
// Helper para buscar nombre de cliente
const resolveClientName = (tx, clients) => {
  if (!tx) return 'N/A';
  // Check if we have explicit client info in note or payment details
  if (tx.pagoDetalles?.clienteNombre) return tx.pagoDetalles.clienteNombre;

  // Try to find by ID
  const cid = tx.pagoDetalles?.clienteId || tx.clientId;
  if (cid && clients?.length > 0) {
    const found = clients.find(c => String(c.id_cliente) === String(cid));
    if (found) return found.nombre;
  }
  return null;
};

const CajaModal = ({
  currentUser, isCajaOpen, session, onOpenCaja, onCloseCaja,
  onClose, isAdmin, showConfirmation, showAlert, initialTasaDolar, clients = []
}) => {
  const [montoApertura, setMontoApertura] = useState('');
  const [tasaDolar, setTasaDolar] = useState(initialTasaDolar || 36.60);
  const [montoContado, setMontoContado] = useState('');
  const [viewingReport, setViewingReport] = useState(false);
  const navigate = useNavigate();

  const userId = currentUser?.id_usuario || currentUser?.id;

  // LOGIC FIX: Prioritize openedBy.name BUT if missing (legacy), try currentUser (if id matches) or fallback
  let openedByName = session?.openedBy?.name;
  if (!openedByName && session?.openedBy && typeof session.openedBy === 'string') openedByName = session.openedBy; // Old string format
  if (!openedByName) openedByName = (session?.userId === userId) ? (currentUser?.nombre_usuario || currentUser?.username) : 'Usuario';
  if (!openedByName) openedByName = 'Caja General';

  const canClose = isAdmin || (session?.userId === userId) || (session?.openedBy?.id === userId);

  const transactions = useMemo(() => Array.isArray(session?.transactions) ? session.transactions : [], [session]);

  // --------- Clasificación y totales (Cálculo corregido) ----------
  const {
    cajaInicial, netCordobas, netDolares, efectivoEsperado, efectivoEsperadoCordobas, efectivoEsperadoDolares,
    ventasContado, devoluciones, cancelaciones, entradas, salidas, abonos,
    totalTarjeta, totalTransferencia, totalCredito, totalNoEfectivo,
    sumDevolucionesCancelaciones, totalVentasDia, tasaRef, totalHidden
  } = useMemo(() => {
    const cajaInicialN = Number(session?.initialAmount || 0);
    const tasaRef = Number(session?.tasaDolar || initialTasaDolar || 36.60);

    const cls = { ventasContado: [], devoluciones: [], cancelaciones: [], entradas: [], salidas: [], abonos: [] };
    let netCordobas = 0, netDolares = 0, tTarjeta = 0, tTransf = 0, tCredito = 0, tVentasDia = 0, sumDevsCancels = 0;
    let totalHidden = 0; // Track hidden adjustments

    for (const tx of transactions) {
      const t = (tx?.type || '').toLowerCase();
      let pd = tx?.pagoDetalles || {};
      if (typeof pd === 'string') { try { pd = JSON.parse(pd); } catch { pd = {}; } }
      if (!pd || typeof pd !== 'object') pd = {};

      // 1. CASH IMPACT (Physical Box)
      // ingresoCaja is the authority on physical money added. If undefined, fallback to tx.amount
      let rawAmount = Number(pd.ingresoCaja !== undefined ? pd.ingresoCaja : (tx.amount || 0));

      // 2. TOTAL REVENUE IMPACT (Accounting)
      // totalVenta is the authority on total transaction value. If undefined, fallback to tx.amount.
      let totalAmount = Number(pd.totalVenta !== undefined ? pd.totalVenta : (tx.amount || 0));

      if (t === 'salida' || t.includes('devolucion')) {
        rawAmount = -Math.abs(rawAmount); // Physical money leaves
        totalAmount = -Math.abs(totalAmount); // Revenue reversal
      }

      const montoBase = rawAmount; // Legacy name for Cash Impact
      const normalizedTx = { ...tx, pagoDetalles: pd, displayAmount: totalAmount };

      // Resolve Client Name for Abonos!
      if (t.includes('abono')) {
        const cName = resolveClientName(normalizedTx, clients);
        if (cName) normalizedTx.resolvedClientName = cName;
      }

      const txTarjeta = Number(pd.tarjeta || 0);
      const txTransf = Number(pd.transferencia || 0);
      const txCredito = Number(pd.credito || 0);

      // --- ACUMULAR NO EFECTIVO (From ANY transaction type that supports it) ---
      if (t.startsWith('venta') || t.includes('abono') || t.includes('pedido')) {
        tTarjeta += txTarjeta;
        tTransf += txTransf;
        tCredito += txCredito;
      } else if (t === 'ajuste') {
        // Ajustes also might have non-cash components
        if (pd.target === 'tarjeta') tTarjeta += Number(tx.amount || 0);
        if (pd.target === 'credito') tCredito += Number(tx.amount || 0);
        if (pd.target === 'transferencia') tTransf += Number(tx.amount || 0);
      }

      // --- ACUMULAR EFECTIVO FÍSICO (Caja) ---
      if (t.startsWith('venta') || t === 'venta_contado' || t === 'venta_mixta' || t === 'venta_credito') {
        if (pd.efectivo !== undefined || pd.dolares !== undefined) {
          netCordobas += (Number(pd.efectivo || 0) - Number(pd.cambio || 0));
          netDolares += Number(pd.dolares || 0);
        } else {
          // Legacy: if no breakdown, assume rawAmount is net cash
          netCordobas += (montoBase - txTarjeta - txTransf - txCredito);
        }
      } else if (t.includes('abono')) {
        if (pd.dolares !== undefined) {
          netDolares += Number(pd.dolares || 0);
          netCordobas += Number(pd.efectivo || 0);
        } else {
          // For Abonos, montoBase (based on ingresoCaja) is the net cash
          netCordobas += montoBase;
        }
      } else if (t === 'entrada') {
        netCordobas += Math.abs(montoBase);
      }
      else if (t === 'salida') {
        netCordobas -= Math.abs(montoBase);
      }
      else if (t.includes('devolucion')) {
        netCordobas += montoBase; // montoBase is negative
      }
      else if (t === 'ajuste') {
        if (pd.target === 'efectivo') {
          netCordobas += montoBase;
          if (pd.hidden) totalHidden += montoBase;
        }
        if (pd.target === 'dolares') {
          netDolares += montoBase; // Add to Net Dollars
          // We don't track hidden dollars separately yet for "Other Income" derived calc, 
          // but sticking to C$ for squares is usually enough. 
        }
      }
      else {
        // Fallback
        netCordobas += montoBase - txTarjeta - txTransf;
      }

      // --- TOTAL VENTAS / INGRESOS DEL DIA (Revenue) ---
      if (t.startsWith('venta') || t.includes('abono') || t === 'entrada') {
        tVentasDia += Math.abs(totalAmount);
      }
      else if (t === 'ajuste') {
        tVentasDia += totalAmount;
      }

      // Clasificar Listas
      if (t.startsWith('venta')) cls.ventasContado.push(normalizedTx);
      else if (t.includes('devolucion')) { cls.devoluciones.push(normalizedTx); sumDevsCancels += Math.abs(totalAmount); }
      else if (t.includes('cancelacion')) { cls.cancelaciones.push(normalizedTx); sumDevsCancels += Math.abs(totalAmount); }
      else if (t === 'entrada') cls.entradas.push(normalizedTx);
      else if (t === 'salida') cls.salidas.push(normalizedTx);
      else if (t.includes('abono')) cls.abonos.push(normalizedTx);
    }

    // Calcular Esperado
    // Formula: CajaInicial + (VentasTotales - NoEfectivo - Salidas) -> Simplificado: CajaInicial + NetCordobasFisicosCalculados
    // We already calculated netCordobas strictly based on physical cash movement.
    const efectivoEsperadoCalc = cajaInicialN + netCordobas + (netDolares * tasaRef);

    return {
      cajaInicial: cajaInicialN,
      netCordobas, netDolares,
      efectivoEsperado: efectivoEsperadoCalc,
      efectivoEsperadoCordobas: cajaInicialN + netCordobas,
      efectivoEsperadoDolares: netDolares,
      ventasContado: cls.ventasContado, devoluciones: cls.devoluciones, cancelaciones: cls.cancelaciones, entradas: cls.entradas, salidas: cls.salidas, abonos: cls.abonos,
      totalTarjeta: tTarjeta, totalTransferencia: tTransf, totalCredito: tCredito, totalNoEfectivo: tTarjeta + tTransf + tCredito,
      sumDevolucionesCancelaciones: sumDevsCancels, totalVentasDia: tVentasDia, tasaRef,
      totalHidden
    };
  }, [transactions, session, initialTasaDolar, clients]);

  const diferencia = (Number(montoContado || 0) - efectivoEsperado);
  const openedAt = session?.openedAt ? new Date(session.openedAt) : null;

  // --------- HANDLERS ----------
  const handleOpen = () => {
    const monto = parseFloat(montoApertura || 0);
    if (isNaN(monto) || monto < 0) return showAlert({ title: 'Inválido', message: 'Monto inicial >= 0' });
    onOpenCaja(monto, Number(tasaDolar || 36.60));
  };

  const handlePrepareClose = () => {
    if (isNaN(parseFloat(montoContado))) return showAlert({ title: 'Requerido', message: 'Ingrese el monto contado físico.' });
    setViewingReport(true);
  };

  /* IMPRESIÓN ROBUSTA: Usa el DOM renderizado (tipo TicketModal) */
  const doPrint = React.useCallback(() => {
    const node = document.getElementById('print-wrapper-caja');
    if (!node) return;
    const htmlToPrint = node.outerHTML;

    /* Estilos críticos para impresora térmica: Negro, Negrita, 80mm */
    const printStyles = `
        @charset "UTF-8";
        @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;600;800;900&display=swap');
        @page { size: 80mm auto; margin: 0; }
        html, body {
          background: #fff; margin: 0 !important; padding: 0 !important;
          -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
          color: #000 !important; font-family: 'League Spartan', sans-serif !important;
        }
        #print-wrapper-caja, #print-wrapper-caja * {
          color: #000 !important; font-weight: 700 !important;
          text-shadow: none !important; box-shadow: none !important;
          visibility: visible !important;
        }
        #print-wrapper-caja {
          width: 80mm !important; padding: 0 !important; border: none !important;
        }
        .brand h2 { font-size: 20pt !important; letter-spacing: 2px !important; margin-bottom: 5px !important; }
        .section-title { font-size: 14pt !important; margin-bottom: 12px !important; border-bottom: 2px solid #000 !important; }
        .row { font-size: 12pt !important; margin-bottom: 6px !important; font-weight: 900 !important; }
        .row.big { font-size: 16pt !important; margin-top: 15px !important; border-top: 4px solid #000 !important; }
        .row.alert { font-size: 18pt !important; padding: 10px !important; border: 4px solid #000 !important; }
        .text-right { text-align: right !important; }
        
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `;

    const w = window.open('', '_blank', 'width=500,height=600');
    if (!w) return;

    w.document.write(`<html><head><title>Cierre Caja</title><style>${printStyles}</style></head><body>${htmlToPrint}</body></html>`);
    w.document.close();
    w.focus();

    // Auto-imprimir y luego (opcional) cerrar ventana
    w.onload = function () {
      setTimeout(() => { w.print(); }, 300);
    };
    w.onafterprint = () => {
      try { w.close(); } catch { }
    };
  }, []);

  const handleConfirmClose = () => {
    // 1. Lanzar impresión
    doPrint();
    // 2. Cerrar caja en sistema tras breve delay (para que dé tiempo al popup de impresión de aparecer)
    setTimeout(() => {
      onCloseCaja(Number(montoContado));
    }, 800);
  };

  // Helpers display
  const money = (n) => `C$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const usd = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <ModalOverlay className="no-print">
      <GlobalPrintStyle />

      {/* --- PREVIEW O CONTENIDO PRINCIPAL --- */}
      <ModalContent style={{ maxWidth: viewingReport ? 450 : 760, padding: viewingReport ? 0 : '1.5rem', background: '#f8f9fa' }}>

        {/* ENCABEZADO MODAL (Solo si no estamos en reporte full screen o queremos que se vea arriba) */}
        {!viewingReport && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ margin: 0 }}>Gestión de Caja</h2>
            <Button $cancel onClick={onClose} style={{ borderRadius: '50%', width: 32, height: 32, padding: 0 }}>✕</Button>
          </div>
        )}

        {!isCajaOpen ? (
          /* --- ABRIR CAJA --- */
          <div style={{ padding: viewingReport ? '1rem' : 0 }}>
            <h3 style={{ color: '#28a745', borderBottom: '2px solid #28a745', paddingBottom: 10 }}>
              <FaLockOpen /> Abrir Caja
            </h3>
            <div style={{ display: 'grid', gap: 12 }}>
              <label style={{ fontWeight: 600 }}>Monto Inicial (C$)</label>
              <SearchInput type="number" step="0.01" value={montoApertura} onChange={e => setMontoApertura(e.target.value)} autoFocus />
              <label style={{ fontWeight: 600 }}>Tasa del Dólar</label>
              <SearchInput type="number" step="0.01" value={tasaDolar} onChange={e => setTasaDolar(e.target.value)} />
            </div>
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <Button primary style={{ flex: 1 }} onClick={handleOpen}>Abrir Caja</Button>
              <Button onClick={() => navigate('/dashboard')}>Ir al Dashboard</Button>
            </div>
          </div>
        ) : viewingReport ? (
          /* --- REPORTE (SPLIT: PREVIEW WEB ESTÉTICA + IMPRESIÓN OCULTA) --- */
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '90vh' }}>
            {/* Header del Modal Web */}
            <div style={{ padding: '15px 20px', background: '#343a40', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '8px 8px 0 0' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', letterSpacing: '0.5px' }}>REPORTAR CIERRE DE CAJA</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>{new Date().toLocaleString('es-NI')}</p>
              </div>
              <Button $cancel onClick={() => setViewingReport(false)} style={{ padding: '8px 15px', fontSize: '0.9rem', background: 'rgba(255,255,255,0.2)', border: 'none' }}>
                <FaExchangeAlt /> Volver / Editar
              </Button>
            </div>

            {/* Contenedor Web Scrollable */}
            <div style={{ flex: 1, overflowY: 'auto', background: '#f8f9fa', padding: '20px' }}>

              {/* Resumen Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15, marginBottom: 20 }}>
                <div style={{ background: '#fff', padding: 15, borderRadius: 8, boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderLeft: '4px solid #007bff' }}>
                  <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase' }}>Ventas Totales</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#333' }}>{money(totalVentasDia)}</div>
                </div>
                <div style={{ background: '#fff', padding: 15, borderRadius: 8, boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderLeft: '4px solid #28a745' }}>
                  <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase' }}>Efectivo Real</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#28a745' }}>{money(montoContado)}</div>
                </div>
                <div style={{ background: '#fff', padding: 15, borderRadius: 8, boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderLeft: `4px solid ${diferencia < 0 ? '#dc3545' : '#ffc107'}` }}>
                  <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase' }}>Diferencia</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: diferencia !== 0 ? (diferencia < 0 ? '#dc3545' : '#e0a800') : '#28a745' }}>{diferencia > 0 ? '+' : ''}{money(diferencia)}</div>
                </div>
              </div>

              {/* Tabla de Arqueo Web */}
              <div style={{ background: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: 20 }}>
                <h4 style={{ margin: '0 0 15px', borderBottom: '1px solid #eee', paddingBottom: 10 }}>Arqueo Detallado</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f1f1' }}><td style={{ padding: 10 }}>Fondo Inicial</td><td className="text-right" style={{ padding: 10, fontWeight: 'bold' }}>{money(cajaInicial)}</td></tr>

                    {/* Sección Detallada de Ventas */}
                    {/* Sección Detallada de Ventas */}
                    <tr style={{ background: '#f8f9fa' }}><td colSpan="2" style={{ padding: '8px 10px', fontSize: '0.85rem', fontWeight: 'bold', color: '#007bff' }}>RESUMEN DE INGRESOS</td></tr>
                    <tr><td style={{ padding: '4px 10px 4px 20px', fontSize: '0.9rem' }}>(+) Total Ingresos (Ventas + Abonos)</td><td className="text-right" style={{ padding: '4px 10px', fontSize: '0.9rem' }}>{money(totalVentasDia)}</td></tr>
                    <tr><td style={{ padding: '4px 10px 4px 20px', fontSize: '0.9rem', color: '#dc3545' }}>(-) Tarjetas / Transf / Crédito</td><td className="text-right" style={{ padding: '4px 10px', fontSize: '0.9rem', color: '#dc3545' }}>- {money(totalNoEfectivo)}</td></tr>
                    <tr><td style={{ padding: '4px 10px 4px 20px', fontSize: '0.9rem', color: '#dc3545' }}>(-) Salidas de Efectivo</td><td className="text-right" style={{ padding: '4px 10px', fontSize: '0.9rem', color: '#dc3545' }}>- {money(salidas.reduce((a, b) => a + Math.abs(b.displayAmount || 0), 0))}</td></tr>

                    <tr style={{ borderBottom: '1px solid #f1f1f1', background: '#e8f5e9' }}><td style={{ padding: 10, fontWeight: 'bold', fontSize: '1.1rem' }}>Esperado en Caja</td><td className="text-right" style={{ padding: 10, fontWeight: 'bold', fontSize: '1.1rem', color: '#146c43' }}>{money(efectivoEsperado)}</td></tr>
                  </tbody>
                </table>
              </div>

              {/* Movimientos Web */}
              {(abonos.length > 0 || salidas.length > 0) && (
                <div style={{ background: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                  <h4 style={{ margin: '0 0 15px', borderBottom: '1px solid #eee', paddingBottom: 10 }}>Detalle de Movimientos</h4>

                  {abonos.length > 0 && (
                    <div style={{ marginBottom: 15 }}>
                      <h5 style={{ color: '#007bff', margin: '0 0 5px' }}>Abonos Recibidos</h5>
                      {abonos.map((x, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #eee' }}>
                          <div>
                            <strong>{x.resolvedClientName || 'Cliente General'}</strong>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>{x.note || 'Abono de cuenta'}</div>
                          </div>
                          <div style={{ fontWeight: 'bold', color: '#28a745' }}>+ {money(x.amount)}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {salidas.length > 0 && (
                    <div>
                      <h5 style={{ color: '#dc3545', margin: '0 0 5px' }}>Salidas de Caja</h5>
                      {salidas.map((x, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #eee' }}>
                          <div>{x.note || 'Salida Varia'}</div>
                          <div style={{ fontWeight: 'bold', color: '#dc3545' }}>{money(Math.abs(x.amount))}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ELEMENTO OCULTO PARA IMPRESIÓN */}
            <div style={{ display: 'none' }}>
              <PrintWrapper id="print-wrapper-caja" className="print-80">
                <div className="brand">
                  <img src="/icons/logo.png" alt="Logo" style={{ filter: 'grayscale(100%) contrast(150%)' }} />
                  <h2>CIERRE DE CAJA</h2>
                  <p>Multirepuestos RG</p>
                  <p>{new Date().toLocaleString('es-NI')}</p>
                  <p>Cajero: {openedByName}</p>
                </div>

                <div className="section">
                  <div className="section-title">1. TOTAL INGRESOS (VENTAS + ABONOS)</div>
                  <div className="row big"><span>TOTAL GLOBAL:</span><span>{money(totalVentasDia)}</span></div>
                  <div className="row sub">(Ventas Contado + Crédito + Abonos + Ajustes)</div>
                </div>

                <div className="section">
                  <div className="section-title">2. DESGLOSE NO EFECTIVO</div>
                  {totalTarjeta > 0 && <div className="row"><span>(-) Tarjetas:</span><span>{money(totalTarjeta)}</span></div>}
                  {totalTransferencia > 0 && <div className="row"><span>(-) Transf.:</span><span>{money(totalTransferencia)}</span></div>}
                  {totalCredito > 0 && <div className="row"><span>(-) Créditos:</span><span>{money(totalCredito)}</span></div>}
                  <div className="row" style={{ borderTop: '1px dashed #000' }}><span>TOTAL NO EFECTIVO:</span><span>{money(totalNoEfectivo)}</span></div>
                </div>

                <div className="section">
                  <div className="section-title">3. FLUJO EFECTIVO (RESUMEN)</div>
                  <div className="row"><span>Fondo Inicial:</span><span>{money(cajaInicial)}</span></div>
                  <div className="row"><span>(+) Ingresos Totales:</span><span>{money(totalVentasDia)}</span></div>
                  <div className="row"><span>(-) No Efectivo:</span><span>-{money(totalNoEfectivo)}</span></div>
                  {Math.abs(salidas.reduce((s, t) => s + Math.abs(t.displayAmount || 0), 0)) > 0 && (
                    <div className="row"><span>(-) Salidas:</span><span>-{money(salidas.reduce((s, t) => s + Math.abs(t.displayAmount || 0), 0))}</span></div>
                  )}
                </div>

                <div className="section">
                  <div className="section-title">4. ARQUEO FINAL</div>
                  <div className="row big"><span>EFECTIVO ESPERADO:</span><span>{money(efectivoEsperado)}</span></div>
                  <div className="row sub">({money(efectivoEsperadoCordobas)} + {usd(efectivoEsperadoDolares)})</div>

                  <div className="row" style={{ marginTop: 8, paddingTop: 4, borderTop: '1px dashed #ccc' }}>
                    <span>EFECTIVO REAL:</span><span>{money(montoContado)}</span>
                  </div>

                  <div className={`row alert`} style={{ color: diferencia !== 0 ? '#000' : '#000', borderColor: diferencia !== 0 ? '#000' : '#000' }}>
                    <span>DIFERENCIA:</span><span>{diferencia > 0 ? '+' : ''}{money(diferencia)}</span>
                  </div>
                  <div style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold', marginTop: 2 }}>
                    {Math.abs(diferencia) < 0.5 ? '(CAJA CUADRADA)' : (diferencia > 0 ? '(SOBRANTE)' : '(FALTANTE)')}
                  </div>
                </div>

                <div className="section">
                  <div className="section-title">5. DETALLE DE MOVIMIENTOS</div>
                  <table style={{ marginTop: 0 }}>
                    <tbody>
                      {abonos.length > 0 && (
                        <>
                          <tr><td colSpan="2" style={{ fontWeight: '900', background: '#f8f9fa', fontSize: '0.9rem' }}>--- ABONOS Y CREDITOS ---</td></tr>
                          {abonos.map((x, i) => (
                            <tr key={'a' + i}>
                              <td style={{ fontSize: '0.9rem' }}>{x.resolvedClientName || x.note || 'Abono'} <br /><span style={{ fontSize: '0.75rem', color: '#555' }}>#{x.id}</span></td>
                              <td className="text-right" style={{ fontSize: '0.9rem' }}>{money(x.amount)}</td>
                            </tr>
                          ))}
                        </>
                      )}
                      {salidas.length > 0 && (
                        <>
                          <tr><td colSpan="2" style={{ fontWeight: '900', background: '#f8f9fa', fontSize: '0.9rem', paddingTop: 8 }}>--- SALIDAS DE EFECTIVO ---</td></tr>
                          {salidas.map((x, i) => (
                            <tr key={'s' + i}>
                              <td style={{ fontSize: '0.9rem' }}>{x.note || 'Salida Varia'}</td>
                              <td className="text-right" style={{ fontSize: '0.9rem' }}>{money(Math.abs(x.amount))}</td>
                            </tr>
                          ))}
                        </>
                      )}
                      {entradas.length > 0 && (
                        <>
                          <tr><td colSpan="2" style={{ fontWeight: '900', background: '#f8f9fa', fontSize: '0.9rem', paddingTop: 8 }}>--- ENTRADAS DE EFECTIVO ---</td></tr>
                          {entradas.map((x, i) => (
                            <tr key={'e' + i}>
                              <td style={{ fontSize: '0.9rem' }}>{x.note || 'Entrada Varia'}</td>
                              <td className="text-right" style={{ fontSize: '0.9rem' }}>{money(x.amount)}</td>
                            </tr>
                          ))}
                        </>
                      )}
                    </tbody>
                  </table>
                  {(abonos.length === 0 && salidas.length === 0 && entradas.length === 0) && (
                    <div style={{ textAlign: 'center', fontStyle: 'italic', fontSize: '0.8rem', padding: 5 }}>Sin movimientos extra</div>
                  )}
                </div>

                <div className="signature">
                  <div className="signature-line"></div>
                  <p>Firma Responsable</p>
                </div>
              </PrintWrapper>
            </div>


            {/* Footer con Botones de Acción */}
            <div style={{ padding: '20px', background: '#fff', borderTop: '1px solid #ccc', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Button $cancel onClick={() => setViewingReport(false)}>Seguir Editando</Button>
              <Button primary style={{ padding: '12px 24px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }} onClick={handleConfirmClose} disabled={!canClose}>
                <FaPrint /> IMPRIMIR Y CERRAR CAJA
              </Button>
            </div>
            {!canClose && <div style={{ padding: 5, textAlign: 'center', color: 'red', fontSize: '0.8rem' }}>Solo el Admin o quien abrió puede cerrar.</div>}
          </div>
        ) : (
          /* --- CONFIRMAR CIERRE (Input Conteo) --- */
          <div>
            <h3 style={{ color: '#dc3545', borderBottom: '2px solid #dc3545', paddingBottom: 10 }}>
              Arqueo y Cierre
            </h3>
            <div style={{ background: '#e9ecef', padding: 10, borderRadius: 6, marginBottom: 15 }}>
              <TotalsRow style={{ fontSize: '1.1rem' }}><span><FaUserClock /> Abrió:</span><strong>{openedByName}</strong></TotalsRow>
            </div>

            <div style={{ marginTop: 8, padding: '15px', backgroundColor: '#f8f9fa', borderRadius: 6, border: '1px dashed #ced4da' }}>
              <div style={{ fontWeight: '800', marginBottom: 10, fontSize: '1.2rem', color: '#495057' }}>Efectivo a Tener:</div>
              <TotalsRow style={{ fontSize: '1.3rem' }}><span>Córdobas:</span><strong style={{ color: '#198754' }}>C$ {Number(efectivoEsperadoCordobas).toLocaleString()}</strong></TotalsRow>
              <TotalsRow style={{ fontSize: '1.3rem' }}><span>Dólares:</span><strong style={{ color: '#198754' }}>$ {Number(efectivoEsperadoDolares).toLocaleString()}</strong></TotalsRow>
              <TotalsRow $bold style={{ marginTop: 10, borderTop: '2px solid #ccc', paddingTop: 10, fontSize: '1.5rem' }}><span>TOTAL (C$):</span><span>{money(efectivoEsperado)}</span></TotalsRow>
            </div>

            <label style={{ display: 'block', marginTop: 20, fontWeight: 800, fontSize: '1.3rem' }}>Monto Contado Físico (C$)</label>
            <SearchInput type="number" step="0.01" value={montoContado} onChange={e => setMontoContado(e.target.value)} autoFocus placeholder="Total Billetes + Monedas" style={{ fontSize: '1.5rem', padding: '12px', height: 'auto' }} />

            {montoContado && (
              <TotalsRow $bold style={{ marginTop: 15, color: diferencia !== 0 ? '#dc3545' : '#28a745', fontSize: '1.8rem', padding: '10px', background: diferencia !== 0 ? '#fff5f5' : '#f0fff4', borderRadius: 8, border: `2px solid ${diferencia !== 0 ? '#dc3545' : '#28a745'}` }}>
                <span>Diferencia:</span><span>{money(diferencia)}</span>
              </TotalsRow>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <Button primary style={{ flex: 1 }} onClick={handlePrepareClose} disabled={!canClose || !montoContado}>Ver Reporte</Button>
              <Button $cancel onClick={onClose}>Cancelar</Button>
            </div>
          </div>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default CajaModal;

// Helpers de sección para listas (usados si se restaura la vista detallada en preview, o borrar si no se usan)
function SectionList({ title, items, positive = false, neutral = false }) {
  if (!items?.length) return null;
  const color = neutral ? '#6c757d' : (positive ? '#198754' : '#dc3545');
  const fmt = (n) => `C$${Number(n || 0).toFixed(2)}`;
  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 10, marginBottom: 10 }}>
      {/* ... (Implementación opcional, simplificada arriba en el PrintWrapper) ... */}
    </div>
  );
}
const thS = { borderBottom: '1px solid #eee', padding: '6px', textAlign: 'left', fontSize: 13, color: '#555' };
const tdS = { borderBottom: '1px solid #f3f3f3', padding: '6px', fontSize: 14 };