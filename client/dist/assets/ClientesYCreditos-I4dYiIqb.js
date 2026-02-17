import{r as d,j as e,n as U,D as Z,s as n,ae as q,a8 as K,J as P,K as W,af as A,v as X,S as Y,W as Q,ag as ee,V as te,a4 as M,ah as O,X as I,ai as re,aj as ne,ak as T,U as se}from"./vendor-BJZlzDLx.js";import{e as oe,h as ie,u as G,i as ae,j as de,k as le,m as ce,n as me,o as xe}from"./index-eefq-jxX.js";import{T as J,A as he,S as pe}from"./SalesHistoryModal-CqrNoPe0.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-BoQlG7Vl.js";import"./POS.styles-CuhWBpp8.js";import"./AlertModal-4fpfKD_M.js";const ue=n.div`
  position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:50;
`,fe=n.div`
  background:white;padding:2rem;border-radius:8px;width:400px;max-width:90%;
`,ge=n.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;`,je=n.h2`margin:0;font-size:1.5rem;`,be=n.button`border:none;background:none;color:#dc3545;font-size:1.2rem;cursor:pointer;`,ye=n.form`display:flex;flex-direction:column;gap:0.8rem;`,z=n.input`padding:0.6rem;border:1px solid #ccc;border-radius:6px;font-size:0.95rem;`,Ce=n.button`
  padding:0.6rem 1rem;background:#007bff;color:white;border:none;border-radius:6px;font-weight:bold;display:flex;align-items:center;gap:0.5rem;justify-content:center;
  &:hover{opacity:0.85;}
`;function we({client:r,onClose:y,onSave:h}){const[C,p]=d.useState(""),[u,w]=d.useState(""),[a,b]=d.useState(""),[f,g]=d.useState(""),v=localStorage.getItem("token");d.useEffect(()=>{r?(p(r.nombre||""),w(r.cedula||""),b(r.telefono||""),g(r.limite_credito||"")):(p(""),w(""),b(""),g(""))},[r]);const N=async s=>{s.preventDefault();const l={nombre:C,cedula:u,telefono:a,limite_credito:f===""?null:Number(f)};try{r?await oe(r.id_cliente,l,v):await ie(l,v),h&&h(),y()}catch(k){console.error(k),alert(`Error al guardar cliente: ${k.message}`)}};return e.jsx(ue,{children:e.jsxs(fe,{children:[e.jsxs(ge,{children:[e.jsx(je,{children:r?"Editar Cliente":"Nuevo Cliente"}),e.jsx(be,{onClick:y,children:e.jsx(U,{})})]}),e.jsxs(ye,{onSubmit:N,children:[e.jsx(z,{value:C,onChange:s=>p(s.target.value),placeholder:"Nombre",required:!0}),e.jsx(z,{value:u,onChange:s=>w(s.target.value),placeholder:"Cédula / RUC"}),e.jsx(z,{value:a,onChange:s=>b(s.target.value),placeholder:"Teléfono"}),e.jsx(z,{type:"number",step:"0.01",value:f,onChange:s=>g(s.target.value),placeholder:"Límite de crédito"}),e.jsxs(Ce,{type:"submit",children:[e.jsx(Z,{})," Guardar"]})]})]})})}const ve=n.div`position: fixed; inset: 0; background-color: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 1rem;`,ke=n.div`background: #f4f7f6; color: #333; border-radius: 10px; width: 900px; max-width: 100%; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0,0,0,0.1);`,$e=n.div`padding: 1rem 1.5rem; border-bottom: 1px solid #dee2e6; display: flex; justify-content: space-between; align-items: center;`,Se=n.h2`margin: 0; font-size: 1.5rem;`,Ne=n.button`background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #888; &:hover{color:#333;}`,Te=n.div`padding: 1.5rem; overflow-y: auto;`,_e=n.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;`,F=n.div`
  background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border-left: 5px solid ${r=>r.color||"#ccc"};
  h3 { margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666; text-transform: uppercase; }
  p { margin: 0; font-size: 1.75rem; font-weight: bold; color: ${r=>r.color||"#333"}; }
