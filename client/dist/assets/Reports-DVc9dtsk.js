import{b as W,r as s,j as e,U as Y,aB as q,a$ as H,O as X,am as J,I as K,b0 as Q,ak as Z,$ as ee,an as te,al as ae,p as re,q as t,k as oe,s as F,ao as se,ap as ne,aq as ie,ar as le,au as de,av as ce,aw as pe}from"./vendor-Dp7SZ6lv.js";import{z as xe,A as ge,B as he,C as me,D as ue}from"./index-CRUdEL4u.js";import{A as be}from"./AlertModal-BThKNu9Y.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-DjsH35t9.js";import"./POS.styles-D5dfWbaN.js";se.register(ne,ie,le,de,ce,pe);const fe=re`
  @media print {
    body * { visibility: hidden; }
    #printableArea, #printableArea * { visibility: visible; }
    #printableArea { position: absolute; left: 0; top: 0; width: 100%; }
    .no-print { display: none !important; }
  }
`,h=F`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`,ye=t.div`
  padding: 1.5rem;
  background-color: #f0f2f5;
  min-height: 100vh;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  --primary-color: #3b82f6;
  --secondary-color: #10b981;
`,je=t.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  animation: ${h} 0.4s ease-out;
  @media print { display: none; }
`,m=t.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 7px 10px rgba(0, 0, 0, 0.1);
  }
`,ve=t(m)`
  background: #6b7280;
  &:hover { background: #4b5563; }
`,we=t(m)`
  background: var(--secondary-color);
  &:hover { background: #059669; }
`,Se=t.header`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
  animation: ${h} 0.5s ease-out;
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  @media print { display: none; }
`,Ce=t.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
`,ke=t.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background-color: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`,A=t.input`
  padding: 0.6rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  background-color: #f9fafb;
`,Ie=t(m)`
  background: var(--primary-color);
  &:hover { background: #2563eb; }
`,De=t.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`,i=t.div`
  background: ${o=>o.bgGradient?o.bgGradient:"#fff"};
  color: ${o=>o.bgGradient?"#fff":"#111827"};
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  animation: ${h} 0.6s ease-out forwards;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
`,l=t.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  opacity: 0.9;
  font-size: 1.1rem;
`,v=t.p`
  font-size: 2.2rem;
  font-weight: 800;
  margin: auto 0 0 0;
  text-shadow: ${o=>o.textShadow?"0 2px 4px rgba(0,0,0,0.1)":"none"};
`,_=t.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  opacity: 0;
  animation: ${h} 0.5s ease-out forwards;
  animation-delay: ${o=>o.delay*100}ms;
  &:last-child { border-bottom: none; }
`,B=t.div`
  text-align: center;
  padding: 2rem;
  opacity: 0.7;
`,Re=F`to { transform: rotate(360deg); }`,Ae=t.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  &::after {
    content: '';
    width: 50px;
    height: 50px;
    border: 5px solid #d1d5db;
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: ${Re} 0.8s linear infinite;
  }
`,_e=t.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5); z-index: 2000;
    display: flex; justify-content: center; align-items: center;
    backdrop-filter: blur(5px);
`,Be=t.div`
    background: white; padding: 25px; border-radius: 12px;
    width: 90%; max-width: 800px; max-height: 85vh;
    overflow-y: auto; position: relative;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
