import{b as oe,r as v,a as M,j as e,U as re,b4 as H,a$ as ne,a8 as ie,az as W,a7 as G,aB as se,q as b,p as de}from"./vendor-Dp7SZ6lv.js";import{a as le}from"./index-CRUdEL4u.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-DjsH35t9.js";const P="/api",ce=`${P}/caja/reporte`,pe=`${P}/caja/abiertas/activas`;function fe(){const a=new Date,w=a.getTimezoneOffset()*6e4;new Date(a.getTime()-w);const l=a.getFullYear(),f=String(a.getMonth()+1).padStart(2,"0"),m=String(a.getDate()).padStart(2,"0");return`${l}-${f}-${m}`}const s=a=>`C$${Number(a||0).toFixed(2)}`,V=a=>a?new Date(a).toLocaleString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0}):"—";function F(a){return a?typeof a=="string"?a:a.name??a.nombre??a.fullName??a.displayName??a.nombre_usuario??a.username??(a.user&&(a.user.name||a.user.username||a.user.displayName))??(a.id?`Usuario ${a.id}`:"—"):"—"}function me(){const[a,w]=v.useState(()=>localStorage.getItem("token")||null);return v.useEffect(()=>{const l=localStorage.getItem("token");l&&l!==a&&w(l)},[a]),a}const ge=de`
  @page { size: A4; margin: 12mm; }
  @media print {
    /* Ocultar controles / botones */
    .no-print { display: none !important; }
    /* Fondo blanco y tipografía legible */
    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    /* Quitar sombras y elevaciones a tarjetas */
    article, section, header, div, .card, .CardsGrid, .Card {
      box-shadow: none !important;
      filter: none !important;
    }
    /* Ajustar grid para ocupar el ancho de página */
    .cards-grid-print { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
    @media (max-width: 99999px) {
      /* Forzamos siempre 2 columnas al imprimir (si caben) */
      .cards-grid-print { grid-template-columns: 1fr 1fr !important; }
    }
  }
`;function J(a){let w=[];if(Array.isArray(a==null?void 0:a.transactions))w=a.transactions;else if(a!=null&&a.detalles_json)try{w=(typeof a.detalles_json=="string"?JSON.parse(a.detalles_json):a.detalles_json).transactions||[]}catch(c){console.error("Error parseando snapshot en calculateReportStats",c)}const l=Number((a==null?void 0:a.initialAmount)||(a==null?void 0:a.monto_inicial)||0),f={ventasContado:[],devoluciones:[],cancelaciones:[],entradas:[],salidas:[],abonos:[]};let m=0,h=0,A=0,k=0,E=0,S=0,z=0,T=0;for(const c of w){const n=((c==null?void 0:c.type)||"").toLowerCase();let i=(c==null?void 0:c.pagoDetalles)||{};if(typeof i=="string")try{i=JSON.parse(i)}catch(d){console.error("Error parseando pagoDetalles en reporte:",c,d),i={}}(!i||typeof i!="object")&&(i={});let g=Number(i.ingresoCaja!==void 0?i.ingresoCaja:c.amount||0),C=Number(i.totalVenta!==void 0?i.totalVenta:c.amount||0);(n==="salida"||n.includes("devolucion"))&&(g=-Math.abs(g),C=-Math.abs(C));const $={...c,pagoDetalles:i,displayAmount:C},O=Number(i.tarjeta||0),t=Number(i.transferencia||0),o=Number(i.credito||0);if(n.startsWith("venta")||n.includes("abono")||n.includes("pedido")||n.includes("apartado")?(A+=O,k+=t,E+=o):n==="ajuste"&&(i.target==="tarjeta"&&(A+=Number(c.amount||0)),i.target==="credito"&&(E+=Number(c.amount||0)),i.target==="transferencia"&&(k+=Number(c.amount||0))),n==="venta_contado"||n==="venta_mixta"||n==="venta_credito"||n.startsWith("venta"))if(i.efectivo!==void 0||i.dolares!==void 0){const d=Number(i.efectivo||0),N=Number(i.dolares||0),R=Number(i.cambio||0);m+=d-R,h+=N}else{const d=g-O-t-o;m+=d}else n.includes("abono")?i.dolares!==void 0?(h+=Number(i.dolares||0),m+=Number(i.efectivo||0)):m+=g:n==="entrada"?m+=Math.abs(g):n==="salida"?m-=Math.abs(g):n.includes("devolucion")?m+=g:n==="ajuste"?(i.target==="efectivo"&&(m+=g,i.hidden&&(T+=g)),i.target==="dolares"&&(h+=g)):m+=g;n.startsWith("venta")||n.includes("abono")||n==="entrada"?z+=Math.abs(C):n==="ajuste"&&(z+=C);const p=n==="devolucion"||n.includes("devolucion");n==="venta_contado"||n==="venta_mixta"||n==="venta_credito"?f.ventasContado.push($):p?(f.devoluciones.push($),S+=Math.abs(C)):n==="cancelacion"||n==="anulacion"?(f.cancelaciones.push($),S+=Math.abs(C)):n==="entrada"?f.entradas.push($):n==="salida"?f.salidas.push($):(n.includes("abono")||n.includes("pedido")||n.includes("apartado"))&&f.abonos.push($)}const _=Number((a==null?void 0:a.tasaDolar)||36.6);return{cajaInicial:l,netCordobas:m,netDolares:h,movimientoNetoEfectivo:m+h*_,efectivoEsperado:l+m+h*_,efectivoEsperadoCordobas:l+m,efectivoEsperadoDolares:h,ventasContado:f.ventasContado,devoluciones:f.devoluciones,cancelaciones:f.cancelaciones,entradas:f.entradas,salidas:f.salidas,abonos:f.abonos,totalTarjeta:A,totalTransferencia:k,totalCredito:E,totalNoEfectivo:A+k+E,sumDevolucionesCancelaciones:S,totalVentasDia:z,tasaRef:_,totalHidden:T}}const r={primary:"#0f172a",secondary:"#475569",danger:"#dc2626",bg:"#f8fafc",border:"#e2e8f0",text:"#1e293b",textLight:"#64748b"},ue=b.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${r.bg};
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: ${r.text};
`,be=b.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  border: 1px solid ${r.border};
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06);
`,xe=b.div`
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    color: ${r.primary};
    display: flex;
    align-items: center;
    gap: 12px;
  }
  p {
    margin: 4px 0 0 0;
    color: ${r.textLight};
    font-size: 0.9rem;
  }
`,he=b.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid ${r.border};
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  input[type="date"] {
    border: none;
    background: transparent;
    padding: 8px 12px 8px 36px;
    font-weight: 500;
    color: ${r.text};
    font-family: inherit;
    outline: none;
    font-size: 0.9rem;
    cursor: pointer;
  }

  button {
    background: ${r.bg};
    border: 1px solid ${r.border};
    color: ${r.secondary};
    width: 36px; height: 36px;
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: ${r.primary};
      color: white;
      border-color: ${r.primary};
    }
  }
