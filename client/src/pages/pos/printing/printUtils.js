// client/src/pages/POS/printing/printUtils.js
const moneyNI = (n) =>
  new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(Number(n || 0));

export function normalizeSale(raw) {
  const total = Number(raw.totalVenta ?? raw.total_venta ?? raw.total ?? 0);
  const subtotal = Number(raw.subtotal ?? raw.sub_total ?? raw.subTotal ?? total);
  const descuento = Number(raw.descuento ?? raw.discount ?? (subtotal - total > 0 ? subtotal - total : 0));

  const items = Array.isArray(raw.items) ? raw.items.map((it, idx) => ({
    id: it.id ?? it.id_producto ?? `it-${idx}`,
    nombre: it.nombre ?? it.descripcion ?? it.producto ?? it.name ?? `Item ${idx + 1}`,
    cantidad: Number(it.cantidad ?? it.quantity ?? 0),
    precio: Number(it.precio ?? it.precio_unitario ?? it.precio_venta ?? 0),
  })) : [];

  return {
    id: raw.id,
    fecha: raw.fecha || new Date().toISOString(),
    clientId: raw.clientId ?? raw.idCliente ?? 0,
    userId: raw.userId ?? raw.idUsuario ?? 0,
    estado: raw.estado,
    pagoDetalles: raw.pagoDetalles || {},
    items,
    subtotal,
    descuento,
    total,
  };
}

export function buildTicketHTML(tx, clientes = [], users = []) {
  const cli = clientes.find(c => String(c.id_cliente ?? c.id) === String(tx.clientId));
  const userName = users.find(u => String(u.id_usuario ?? u.id) === String(tx.userId))?.nombre_usuario || '';
  const fecha = new Date(tx.fecha).toLocaleString('es-NI');

  const lineItems = tx.items.map(it => `
    <div style="margin-bottom:4px">
      <div style="white-space:pre-wrap">${it.nombre}</div>
      <div style="display:flex;justify-content:space-between">
        <span>${it.cantidad} x C$${moneyNI(it.precio)}</span>
        <span>C$${moneyNI(it.cantidad * it.precio)}</span>
      </div>
    </div>
  `).join('');

  const p = tx.pagoDetalles || {};
  const pagosHTML = `
    <div style="margin-top:8px;font-size:12px">
      <div>Pago: ${(p.tipoVenta || 'contado').toString().toUpperCase()}</div>
      <div>Efectivo: C$${moneyNI(p.efectivo || 0)}</div>
      <div>Tarjeta: C$${moneyNI(p.tarjeta || 0)}</div>
      ${p.referenciaTarjeta ? `<div>Ref. Tarjeta: ${p.referenciaTarjeta}</div>` : ''}
      <div>Transf.: C$${moneyNI(p.transferencia || 0)}</div>
      <div>USD: ${moneyNI(p.dolares || 0)} (Tasa C$${moneyNI(p.tasaDolarAlMomento || 0)})</div>
      <div>Cambio: C$${moneyNI(p.cambio || 0)}</div>
      ${p.credito ? `<div>Crédito: C$${moneyNI(p.credito)}</div>` : ''}
    </div>
  `;

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Ticket #${tx.id}</title>
    <style>
      @media print { @page { size: 80mm auto; margin: 4mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      body { font-family: monospace; color:#000; }
      .wrap { width:260px; padding:10px; }
      .hr { border-top:1px dashed #000; margin:6px 0; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div style="text-align:center;border-bottom:1px dashed #000;padding-bottom:8px;margin-bottom:8px">
        <strong>Multirepuestos RG</strong><br/><small>RUC: ———</small><br/><small>Tel: ———</small>
      </div>
      <div style="font-size:12px;margin-bottom:8px">
        <div>Fecha: ${fecha}</div>
        ${cli ? `<div>Cliente: ${cli.nombre}</div>` : ``}
        ${userName ? `<div>Vendedor: ${userName}</div>` : ``}
        ${tx.id ? `<div>Venta #: ${tx.id}</div>` : ``}
      </div>
      <div class="hr"></div>
      <div style="padding:6px 0;font-size:12px">${lineItems}</div>
      <div class="hr"></div>
      <div style="margin-top:6px;font-size:12px">
        <div style="display:flex;justify-content:space-between"><strong>SUBTOTAL:</strong><strong>C$${moneyNI(tx.subtotal)}</strong></div>
        ${tx.descuento ? `<div style="display:flex;justify-content:space-between"><span>DESCUENTO:</span><span>- C$${moneyNI(tx.descuento)}</span></div>` : ``}
        <div style="display:flex;justify-content:space-between;border-top:1px solid #000;margin-top:6px;padding-top:6px"><strong>TOTAL:</strong><strong>C$${moneyNI(tx.total)}</strong></div>
      </div>
      ${pagosHTML}
      <div style="text-align:center;margin-top:10px;font-size:12px">¡Gracias por su compra!</div>
    </div>
    <script>
      window.onload = function() {
        try { window.focus(); window.print(); console.log('ticket impreso'); }
        catch(e){ console.log('ticket impreso (fallback), error:', e?.message); }
        setTimeout(() => window.close && window.close(), 250);
      };
    </script>
  </body>
</html>`;
}

export function printHTML(htmlString) {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed'; iframe.style.right = '0'; iframe.style.bottom = '0';
  iframe.style.width = '0'; iframe.style.height = '0'; iframe.style.border = '0';
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow || iframe.contentDocument;
  const iDoc = doc.document || doc;
  iDoc.open(); iDoc.write(htmlString); iDoc.close();
}
