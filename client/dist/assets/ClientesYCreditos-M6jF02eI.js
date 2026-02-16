import{r as i,j as e,n as B,D as H,s,af as U,a9 as G,J as M,K as L,ag as E,v as W,S as J,X as Y,ah as Z,W as q,a5 as K,ai as O,Y as X,V as z,U as Q}from"./vendor-BHEUBfle.js";import{e as ee,h as te,u as V,i as re,j as se,k as ne,m as oe,n as ae}from"./index-WS_0-QTp.js";import{T as R,A as ie,S as de}from"./SalesHistoryModal-DK3u_9kg.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-BzGOTXeo.js";import"./POS.styles-Dbi1_TMg.js";import"./AlertModal-DAjc3Hhf.js";const le=s.div`
  position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:50;
`,ce=s.div`
  background:white;padding:2rem;border-radius:8px;width:400px;max-width:90%;
`,me=s.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;`,he=s.h2`margin:0;font-size:1.5rem;`,xe=s.button`border:none;background:none;color:#dc3545;font-size:1.2rem;cursor:pointer;`,ue=s.form`display:flex;flex-direction:column;gap:0.8rem;`,A=s.input`padding:0.6rem;border:1px solid #ccc;border-radius:6px;font-size:0.95rem;`,pe=s.button`
  padding:0.6rem 1rem;background:#007bff;color:white;border:none;border-radius:6px;font-weight:bold;display:flex;align-items:center;gap:0.5rem;justify-content:center;
  &:hover{opacity:0.85;}
`;function fe({client:r,onClose:C,onSave:h}){const[w,x]=i.useState(""),[m,j]=i.useState(""),[o,b]=i.useState(""),[u,f]=i.useState(""),v=localStorage.getItem("token");i.useEffect(()=>{r?(x(r.nombre||""),j(r.cedula||""),b(r.telefono||""),f(r.limite_credito||"")):(x(""),j(""),b(""),f(""))},[r]);const S=async a=>{a.preventDefault();const l={nombre:w,cedula:m,telefono:o,limite_credito:u===""?null:Number(u)};try{r?await ee(r.id_cliente,l,v):await te(l,v),h&&h(),C()}catch(N){console.error(N),alert(`Error al guardar cliente: ${N.message}`)}};return e.jsx(le,{children:e.jsxs(ce,{children:[e.jsxs(me,{children:[e.jsx(he,{children:r?"Editar Cliente":"Nuevo Cliente"}),e.jsx(xe,{onClick:C,children:e.jsx(B,{})})]}),e.jsxs(ue,{onSubmit:S,children:[e.jsx(A,{value:w,onChange:a=>x(a.target.value),placeholder:"Nombre",required:!0}),e.jsx(A,{value:m,onChange:a=>j(a.target.value),placeholder:"Cédula / RUC"}),e.jsx(A,{value:o,onChange:a=>b(a.target.value),placeholder:"Teléfono"}),e.jsx(A,{type:"number",step:"0.01",value:u,onChange:a=>f(a.target.value),placeholder:"Límite de crédito"}),e.jsxs(pe,{type:"submit",children:[e.jsx(H,{})," Guardar"]})]})]})})}const ge=s.div`position: fixed; inset: 0; background-color: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 1rem;`,je=s.div`background: #f4f7f6; color: #333; border-radius: 10px; width: 900px; max-width: 100%; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0,0,0,0.1);`,be=s.div`padding: 1rem 1.5rem; border-bottom: 1px solid #dee2e6; display: flex; justify-content: space-between; align-items: center;`,ye=s.h2`margin: 0; font-size: 1.5rem;`,Ce=s.button`background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #888; &:hover{color:#333;}`,we=s.div`padding: 1.5rem; overflow-y: auto;`,ve=s.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;`,F=s.div`
  background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border-left: 5px solid ${r=>r.color||"#ccc"};
  h3 { margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666; text-transform: uppercase; }
  p { margin: 0; font-size: 1.75rem; font-weight: bold; color: ${r=>r.color||"#333"}; }
`,ke=s(W)`animation: spin 1s linear infinite; @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`,D=s.div`text-align: center; padding: 2rem; color: #6c757d;`,$e=s.div`
  background: white; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;
  border: 1px solid #e9ecef; box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  border-left: 5px solid ${r=>r.$estado==="PAGADO"?"#28a745":r.$estado==="DEVUELTO"?"#ffc107":"#dc3545"};