`,Ae=n(X)`animation: spin 1s linear infinite; @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`,E=n.div`text-align: center; padding: 2rem; color: #6c757d;`,ze=n.div`
  background: white; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;
  border: 1px solid #e9ecef; box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  border-left: 5px solid ${r=>r.$estado==="PAGADO"?"#28a745":r.$estado==="DEVUELTO"?"#ffc107":"#dc3545"};
`,Fe=n.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;
  .ticket-title { font-weight: 700; font-size: 1.1rem; color: #0056b3; }
  .ticket-date { font-size: 0.85rem; color: #6c757d; }
`,De=n.div`
  width: 100%; height: 8px; background: #e9ecef; border-radius: 4px; overflow: hidden; margin: 0.5rem 0;
  .fill { height: 100%; background: ${r=>r.$pct>=100?"#28a745":"#007bff"}; border-radius: 4px; transition: width 0.3s; }
`,Ee=n.div`
  display: flex; gap: 1.5rem; flex-wrap: wrap; font-size: 0.9rem; color: #495057;
  .stat { display: flex; flex-direction: column; }
  .stat-label { font-size: 0.75rem; color: #6c757d; text-transform: uppercase; font-weight: 600; }
  .stat-value { font-weight: 700; font-size: 1.1rem; }
`,Pe=n.span`
  font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 12px;
  background: ${r=>r.$type==="PAGADO"?"#d4edda":r.$type==="DEVUELTO"?"#fff3cd":"#f8d7da"};
  color: ${r=>r.$type==="PAGADO"?"#155724":r.$type==="DEVUELTO"?"#856404":"#721c24"};
`,Me=n.div`padding: 0; margin: 0.75rem 0 0;`,Oe=n.div`
  display: flex; gap: 0.75rem; padding: 0.5rem 0; border-bottom: 1px solid #f1f5f9;
  &:last-child { border-bottom: none; }
  .icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0;
    background: ${r=>r.$type==="credito"?"#dc3545":"#28a745"}; font-size: 0.8rem; }
  .content { flex: 1; }
  .amount { font-weight: 700; color: ${r=>r.$type==="credito"?"#dc3545":"#28a745"}; }
  .meta { font-size: 0.8rem; color: #6c757d; }
`,S=r=>`C$${Number(r||0).toFixed(2)}`,Ie=r=>r?new Date(r).toLocaleDateString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric"}):"—",Be=r=>r?new Date(r).toLocaleString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0}):"—";function Le({client:r,onClose:y,token:h}){const[C,p]=d.useState(!0),[u,w]=d.useState([]),[a,b]=d.useState([]),[f,g]=d.useState(null),{allUsers:v}=G(),[N,s]=d.useState(!1),[l,k]=d.useState(null),_=d.useCallback(async()=>{if(r){p(!0),g(null);try{const[t,o,m]=await Promise.all([ae(r.id_cliente,h),de(r.id_cliente,h),le(r.id_cliente,h)]);w(Array.isArray(t)?t:[]);const D=(o||[]).map(i=>{let $=i.pagoDetalles||{};if(typeof $=="string")try{$=JSON.parse($)}catch{$={}}return{id:`c-${i.id_venta}`,fecha:new Date(i.fecha),tipo:"credito",descripcion:`Compra a crédito (Venta #${i.id_venta})`,monto:Number($.credito||i.total||0),userId:i.id_usuario,idVenta:i.id_venta}}),c=(m||[]).map(i=>({id:`a-${i.id_abono}`,fecha:new Date(i.fecha),tipo:"abono",descripcion:"Abono registrado",monto:Number(i.monto),userId:i.id_usuario||i.usuario}));b([...D,...c].sort((i,$)=>$.fecha-i.fecha))}catch(t){console.error("Error cargando historial:",t),g("No se pudo cargar el historial del cliente.")}finally{p(!1)}}},[r,h]);d.useEffect(()=>{_()},[_]);const j=d.useMemo(()=>{const t=a.filter(c=>c.tipo==="credito").reduce((c,i)=>c+i.monto,0),o=a.filter(c=>c.tipo==="abono").reduce((c,i)=>c+i.monto,0),m=u.filter(c=>c.saldoRestante>0).length,D=u.filter(c=>c.saldoRestante<=0).length;return{totalCredito:t,totalAbono:o,ticketsPendientes:m,ticketsPagados:D}},[a,u]);return r?e.jsxs(ve,{onClick:y,children:[e.jsxs(ke,{onClick:t=>t.stopPropagation(),children:[e.jsxs($e,{children:[e.jsxs(Se,{children:["Historial de ",r.nombre]}),e.jsx(Ne,{onClick:y,children:e.jsx(U,{})})]}),e.jsxs(Te,{children:[C&&e.jsxs(E,{children:[e.jsx(Ae,{size:30})," ",e.jsx("p",{children:"Cargando..."})]}),f&&e.jsx(E,{style:{color:"red"},children:f}),!C&&!f&&e.jsxs(e.Fragment,{children:[e.jsxs(_e,{children:[e.jsxs(F,{color:"#dc3545",children:[e.jsx("h3",{children:"Total Crédito"}),e.jsx("p",{children:S(j.totalCredito)})]}),e.jsxs(F,{color:"#28a745",children:[e.jsx("h3",{children:"Total Abonado"}),e.jsx("p",{children:S(j.totalAbono)})]}),e.jsxs(F,{color:"#007bff",children:[e.jsx("h3",{children:"Saldo Actual"}),e.jsx("p",{children:S(r.saldo_pendiente)})]}),e.jsxs(F,{color:j.ticketsPendientes>0?"#ffc107":"#28a745",children:[e.jsx("h3",{children:"Facturas"}),e.jsx("p",{style:{fontSize:"1.2rem"},children:j.ticketsPendientes>0?e.jsxs(e.Fragment,{children:[e.jsx(q,{style:{color:"#ffc107"}})," ",j.ticketsPendientes," pendiente",j.ticketsPendientes>1?"s":""]}):e.jsxs(e.Fragment,{children:[e.jsx(K,{style:{color:"#28a745"}})," Todo pagado"]})})]})]}),u.length>0&&e.jsxs(e.Fragment,{children:[e.jsxs("h3",{style:{margin:"0 0 1rem",color:"#333",display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(P,{})," Desglose por Factura"]}),u.map(t=>{const o=t.montoOriginal-t.saldoRestante,m=t.montoOriginal>0?o/t.montoOriginal*100:0;return e.jsxs(ze,{$estado:t.estado,children:[e.jsxs(Fe,{children:[e.jsxs("div",{children:[e.jsxs("span",{className:"ticket-title",children:["Venta #",t.idVenta]}),e.jsx(Pe,{$type:t.estado,style:{marginLeft:"0.75rem"},children:t.estado})]}),e.jsx("span",{className:"ticket-date",children:Ie(t.fecha)})]}),e.jsx(De,{$pct:m,children:e.jsx("div",{className:"fill",style:{width:`${Math.min(100,m)}%`}})}),e.jsxs(Ee,{children:[e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Monto Original"}),e.jsx("span",{className:"stat-value",children:S(t.montoOriginal)})]}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Pagado"}),e.jsx("span",{className:"stat-value",style:{color:"#28a745"},children:S(o)})]}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Pendiente"}),e.jsx("span",{className:"stat-value",style:{color:t.saldoRestante>0?"#dc3545":"#28a745"},children:S(t.saldoRestante)})]}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Progreso"}),e.jsxs("span",{className:"stat-value",children:[Math.round(m),"%"]})]})]})]},t.idVenta)})]}),e.jsx("h3",{style:{margin:"1.5rem 0 0.75rem",color:"#333"},children:"Historial Completo"}),e.jsx(Me,{children:a.length>0?a.map(t=>{const o=v.find(m=>(m.id_usuario??m.id)===t.userId);return e.jsxs(Oe,{$type:t.tipo,children:[e.jsx("div",{className:"icon",children:t.tipo==="credito"?e.jsx(W,{}):e.jsx(A,{})}),e.jsxs("div",{className:"content",children:[e.jsx("span",{className:"amount",children:S(t.monto)}),e.jsx("p",{style:{margin:"2px 0"},children:t.descripcion}),e.jsxs("span",{className:"meta",children:[Be(t.fecha)," por ",e.jsx("strong",{children:(o==null?void 0:o.nombre_usuario)||"Sistema"})]})]})]},t.id)}):e.jsxs(E,{children:[e.jsx(P,{size:40}),e.jsx("p",{children:"No hay movimientos para mostrar."})]})})]})]})]}),N&&l&&e.jsx(J,{transaction:{estado:"ABONO_CREDITO",totalVenta:l.monto,fecha:l.fecha,id:l.id.split("-")[1],clientId:r.id_cliente,userId:l.userId},creditStatus:{remainingBalance:Number(r.saldo_pendiente||0)},clients:[r],users:v,onClose:()=>s(!1)})]}):null}const B=n.div`
    padding: 2rem 4rem;
    background: #f8f9fa;
    min-height: 100vh;
    @media(max-width: 992px) {
        padding: 1rem;
    }
