// client/src/pages/pos/components/PaymentModal.jsx
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  FaCreditCard, FaWindowClose, FaMoneyBillWave, FaDollarSign, FaCheckCircle,
  FaHashtag, FaExchangeAlt, FaUserTag, FaCoins, FaMinusCircle, FaBalanceScale,
  FaCashRegister, FaHandshake, FaCreditCard as FaCreditCardIcon, FaPrint
} from 'react-icons/fa';

import {
  ModalOverlay, ModalContent, Button, SearchInput, TotalsRow, InfoBox
} from '../POS.styles.jsx';

/* ========== Helpers ========== */
const cleanFloat = (v) => {
  const n = parseFloat(v);
  if (Number.isNaN(n)) return 0;
  return Math.abs(n) < 0.001 ? 0 : n;
};
const fmt = (n) =>
  new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n || 0));

/* ========== Payment Modal ========== */
const PaymentModal = ({
  total = 0,
  tasaDolar = 1,
  onClose,
  onFinishSale,       // el padre (POS.jsx) guarda la venta y maneja la impresión
  clientes = [],
  users = [],         // opcional: solo para mostrar info si quisieras
  showAlert,
  initialClientId = '0',

  // datos para duplicados/consistencia (no imprimimos aquí)
  cartSnapshot = [],
  currentUserId = undefined,
  orderSubtotal = undefined,
  orderDiscountAmount = undefined,
}) => {
  /* ---- UI State ---- */
  const [efectivo, setEfectivo] = useState('0.00');
  const [tarjeta, setTarjeta] = useState('0.00');
  const [dolares, setDolares] = useState('0.00');
  const [transferencia, setTransferencia] = useState('0.00');
  const [referenciaTarjeta, setReferenciaTarjeta] = useState('');
  const [referenciaTransferencia, setReferenciaTransferencia] = useState('');
  const [tipoPagoPrincipal, setTipoPagoPrincipal] = useState('contado');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(initialClientId ?? '0');
  const [saving, setSaving] = useState(false);

  // hover del botón pagar
  const [isHovering, setIsHovering] = useState(false);

  /* ---- Derivados ---- */
  const finalClienteId = useMemo(() => {
    const n = parseInt(clienteSeleccionado, 10);
    return Number.isNaN(n) ? 0 : n;
  }, [clienteSeleccionado]);
  const isClientValid = finalClienteId !== 0;

  const numEfectivo = useMemo(() => cleanFloat(efectivo), [efectivo]);
  const numTarjeta = useMemo(() => cleanFloat(tarjeta), [tarjeta]);
  const numDolares = useMemo(() => cleanFloat(dolares), [dolares]);
  const numTransferencia = useMemo(() => cleanFloat(transferencia), [transferencia]);

  const dolaresEnMonedaLocal = useMemo(
    () => numDolares * Number(tasaDolar || 1),
    [numDolares, tasaDolar]
  );

  const pagosContadoTotal = useMemo(
    () => numEfectivo + numTarjeta + numTransferencia + dolaresEnMonedaLocal,
    [numEfectivo, numTarjeta, numTransferencia, dolaresEnMonedaLocal]
  );

  const needsReference = useMemo(() => numTarjeta > 0.01, [numTarjeta]);
  const restanteTotal = useMemo(() => Number(total) - pagosContadoTotal, [total, pagosContadoTotal]);

  const credito = useMemo(() => {
    if (tipoPagoPrincipal === 'credito' && isClientValid && restanteTotal > 0.01) return restanteTotal;
    if (pagosContadoTotal >= Number(total) - 0.0001) return 0;
    return 0;
  }, [tipoPagoPrincipal, isClientValid, restanteTotal, pagosContadoTotal, total]);

  const saldoPendienteDePago = useMemo(() => {
    const saldo = cleanFloat(restanteTotal);
    if (saldo <= 0.01) return 0;
    if (tipoPagoPrincipal === 'credito' && isClientValid) return 0;
    return saldo;
  }, [restanteTotal, tipoPagoPrincipal, isClientValid]);

  const cambio = useMemo(() => Math.max(0, -restanteTotal), [restanteTotal]);

  const tipoVentaFinal = useMemo(() => {
    const tieneCredito = credito > 0.01;
    if (tieneCredito) return pagosContadoTotal > 0.01 ? 'mixto' : 'credito_total';
    return 'contado';
  }, [credito, pagosContadoTotal]);

  const displayTipoVenta = useMemo(() => {
    if (saldoPendienteDePago > 0.01) return 'PAGO INCOMPLETO';
    if ((tipoVentaFinal === 'mixto' || tipoVentaFinal === 'credito_total') && !isClientValid) return 'CLIENTE NO SELECCIONADO';
    switch (tipoVentaFinal) {
      case 'mixto': return 'PAGO MIXTO (Contado + Crédito)';
      case 'credito_total': return 'CRÉDITO TOTAL';
      default: return 'CONTADO';
    }
  }, [tipoVentaFinal, saldoPendienteDePago, isClientValid]);

  const disableInputs = useMemo(
    () => (tipoPagoPrincipal === 'credito' && !isClientValid),
    [tipoPagoPrincipal, isClientValid]
  );

  const isButtonDisabled = useMemo(() => (
    saving ||
    saldoPendienteDePago > 0.01 ||
    ((tipoVentaFinal === 'mixto' || tipoVentaFinal === 'credito_total') && !isClientValid) ||
    (needsReference && !referenciaTarjeta.trim()) ||
    (numTransferencia > 0.01 && !referenciaTransferencia.trim())
  ), [saving, saldoPendienteDePago, tipoVentaFinal, isClientValid, needsReference, referenciaTarjeta, numTransferencia, referenciaTransferencia]);

  /* ---- Carrito local (para coherencia de totales) ---- */
  const normalizedItems = useMemo(() => {
    if (!Array.isArray(cartSnapshot)) return [];
    return cartSnapshot.map(({ raw, costo, existencia, ...rest }) => ({
      id: rest.id || rest.id_producto,
      nombre: rest.nombre ?? rest.descripcion ?? rest.producto ?? '',
      quantity: Number(rest.quantity || 0),
      precio: Number(rest.precio_venta ?? rest.precio ?? 0),
    })).filter(i => i.quantity > 0);
  }, [cartSnapshot]);

  const localSubtotal = useMemo(() => {
    if (typeof orderSubtotal === 'number') return Number(orderSubtotal);
    return normalizedItems.reduce((s, i) => s + Number(i.precio || 0) * Number(i.quantity || 0), 0);
  }, [orderSubtotal, normalizedItems]);

  const localDescuento = useMemo(() => {
    if (typeof orderDiscountAmount === 'number') return Number(orderDiscountAmount);
    const d = Number(localSubtotal) - Number(total);
    return d > 0 ? d : 0;
  }, [orderDiscountAmount, localSubtotal, total]);

  /* ---- Efectos ---- */
  useEffect(() => {
    if (tipoPagoPrincipal === 'contado' && pagosContadoTotal === 0 && Number(total) > 0) {
      setEfectivo(Number(total).toFixed(2));
    }
    if (tipoPagoPrincipal === 'credito' && !isClientValid) {
      setClienteSeleccionado('0');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoPagoPrincipal, total]);

  /* ---- Handlers ---- */
  const handleClientChange = useCallback((e) => {
    const val = String(e.target.value);
    setClienteSeleccionado(val);
    const id = parseInt(val, 10) || 0;
    if (id !== 0) {
      setTipoPagoPrincipal('contado');
      if (pagosContadoTotal < Number(total) && pagosContadoTotal === 0) {
        setEfectivo(Number(total).toFixed(2));
      }
    }
  }, [pagosContadoTotal, total]);

  const handleSetTipoContado = useCallback(() => {
    setTipoPagoPrincipal('contado');
    const pagosNoEfectivo = numTarjeta + numTransferencia + dolaresEnMonedaLocal;
    const efectivoFaltante = Math.max(0, Number(total) - pagosNoEfectivo);
    setEfectivo(Number(efectivoFaltante).toFixed(2));
  }, [numTarjeta, numTransferencia, dolaresEnMonedaLocal, total]);

  const handleSetTipoCredito = useCallback(() => {
    if (!isClientValid) {
      showAlert?.({
        title: 'Cliente Requerido',
        message: 'Debe seleccionar un cliente para habilitar la opción de Crédito.',
        type: 'error'
      });
      return;
    }
    setTipoPagoPrincipal('credito');
    setEfectivo('0.00');
    setTarjeta('0.00');
    setDolares('0.00');
    setTransferencia('0.00');
    setReferenciaTarjeta('');
    setReferenciaTransferencia('');
  }, [isClientValid, showAlert]);

  const handlePayFullCash = useCallback(() => {
    setEfectivo(Number(total).toFixed(2));
    setTarjeta('0.00');
    setDolares('0.00');
    setTransferencia('0.00');
    setReferenciaTarjeta('');
    setReferenciaTransferencia('');
    setTipoPagoPrincipal('contado');
  }, [total]);

  const computeTipoVenta = ({ efectivo, tarjeta, transferencia, dolaresLocal, credito }) => {
    const contado = (efectivo + tarjeta + transferencia + dolaresLocal) > 0.01;
    if (credito && contado) return 'mixto';
    if (credito && !contado) return 'credito_total';
    return 'contado';
  };

  /* ---- Finalizar Venta (sin imprimir aquí) ---- */
  const handleFinish = async (shouldPrintNow) => {
    // 1. Validación Estricta de Cliente (Solicitud Usuario)
    if (!isClientValid || finalClienteId === 0) {
      showAlert?.({
        title: 'Cliente Requerido',
        message: 'No puedes vender sin seleccionar un cliente. Por favor selecciona uno.',
        type: 'error'
      });
      return;
    }

    if ((tipoVentaFinal === 'credito_total' || tipoVentaFinal === 'mixto') && finalClienteId === 0) {
      showAlert?.({ title: 'Cliente Requerido', message: 'Debe seleccionar un cliente para ventas a crédito o mixtas.', type: 'error' });
      return;
    }
    if (saldoPendienteDePago > 0.01) {
      showAlert?.({ title: 'Pago Incompleto', message: `Faltan C$${saldoPendienteDePago.toFixed(2)} para completar la venta.`, type: 'warning' });
      return;
    }
    if (needsReference && !referenciaTarjeta.trim()) {
      showAlert?.({ title: 'Dato Requerido', message: 'Ingrese el número de referencia para el pago con tarjeta.', type: 'warning' });
      return;
    }
    if (numTransferencia > 0.01 && !referenciaTransferencia.trim()) {
      showAlert?.({ title: 'Dato Requerido', message: 'Ingrese el número de referencia para la transferencia.', type: 'warning' });
      return;
    }
    if (saving) return;
    setSaving(true);

    const ingresoRealEnCaja = Math.max(0, numEfectivo + dolaresEnMonedaLocal - cambio);

    const pagoDetalles = {
      totalVenta: Number(total),
      efectivo: numEfectivo,
      tarjeta: numTarjeta,
      transferencia: numTransferencia,
      dolares: numDolares,
      tasaDolarAlMomento: Number(tasaDolar),
      referenciaTarjeta: referenciaTarjeta.trim(),
      referenciaTransferencia: referenciaTransferencia.trim(),
      credito,                           // shorthand
      clienteId: finalClienteId,
      tipoVenta: computeTipoVenta({
        efectivo: numEfectivo,
        tarjeta: numTarjeta,
        transferencia: numTransferencia,
        dolaresLocal: dolaresEnMonedaLocal,
        credito: tipoPagoPrincipal === 'credito',
      }),
      cambio: Number(cambio),
      ingresoCaja: Number(ingresoRealEnCaja),
      shouldPrintNow: shouldPrintNow,    // <- IMPORTANTE: Bandera para imprimir
    };

    try {
      if (typeof onFinishSale === 'function') {
        await onFinishSale(pagoDetalles); // el padre maneja éxito/alerta/confirmación e impresión
      }
      onClose?.(); // cerrar el modal siempre al terminar
    } catch (err) {
      showAlert?.({ title: 'Error', message: err?.message || 'No se pudo completar la venta.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const alertColor =
    !isClientValid ? '#dc3545' : (saldoPendienteDePago > 0.01 ? '#dc3545' : ((cambio > 0.01 ? '#28a745' : '#17a2b8')));

  const alertMessage =
    !isClientValid
      ? '¡SELECCIONA UN CLIENTE!'
      : (saldoPendienteDePago > 0.01
        ? `¡FALTA CUBRIR! C$${saldoPendienteDePago.toFixed(2)}`
        : (cambio > 0.01 ? `CAMBIO A ENTREGAR: C$${cambio.toFixed(2)}` : 'BALANCE PERFECTO'));

  const buttonBgColor = isHovering ? '#218838' : '#28a745';

  const handleMouseEnter = () => !isButtonDisabled && setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  /* ---- Render ---- */
  return (
    <ModalOverlay>
      <ModalContent
        style={{
          maxWidth: '950px',
          width: '96%',
          maxHeight: '90vh',
          overflow: 'hidden',
          borderRadius: 16,
          backgroundColor: '#f8f9fa',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderBottom: '2px solid #e9ecef', paddingBottom: 15, marginBottom: 20
          }}
        >
          <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.5rem', fontWeight: 800 }}>
            <FaCreditCardIcon style={{ marginRight: '0.5rem', color: '#007bff' }} /> PROCESAR PAGO
          </h2>
          <Button
            $cancel onClick={onClose}
            style={{ borderRadius: '50%', width: 40, height: 40, padding: 0, fontSize: '1.2rem', backgroundColor: '#fee2e2', color: '#ef4444', borderColor: 'transparent' }}
          >
            <FaWindowClose />
          </Button>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 4fr', gap: '2rem', height: 'calc(90vh - 140px)' }}>
          {/* Left */}
          <div style={{ paddingRight: 10, borderRight: '1px solid #e2e8f0', overflowY: 'auto', paddingBottom: 10 }}>
            {/* Opciones */}
            <div style={{ padding: 20, border: '1px solid #e2e8f0', borderRadius: 12, backgroundColor: '#fff', marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ marginTop: 0, color: '#334155', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 15 }}>
                <FaCashRegister style={{ marginRight: 6 }} /> Tipo de Venta
              </h4>

              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <Button
                  onClick={handleSetTipoContado}
                  style={{
                    flex: 1, padding: '10px 0',
                    backgroundColor: tipoPagoPrincipal === 'contado' ? '#0ea5e9' : '#f1f5f9',
                    color: tipoPagoPrincipal === 'contado' ? '#fff' : '#475569',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: '700',
                    boxShadow: tipoPagoPrincipal === 'contado' ? '0 4px 6px -1px rgba(14, 165, 233, 0.4)' : 'none'
                  }}
                >
                  CONTADO
                </Button>
                <Button
                  onClick={handleSetTipoCredito}
                  disabled={!isClientValid}
                  style={{
                    flex: 1, padding: '10px 0',
                    backgroundColor: tipoPagoPrincipal === 'credito' ? '#f59e0b' : '#f1f5f9',
                    color: tipoPagoPrincipal === 'credito' ? '#fff' : '#475569',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: '700',
                    boxShadow: tipoPagoPrincipal === 'credito' ? '0 4px 6px -1px rgba(245, 158, 11, 0.4)' : 'none',
                    opacity: !isClientValid ? 0.5 : 1
                  }}
                >
                  CRÉDITO
                </Button>
              </div>

              {/* Cliente */}
              <label style={{ display: 'block', fontWeight: '700', marginBottom: 8, color: '#475569', fontSize: '0.9rem' }}>
                <FaUserTag /> Seleccionar Cliente <span style={{ color: '#ef4444' }}>* (Obligatorio)</span>
              </label>
              <SearchInput
                as="select"
                value={clienteSeleccionado}
                onChange={handleClientChange}
                style={{
                  height: 42, padding: '0 12px', width: '100%', fontSize: '1rem',
                  border: isClientValid ? '2px solid #22c55e' : '2px solid #ef4444',
                  backgroundColor: isClientValid ? '#f0fdf4' : '#fef2f2',
                  borderRadius: 8
                }}
              >
                <option value="0">-- Seleccionar Cliente --</option>
                {(clientes || []).map(c => (
                  <option key={(c.id_cliente ?? c.id)} value={(c.id_cliente ?? c.id)}>
                    {c.nombre}{Number(c.saldo_pendiente || 0) > 0 ? ` (Deuda: C$${Number(c.saldo_pendiente).toFixed(2)})` : ''}
                  </option>
                ))}
              </SearchInput>

              {!isClientValid && (
                <p style={{ color: '#ef4444', margin: '8px 0 0', fontSize: '0.85rem', fontWeight: '600' }}>
                  <FaWindowClose style={{ marginRight: 4 }} /> No puedes vender sin seleccionar un cliente.
                </p>
              )}
            </div>

            {/* Medios de pago */}
            <div style={{ padding: 20, border: '1px solid #e2e8f0', borderRadius: 12, backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ marginTop: 0, color: '#334155', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9', paddingBottom: 10, marginBottom: 15 }}>
                Desglose de Pago (C$)
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: 6, color: '#64748b' }}>
                    <FaMoneyBillWave /> Efectivo
                  </label>
                  <SearchInput type="number" step="0.01" value={efectivo} onChange={e => setEfectivo(e.target.value)} style={{ width: '100%', height: 38, fontSize: '1rem', borderRadius: 8, border: '1px solid #cbd5e1' }} disabled={disableInputs} />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: 6, color: '#64748b' }}>
                    <FaDollarSign /> Dólares
                  </label>
                  <SearchInput type="number" step="0.01" value={dolares} onChange={e => setDolares(e.target.value)} style={{ width: '100%', height: 38, fontSize: '1rem', borderRadius: 8, border: '1px solid #cbd5e1' }} disabled={disableInputs} />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: 6, color: '#64748b' }}>
                    <FaCreditCardIcon /> Tarjeta
                  </label>
                  <SearchInput type="number" step="0.01" value={tarjeta} onChange={e => setTarjeta(e.target.value)} style={{ width: '100%', height: 38, fontSize: '1rem', borderRadius: 8, border: '1px solid #cbd5e1' }} disabled={disableInputs} />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: 6, color: '#64748b' }}>
                    <FaExchangeAlt /> Transferencia
                  </label>
                  <SearchInput type="number" step="0.01" value={transferencia} onChange={e => setTransferencia(e.target.value)} style={{ width: '100%', height: 38, fontSize: '1rem', borderRadius: 8, border: '1px solid #cbd5e1' }} disabled={disableInputs} />
                </div>
              </div>

              {tipoPagoPrincipal === 'credito' && (
                <div style={{ marginTop: 15, padding: 12, backgroundColor: '#fff7ed', borderRadius: 8, border: '1px dashed #f97316' }}>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', marginBottom: 4, color: '#c2410c' }}>
                    <FaMinusCircle /> CRÉDITO GENERADO
                  </label>
                  <div style={{ fontSize: '1.2rem', color: '#ea580c', fontWeight: 800 }}>C$ {credito.toFixed(2)}</div>
                </div>
              )}

              {needsReference && (
                <div style={{ marginTop: 15, padding: 12, border: '1px solid #fcd34d', borderRadius: 8, backgroundColor: '#fffbeb' }}>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', color: '#b45309', marginBottom: 6 }}>
                    <FaHashtag /> Nº Referencia Tarjeta <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <SearchInput type="text" placeholder="Ej: 1234" value={referenciaTarjeta} onChange={e => setReferenciaTarjeta(e.target.value)} style={{ width: '100%', height: 36, fontSize: '0.95rem' }} />
                </div>
              )}

              {numTransferencia > 0.01 && (
                <div style={{ marginTop: 15, padding: 12, border: '1px solid #bae6fd', borderRadius: 8, backgroundColor: '#f0f9ff' }}>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', color: '#0369a1', marginBottom: 6 }}>
                    <FaHashtag /> Nº Referencia Transferencia <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <SearchInput type="text" placeholder="Ej: REF-5678" value={referenciaTransferencia} onChange={e => setReferenciaTransferencia(e.target.value)} style={{ width: '100%', height: 36, fontSize: '0.95rem' }} />
                </div>
              )}

              {tipoPagoPrincipal === 'contado' && (
                <Button info onClick={handlePayFullCash} style={{ width: '100%', padding: '12px 0', marginTop: 20, backgroundColor: '#e0f2fe', color: '#0284c7', border: '1px dashed #0ea5e9', fontSize: '0.95rem', fontWeight: 600 }}>
                  <FaCoins /> Rellenar con Efectivo (Total: C$ {Number(total).toFixed(2)})
                </Button>
              )}
            </div>
          </div>

          {/* Right */}
          <div style={{ paddingLeft: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: 10 }}>
            <div>
              <InfoBox style={{ marginBottom: 15, padding: 20, backgroundColor: '#f0f9ff', border: 'none', borderRadius: 12, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                <TotalsRow $bold style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: 5 }}>
                  <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 600 }}>TOTAL A PAGAR</span>
                  <span>C$ {Number(total).toFixed(2)}</span>
                </TotalsRow>
                <TotalsRow style={{ borderTop: '1px solid #cbd5e0', paddingTop: 10, fontSize: '0.9rem', color: '#64748b' }}>
                  <span>Tasa USD: C$ {Number(tasaDolar).toFixed(2)}</span>
                  <span style={{ color: '#0f172a', fontWeight: 700 }}>${(Number(total) / Number(tasaDolar || 1)).toFixed(2)} USD</span>
                </TotalsRow>
              </InfoBox>

              <div style={{ padding: 15, border: '1px solid #e2e8f0', borderRadius: 12, marginBottom: 15, backgroundColor: '#fff' }}>
                <TotalsRow style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: 8 }}>
                  <span>Pagado (Contado)</span>
                  <span style={{ fontWeight: '700', color: '#1e293b' }}>C$ {pagosContadoTotal.toFixed(2)}</span>
                </TotalsRow>

                <TotalsRow style={{ fontSize: '0.95rem' }}>
                  <span>Estado</span>
                  <span style={{ fontWeight: '700', color: credito > 0.01 ? '#f59e0b' : (isClientValid ? '#22c55e' : '#ef4444') }}>
                    {displayTipoVenta}
                  </span>
                </TotalsRow>
              </div>

              <InfoBox
                style={{
                  marginBottom: 10, padding: 15,
                  backgroundColor: alertColor === '#dc3545' ? '#fef2f2' : (alertColor === '#28a745' ? '#ecfccb' : '#e0f2fe'),
                  color: alertColor === '#dc3545' ? '#ef4444' : (alertColor === '#28a745' ? '#4d7c0f' : '#0369a1'),
                  fontWeight: '800', fontSize: '1.1rem',
                  textAlign: 'center', borderRadius: 12, border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <FaBalanceScale style={{ marginRight: 8 }} /> {alertMessage}
              </InfoBox>
            </div>

            {/* ACCIONES FINALES (BOTONES) */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* BOTÓN 1: PAGAR E IMPRIMIR (PRINCIPAL) */}
              <Button
                type="button"
                onClick={(e) => { e.preventDefault(); handleFinish(true); }}
                disabled={isButtonDisabled || !isClientValid}
                style={{
                  width: '100%',
                  padding: '16px 0',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  backgroundColor: (isButtonDisabled || !isClientValid) ? '#cbd5e1' : '#2563eb', // Azul fuerte
                  color: 'white',
                  border: 'none',
                  borderRadius: 10,
                  boxShadow: (isButtonDisabled || !isClientValid) ? 'none' : '0 4px 6px -1px rgba(37, 99, 235, 0.4)',
                  transition: 'all 0.2s'
                }}
              >
                <FaPrint style={{ marginRight: 8 }} /> PAGAR E IMPRIMIR
              </Button>

              {/* BOTÓN 2: SOLO PAGAR/GUARDAR (SECUNDARIO) */}
              <Button
                type="button"
                onClick={(e) => { e.preventDefault(); handleFinish(false); }}
                disabled={isButtonDisabled || !isClientValid}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  fontSize: '1rem',
                  fontWeight: 700,
                  backgroundColor: 'white',
                  color: (isButtonDisabled || !isClientValid) ? '#cbd5e1' : '#475569',
                  border: (isButtonDisabled || !isClientValid) ? '1px solid #e2e8f0' : '2px solid #cbd5e1',
                  borderRadius: 10,
                  transition: 'all 0.2s'
                }}
              >
                <FaCheckCircle style={{ marginRight: 8 }} /> Solo Guardar (Sin Ticket)
              </Button>

            </div>
          </div>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};


export default PaymentModal;