`,Se=s.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;
  .ticket-title { font-weight: 700; font-size: 1.1rem; color: #0056b3; }
  .ticket-date { font-size: 0.85rem; color: #6c757d; }
`,Ne=s.div`
  width: 100%; height: 8px; background: #e9ecef; border-radius: 4px; overflow: hidden; margin: 0.5rem 0;
  .fill { height: 100%; background: ${r=>r.$pct>=100?"#28a745":"#007bff"}; border-radius: 4px; transition: width 0.3s; }
`,Te=s.div`
  display: flex; gap: 1.5rem; flex-wrap: wrap; font-size: 0.9rem; color: #495057;
  .stat { display: flex; flex-direction: column; }
  .stat-label { font-size: 0.75rem; color: #6c757d; text-transform: uppercase; font-weight: 600; }
  .stat-value { font-weight: 700; font-size: 1.1rem; }
`,Ae=s.span`
  font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 12px;
  background: ${r=>r.$type==="PAGADO"?"#d4edda":r.$type==="DEVUELTO"?"#fff3cd":"#f8d7da"};
  color: ${r=>r.$type==="PAGADO"?"#155724":r.$type==="DEVUELTO"?"#856404":"#721c24"};
`,Fe=s.div`padding: 0; margin: 0.75rem 0 0;`,_e=s.div`
  display: flex; gap: 0.75rem; padding: 0.5rem 0; border-bottom: 1px solid #f1f5f9;
  &:last-child { border-bottom: none; }
  .icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0;
    background: ${r=>r.$type==="credito"?"#dc3545":"#28a745"}; font-size: 0.8rem; }
  .content { flex: 1; }
  .amount { font-weight: 700; color: ${r=>r.$type==="credito"?"#dc3545":"#28a745"}; }
  .meta { font-size: 0.8rem; color: #6c757d; }
`,$=r=>`C$${Number(r||0).toFixed(2)}`,ze=r=>r?new Date(r).toLocaleDateString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric"}):"—",De=r=>r?new Date(r).toLocaleString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0}):"—";function Ee({client:r,onClose:C,token:h}){const[w,x]=i.useState(!0),[m,j]=i.useState([]),[o,b]=i.useState([]),[u,f]=i.useState(null),{allUsers:v}=V(),[S,a]=i.useState(!1),[l,N]=i.useState(null),T=i.useCallback(async()=>{if(r){x(!0),f(null);try{const[t,d,p]=await Promise.all([re(r.id_cliente,h),se(r.id_cliente,h),ne(r.id_cliente,h)]);j(Array.isArray(t)?t:[]);const _=(d||[]).map(n=>{let k=n.pagoDetalles||{};if(typeof k=="string")try{k=JSON.parse(k)}catch{k={}}return{id:`c-${n.id_venta}`,fecha:new Date(n.fecha),tipo:"credito",descripcion:`Compra a crédito (Venta #${n.id_venta})`,monto:Number(k.credito||n.total||0),userId:n.id_usuario,idVenta:n.id_venta}}),c=(p||[]).map(n=>({id:`a-${n.id_abono}`,fecha:new Date(n.fecha),tipo:"abono",descripcion:"Abono registrado",monto:Number(n.monto),userId:n.id_usuario||n.usuario}));b([..._,...c].sort((n,k)=>k.fecha-n.fecha))}catch(t){console.error("Error cargando historial:",t),f("No se pudo cargar el historial del cliente.")}finally{x(!1)}}},[r,h]);i.useEffect(()=>{T()},[T]);const g=i.useMemo(()=>{const t=o.filter(c=>c.tipo==="credito").reduce((c,n)=>c+n.monto,0),d=o.filter(c=>c.tipo==="abono").reduce((c,n)=>c+n.monto,0),p=m.filter(c=>c.saldoRestante>0).length,_=m.filter(c=>c.saldoRestante<=0).length;return{totalCredito:t,totalAbono:d,ticketsPendientes:p,ticketsPagados:_}},[o,m]);return r?e.jsxs(ge,{onClick:C,children:[e.jsxs(je,{onClick:t=>t.stopPropagation(),children:[e.jsxs(be,{children:[e.jsxs(ye,{children:["Historial de ",r.nombre]}),e.jsx(Ce,{onClick:C,children:e.jsx(B,{})})]}),e.jsxs(we,{children:[w&&e.jsxs(D,{children:[e.jsx(ke,{size:30})," ",e.jsx("p",{children:"Cargando..."})]}),u&&e.jsx(D,{style:{color:"red"},children:u}),!w&&!u&&e.jsxs(e.Fragment,{children:[e.jsxs(ve,{children:[e.jsxs(F,{color:"#dc3545",children:[e.jsx("h3",{children:"Total Crédito"}),e.jsx("p",{children:$(g.totalCredito)})]}),e.jsxs(F,{color:"#28a745",children:[e.jsx("h3",{children:"Total Abonado"}),e.jsx("p",{children:$(g.totalAbono)})]}),e.jsxs(F,{color:"#007bff",children:[e.jsx("h3",{children:"Saldo Actual"}),e.jsx("p",{children:$(r.saldo_pendiente)})]}),e.jsxs(F,{color:g.ticketsPendientes>0?"#ffc107":"#28a745",children:[e.jsx("h3",{children:"Facturas"}),e.jsx("p",{style:{fontSize:"1.2rem"},children:g.ticketsPendientes>0?e.jsxs(e.Fragment,{children:[e.jsx(U,{style:{color:"#ffc107"}})," ",g.ticketsPendientes," pendiente",g.ticketsPendientes>1?"s":""]}):e.jsxs(e.Fragment,{children:[e.jsx(G,{style:{color:"#28a745"}})," Todo pagado"]})})]})]}),m.length>0&&e.jsxs(e.Fragment,{children:[e.jsxs("h3",{style:{margin:"0 0 1rem",color:"#333",display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(M,{})," Desglose por Factura"]}),m.map(t=>{const d=t.montoOriginal-t.saldoRestante,p=t.montoOriginal>0?d/t.montoOriginal*100:0;return e.jsxs($e,{$estado:t.estado,children:[e.jsxs(Se,{children:[e.jsxs("div",{children:[e.jsxs("span",{className:"ticket-title",children:["Venta #",t.idVenta]}),e.jsx(Ae,{$type:t.estado,style:{marginLeft:"0.75rem"},children:t.estado})]}),e.jsx("span",{className:"ticket-date",children:ze(t.fecha)})]}),e.jsx(Ne,{$pct:p,children:e.jsx("div",{className:"fill",style:{width:`${Math.min(100,p)}%`}})}),e.jsxs(Te,{children:[e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Monto Original"}),e.jsx("span",{className:"stat-value",children:$(t.montoOriginal)})]}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Pagado"}),e.jsx("span",{className:"stat-value",style:{color:"#28a745"},children:$(d)})]}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Pendiente"}),e.jsx("span",{className:"stat-value",style:{color:t.saldoRestante>0?"#dc3545":"#28a745"},children:$(t.saldoRestante)})]}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Progreso"}),e.jsxs("span",{className:"stat-value",children:[Math.round(p),"%"]})]})]})]},t.idVenta)})]}),e.jsx("h3",{style:{margin:"1.5rem 0 0.75rem",color:"#333"},children:"Historial Completo"}),e.jsx(Fe,{children:o.length>0?o.map(t=>{const d=v.find(p=>(p.id_usuario??p.id)===t.userId);return e.jsxs(_e,{$type:t.tipo,children:[e.jsx("div",{className:"icon",children:t.tipo==="credito"?e.jsx(L,{}):e.jsx(E,{})}),e.jsxs("div",{className:"content",children:[e.jsx("span",{className:"amount",children:$(t.monto)}),e.jsx("p",{style:{margin:"2px 0"},children:t.descripcion}),e.jsxs("span",{className:"meta",children:[De(t.fecha)," por ",e.jsx("strong",{children:(d==null?void 0:d.nombre_usuario)||"Sistema"})]})]})]},t.id)}):e.jsxs(D,{children:[e.jsx(M,{size:40}),e.jsx("p",{children:"No hay movimientos para mostrar."})]})})]})]})]}),S&&l&&e.jsx(R,{transaction:{estado:"ABONO_CREDITO",totalVenta:l.monto,fecha:l.fecha,id:l.id.split("-")[1],clientId:r.id_cliente,userId:l.userId},creditStatus:{remainingBalance:Number(r.saldo_pendiente||0)},clients:[r],users:v,onClose:()=>a(!1)})]}):null}const P=s.div`
    padding: 2rem 4rem;
    background: #f8f9fa;
    min-height: 100vh;
    @media(max-width: 992px) {
        padding: 1rem;
    }
