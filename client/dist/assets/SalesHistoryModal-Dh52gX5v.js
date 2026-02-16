import{R as U,r as l,j as e,n as st,J as lt,a9 as dt,D as ct,s as m,v as pt,x as De,aI as mt,C as xt,q as ht,ae as le,aS as ft,aE as Be,h as qe,aT as Ke,aU as gt,K as ut,az as Xe,aA as et,ai as bt,Y as He,Z as jt,S as yt,aV as Ct,aW as vt,aX as Nt,aY as tt,aZ as We,ag as $e}from"./vendor-BHEUBfle.js";import{c as Ne,d as we,B as A,T as G,I as ke,S as be}from"./POS.styles-Dbi1_TMg.js";import{u as Ee,y as wt,i as kt,a as $t}from"./index-CRFpa_vU.js";import{A as St}from"./AlertModal-DAjc3Hhf.js";const At=m.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1050;
  backdrop-filter: blur(5px);
`,Tt=m.div`
  background: white; padding: 2rem; border-radius: 12px; width: 560px; max-width: 95%; max-height: 90vh; overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  animation: fadeIn 0.3s ease-out;
  @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
`,It=m.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef; padding-bottom: 1rem;
`,Dt=m.h2`margin: 0; font-size: 1.5rem; color: #333;`,Et=m.button`
  border: none; background: none; font-size: 1.5rem; cursor: pointer; color: #888;
  &:hover { color: #333; }
`,Ft=m.form`display: flex; flex-direction: column; gap: 1.25rem;`,Se=m.div`display: flex; flex-direction: column; gap: 0.5rem;`,Ae=m.label`font-weight: 600; color: #495057; font-size: 0.9rem;`,Fe=m.input`
  padding: 0.75rem; border: 1px solid #ccc; border-radius: 6px; font-size: 1rem;
  &:focus { border-color: #007bff; outline: none; box-shadow: 0 0 0 2px rgba(0,123,255,0.25); }
`,Lt=m(Fe).attrs({as:"select"})``,Ue=m.button`
  padding: 0.85rem 1.5rem; background: #28a745; color: white; border: none;
  border-radius: 6px; font-weight: bold; display: flex; align-items: center; gap: 0.5rem;
  justify-content: center; cursor: pointer; transition: background-color 0.2s; font-size: 1rem;
  &:hover:not(:disabled) { background: #218838; }
  &:disabled { background: #6c757d; cursor: not-allowed; }
`,Mt=m.p`
  margin: 0 0 0.5rem 0; padding: 0.75rem; background-color: #e9ecef; border-radius: 6px;
  color: #495057; text-align: center; font-size: 1rem;
  strong { color: #dc3545; }
`,_t=m.p`
  margin-top: -1rem; margin-bottom: 0.5rem; padding: 0.5rem; color: #dc3545; font-size: 0.9rem; text-align: center;
`,Ge=m(pt)`
  animation: spin 1s linear infinite;
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`,Ze=m.div`
  display: flex; flex-direction: column; gap: 0.5rem;
  max-height: 220px; overflow-y: auto; padding: 0.25rem;
`,Je=m.div`
  padding: 0.75rem 1rem; border: 2px solid ${t=>t.$selected?"#007bff":"#e9ecef"};
  border-radius: 8px; cursor: pointer; transition: all 0.2s;
  background: ${t=>t.$selected?"#e8f0fe":t.$paid?"#f0f9f0":"white"};
  opacity: ${t=>t.$paid?.6:1};
  display: flex; justify-content: space-between; align-items: center;
  &:hover { border-color: ${t=>t.$paid?"#e9ecef":"#007bff"}; }

  .ticket-info {
    display: flex; flex-direction: column; gap: 2px;
    .ticket-id { font-weight: 700; color: #0056b3; font-size: 0.9rem; }
    .ticket-date { font-size: 0.8rem; color: #6c757d; }
  }
  .ticket-amounts {
    text-align: right;
    .original { font-size: 0.8rem; color: #6c757d; text-decoration: line-through; }
    .remaining { font-weight: 700; color: ${t=>t.$paid?"#28a745":"#dc3545"}; font-size: 1rem; }
  }
`,Rt=m.div`
  font-size: 0.85rem; font-weight: 600; color: #495057;
  margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.5rem;
`,pe=t=>`C$${Number(t||0).toFixed(2)}`,Ye=t=>t?new Date(t).toLocaleDateString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric"}):"—",Pt=({client:t,onClose:o,onAbonoSuccess:p,showAlert:x})=>{const{addCajaTransaction:y,user:u}=Ee(),[s,v]=l.useState(""),[h,i]=l.useState("Efectivo"),[w,E]=l.useState(""),[T,a]=l.useState(!1),[k,f]=l.useState(""),[I,W]=l.useState([]),[g,$]=l.useState(!0),[C,D]=l.useState(null),O=l.useMemo(()=>Number(t==null?void 0:t.saldo_pendiente)||0,[t]);l.useEffect(()=>{const d=async()=>{$(!0);try{const N=localStorage.getItem("token"),R=await kt(t.id_cliente,N);W(Array.isArray(R)?R:[])}catch(N){console.error("Error cargando tickets:",N),W([])}finally{$(!1)}};t!=null&&t.id_cliente&&d()},[t]);const B=l.useMemo(()=>I.filter(d=>d.saldoRestante>0),[I]),X=l.useMemo(()=>I.filter(d=>d.saldoRestante<=0),[I]),F=C?Math.min(O,C.saldoRestante):O;l.useEffect(()=>{if(!s){f("");return}const d=parseFloat(s);isNaN(d)||d<=0?f("Ingrese un monto válido mayor a cero."):d>F?f(`El máximo es ${pe(F)}.`):f("")},[s,F]);const ee=d=>{d.saldoRestante<=0||(D(N=>(N==null?void 0:N.idVenta)===d.idVenta?null:d),v(""))},Z=()=>{v(C?C.saldoRestante.toFixed(2):O.toFixed(2))},L=l.useCallback(async d=>{d.preventDefault();const N=parseFloat(s),R=localStorage.getItem("token");if(k||!N||N<=0){x==null||x({title:"Monto Inválido",message:k||"Revise el monto ingresado."});return}if(h!=="Efectivo"&&!w.trim()){x==null||x({title:"Referencia Requerida",message:"Ingrese el número de referencia, transferencia o voucher."});return}a(!0);try{await wt(t.id_cliente,{monto:N,id_venta:(C==null?void 0:C.idVenta)||null,pagoDetalles:{metodo:h,usuario:(u==null?void 0:u.nombre_usuario)||"Desconocido",referencia:w||"",ticketRef:C?`Venta #${C.idVenta}`:"FIFO"}},R);const _=h==="Efectivo",J={id:`abono-${Date.now()}`,type:"abono",amount:N,note:`Abono Cliente: ${t.nombre} (${h})${C?` - Venta #${C.idVenta}`:""} ${w?"- Ref: "+w:""}`,at:new Date().toISOString(),pagoDetalles:{clienteId:t.id_cliente,clienteNombre:t.nombre,metodo:h,referencia:w,ingresoCaja:_?N:0,efectivo:_?N:0,tarjeta:h==="Tarjeta"?N:0,transferencia:h==="Transferencia"?N:0,credito:0}};await y(J),p==null||p(J),o==null||o()}catch(_){console.error("Error al registrar abono:",_),x==null||x({title:"Error",message:`No se pudo registrar el abono. ${_.message}`})}finally{a(!1)}},[s,h,w,k,t,u,C,y,p,o,x]),r=T||O<=0||!!k||!s;return e.jsx(At,{children:e.jsxs(Tt,{children:[e.jsxs(It,{children:[e.jsx(Dt,{children:"Registrar Abono"}),e.jsx(Et,{onClick:o,disabled:T,children:e.jsx(st,{})})]}),e.jsxs("p",{children:["Cliente: ",e.jsx("strong",{children:(t==null?void 0:t.nombre)||"Desconocido"})]}),e.jsxs(Mt,{children:["Saldo Pendiente Total: ",e.jsx("strong",{children:pe(O)})]}),g?e.jsxs("div",{style:{textAlign:"center",padding:"1rem",color:"#6c757d"},children:[e.jsx(Ge,{})," Cargando facturas..."]}):B.length>0?e.jsxs(e.Fragment,{children:[e.jsxs(Rt,{children:[e.jsx(lt,{})," Selecciona una factura (opcional — si no, paga la más antigua):"]}),e.jsx(Ze,{children:B.map(d=>e.jsxs(Je,{$selected:(C==null?void 0:C.idVenta)===d.idVenta,onClick:()=>ee(d),children:[e.jsxs("div",{className:"ticket-info",children:[e.jsxs("span",{className:"ticket-id",children:["Venta #",d.idVenta]}),e.jsx("span",{className:"ticket-date",children:Ye(d.fecha)})]}),e.jsxs("div",{className:"ticket-amounts",children:[d.montoOriginal!==d.saldoRestante&&e.jsx("div",{className:"original",children:pe(d.montoOriginal)}),e.jsx("div",{className:"remaining",children:pe(d.saldoRestante)})]})]},d.idVenta))}),X.length>0&&e.jsxs("details",{style:{marginTop:"0.5rem"},children:[e.jsxs("summary",{style:{cursor:"pointer",fontSize:"0.85rem",color:"#6c757d"},children:[e.jsx(dt,{style:{color:"#28a745"}})," ",X.length," factura(s) pagada(s)"]}),e.jsx(Ze,{style:{marginTop:"0.5rem"},children:X.map(d=>e.jsxs(Je,{$paid:!0,children:[e.jsxs("div",{className:"ticket-info",children:[e.jsxs("span",{className:"ticket-id",children:["Venta #",d.idVenta]}),e.jsx("span",{className:"ticket-date",children:Ye(d.fecha)})]}),e.jsx("div",{className:"ticket-amounts",children:e.jsx("div",{className:"remaining",style:{color:"#28a745"},children:"Pagada ✔"})})]},d.idVenta))})]})]}):null,e.jsxs(Ft,{onSubmit:L,children:[e.jsxs(Se,{children:[e.jsxs(Ae,{htmlFor:"montoAbono",children:["Monto a Abonar (C$)",C&&e.jsxs("span",{style:{fontWeight:"normal",color:"#007bff",marginLeft:"0.5rem"},children:["— Venta #",C.idVenta," (máx: ",pe(F),")"]})]}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem"},children:[e.jsx(Fe,{id:"montoAbono",type:"number",value:s,onChange:d=>v(d.target.value),placeholder:"0.00",required:!0,autoFocus:!0,step:"0.01",min:"0.01",max:F?F.toFixed(2):void 0,disabled:T||O<=0,style:{flex:1}}),e.jsx(Ue,{type:"button",onClick:Z,style:{background:"#007bff",padding:"0.5rem 0.75rem",fontSize:"0.85rem"},disabled:T||O<=0,children:"Total"})]})]}),e.jsxs(Se,{children:[e.jsx(Ae,{htmlFor:"metodoPago",children:"Método de Pago"}),e.jsxs(Lt,{id:"metodoPago",value:h,onChange:d=>i(d.target.value),disabled:T,children:[e.jsx("option",{value:"Efectivo",children:"Efectivo"}),e.jsx("option",{value:"Tarjeta",children:"Tarjeta"}),e.jsx("option",{value:"Transferencia",children:"Transferencia"})]})]}),h!=="Efectivo"&&e.jsxs(Se,{children:[e.jsx(Ae,{htmlFor:"referencia",children:"Referencia / Voucher / N° Transferencia"}),e.jsx(Fe,{id:"referencia",type:"text",value:w,onChange:d=>E(d.target.value),placeholder:"Ej: BAC-123456",required:!0})]}),k&&e.jsx(_t,{children:k}),e.jsx(Ue,{type:"submit",disabled:r,children:T?e.jsxs(e.Fragment,{children:[e.jsx(Ge,{})," Procesando..."]}):e.jsxs(e.Fragment,{children:[e.jsx(ct,{})," Registrar Abono"]})})]})]})})},Ot=U.memo(Pt),zt=ht`
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
`,Vt=m.div`
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
`,Bt=m.div`
  display: flex; flex-direction: column; gap: 12px;