`,Fe=({isOpen:o,onClose:d,breakdown:c=[]})=>o?e.jsx(_e,{onClick:d,children:e.jsxs(Be,{onClick:n=>n.stopPropagation(),children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"1rem"},children:[e.jsx("h2",{style:{margin:0,color:"#1e293b"},children:"💰 Top 50 Productos (Mayor Valor)"}),e.jsx("button",{onClick:d,style:{border:"none",background:"none",fontSize:"1.5rem",cursor:"pointer"},children:e.jsx(oe,{})})]}),e.jsx("p",{style:{color:"#64748b",marginBottom:"1rem"},children:"Estos son los productos que más contribuyen al valor total del inventario. Revisa si hay errores (ej. costo de una caja pero existencia en unidades)."}),e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:"0.9rem"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{background:"#f1f5f9",textAlign:"left",color:"#475569"},children:[e.jsx("th",{style:{padding:"10px"},children:"Producto"}),e.jsx("th",{style:{padding:"10px"},children:"Costo Unit."}),e.jsx("th",{style:{padding:"10px"},children:"Existencia"}),e.jsx("th",{style:{padding:"10px",textAlign:"right"},children:"Valor Total"})]})}),e.jsx("tbody",{children:c.map((n,p)=>e.jsxs("tr",{style:{borderBottom:"1px solid #e2e8f0",background:n.valor_total>1e5?"#fff1f2":"transparent"},children:[e.jsxs("td",{style:{padding:"10px"},children:[e.jsx("div",{style:{fontWeight:"bold",color:"#334155"},children:n.nombre}),e.jsx("div",{style:{fontSize:"0.8em",color:"#94a3b8"},children:n.codigo})]}),e.jsxs("td",{style:{padding:"10px"},children:["C$",Number(n.costo).toLocaleString("en-US")]}),e.jsx("td",{style:{padding:"10px"},children:n.existencia}),e.jsxs("td",{style:{padding:"10px",textAlign:"right",fontWeight:"bold",color:"#0f172a"},children:["C$",Number(n.valor_total).toLocaleString("en-US")]})]},n.id_producto||p))})]})}),e.jsx("div",{style:{marginTop:"1.5rem",textAlign:"right"},children:e.jsx(m,{style:{background:"#64748b",display:"inline-flex"},onClick:d,children:"Cerrar"})})]})}):null,Ne=()=>{const o=W(),d=()=>new Date(new Date().getFullYear(),new Date().getMonth(),1).toISOString().split("T")[0],[c,n]=s.useState(d),[p,P]=s.useState(new Date().toISOString().split("T")[0]),[w,T]=s.useState({ventas_brutas:0,ganancia_total:0}),[S,C]=s.useState({total:0,breakdown:[]}),[k,$]=s.useState([]),[I,O]=s.useState([]),[z,E]=s.useState({labels:[],datasets:[]}),[N,u]=s.useState(!0),[b,f]=s.useState({isOpen:!1,title:"",message:""}),[V,D]=s.useState(!1),g=a=>new Intl.NumberFormat("es-NI",{style:"currency",currency:"NIO"}).format(a||0),y=s.useCallback(async()=>{u(!0);const a=localStorage.getItem("token");if(!a){f({isOpen:!0,title:"Error de Autenticación",message:"No se encontró tu sesión."}),u(!1);return}try{const r={startDate:c,endDate:p},[L,x,M,U,R]=await Promise.all([xe(a,r),ge(a),he(a,r),me(a,r),ue(a,r)]);T(L),x.breakdown?C({total:x.valor_total_inventario,breakdown:x.breakdown}):C({total:x.valor_total_inventario||x,breakdown:[]}),$(M),O(U),E({labels:R.map(j=>new Date(j.dia).toLocaleDateString("es-NI",{day:"numeric",month:"short"})),datasets:[{label:"Ventas por Día",data:R.map(j=>j.total_diario),backgroundColor:"rgba(59, 130, 246, 0.7)",borderColor:"rgba(59, 130, 246, 1)",borderWidth:1,borderRadius:4,hoverBackgroundColor:"rgba(59, 130, 246, 1)"}]})}catch(r){f({isOpen:!0,title:"Error de Conexión",message:r.message})}finally{u(!1)}},[c,p]);s.useEffect(()=>{y()},[y]);const G=()=>{window.print()};return e.jsxs(e.Fragment,{children:[e.jsx(fe,{}),e.jsxs(ye,{children:[N&&e.jsx(Ae,{}),e.jsx(be,{isOpen:b.isOpen,onClose:()=>f({isOpen:!1,title:"",message:""}),title:b.title,message:b.message}),e.jsx(Fe,{isOpen:V,onClose:()=>D(!1),breakdown:S.breakdown}),e.jsxs(je,{children:[e.jsxs(ve,{onClick:()=>o(-1),children:[e.jsx(Y,{})," Regresar"]}),e.jsxs(we,{onClick:G,children:[e.jsx(q,{})," Imprimir Reporte"]})]}),e.jsxs(Se,{children:[e.jsx(Ce,{children:"Dashboard de Reportes"}),e.jsxs(ke,{children:[e.jsx("label",{children:e.jsx(H,{})}),e.jsx(A,{type:"date",value:c,onChange:a=>n(a.target.value)}),e.jsx(A,{type:"date",value:p,onChange:a=>P(a.target.value)}),e.jsx(Ie,{onClick:y,children:"Generar"})]})]}),e.jsx("div",{id:"printableArea",children:e.jsxs(De,{children:[e.jsxs(i,{style:{gridColumn:"1 / -1"},bgGradient:"linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",children:[e.jsxs(l,{style:{color:"#1e293b"},children:[e.jsx(X,{style:{color:"#3b82f6"}})," Rendimiento de Ventas"]}),e.jsx("div",{style:{position:"relative",height:"350px"},children:e.jsx(J,{data:z,options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}}}})})]}),e.jsxs(i,{bgGradient:"linear-gradient(135deg, #10b981 0%, #059669 100%)",children:[e.jsxs(l,{style:{color:"white"},children:[e.jsx(K,{})," Ventas Totales"]}),e.jsx(v,{style:{color:"white"},textShadow:!0,children:g(w.ventas_brutas)})]}),e.jsxs(i,{bgGradient:"linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",children:[e.jsxs(l,{style:{color:"white"},children:[e.jsx(Q,{})," Ganancias"]}),e.jsx(v,{style:{color:"white"},textShadow:!0,children:g(w.ganancia_total)})]}),e.jsxs(i,{bgGradient:"linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",width:"100%",alignItems:"flex-start"},children:[e.jsxs(l,{style:{color:"white",margin:0},children:[e.jsx(Z,{})," Capital"]}),e.jsxs("button",{onClick:()=>D(!0),style:{background:"rgba(255,255,255,0.2)",border:"none",color:"white",padding:"5px 10px",borderRadius:"15px",cursor:"pointer",fontSize:"0.8rem",display:"flex",alignItems:"center",gap:"5px",fontWeight:"700",marginTop:"-5px",marginRight:"-5px"},className:"no-print",children:[e.jsx(ee,{})," Detalles"]})]}),e.jsx(v,{style:{color:"white"},textShadow:!0,children:g(S.total)})]}),e.jsxs(i,{style:{gridColumn:"span 1 / auto"},children:[e.jsxs(l,{children:[e.jsx(te,{style:{color:"#8b5cf6"}})," Top Vendedores"]}),e.jsx("ul",{children:k.length>0?k.map((a,r)=>e.jsxs(_,{delay:r+1,children:[e.jsxs("span",{children:[r+1,". ",a.nombre_usuario]}),e.jsx("strong",{style:{color:"#1e293b"},children:g(a.total_vendido)})]},r)):e.jsx(B,{children:"No hay datos de vendedores."})})]}),e.jsxs(i,{style:{gridColumn:"span 1 / auto"},children:[e.jsxs(l,{children:[e.jsx(ae,{style:{color:"#f59e0b"}})," Más Vendidos"]}),e.jsx("ul",{children:I.length>0?I.map((a,r)=>e.jsxs(_,{delay:r+1,children:[e.jsxs("span",{children:[r+1,". ",a.nombre]}),e.jsxs("strong",{style:{color:"#1e293b"},children:[a.total_unidades_vendidas," und."]})]},r)):e.jsx(B,{children:"No hay datos de productos."})})]})]})})]})]})};export{Ne as default};