`,Me=s.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
`,Oe=s.h1`
    font-size: 2.5rem;
    color: #343a40;
    display: flex;
    align-items: center;
    gap: 1rem;
    @media(max-width: 992px) {
        font-size: 1.8rem;
    }
`,I=s.div`
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
`,y=s.button`
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    color: white;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    background: ${r=>r.primary?"#007bff":r.$delete?"#dc3545":r.$abono?"#17a2b8":(r.$refresh,"#6c757d")};
    &:hover:not(:disabled) {
        opacity: 0.85;
    }
    &:disabled {
        background: #adb5bd;
        cursor: not-allowed;
    }
`,Pe=s(Q)`
    padding: 0.7rem 1.3rem;
    background-color: #6c757d;
    color: white;
    border-radius: 8px;
    font-weight: bold;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    &:hover {
        background-color: #5a6268;
    }
`,Ie=s.table`
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    border-radius: 8px;
    overflow: hidden;
    @media(max-width: 992px) {
        display: none;
    }
    th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #dee2e6;
        vertical-align: middle;
    }
    th {
        background: #f8f9fa;
        color: #495057;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.8rem;
    }
`;function We(){var g;const{clients:r,user:C,token:h,isLoading:w,refreshClients:x,cajaSession:m,allUsers:j}=V(),[o,b]=i.useState({name:null,data:null}),[u,f]=i.useState(null),v=i.useMemo(()=>m&&!m.closedAt,[m]),S=async t=>{if(t.saldo_pendiente>0){z.error("El cliente tiene saldo pendiente.");return}if(window.confirm("¿Seguro de eliminar este cliente?"))try{await ae(t.id_cliente,h),z.success("Cliente eliminado correctamente."),x()}catch(d){z.error(d.message||"Error al eliminar cliente.")}},a=(t,d=null)=>b({name:t,data:d}),l=()=>b({name:null,data:null}),N=t=>`C$${Number(t||0).toFixed(2)}`,T=t=>t===null?"∞":N(t);return w?e.jsx(P,{children:e.jsx("h1",{children:"Cargando..."})}):e.jsxs(P,{children:[e.jsxs(Me,{children:[e.jsxs(Oe,{children:[e.jsx(J,{})," Clientes y Créditos"]}),e.jsxs(I,{children:[e.jsxs(y,{primary:!0,onClick:()=>a("client"),children:[e.jsx(Y,{})," Crear Cliente"]}),e.jsxs(y,{$refresh:!0,onClick:x,children:[e.jsx(Z,{})," Recargar"]}),e.jsxs(Pe,{to:"/dashboard",children:[e.jsx(q,{})," Volver"]})]})]}),e.jsxs(Ie,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"ID"}),e.jsx("th",{children:"Nombre"}),e.jsx("th",{children:"Teléfono"}),e.jsx("th",{children:"Límite"}),e.jsxs("th",{children:[e.jsx(L,{})," Saldo"]}),e.jsx("th",{children:"Acciones"})]})}),e.jsx("tbody",{children:r.map(t=>e.jsxs("tr",{children:[e.jsx("td",{children:t.id_cliente}),e.jsx("td",{children:t.nombre}),e.jsx("td",{children:t.telefono||"N/A"}),e.jsx("td",{children:T(t.limite_credito)}),e.jsx("td",{style:{fontWeight:"bold",color:t.saldo_pendiente>0?"#dc3545":"#28a745"},children:N(t.saldo_pendiente)}),e.jsx("td",{children:e.jsxs(I,{children:[e.jsxs(y,{$abono:!0,disabled:!v||t.saldo_pendiente<=0,onClick:()=>a("abono",t),children:[e.jsx(E,{})," Abono"]}),e.jsxs(y,{onClick:()=>a("client",t),children:[e.jsx(K,{})," Editar"]}),e.jsxs(y,{$delete:!0,onClick:()=>S(t),children:[e.jsx(O,{})," Eliminar"]}),e.jsxs(y,{$delete:!0,onClick:()=>S(t),children:[e.jsx(O,{})," Eliminar"]}),e.jsxs(y,{primary:!0,onClick:()=>a("historial",t),children:[e.jsx(X,{})," Créditos"]}),e.jsxs(y,{$refresh:!0,style:{background:"#6f42c1"},onClick:()=>a("tickets",t),children:[e.jsx(E,{})," Ver Tickets"]})]})})]},t.id_cliente))})]}),o.name==="client"&&e.jsx(fe,{client:o.data,onClose:l,onSave:x}),o.name==="abono"&&e.jsx(ie,{client:o.data,onClose:l,onAbonoSuccess:x,showAlert}),o.name==="historial"&&e.jsx(Ee,{client:o.data,onClose:l,token:h}),o.name==="tickets"&&e.jsx(de,{onClose:l,initialClientId:(g=o.data)==null?void 0:g.id_cliente,clients:r,users:j,loadSales:async t=>{try{return await oe(h,t)}catch(d){return console.error(d),[]}},onReprintTicket:t=>{f(t)}}),u&&e.jsx(R,{isOpen:!0,transaction:u,onClose:()=>f(null),clients:r,users:j,currentUser:C})]})}export{We as default};