`,qt=m.img`
  width: 100%;
  max-width: 160px;
  height: auto;
  display: block;
  margin: 0 auto; 
  border-radius: 6px;
  &.a4-logo { margin: 0; max-width: 140px; }
`,je=m.span`
  display: inline-flex; align-items: center; gap: 6px;
  font-weight: 700; letter-spacing: .4px; padding: 4px 8px; border-radius: 4px;
  font-size: 0.85rem;
  ${({$type:t})=>t==="proforma"&&le`background: #e8f4ff; color: #0b72b9; border: 1px solid #b9defc;`}
  ${({$type:t})=>t==="abono"&&le`background: #fff3cd; color: #856404; border: 1px solid #ffeeba;`}
  ${({$type:t})=>t==="venta"&&le`background: #e8f7ee; color: #1c7d3a; border: 1px solid #bfe8cf;`}
  ${({$type:t})=>t==="outflow"&&le`background: #fee2e2; color: #991b1b; border: 1px solid #fecaca;`}
`,Ht=m.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: .75rem;
`,oe=t=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(t||0)),S=(...t)=>t.find(o=>o!=null),re=t=>S(t==null?void 0:t.usuarioNombre,t==null?void 0:t.nombre_usuario,t==null?void 0:t.nombre,t==null?void 0:t.name,t==null?void 0:t.displayName,t==null?void 0:t.fullName,t==null?void 0:t.username,null);function Wt(t=[]){return t.map((o,p)=>{const x=Number(S(o.quantity,o.cantidad,o.qty,0)),y=S(o.nombre,o.descripcion,o.description,o.producto,`Item ${p+1}`),u=Number(S(o.precio_unitario,o.precio_venta,o.precio,o.unitPrice,0));return{id:S(o.id_producto,o.id,`it-${p}`),nombre:y,quantity:x,unit:u,total:x*u}})}function Ut(t={}){const o=Number(t.efectivo||0),p=Number(t.tarjeta||0),x=Number(t.transferencia||0),y=Number(t.dolares||0);if(Number(t.credito||0)>0)return"Crédito";const s=[];return o>0&&s.push("Efectivo"),p>0&&s.push("Tarjeta"),x>0&&s.push("Transferencia"),y>0&&s.push("Dólares"),s.length===0?"Contado":s.length===1?s[0]:"Mixto"}function Gt(t={},o=0){const p=Number(t.efectivo||0),x=Number(t.tarjeta||0),y=Number(t.transferencia||0),u=Number(t.otro||0),s=Number(t.dolares||0),v=Number(t.tasaDolarAlMomento||t.tasaObtenida||1),h=s*(v>1?v:1),i=p+x+y+u+h;return i>0?i:Number(t.montoRecibido||o||0)}function Zt(t){const o=S(t==null?void 0:t.fecha,t==null?void 0:t.createdAt,t==null?void 0:t.created_at,t==null?void 0:t.date,t);try{const p=new Date(o);return isNaN(p)?"Fecha inválida":p.toLocaleString("es-NI",{hour12:!0})}catch{return"Fecha inválida"}}function Jt(t){const o=S(t.proformaId,t.proformaNumero,t.numeroProforma,t.id);if(o)return o;const p=new Date,x=p.toISOString().slice(2,10).replace(/-/g,""),y=p.toTimeString().slice(0,8).replace(/:/g,"");return`PF-${x}-${y}`}const vn=({transaction:t,onClose:o,clients:p=[],users:x=[],isOpen:y=!0,printMode:u="80",currentUser:s=null,onPersistPrint:v=null})=>{var Y;const{user:h}=typeof Ee=="function"?Ee():{user:null},{settings:i}=$t();if(!y||t==null)return null;const[w]=U.useState(typeof t=="object"?t:null),[E]=U.useState(!1),[T]=U.useState(null);if(E||T||!w)return e.jsx(Ne,{className:"no-print",children:e.jsxs(we,{className:"no-print",style:{maxWidth:420,padding:"1rem"},children:[e.jsx("h3",{style:{color:"#dc3545"},children:"No se pudo imprimir"}),e.jsx("div",{style:{display:"flex",justifyContent:"center",marginTop:12},children:e.jsxs(A,{onClick:o,$cancel:!0,children:[e.jsx(De,{})," Cerrar"]})})]})});const a=w,k=a.estado==="ABONO_CREDITO",f=!!(a.isProforma||a.proformaFor||a.proformaNombre),I=!!a.isOutflow,W=a.estado==="DEVOLUCION",g=f?Jt(a):S(a.id,a.saleId,a.numero,"-"),$=Zt(S(a.fecha,a.createdAt,a.date)),C=S(a.clientId,a.idCliente,a.clienteId),D=p.find(b=>String(b.id_cliente??b.id)===String(C)),O=f&&a.proformaNombre?a.proformaNombre:S(D==null?void 0:D.nombre,a.clienteNombre,"Consumidor Final"),B=(D==null?void 0:D.cedula)||a.clienteCedula,X=S(a.userId,a.idUsuario,(Y=a.openedBy)==null?void 0:Y.id)??(s==null?void 0:s.id_usuario)??(s==null?void 0:s.id)??(s==null?void 0:s.uid)??(h==null?void 0:h.id_usuario)??(h==null?void 0:h.id)??(h==null?void 0:h.uid),F=(()=>{try{return JSON.parse(localStorage.getItem("authUser")||"null")}catch{return null}})(),ee=x.find(b=>String(b.id_usuario||b.id||b.uid)===String(X)),Z=S(a.usuarioNombre,re(ee),re(s),re(h),re(F),"Cajero POS"),L=f?S(a.usuarioNombre,re(s),re(h),re(F),Z):Z,r=Wt(S(a.items,a.detalle,[])),d=r.reduce((b,Q)=>b+Number(Q.unit)*Number(Q.quantity),0),N=Number(S(a.subtotal,d)),R=Number(S(a.descuento,0)),_=Number(S(a.totalVenta,a.total_venta,N-R,0)),J=a.pagoDetalles||{},M=f||I?"N/A":S(a.metodoPago,Ut(J)),me=f||I?0:Gt(J,_),te=f||I?0:Math.max(0,me-_);Math.abs(Number(S(a.totalVenta,a.montoAbono,0))),Number((D==null?void 0:D.saldo_pendiente)||0);const ne=r.length<=2,P={name:(i==null?void 0:i.empresa_nombre)||"Multirepuestos RG",ruc:(i==null?void 0:i.empresa_ruc)||"1211812770001E",phone:(i==null?void 0:i.empresa_telefono)||"84031936 / 84058142",address:(i==null?void 0:i.empresa_direccion)||"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",slogan:(i==null?void 0:i.empresa_eslogan)||"Repuestos de confianza al mejor precio",logo:i!=null&&i.empresa_logo_url?i.empresa_logo_url.startsWith("http")?i.empresa_logo_url:`undefined${i.empresa_logo_url}`:new URL("/icons/logo.png",window.location.origin).toString()};U.useCallback(async b=>{},[]);const ae=U.useCallback((b="80")=>{const Q=document.getElementById("print-wrapper-ticket");if(!Q)return;const de=Q.outerHTML,ie=`
      @charset "UTF-8";
      @page { size: ${b==="A4"?"A4 portrait":"80mm auto"}; margin: ${b==="A4"?"12mm":"0"}; }
      html, body { background: #fff; margin: 0 !important; padding: 0 !important; font-family: ${b==="A4"?"'Inter', Helvetica, Arial, sans-serif":"'Consolas', monospace"}; color: #000 !important; }
      
      /* Reset para impresión */
      #print-wrapper-ticket {
        box-shadow: none !important; border: none !important; margin: 0 !important;
        ${b==="A4"?"width: 100% !important; padding: 0 !important; font-size: 10pt !important;":"width: 80mm !important; padding: 6px 4px !important; font-size: 8pt !important;"}
      }

      /* Estilos específicos A4 en impresión */
      ${b==="A4"?`
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
      `:`
        /* Estilos 80mm */
        #print-wrapper-ticket { font-family: 'Consolas', monospace !important; }
        #print-wrapper-ticket .brand { text-align: center !important; border-bottom: 1px dashed #000 !important; }
        #print-wrapper-ticket table.items th { border-bottom: 1px dashed #000 !important; }
        #print-wrapper-ticket .grand-total { font-size: 12pt !important; font-weight: 900 !important; }
      `}
    `,q=window.open("","_blank","width=900,height=700");q&&(q.document.write(`<html><head><title>Impresión ${b.toUpperCase()} - ${P.name}</title><style>${ie}</style></head><body>${de}</body></html>`),q.document.close(),q.focus(),q.onload=()=>{setTimeout(()=>{q.print()},250)})},[P]);return e.jsxs(Ne,{className:"no-print",children:[e.jsx(zt,{}),e.jsxs(we,{className:"no-print",style:{maxWidth:520,width:"96%",padding:"1.2rem",background:"#fff"},children:[e.jsxs(Ht,{children:[e.jsxs("h2",{style:{display:"flex",alignItems:"center",gap:8,margin:0},children:[e.jsx(mt,{})," Vista de Impresión (",u.toUpperCase(),")"]}),e.jsxs("div",{style:{display:"flex",gap:8},children:[e.jsx(A,{onClick:()=>ae("80"),children:"Ticket 80mm"}),e.jsxs(A,{onClick:()=>ae("A4"),children:[e.jsx(xt,{})," A4 (1 pág.)"]}),e.jsx(A,{$cancel:!0,onClick:o,children:e.jsx(De,{})})]})]}),e.jsx(Bt,{children:e.jsxs(Vt,{id:"print-wrapper-ticket",className:`print-area ${u==="A4"?"print-a4":"print-80"} ${ne?"compact":""}`,children:[e.jsxs("div",{className:"brand",children:[e.jsx("div",{className:"brand-logo-container",children:e.jsx(qt,{className:"a4-logo",src:P.logo,alt:"Logo",onError:b=>{b.currentTarget.style.display="none"}})}),e.jsxs("div",{className:"brand-info",children:[e.jsx("h1",{children:P.name}),e.jsx("small",{children:P.slogan}),e.jsxs("small",{children:["RUC: ",P.ruc]}),e.jsxs("small",{children:["Tel: ",P.phone]}),e.jsx("small",{children:P.address}),e.jsx("div",{style:{marginTop:8},children:f?e.jsx(je,{$type:"proforma",children:"PROFORMA"}):k?e.jsx(je,{$type:"abono",children:"RECIBO"}):I?e.jsx(je,{$type:"outflow",children:"SALIDA"}):e.jsx(je,{$type:"venta",children:W?"DEVOLUCIÓN":"FACTURA"})})]})]}),e.jsxs("div",{className:"meta",children:[e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Detalles del Documento"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Fecha:"}),e.jsx("span",{className:"meta-value",children:$})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"No. Documento:"}),e.jsx("span",{className:"meta-value",children:g})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Atendido por:"}),e.jsx("span",{className:"meta-value",children:L})]})]}),e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Datos del Cliente"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Cliente:"}),e.jsx("span",{className:"meta-value",children:O})]}),B&&e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Cédula/RUC:"}),e.jsx("span",{className:"meta-value",children:B})]}),!f&&!I&&e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Pago:"}),e.jsx("span",{className:"meta-value",children:M})]})]})]}),e.jsxs("table",{className:"items",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"col-qty",children:"Cant."}),e.jsx("th",{children:"Descripción"}),e.jsx("th",{className:"text-right col-unit",children:"P. Unit"}),e.jsx("th",{className:"text-right col-total",children:"Total"})]})}),e.jsx("tbody",{children:r.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:"4",style:{textAlign:"center"},children:"Sin ítems"})}):r.map(b=>e.jsxs("tr",{children:[e.jsx("td",{className:"col-qty",children:b.quantity}),e.jsx("td",{children:b.nombre}),e.jsxs("td",{className:"text-right col-unit",children:["C$",oe(b.unit)]}),e.jsxs("td",{className:"text-right col-total",children:["C$",oe(b.total)]})]},b.id))})]}),e.jsx("div",{className:"totals",children:e.jsxs("div",{className:"totals-box",children:[e.jsxs(G,{children:[e.jsx("span",{children:"Subtotal:"}),e.jsxs("span",{children:["C$",oe(N)]})]}),R>0&&e.jsxs(G,{style:{color:"#dc3545"},children:[e.jsx("span",{children:"Descuento:"}),e.jsxs("span",{children:["- C$",oe(R)]})]}),e.jsxs(G,{className:"grand-total",$bold:!0,style:{fontSize:"1.2em",borderTop:"1px solid #ccc",marginTop:5,paddingTop:5},children:[e.jsx("span",{children:"TOTAL:"}),e.jsxs("span",{children:["C$",oe(_)]})]}),!f&&e.jsxs(e.Fragment,{children:[e.jsxs(G,{style:{marginTop:10,fontSize:"0.9em",color:"#666"},children:[e.jsx("span",{children:"Pagado:"}),e.jsxs("span",{children:["C$",oe(me)]})]}),te>0&&e.jsxs(G,{$bold:!0,style:{color:"#dc3545"},children:[e.jsx("span",{children:"Cambio:"}),e.jsxs("span",{children:["C$",oe(te)]})]})]})]})}),e.jsxs("div",{className:"footer-sign no-show-80",children:[e.jsx("div",{className:"sign-box",children:"Entregado por"}),e.jsx("div",{className:"sign-box",children:"Recibido por"})]}),e.jsxs("div",{className:"thanks",children:[e.jsxs("p",{children:['"',P.slogan,'"']}),e.jsx("p",{style:{whiteSpace:"pre-line",marginTop:"5px"},children:f?(i==null?void 0:i.ticket_proforma_footer)||"Cotización válida por 15 días.":I?(i==null?void 0:i.ticket_transfer_footer)||"Salida de Inventario.":(i==null?void 0:i.ticket_sales_footer)||"¡Gracias por su compra!"})]})]})})]})]})},H=t=>Number(t||0).toFixed(2),Yt=(t,o=0)=>(t==null?void 0:t.nombre)??(t==null?void 0:t.name)??(t==null?void 0:t.producto)??(t==null?void 0:t.descripcion)??`Item ${o+1}`,Qe=m.div`
  border-left: 1px solid #e9ecef; padding-left: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.2rem;
`,ye=m.div`
  background-color: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 1.2rem;
  h4 { margin-top: 0; margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; color: #495057; }
`,Qt=m.table`
  width: 100%; border-collapse: collapse; font-size: 0.9rem;
  th, td { padding: 0.6rem; text-align: left; border-bottom: 1px solid #f1f1f1; }
  th { font-weight: 600; color: #6c757d; }
  td:nth-child(3), td:nth-child(4) { text-align: right; }
`,V=m.div`
  display: flex; justify-content: space-between; padding: 0.4rem 0; font-size: 0.95rem; font-weight: ${t=>t.$bold?"600":"normal"};
  border-top: ${t=>t.$bordered?"1px dashed #ccc":"none"}; color: ${t=>t.color||"inherit"};
  span:first-child { color: #6c757d; }
`,Kt=m.div`
  display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem;
`,Xt=m.span`
  font-weight: bold; padding: 0.25rem 0.5rem; border-radius: 4px; color: white; background-color: ${t=>t.color};
`,en=({sale:t,client:o,creditStatus:p,dailySales:x,isAdmin:y,onOpenAbonoModal:u,onCancelSale:s,onReturnItem:v,onReprintTicket:h,showConfirmation:i,showPrompt:w,showAlert:E})=>{const T=l.useMemo(()=>!(!t||t.estado!=="COMPLETADA"),[t]);if(!t)return e.jsx(Qe,{style:{justifyContent:"center",alignItems:"center"},children:e.jsxs(ke,{children:[e.jsx(ft,{})," Seleccione una transacción de la lista para ver sus detalles."]})});const k={COMPLETADA:{text:"COMPLETADA",color:"#28a745"},CANCELADA:{text:"CANCELADA",color:"#dc3545"},DEVOLUCION:{text:"DEVOLUCIÓN",color:"#ffc107"},ABONO_CREDITO:{text:"ABONO A CRÉDITO",color:"#17a2b8"}}[t.estado]||{text:t.estado,color:"#6c757d"},f=t.estado==="COMPLETADA",I=(g,$)=>{if(T){if(!v){E==null||E({title:"Config",message:"Falta onReturnItem en props.",type:"error"});return}v(g,$)}},W=()=>{if(T){if(!s){E==null||E({title:"Config",message:"Falta onCancelSale en props.",type:"error"});return}i==null||i({title:"Cancelar Venta",message:`Esta acción revertirá stock y (si aplica) crédito del cliente.

¿Cancelar la venta #${t.id}?`,onConfirm:()=>s(t.id)})}};return e.jsxs(Qe,{children:[e.jsxs("h3",{children:["Detalle de Transacción #",t.id]}),o&&p&&e.jsxs(ke,{$type:"info",style:{flexDirection:"column",alignItems:"stretch",gap:"1rem"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("span",{style:{fontWeight:"bold"},children:["Estado de Cuenta: ",o.nombre]}),e.jsxs(A,{$primary:!0,onClick:u,disabled:p.currentBalance<=0,children:[e.jsx(Be,{})," Registrar Abono"]})]}),e.jsxs(V,{$bold:!0,color:p.currentBalance>0?"#dc3545":"#28a745",children:[e.jsx("span",{children:"SALDO PENDIENTE TOTAL:"}),e.jsxs("span",{children:["C$",p.currentBalance.toFixed(2)]})]})]}),e.jsxs(ye,{children:[e.jsxs("p",{children:[e.jsxs("strong",{children:[e.jsx(qe,{})," Cliente:"]})," ",(o==null?void 0:o.nombre)||"Cliente Genérico"]}),e.jsxs("p",{children:[e.jsxs("strong",{children:[e.jsx(Ke,{})," Fecha:"]})," ",new Date(t.fecha).toLocaleString("es-NI")]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Estado:"})," ",e.jsx(Xt,{color:k.color,children:k.text})]})]}),f&&e.jsxs(e.Fragment,{children:[Array.isArray(t.items)&&t.items.length>0&&e.jsxs(ye,{children:[e.jsx("h4",{children:"Productos"}),e.jsxs(Qt,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Producto"}),e.jsx("th",{children:"Cant."}),e.jsx("th",{children:"P. Unit."}),e.jsx("th",{children:"Subtotal"}),e.jsx("th",{})]})}),e.jsx("tbody",{children:t.items.map((g,$)=>e.jsxs("tr",{children:[e.jsx("td",{children:Yt(g,$)}),e.jsx("td",{children:(g==null?void 0:g.quantity)??(g==null?void 0:g.cantidad)??0}),e.jsxs("td",{children:["C$",H(g==null?void 0:g.precio)]}),e.jsxs("td",{children:["C$",H(((g==null?void 0:g.quantity)??(g==null?void 0:g.cantidad)??0)*((g==null?void 0:g.precio)??0))]}),e.jsx("td",{children:T&&e.jsx(A,{$warning:!0,$small:!0,onClick:()=>I(g,$),title:"Devolver",children:e.jsx(gt,{})})})]},(g&&(g.id_producto||g.id))??$))})]})]}),e.jsxs(ye,{children:[e.jsx("h4",{children:"Resumen Financiero de esta Venta"}),t.subtotal!==void 0&&e.jsxs(V,{children:[e.jsx("span",{children:"Subtotal:"}),e.jsxs("span",{children:["C$",H(t.subtotal)]})]}),t.descuento>0&&e.jsxs(V,{children:[e.jsx("span",{children:"Descuento:"}),e.jsxs("span",{style:{color:"#dc3545"},children:["- C$",H(t.descuento)]})]}),e.jsxs(V,{$bold:!0,$bordered:!0,children:[e.jsx("span",{children:"Total Transacción:"}),e.jsxs("span",{children:["C$",H(Math.abs(t.totalVenta))]})]}),t.pagoDetalles&&e.jsxs("div",{style:{marginTop:"1rem"},children:[e.jsx("h5",{style:{marginBottom:"0.5rem",fontSize:"1rem"},children:"Detalle del Pago:"}),t.pagoDetalles.efectivo>0&&e.jsxs(V,{children:[e.jsxs("span",{children:[e.jsx(Be,{})," Efectivo Recibido:"]}),e.jsxs("span",{children:["C$",H(t.pagoDetalles.efectivo)]})]}),t.pagoDetalles.tarjeta>0&&e.jsxs(e.Fragment,{children:[e.jsxs(V,{children:[e.jsxs("span",{children:[e.jsx(ut,{})," Tarjeta:"]}),e.jsxs("span",{children:["C$",H(t.pagoDetalles.tarjeta)]})]}),t.pagoDetalles.referenciaTarjeta&&e.jsxs(V,{style:{fontSize:"0.85rem",color:"#666",paddingLeft:"1.5rem"},children:[e.jsx("span",{children:"↳ Ref:"}),e.jsx("span",{children:t.pagoDetalles.referenciaTarjeta})]})]}),t.pagoDetalles.transferencia>0&&e.jsxs(e.Fragment,{children:[e.jsxs(V,{children:[e.jsxs("span",{children:[e.jsx(Xe,{})," Transferencia:"]}),e.jsxs("span",{children:["C$",H(t.pagoDetalles.transferencia)]})]}),t.pagoDetalles.referenciaTransferencia&&e.jsxs(V,{style:{fontSize:"0.85rem",color:"#666",paddingLeft:"1.5rem"},children:[e.jsx("span",{children:"↳ Ref:"}),e.jsx("span",{children:t.pagoDetalles.referenciaTransferencia})]})]}),t.pagoDetalles.credito>0&&e.jsxs(V,{children:[e.jsxs("span",{children:[e.jsx(qe,{})," Crédito Otorgado:"]}),e.jsxs("span",{style:{color:"#dc3545"},children:["C$",H(t.pagoDetalles.credito)]})]}),t.pagoDetalles.vuelto>0&&e.jsxs(V,{children:[e.jsx("span",{children:"Vuelto Entregado:"}),e.jsxs("span",{children:["- C$",H(t.pagoDetalles.vuelto)]})]})]})]})]}),t.estado!=="CANCELADA"&&e.jsxs(ye,{children:[e.jsx("h4",{children:"Acciones"}),e.jsxs(Kt,{children:[e.jsxs(A,{onClick:h,children:[e.jsx(et,{})," Reimprimir Ticket"]}),T&&e.jsxs(A,{$cancel:!0,onClick:W,children:[e.jsx(bt,{})," Cancelar Venta"]})]})]})]})},tn=U.memo(en),Te=()=>{const t=new Date,o=t.toLocaleString("en-US",{year:"numeric",timeZone:"America/Managua"}),p=t.toLocaleString("en-US",{month:"2-digit",timeZone:"America/Managua"}),x=t.toLocaleString("en-US",{day:"2-digit",timeZone:"America/Managua"});return`${o}-${p}-${x}`},Le=t=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(t||0)),nn=t=>{if(!t)return{label:"N/A",icon:null};const{efectivo:o,tarjeta:p,transferencia:x,credito:y}=t;if(Number(y)>0)return{label:"Crédito",icon:e.jsx(We,{style:{color:"#dc3545"}})};const u=[];if(Number(o)>0&&u.push("Efectivo"),Number(p)>0&&u.push("Tarjeta"),Number(x)>0&&u.push("Transferencia"),u.length===1){const s=u[0];return s==="Efectivo"?{label:"Efectivo",icon:e.jsx($e,{style:{color:"#28a745"}})}:s==="Tarjeta"?{label:"Tarjeta",icon:e.jsx(We,{style:{color:"#007bff"}})}:{label:"Transferencia",icon:e.jsx(Xe,{style:{color:"#007bff"}})}}return u.length>1?{label:"Mixto",icon:e.jsx($e,{style:{color:"#ffc107"}})}:{label:"Contado",icon:e.jsx($e,{style:{color:"#28a745"}})}},Ce=(t,o=0)=>(t==null?void 0:t.nombre)??(t==null?void 0:t.name)??(t==null?void 0:t.producto)??(t==null?void 0:t.descripcion)??`Item ${o+1}`,on=m(we)`
  width: 95%;
  max-width: 1400px;
  height: 90vh;
  display: flex;
  flex-direction: column;
  padding: 1.25rem;

  @media (max-width: 768px) {
    height: 95vh;
    padding: 1rem;
  }
`,rn=m.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #dee2e6;
  h2 { display: flex; align-items: center; gap: .5rem; margin: 0; }
`,an=m.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: .75rem 1rem; margin-bottom: 1rem;

  @media (max-width: 1100px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 520px) { grid-template-columns: 1fr; }

  label { display: block; font-size: .9rem; color: #6c757d; margin-bottom: .25rem; }
`,sn=m.div`
  display: grid; grid-template-columns: 380px 1fr; gap: 1rem; flex: 1; min-height: 0;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`,ln=m.div`
  background: #f8f9fa; border-radius: 12px; padding: .75rem; display: flex;
  flex-direction: column; min-height: 0;
`,ve=m.div`
  background: #fff; border-radius: 12px; padding: 1rem; min-height: 0;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
`,dn=m.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: .5rem;
  small { color: #6c757d; }
`,cn=m.div`
  flex: 1; overflow: auto; padding-right: 4px; min-height: 200px;
`,pn=m.div`
  display: flex; justify-content: center; align-items: center; gap: .75rem;
  padding-top: .5rem; border-top: 1px solid #e9ecef;
`,mn=m.div`
  padding: .7rem .8rem; border-left: 5px solid ${t=>t.$borderColor||"#6c757d"};
  border-radius: 8px; background: ${t=>t.selected?"#e9f2ff":"#fff"};
  box-shadow: 0 1px 3px rgba(0,0,0,.05);
  margin-bottom: .6rem; cursor: pointer; transition: box-shadow .15s, background .15s;

  &:hover { box-shadow: 0 2px 6px rgba(0,0,0,.1); }

  .top {
    display: flex; justify-content: space-between; gap: .75rem; font-weight: 700; font-size: .95rem;
    word-break: break-word;
  }
  .sub { color: #6c757d; font-size: .82rem; margin-top: 2px; }
`,xn=m.span`
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 9999px; padding: .25rem .6rem; font-weight: 700; font-size: .8rem;
  ${t=>t.$green&&le`background:#e8f7ee; color:#198754;`}
  ${t=>t.$red&&le`background:#fdecec; color:#dc3545;`}
`,hn=U.memo(function({sale:o,isSelected:p,onSelect:x,safeUsers:y,safeClients:u}){const s={COMPLETADA:"#28a745",CANCELADA:"#dc3545",DEVOLUCION:"#ffc107",ABONO_CREDITO:"#17a2b8"},v=l.useMemo(()=>{var a,k;return((a=(y||[]).find(f=>((f==null?void 0:f.id_usuario)??(f==null?void 0:f.id))==(o==null?void 0:o.userId)))==null?void 0:a.nombre_usuario)||((k=o==null?void 0:o.usuario)==null?void 0:k.nombre_usuario)||(o==null?void 0:o.userName)||(o==null?void 0:o.vendedor)||"N/A"},[y,o]),h=l.useMemo(()=>{var a,k;return((a=(u||[]).find(f=>(f==null?void 0:f.id_cliente)===((o==null?void 0:o.clientId)||(o==null?void 0:o.idCliente))))==null?void 0:a.nombre)||((k=o==null?void 0:o.cliente)==null?void 0:k.nombre)||(o==null?void 0:o.clientName)||"Consumidor Final"},[u,o]),i=Number(o.totalVenta??o.total_venta??o.total??0),w=nn(o.pagoDetalles),E=o.estado==="ABONO_CREDITO"?e.jsxs(e.Fragment,{children:[e.jsx(tt,{style:{marginRight:6}})," ABONO"]}):e.jsxs(e.Fragment,{children:["#",o.id," - ",o.estado.replace("_"," ")]});return e.jsxs(mn,{onClick:()=>x(o),selected:p,$borderColor:s[o.estado]||"#6c757d",title:`Venta #${o.id}`,children:[e.jsxs("div",{className:"top",children:[e.jsx("span",{children:E}),e.jsxs("span",{children:[w.icon," C$",Le(Math.abs(i))]})]}),e.jsxs("div",{className:"sub",children:[new Date(o.fecha).toLocaleString("es-NI")," · Cliente: ",e.jsx("strong",{children:h})," · Vendedor: ",v]})]})}),Ie=10;function fn({dailySales:t=[],loadSales:o,onClose:p,isAdmin:x,users:y=[],clients:u=[],onReprintTicket:s,onCancelSale:v,onReturnItem:h,onAbonoSuccess:i,initialClientId:w=null}){var Re,Pe,Oe,ze;const[E,T]=l.useState(Te()),[a,k]=l.useState(Te()),[f,I]=l.useState(Array.isArray(t)?t:[]),[W,g]=l.useState(!1),[$,C]=l.useState(""),[D,O]=l.useState(""),[B,X]=l.useState(""),[F,ee]=l.useState(1),Z=l.useMemo(()=>Array.isArray(y)?y:[],[y]),L=l.useMemo(()=>Array.isArray(u)?u:[],[u]);l.useEffect(()=>{if(w){const n=L.find(c=>c.id_cliente===w);n?(C(n.nombre),k("")):C(String(w))}},[w,L]);const[r,d]=l.useState(null),[N,R]=l.useState(!1),[_,J]=l.useState({open:!1,title:"",message:""}),M=(n,c)=>J({open:!0,title:n,message:c}),me=()=>J({open:!1,title:"",message:""}),[te,ne]=l.useState({open:!1,title:"",message:"",onConfirm:null}),P=(n,c,j)=>ne({open:!0,title:n,message:c,onConfirm:j}),ae=()=>ne({open:!1,title:"",message:"",onConfirm:null}),[Y,b]=l.useState({open:!1,title:"",message:"",initialValue:"1",onConfirm:null}),Q=(n,c,j,z)=>b({open:!0,title:n,message:c,initialValue:String(j??"1"),onConfirm:z}),de=()=>b({open:!1,title:"",message:"",initialValue:"1",onConfirm:null}),ie=l.useCallback(async(n=null)=>{if(!o)return[];g(!0),T(n);try{const c=await o(n),j=Array.isArray(c)?c:[];return I(j),j}catch(c){return I([]),M("Error","No se pudieron cargar las transacciones: "+(c.message||"Error de conexión.")),[]}finally{g(!1)}},[o]);l.useEffect(()=>{const c=$&&$.length>=2||w&&!a?null:a;ie(c),ee(1),d(null)},[a,ie,$,w]),l.useEffect(()=>{a===Te()&&Array.isArray(t)&&!$&&I(t)},[t,a,$]);const q=l.useMemo(()=>{const n=($||"").toLowerCase();return(f||[]).filter(j=>{var fe;const z=j.clientId||j.idCliente,K=((fe=L.find(ge=>ge.id_cliente===z))==null?void 0:fe.nombre)||"";return(!D||String(j.userId)===String(D))&&(!B||j.estado===B)&&(!n||String(j.id).includes(n)||K.toLowerCase().includes(n))}).sort((j,z)=>new Date(z.fecha)-new Date(j.fecha))},[f,D,B,$,L]),xe=Math.max(1,Math.ceil(q.length/Ie)),Me=(F-1)*Ie,se=q.slice(Me,Me+Ie);l.useEffect(()=>{(!r||!se.some(n=>n.id===r.id))&&d(se[0]||null)},[se,r]);const ce=l.useCallback(async(n=null)=>{const c=await ie(E);if(n){const j=(c||[]).find(z=>String(z.id)===String(n));d(j||null)}else d(null)},[ie,E]),_e=l.useCallback(n=>{const c=n||(r==null?void 0:r.id);if(!(!c||!r)){if(r.estado==="CANCELADA"){M("Venta ya cancelada",`La venta #${c} ya fue cancelada.`);return}if(!v){M("Error de Configuración","onCancelSale no fue proporcionada.");return}P("Cancelar Venta",`¿Seguro que deseas cancelar la venta #${c}? Esta acción revierte inventario y no se puede deshacer.`,async()=>{ae();try{await v(r),M("Éxito",`Venta #${c} cancelada.`),await ce(null)}catch(j){M("Error al Cancelar",j.message||"No se pudo cancelar la venta.")}})}},[r,v,ce]),ot=l.useCallback((n,c=0)=>{if(!r)return;if(!h){M("Error de Configuración","onReturnItem no fue proporcionada.");return}const j=Number((n==null?void 0:n.quantity)||(n==null?void 0:n.cantidad)||0);if(!Number.isFinite(j)||j<=0){M("No se puede devolver","Este artículo no tiene cantidad disponible para devolver.");return}Q("Devolver producto",`Cantidad a devolver para "${Ce(n,c)}" (máx. ${j})`,"1",async z=>{const K=Number(z);if(!Number.isFinite(K)||K<=0||K>j){M("Cantidad inválida",`Ingresa un número entre 1 y ${j}.`);return}const fe=r.items.length===1&&K===j,ge=async()=>{try{await h(r,n,K),M("Éxito",`Se devolvieron ${K} unidad(es) de ${Ce(n,c)}.`),await ce(null)}catch(ue){const Ve=((ue==null?void 0:ue.message)||"").toLowerCase(),it=Ve.includes("not found")||Ve.includes("404")?"Ruta de API no encontrada.":ue.message||"No se pudo devolver el producto.";M("Error al Devolver",it)}};if(fe){de(),setTimeout(()=>{ne({open:!0,title:"¿Cancelar Venta Completa?",message:`Este es el ÚLTIMO artículo de la venta. 

¿Prefieres CANCELAR toda la venta en lugar de hacer una devolución individual?
(Esto revertirá todo el ticket).`,onConfirm:async()=>{ne({open:!1,title:"",message:"",onConfirm:null}),v&&_e(r.id)},onClose:()=>{ne({open:!1,title:"",message:"",onConfirm:null}),ge()}})},100);return}await ge()})},[r,h,ce]),he=l.useCallback(()=>{r&&(s==null||s(r))},[r,s]),rt=q.length,at=se.length;return e.jsxs(Ne,{"data-history-modal":!0,children:[e.jsxs(on,{children:[e.jsxs(rn,{children:[e.jsxs("h2",{children:[e.jsx(He,{})," Historial de Transacciones"]}),e.jsx(A,{$cancel:!0,onClick:p,children:e.jsx(De,{})})]}),e.jsxs(an,{children:[e.jsxs("div",{children:[e.jsxs("label",{children:[e.jsx(jt,{})," Buscar ID/Cliente:"]}),e.jsx(be,{type:"text",placeholder:"ID o nombre",value:$,onChange:n=>C(n.target.value)})]}),e.jsxs("div",{children:[e.jsxs("label",{children:[e.jsx(Ke,{})," Fecha:"]}),e.jsx(be,{type:"date",value:a,onChange:n=>k(n.target.value)})]}),x&&e.jsxs("div",{children:[e.jsxs("label",{children:[e.jsx(yt,{})," Usuario:"]}),e.jsxs(be,{as:"select",value:D,onChange:n=>O(n.target.value),children:[e.jsx("option",{value:"",children:"Todos"}),Z.map(n=>e.jsx("option",{value:n.id_usuario??n.id,children:n.nombre_usuario??n.nombre},n.id_usuario??n.id))]})]}),e.jsxs("div",{children:[e.jsxs("label",{children:[e.jsx(Ct,{})," Estado:"]}),e.jsxs(be,{as:"select",value:B,onChange:n=>X(n.target.value),children:[e.jsx("option",{value:"",children:"Todos"}),e.jsx("option",{value:"COMPLETADA",children:"Completadas"}),e.jsx("option",{value:"CANCELADA",children:"Canceladas"}),e.jsx("option",{value:"DEVOLUCION",children:"Devoluciones"}),e.jsx("option",{value:"ABONO_CREDITO",children:"Abonos"})]})]})]}),e.jsxs(sn,{children:[e.jsxs(ln,{children:[e.jsxs(dn,{children:[e.jsx("small",{children:$?e.jsx("strong",{children:"Mostrando historial de búsqueda"}):`Resultados: ${rt}`}),e.jsxs(xn,{$green:!0,children:["Mostrando ",at]})]}),W&&e.jsx(ke,{style:{textAlign:"center",margin:".5rem 0"},children:"Cargando transacciones…"}),!W&&e.jsx(cn,{children:se.length?se.map(n=>e.jsx(hn,{sale:n,isSelected:(r==null?void 0:r.id)===n.id,onSelect:d,safeUsers:Z,safeClients:L},n.id)):e.jsx("p",{style:{textAlign:"center",color:"#6c757d",marginTop:"1rem"},children:"No se encontraron transacciones para la fecha y filtros seleccionados."})}),xe>1&&e.jsxs(pn,{children:[e.jsx(A,{onClick:()=>ee(n=>Math.max(1,n-1)),disabled:F===1,title:"Anterior",children:e.jsx(vt,{})}),e.jsxs("span",{children:["Página ",F," de ",xe]}),e.jsx(A,{onClick:()=>ee(n=>Math.min(xe,n+1)),disabled:F===xe,title:"Siguiente",children:e.jsx(Nt,{})})]})]}),r?r.estado==="ABONO_CREDITO"?e.jsxs(ve,{children:[e.jsxs("div",{style:{borderBottom:"2px dashed #ccc",paddingBottom:15,marginBottom:15},children:[e.jsxs("h3",{style:{margin:0,fontSize:"1.4rem",color:"#17a2b8",textAlign:"center"},children:[e.jsx(tt,{})," Recibo de Abono"]}),e.jsxs("p",{style:{textAlign:"center",color:"#555",margin:"5px 0"},children:["#",r.id]})]}),e.jsx(ke,{children:e.jsxs("div",{style:{display:"grid",gap:10},children:[e.jsxs(G,{children:[e.jsx("span",{children:"Fecha:"}),e.jsx("strong",{children:new Date(r.fecha).toLocaleString("es-NI")})]}),e.jsxs(G,{children:[e.jsx("span",{children:"Cliente:"}),e.jsx("strong",{style:{fontSize:"1.1rem"},children:((Re=L.find(n=>n.id_cliente===(r.clientId||r.idCliente)))==null?void 0:Re.nombre)||"Desconocido"})]}),e.jsxs(G,{children:[e.jsx("span",{children:"Cajero:"}),e.jsx("strong",{children:((Pe=Z.find(n=>(n.id_usuario??n.id)==r.userId))==null?void 0:Pe.nombre_usuario)||r.usuarioNombre||"Sistema"})]})]})}),e.jsx("div",{style:{margin:"20px 0",border:"1px solid #ddd",padding:15,borderRadius:8,background:"#f8f9fa"},children:e.jsxs(G,{style:{fontSize:"1.2rem",color:"#28a745"},children:[e.jsx("span",{children:"Monto Abonado:"}),e.jsxs("strong",{children:["C$ ",Le(r.totalVenta)]})]})}),e.jsx("div",{style:{display:"flex",justifyContent:"center",marginTop:20},children:e.jsxs(A,{onClick:he,style:{fontSize:"1.1rem",padding:"10px 20px"},children:[e.jsx(et,{})," Imprimir Comprobante"]})})]}):r.estado==="DEVOLUCION"?e.jsxs(ve,{children:[e.jsxs("h3",{style:{marginTop:0},children:["Detalle de Transacción #",r.id]}),e.jsxs("div",{className:"box",style:{marginTop:10},children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Cliente:"})," ",((Oe=L.find(n=>n.id_cliente===(r.clientId||r.idCliente)))==null?void 0:Oe.nombre)||"Consumidor Final"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Fecha:"})," ",new Date(r.fecha).toLocaleString("es-NI")]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Estado:"})," ",e.jsx("span",{style:{background:"#fff3cd",color:"#856404",padding:"2px 8px",borderRadius:8,fontWeight:700},children:"DEVOLUCIÓN"})]})]}),e.jsxs("div",{className:"box",style:{marginTop:10},children:[e.jsx("h4",{style:{marginTop:0},children:"Detalle de Devolución"}),e.jsx("ul",{style:{margin:0,paddingLeft:18},children:(r.items||[]).map((n,c)=>e.jsxs("li",{children:[e.jsx("strong",{children:Ce(n,c)})," ","— ",Number(n.quantity||n.cantidad||0)," u. @ C$",Number(n.precio||n.precio_unitario||0).toFixed(2)]},`${n.id||n.id_producto}-${c}`))}),e.jsxs("p",{style:{marginTop:8},children:["Importe devuelto:"," ",e.jsxs("strong",{children:["C$",(()=>{const n=Number(r.totalVenta??r.total_venta??r.total??0);return Math.abs(n).toFixed(2)})()]})]})]}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-start",gap:10,marginTop:12},children:e.jsx(A,{onClick:he,children:"Reimprimir Ticket"})})]}):r.estado==="CANCELADA"?e.jsxs(ve,{children:[e.jsxs("h3",{style:{marginTop:0,color:"#dc3545"},children:["Detalle de Venta Cancelada #",r.id]}),e.jsxs("div",{className:"box",style:{marginTop:10},children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Cliente:"})," ",((ze=L.find(n=>n.id_cliente===(r.clientId||r.idCliente)))==null?void 0:ze.nombre)||"Consumidor Final"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Fecha:"})," ",new Date(r.fecha).toLocaleString("es-NI")]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Estado:"})," ",e.jsx("span",{style:{background:"#f8d7da",color:"#721c24",padding:"2px 8px",borderRadius:8,fontWeight:700},children:"CANCELADA"})]})]}),e.jsxs("div",{className:"box",style:{marginTop:10},children:[e.jsx("h4",{style:{marginTop:0},children:"Productos Cancelados"}),!r.items||r.items.length===0?e.jsx("p",{style:{color:"#6c757d",fontStyle:"italic"},children:"No hay detalles de productos disponibles."}):e.jsx("ul",{style:{margin:0,paddingLeft:18,color:"#6c757d"},children:r.items.map((n,c)=>e.jsxs("li",{children:[e.jsx("strong",{children:Ce(n,c)})," ","— ",Number(n.quantity||n.cantidad||0)," u."]},`${n.id||n.id_producto}-${c}`))}),e.jsxs("p",{style:{marginTop:8,color:"#dc3545",textDecoration:"line-through"},children:["Total Anulado: ",e.jsxs("strong",{children:["C$ ",Le(r.totalVenta)]})]})]}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-start",gap:10,marginTop:12},children:e.jsx(A,{onClick:he,children:"Reimprimir Comprobante"})})]}):e.jsx(tn,{sale:r,client:L.find(n=>n.id_cliente===(r.clientId||r.idCliente)),creditStatus:null,dailySales:f,isAdmin:x,onOpenAbonoModal:()=>R(!0),onCancelSale:n=>_e(n),onReturnItem:(n,c)=>ot(n,c),onReprintTicket:he,showConfirmation:({onConfirm:n})=>P("Confirmación","¿Confirmar acción?",n),showPrompt:({title:n,message:c,defaultValue:j,onConfirm:z})=>Q(n,c,j,z),showAlert:({title:n,message:c})=>M(n,c)}):e.jsx(ve,{children:e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"#aaa",fontStyle:"italic",flexDirection:"column"},children:[e.jsx(He,{size:40,style:{marginBottom:10,opacity:.5}}),e.jsx("p",{children:"Seleccione una transacción para ver detalles"})]})})]}),N&&r&&e.jsx(Ot,{client:L.find(n=>n.id_cliente===(r.clientId||r.idCliente)),onClose:()=>R(!1),onAbonoSuccess:async()=>{R(!1),await ce(r.id),i==null||i()},showAlert:({title:n,message:c})=>M(n,c)})]}),e.jsx(St,{isOpen:_.open,onClose:me,title:_.title,message:_.message}),e.jsx(gn,{isOpen:!!te.open,title:te.title,message:te.message,onCancel:ae,onConfirm:te.onConfirm||ae}),e.jsx(un,{isOpen:!!Y.open,title:Y.title,message:Y.message,initialValue:Y.initialValue,onCancel:de,onConfirm:n=>{const c=Y.onConfirm;de(),c&&c(n)}})]})}const nt=({isOpen:t,children:o,maxWidth:p=450})=>t?e.jsx(Ne,{style:{zIndex:99999,backgroundColor:"rgba(0,0,0,0.6)"},children:e.jsx(we,{style:{maxWidth:`${p}px`,textAlign:"center"},children:o})}):null,gn=({isOpen:t,title:o,message:p,onCancel:x,onConfirm:y})=>e.jsxs(nt,{isOpen:t,children:[e.jsx("h2",{style:{marginTop:0},children:o}),e.jsx("p",{style:{color:"#6c757d",lineHeight:1.5},children:p}),e.jsxs("div",{style:{display:"flex",justifyContent:"center",gap:10,marginTop:10},children:[e.jsx(A,{onClick:x,$cancel:!0,children:"Cancelar"}),e.jsx(A,{onClick:y,primary:!0,children:"Aceptar"})]})]}),un=({isOpen:t,title:o,message:p,initialValue:x="1",inputType:y="number",onCancel:u,onConfirm:s})=>{const[v,h]=l.useState(x);return l.useEffect(()=>{h(x)},[x,t]),e.jsxs(nt,{isOpen:t,children:[e.jsx("h2",{style:{marginTop:0},children:o}),p&&e.jsx("p",{style:{color:"#6c757d"},children:p}),e.jsx("input",{style:{width:"100%",padding:".6rem",borderRadius:8,border:"1px solid #dee2e6",margin:"8px 0 14px"},type:y,value:v,onChange:i=>h(i.target.value)}),e.jsxs("div",{style:{display:"flex",justifyContent:"center",gap:10},children:[e.jsx(A,{onClick:u,$cancel:!0,children:"Cancelar"}),e.jsx(A,{onClick:()=>s(v),primary:!0,children:"Aceptar"})]})]})},Nn=U.memo(fn);export{Ot as A,Nn as S,vn as T};