`,Re=n.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
`,Ve=n.h1`
    font-size: 2.5rem;
    color: #343a40;
    display: flex;
    align-items: center;
    gap: 1rem;
    @media(max-width: 992px) {
        font-size: 1.8rem;
    }
`,L=n.div`
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
`,x=n.button`
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
`,He=n(se)`
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
`,Ue=n.table`
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
`,We=n.div`
    display: none;
    @media(max-width: 992px) {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
`,Ge=n.div`
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    padding: 1.25rem;
    border: 1px solid #e9ecef;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-left: 5px solid ${r=>r.$hasDebt?"#dc3545":"#28a745"};
`,R=n.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`,V=n.span`
    font-size: 0.85rem;
    color: #6c757d;
    font-weight: 600;
`,H=n.span`
    font-size: 1rem;
    font-weight: 700;
    color: ${r=>r.color||"#343a40"};
`,Je=n.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px dashed #dee2e6;
`;function tt(){var j;const{clients:r,user:y,token:h,isLoading:C,refreshClients:p,allUsers:u}=G(),{isCajaOpen:w}=ce(),[a,b]=d.useState({name:null,data:null}),[f,g]=d.useState(null),v=({title:t,message:o,type:m})=>{m==="error"?T.error(o):T.success(o)},N=async t=>{if(t.saldo_pendiente>0){T.error("El cliente tiene saldo pendiente.");return}if(window.confirm("¿Seguro de eliminar este cliente?"))try{await xe(t.id_cliente,h),T.success("Cliente eliminado correctamente."),p()}catch(o){T.error(o.message||"Error al eliminar cliente.")}},s=(t,o=null)=>{t==="abono"&&!w&&T("⚠️ No se detecta sesión de caja abierta. El abono se registrará pero podría no reflejarse en el cierre de caja.",{icon:"⚠️",duration:5e3}),b({name:t,data:o})},l=()=>b({name:null,data:null}),k=t=>`C$${Number(t||0).toFixed(2)}`,_=t=>t===null?"∞":k(t);return C?e.jsx(B,{children:e.jsx("h1",{children:"Cargando..."})}):e.jsxs(B,{children:[e.jsxs(Re,{children:[e.jsxs(Ve,{children:[e.jsx(Y,{})," Clientes y Créditos"]}),e.jsxs(L,{children:[e.jsxs(x,{primary:!0,onClick:()=>s("client"),children:[e.jsx(Q,{})," Crear Cliente"]}),e.jsxs(x,{$refresh:!0,onClick:p,children:[e.jsx(ee,{})," Recargar"]}),e.jsxs(He,{to:"/dashboard",children:[e.jsx(te,{})," Volver"]})]})]}),e.jsxs(Ue,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"ID"}),e.jsx("th",{children:"Nombre"}),e.jsx("th",{children:"Teléfono"}),e.jsx("th",{children:"Límite"}),e.jsxs("th",{children:[e.jsx(W,{})," Saldo"]}),e.jsx("th",{children:"Acciones"})]})}),e.jsx("tbody",{children:r.map(t=>e.jsxs("tr",{children:[e.jsx("td",{children:t.id_cliente}),e.jsx("td",{children:t.nombre}),e.jsx("td",{children:t.telefono||"N/A"}),e.jsx("td",{children:_(t.limite_credito)}),e.jsx("td",{style:{fontWeight:"bold",color:t.saldo_pendiente>0?"#dc3545":"#28a745"},children:k(t.saldo_pendiente)}),e.jsx("td",{children:e.jsxs(L,{children:[e.jsxs(x,{$abono:!0,disabled:t.saldo_pendiente<=0,onClick:()=>s("abono",t),children:[e.jsx(A,{})," Abono"]}),e.jsxs(x,{onClick:()=>s("client",t),children:[e.jsx(M,{})," Editar"]}),e.jsxs(x,{$delete:!0,onClick:()=>N(t),children:[e.jsx(O,{})," Eliminar"]}),e.jsxs(x,{primary:!0,onClick:()=>s("historial",t),children:[e.jsx(I,{})," Créditos"]}),e.jsxs(x,{$refresh:!0,style:{background:"#6f42c1"},onClick:()=>s("tickets",t),children:[e.jsx(A,{})," Ver Tickets"]})]})})]},t.id_cliente))})]}),e.jsx(We,{children:r.map(t=>e.jsxs(Ge,{$hasDebt:t.saldo_pendiente>0,children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"5px"},children:[e.jsx("span",{style:{fontWeight:"800",fontSize:"1.1rem",color:"#343a40"},children:t.nombre}),e.jsxs("span",{style:{fontSize:"0.8rem",color:"#adb5bd"},children:["#",t.id_cliente]})]}),e.jsxs(R,{children:[e.jsxs(V,{children:[e.jsx(re,{size:12})," Teléfono"]}),e.jsx(H,{style:{fontWeight:"normal"},children:t.telefono||"N/A"})]}),e.jsxs(R,{children:[e.jsxs(V,{children:[e.jsx(ne,{size:12})," Límite"]}),e.jsx(H,{style:{fontWeight:"normal"},children:_(t.limite_credito)})]}),e.jsxs("div",{style:{background:"#f8f9fa",padding:"10px",borderRadius:"8px",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("span",{style:{fontWeight:600,color:"#495057"},children:"Saldo Pendiente:"}),e.jsx("span",{style:{fontWeight:800,fontSize:"1.2rem",color:t.saldo_pendiente>0?"#dc3545":"#28a745"},children:k(t.saldo_pendiente)})]}),e.jsxs(Je,{children:[e.jsxs(x,{$abono:!0,disabled:t.saldo_pendiente<=0,onClick:()=>s("abono",t),style:{justifyContent:"center"},children:[e.jsx(A,{})," Abonar"]}),e.jsxs(x,{onClick:()=>s("client",t),style:{justifyContent:"center",background:"#e2e6ea",color:"#495057"},children:[e.jsx(M,{})," Editar"]}),e.jsxs(x,{primary:!0,onClick:()=>s("historial",t),style:{justifyContent:"center"},children:[e.jsx(I,{})," Historial"]}),e.jsxs(x,{$refresh:!0,style:{background:"#6f42c1",justifyContent:"center"},onClick:()=>s("tickets",t),children:[e.jsx(A,{})," Tickets"]}),e.jsxs(x,{$delete:!0,onClick:()=>N(t),style:{justifyContent:"center",gridColumn:"span 2"},children:[e.jsx(O,{})," Eliminar Cliente"]})]})]},t.id_cliente))}),a.name==="client"&&e.jsx(we,{client:a.data,onClose:l,onSave:p}),a.name==="abono"&&e.jsx(he,{client:a.data,onClose:l,onAbonoSuccess:p,showAlert:v}),a.name==="historial"&&e.jsx(Le,{client:a.data,onClose:l,token:h}),a.name==="tickets"&&e.jsx(pe,{onClose:l,initialClientId:(j=a.data)==null?void 0:j.id_cliente,clients:r,users:u,loadSales:async t=>{try{return await me(h,t)}catch(o){return console.error(o),[]}},onReprintTicket:t=>{g(t)}}),f&&e.jsx(J,{isOpen:!0,transaction:f,onClose:()=>g(null),clients:r,users:u,currentUser:y})]})}export{tt as default};