`,U=b.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`,q=b.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${r.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex; flex-direction: column;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }
`,Y=b.div`
  padding: 1.25rem;
  border-bottom: 1px solid ${r.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${a=>a.isOpen?"#f0fdf4":"#f8fafc"};
`,Z=b.span`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  ${a=>a.isOpen?`
    color: #166534; background: #dcfce7; border: 1px solid #bbf7d0;
  `:`
    color: #1e293b; background: #f1f5f9; border: 1px solid #e2e8f0;
  `}
`,Q=b.div`
  padding: 1.5rem;
  flex: 1;
  display: flex; flex-direction: column; gap: 1rem;
`,ye=b.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: ${r.textLight};
  padding: 4px 0;
  align-items: center;

  strong {
    color: ${r.text};
    font-weight: 600;
    font-family: 'Roboto Mono', monospace; // Banking feel for numbers
    font-size: 1rem;
  }

  &.highlight {
    background: #f8fafc;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid ${r.border};
    margin: 0.5rem 0;
    
    strong { color: ${r.primary}; font-weight: 700; font-size: 1.1rem; }
  }
`,ve=b.div`
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex; justify-content: space-between; align-items: center;
  margin-top: auto;
  
  ${a=>a.diff===0?`
    background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0;
  `:`
    background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca;
  `}
`,K=b.div`
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid ${r.border};
`,X=b.button`
  width: 100%;
  background: white;
  border: 1px solid ${r.border};
  padding: 0.6rem;
  border-radius: 6px;
  font-weight: 600;
  color: ${r.secondary};
  cursor: pointer;
  display: flex;
  align-items: center; justify-content: center; gap: 8px;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background: ${r.primary};
    color: white;
    border-color: ${r.primary};
  }
`,je=b.button`
  background: white;
  border: 1px solid ${r.border};
  width: 40px; height: 40px;
  border-radius: 8px;
  display: grid; place-items: center;
  cursor: pointer;
  color: ${r.text};
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  transition: all 0.2s;

  &:hover {
    background: ${r.bg};
    border-color: ${r.secondary};
    color: ${r.primary};
  }
`,we=b.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  margin-top: 1rem;
  
  th {
    text-align: left;
    padding: 8px;
    background: #f1f5f9;
    color: #475569;
    font-weight: 600;
    border-bottom: 1px solid #e2e8f0;
  }
  td {
    padding: 8px;
    border-bottom: 1px solid #f1f5f9;
    color: #1e293b;
  }
  tr:last-child td { border-bottom: none; }
  .num { text-align: right; font-family: 'Roboto Mono', monospace; }
  .center { text-align: center; }
`,Ne=()=>{const a=me(),w=oe(),{settings:l}=le(),[f,m]=v.useState(()=>fe()),[h,A]=v.useState(!1),[k,E]=v.useState([]),[S,z]=v.useState([]),[T,_]=v.useState([]),[c,n]=v.useState(null),i=v.useMemo(()=>{const t={"Content-Type":"application/json"};return a&&(t.Authorization=`Bearer ${a}`),t},[a]),g=v.useCallback(async()=>{var t,o,p;A(!0),n(null);try{const[u,d]=await Promise.all([M.get(ce,{headers:i,params:{date:f}}),M.get(pe,{headers:i})]);E(Array.isArray((t=u.data)==null?void 0:t.abiertas)?u.data.abiertas:[]),z(Array.isArray((o=u.data)==null?void 0:o.cerradas)?u.data.cerradas:[]),_(Array.isArray((p=d.data)==null?void 0:p.abiertas)?d.data.abiertas:[])}catch{n("Error al cargar datos.")}finally{A(!1)}},[i,f]);v.useEffect(()=>{g()},[g]);const C=async t=>{var o,p,u;if(window.confirm(`¿Seguro que deseas FORZAR el cierre de la caja de ${F(t.openedBy)}? 

Esto asumirá que el dinero contado es igual al calculado (Cuadre Perfecto).`))try{const d=new Date().toISOString(),N={userId:((o=t.openedBy)==null?void 0:o.id)||t.usuario_id,closedAt:d,closedBy:{id:999,name:"Admin (Forzado)"},countedAmount:0,notes:"Cierre Forzado por Administrador desde Reportes"};await M.post(`${P}/caja/session/close`,N,{headers:i}),alert("Caja cerrada exitosamente."),g()}catch(d){console.error(d),d.response&&d.response.status===404?(alert("Esta caja ya no existe o ya estaba cerrada. Se actualizará la lista."),g()):alert("Error cerrando caja: "+(((u=(p=d.response)==null?void 0:p.data)==null?void 0:u.message)||d.message))}},$=t=>{var D,L;const o=J(t),p=window.open("","_blank");if(!p)return;const u=(l==null?void 0:l.empresa_nombre)||"Multirepuestos RG",d=(l==null?void 0:l.empresa_eslogan)||"Repuestos de confianza al mejor precio",N=(l==null?void 0:l.empresa_logo_url)||window.location.origin+"/icons/logo.png",R=`
      @page { size: A4; margin: 15mm; }
      body { font-family: 'Inter', Helvetica, Arial, sans-serif; padding: 0; margin: 0; color: #1e293b; max-width: none; background: #fff; }
      
      .brand { 
        display: flex; justify-content: space-between; align-items: flex-start;
        border-bottom: 3px solid #1e293b; padding-bottom: 20px; margin-bottom: 30px;
      }
      .brand img { width: 140px; height: auto; }
      .brand-info { text-align: right; }
      .brand h1 { margin: 0 0 5px 0; color: #1e293b; font-size: 24pt; letter-spacing: -0.5px; font-weight: 800; }
      .brand p { margin: 2px 0; color: #64748b; font-size: 10pt; }

      .box { 
        background: #fff; 
        border: 1px solid #cbd5e1; 
        border-radius: 8px; 
        margin-bottom: 20px; 
        padding: 0;
        overflow: hidden;
      }
      .box-header {
        background: #f1f5f9;
        padding: 10px 15px;
        border-bottom: 1px solid #cbd5e1;
        font-weight: 700;
        color: #334155;
        font-size: 10pt;
        text-transform: uppercase;
      }
      .box-content { padding: 15px; }

      .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #e2e8f0; font-size: 10pt; }
      .row:last-child { border-bottom: none; }
      .row.bold { font-weight: 700; color: #0f172a; font-size: 11pt; border-bottom: 1px solid #cbd5e1; margin-top: 5px; padding-top: 8px; }
      .row.sub-row { color: #64748b; font-size: 9pt; padding-left: 10px; font-style: italic; border: none; }

      .text-right { text-align: right; }
      .text-success { color: #15803d; }
      .text-danger { color: #dc2626; }

      .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
      
      /* Tables */
      table { width: 100%; border-collapse: collapse; }
      th { background: #f8fafc; text-align: left; padding: 8px; font-size: 9pt; color: #475569; border-bottom: 2px solid #e2e8f0; }
      td { padding: 8px; font-size: 10pt; border-bottom: 1px solid #f1f5f9; color: #334155; }
      tr:last-child td { border: none; }
      .num { font-family: 'Roboto Mono', monospace; text-align: right; }

      .footer { margin-top: 50px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; color: #94a3b8; font-size: 9pt; }
      .signatures { display: flex; justify-content: space-between; margin-top: 40px; padding: 0 40px; }
      .sign-box { border-top: 1px solid #94a3b8; width: 40%; text-align: center; padding-top: 5px; font-size: 10pt; color: #64748b; }
    `,j=Number(t.contado||t.countedAmount||0)-o.efectivoEsperado,x=`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reporte de Caja - ${V(t.closedAt||t.hora_cierre)}</title>
        <style>${R}</style>
      </head>
      <body>
        
        <div class="brand">
           <img src="${N}" alt="Logo" onerror="this.style.display='none'" />
           <div class="brand-info">
             <h1>REPORTE DE CAJA</h1>
             <p>${new Date().toLocaleDateString("es-NI",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
             <p>"${d}"</p>
             <p>${u}</p>
           </div>
        </div>

        <div class="info-grid">
           <div class="box">
             <div class="box-header">Detalles de Sesión</div>
             <div class="box-content">
               <div class="row"><span>Cajero Apertura:</span> <strong>${F(t.openedBy||t.abierta_por)}</strong></div>
               <div class="row"><span>Fecha Apertura:</span> <span>${V(t.openedAt||t.hora_apertura)}</span></div>
               <div class="row"><span>Cajero Cierre:</span> <strong>${F(t.closedBy||t.cerrada_por)}</strong></div>
               <div class="row"><span>Fecha Cierre:</span> <span>${V(t.closedAt||t.hora_cierre)}</span></div>
             </div>
           </div>

           <div class="box">
             <div class="box-header">Resumen General</div>
             <div class="box-content">
                <div class="row bold"><span>Efectivo Esperado:</span> <span>${s(o.efectivoEsperado)}</span></div>
                <div class="row sub-row">(${s(o.efectivoEsperadoCordobas)} C$ + $${Number(o.efectivoEsperadoDolares).toFixed(2)})</div>
                
                <div class="row bold" style="margin-top: 10px;"><span>Contado Real:</span> <span>${s(t.contado||t.countedAmount)}</span></div>
                
                <div class="row bold ${j<-.5?"text-danger":j>.5?"text-success":""}" style="justify-content: flex-end; font-size: 14pt; margin-top: 15px;">
                  <span>Diferencia: ${j>0?"+":""}${s(j)}</span>
                </div>
             </div>
           </div>
        </div>

        <div class="box">
          <div class="box-header">Conciliación de Efectivo</div>
          <div class="box-content">
                <div class="section">
                  <div class="row bold" style="background:#f8fafc; padding:8px;"><span>1. TOTAL INGRESOS BRUTOS:</span><span>${s(o.totalVentasDia)}</span></div>
                  <div class="row sub-row" style="margin-bottom:10px;">(Incluye Ventas Contado, Crédito, Abonos, Entradas y Ajustes)</div>
                </div>

                <div class="section">
                  <div class="row bold" style="border:none;"><span>2. MENOS NO EFECTIVO:</span></div>
                  ${o.totalTarjeta>0?`<div class="row"><span>(-) Tarjetas:</span><span>${s(o.totalTarjeta)}</span></div>`:""}
                  ${o.totalTransferencia>0?`<div class="row"><span>(-) Transferencias:</span><span>${s(o.totalTransferencia)}</span></div>`:""}
                  ${o.totalCredito>0?`<div class="row"><span>(-) Créditos Otorgados:</span><span>${s(o.totalCredito)}</span></div>`:""}
                  <div class="row bold" style="border-top: 1px dashed #000; margin-top:5px;"><span>TOTAL DEDUCIBLE:</span><span>${s(o.totalNoEfectivo)}</span></div>
                </div>

                <div class="section" style="margin-top:15px;">
                  <div class="row bold" style="border:none;"><span>3. FLUJO DE CAJA NETO:</span></div>
                  <div class="row"><span>(+) Fondo Inicial:</span><span>${s(t.monto_inicial||t.initialAmount)}</span></div>
                  <div class="row"><span>(+) Ingresos Totales:</span><span>${s(o.totalVentasDia)}</span></div>
                  <div class="row"><span>(-) Total No Efectivo:</span><span>-${s(o.totalNoEfectivo)}</span></div>
                  ${Math.abs((D=o.salidas)==null?void 0:D.reduce((y,I)=>y+Math.abs(I.amount||0),0))>0?`
                      <div class="row"><span>(-) Salidas de Caja:</span><span>-${s(Math.abs((L=o.salidas)==null?void 0:L.reduce((y,I)=>y+Math.abs(I.amount||0),0)))}</span></div>
                  `:""}
                  <div class="row bold" style="background:#f0fdf4; padding:8px; border:1px solid #bbf7d0; margin-top:10px;">
                    <span>= EFECTIVO ESPERADO EN CAJA:</span><span>${s(o.efectivoEsperado)}</span>
                  </div>
                </div>
            </div>
          </div>
        </div>

        <div class="footer">
           <div class="signatures">
              <div class="sign-box">Firma Cajero</div>
              <div class="sign-box">Firma Supervisor</div>
           </div>
           <p style="margin-top:30px;">Reporte generado automáticamente por Sistema RG</p>
        </div>

      </body>
      </html>
    `;p.document.write(x),p.document.close(),p.focus()},O=({session:t})=>{let o=[];if(t!=null&&t.detalles_json)try{o=(typeof t.detalles_json=="string"?JSON.parse(t.detalles_json):t.detalles_json).transactions||[]}catch{o=[]}else Array.isArray(t==null?void 0:t.transactions)&&(o=t.transactions);if(!o.length)return null;const p=o.filter(x=>(x.type||"").startsWith("venta")),u=o.filter(x=>(x.type||"").includes("abono")),d=o.filter(x=>(x.type||"").includes("devolucion")),N=o.filter(x=>x.type==="entrada"),R=o.filter(x=>x.type==="salida"),j=(x,D,L)=>D.length?e.jsxs("div",{style:{marginTop:"0.75rem"},children:[e.jsxs("h5",{style:{margin:"0 0 0.4rem 0",color:L||r.secondary,fontSize:"0.85rem",borderBottom:`1px solid ${r.border}`,paddingBottom:4},children:[x," (",D.length,")"]}),e.jsxs(we,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Hora"}),e.jsx("th",{children:"Detalle"}),e.jsx("th",{className:"num",children:"Monto"})]})}),e.jsx("tbody",{children:D.map((y,I)=>{const B=y.pagoDetalles||{},ee=y.at?new Date(y.at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"—",te=Number(B.totalVenta||B.ingresoCaja||y.amount||0),ae=y.note||B.nota||B.clienteNombre||"";return e.jsxs("tr",{children:[e.jsx("td",{children:ee}),e.jsx("td",{children:ae||y.type}),e.jsx("td",{className:"num",children:s(te)})]},y.id||I)})})]})]}):null;return e.jsxs("div",{style:{marginTop:"1rem"},children:[j("💰 Ventas",p,"#16a34a"),j("💳 Abonos",u,"#0284c7"),j("🔄 Devoluciones",d,"#dc2626"),j("📥 Entradas",N,"#d97706"),j("📤 Salidas",R,"#7c3aed")]})};return e.jsxs(ue,{children:[e.jsx(ge,{}),e.jsxs(be,{className:"no-print",children:[e.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[e.jsx(je,{title:"Volver al Dashboard",onClick:()=>w("/dashboard"),children:e.jsx(re,{})}),e.jsxs(xe,{children:[e.jsx("h1",{children:"Reportes de Caja"}),e.jsx("p",{children:"Historial de aperturas, cierres y auditoría"})]})]}),e.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[h&&e.jsxs("span",{style:{color:r.textLight},children:[e.jsx(H,{className:"icon-spin"})," Cargando..."]}),e.jsxs(he,{children:[e.jsxs("div",{className:"input-wrapper",children:[e.jsx(ne,{style:{position:"absolute",left:12,color:r.primary,pointerEvents:"none"}}),e.jsx("input",{type:"date",value:f,onChange:t=>m(t.target.value)})]}),e.jsx("button",{onClick:g,title:"Refrescar",children:e.jsx(H,{})})]})]})]}),c&&e.jsxs("div",{style:{textAlign:"center",margin:"2rem",color:r.danger},children:[e.jsx(ie,{})," ",c]}),e.jsxs("h3",{style:{marginLeft:"0.5rem",marginBottom:"1rem",color:r.text},children:[e.jsx(W,{})," Cajas Activas en el Sistema (",T.length,")"]}),!h&&!T.length&&e.jsx("p",{style:{marginLeft:"1rem",color:r.textLight,fontStyle:"italic"},children:"No hay cajas abiertas actualmente."}),e.jsx(U,{className:"cards-grid-print",style:{marginBottom:"3rem"},children:T.map(t=>e.jsxs(q,{className:"Card",children:[e.jsxs(Y,{isOpen:!0,children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[e.jsx("strong",{style:{fontSize:"1.1rem"},children:F(t.abierta_por)}),e.jsxs("span",{style:{fontSize:"0.85rem",color:"#15803d"},children:["Abierta: ",new Date(t.hora_apertura).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})]})]}),e.jsx(Z,{isOpen:!0,children:"Abierta"})]}),e.jsxs(Q,{children:[e.jsxs(ye,{children:[e.jsx("span",{children:"Monto Inicial:"}),e.jsx("strong",{children:s(t.monto_inicial)})]}),e.jsxs("div",{style:{padding:"1rem",background:"#f0fdf4",borderRadius:"12px",color:"#166534",marginTop:"auto"},children:[e.jsx(G,{})," Caja activa actualmente"]})]}),e.jsx(K,{className:"no-print",style:{display:"flex",gap:"10px"},children:e.jsxs(X,{style:{background:"#fee2e2",color:"#b91c1c",borderColor:"#fecaca"},onClick:()=>C(t),children:[e.jsx(W,{})," Forzar Cierre"]})})]},t.id))}),e.jsxs("h3",{style:{marginLeft:"0.5rem",marginBottom:"1rem",color:r.text},children:[e.jsx(G,{})," Cierres Completados (",S.length,")"]}),!h&&!S.length&&e.jsx("p",{style:{marginLeft:"1rem",color:r.textLight,fontStyle:"italic"},children:"No hay cierres registrados en esta fecha."}),e.jsx(U,{className:"cards-grid-print",children:S.map(t=>{const o=J(t),p=Number(t.diferencia),u=o.totalVentasDia||(o.totalVentaContado||o.total_efectivo||0)+(o.totalTarjeta||0)+(o.totalTransferencia||0)+(o.totalCredito||0);return e.jsxs(q,{className:"Card",children:[e.jsxs(Y,{children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[e.jsx("strong",{style:{fontSize:"1.1rem"},children:F(t.abierta_por)}),e.jsxs("span",{style:{fontSize:"0.85rem",color:r.textLight},children:["📅 ",new Date(t.hora_apertura).toLocaleDateString("es-NI")," | 🕒 ",new Date(t.hora_apertura).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})," ➜ ",new Date(t.hora_cierre).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})]})]}),e.jsx(Z,{children:"Cerrada"})]}),e.jsxs(Q,{children:[e.jsxs("div",{style:{background:"#f1f5f9",padding:"1rem",borderRadius:"8px",border:`1px solid ${r.border}`,marginBottom:"1rem",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("span",{style:{fontWeight:"600",color:r.secondary,textTransform:"uppercase",fontSize:"0.85rem"},children:"💰 Ventas Totales"}),e.jsx("span",{style:{fontSize:"1.2rem",fontWeight:"bold",color:r.primary,fontFamily:"Roboto Mono"},children:s(u)})]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"1fr",gap:"1rem",marginBottom:"1rem"},children:e.jsxs("div",{style:{background:"#fff",padding:"10px",borderRadius:8,border:"1px solid #eee"},children:[e.jsx("h5",{style:{margin:"0 0 0.5rem 0",color:r.secondary,fontSize:"0.85rem",borderBottom:"1px solid #eee",paddingBottom:5},children:"📊 Desglose de Efectivo"}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem"},children:[e.jsx("span",{children:"(+) Ventas Totales:"}),e.jsx("strong",{children:s(u)})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",color:"#dc3545"},children:[e.jsx("span",{children:"(-) Tarjetas/Transf:"}),e.jsxs("strong",{children:["- ",s(o.totalNoEfectivo)]})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",fontWeight:"bold",borderTop:"1px dashed #ccc",marginTop:4,paddingTop:4},children:[e.jsx("span",{children:"(=) Efectivo de Ventas:"}),e.jsx("span",{children:s(u-o.totalNoEfectivo)})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",marginTop:8},children:[e.jsx("span",{children:"(+) Fondo Inicial:"}),e.jsx("strong",{children:s(t.monto_inicial||t.initialAmount)})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",marginTop:4,background:"#f8fafc",padding:4,borderRadius:4},children:[e.jsx("span",{style:{fontWeight:"bold",color:r.primary},children:"Total Esperado:"}),e.jsx("strong",{style:{color:r.primary},children:s(o.efectivoEsperado)})]}),e.jsxs("div",{style:{fontSize:"0.75rem",color:"#64748b",textAlign:"right"},children:["(C$",o.efectivoEsperadoCordobas.toFixed(2)," + $",o.efectivoEsperadoDolares.toFixed(2),")"]})]})}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#f8fafc",padding:"10px",borderRadius:"8px",border:"1px solid #e2e8f0"},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:"0.8rem",color:r.textLight},children:"Contado Real"}),e.jsx("div",{style:{fontWeight:"bold",fontSize:"1.1rem"},children:s(t.contado||t.countedAmount)})]}),e.jsx(ve,{diff:p,children:Math.abs(p)<.5?"Cuadre Perfecto":`${p>0?"+":""}${s(p)}`})]}),e.jsx(O,{session:t})]}),e.jsx(K,{className:"no-print",children:e.jsxs(X,{onClick:()=>$(t),children:[e.jsx(se,{})," Imprimir Reporte"]})})]},t.id)})})]})};export{Ne as default};
