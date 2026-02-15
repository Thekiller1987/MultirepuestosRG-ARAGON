import{u as se,r as n,j as e,ab as N,W as ne,P as oe,ag as ie,aj as E,ak as le,al as de,am as ce,s as t,ae as pe,t as R,an as me,ao as xe,ap as ge,aq as fe,ar as he,as as be,at as ue,au as we,av as ye,aw as je}from"./vendor-BMIwBeBI.js";import{A as ve}from"./AlertModal-D3Gk2GaP.js";import"./scanner-vendor-DfxRpMWJ.js";import"./POS.styles-CI0-ztUL.js";me.register(xe,ge,fe,he,be,ue,we,ye,je);const L=()=>new Date().toLocaleDateString("sv-SE",{timeZone:"America/Managua"}),M=R`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;R`0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); } 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }`;const ke=t.div`
  padding: clamp(1rem, 3vw, 2.5rem);
  background-color: #f1f5f9; /* Slate-100 */
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #1e293b;
  animation: ${M} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
`,Se=t.header`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  background: white;
  padding: 1.5rem;
  border-radius: 24px;
  box-shadow: 0 4px 20px -5px rgba(0,0,0,0.05);
  border: 1px solid white;
  
  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2.5rem;
  }
`,Ce=t.div`
  display: flex; align-items: center; gap: 1rem;
`,De=t.button`
  background: white;
  border: 1px solid #e2e8f0;
  width: 45px; height: 45px;
  border-radius: 14px;
  display: grid; place-items: center;
  cursor: pointer;
  color: #334155;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px -3px rgba(0,0,0,0.08);
    background: #f8fafc;
    color: #0f172a;
  }
`,ze=t.h1`
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  color: #0f172a;
  margin: 0;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`,Ie=t.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: 18px;
  border: 1px solid #e2e8f0;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`,$e=t.div`
    display: flex; gap: 0.5rem; background: #e2e8f0; padding: 4px; border-radius: 14px;
`,D=t.button`
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 10px;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    background: ${s=>s.active?"white":"transparent"};
    color: ${s=>s.active?"#2563eb":"#64748b"};
    box-shadow: ${s=>s.active?"0 2px 5px rgba(0,0,0,0.06)":"none"};
    
    &:hover { color: ${s=>s.active?"#2563eb":"#334155"}; }
`,Fe=t.div`
    display: flex; align-items: center; gap: 0.75rem;
    padding-left: 1rem;
    border-left: 1px solid #cbd5e1;
    
    @media (max-width: 768px) { border-left: none; padding-left: 0; flex-wrap: wrap; }
`,A=t.input`
  padding: 0.5rem 0.8rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 10px;
  font-size: 0.9rem;
  color: #334155;
  background: white;
  font-family: inherit; font-weight: 500;
  &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
`,Pe=t.button`
  width: 36px; height: 36px;
  border: none;
  border-radius: 10px;
  background: #3b82f6;
  color: white;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);

  &:hover { background: #2563eb; transform: translateY(-1px); box-shadow: 0 6px 15px rgba(59, 130, 246, 0.4); }
  &:active { transform: translateY(0); }
`,_e=t.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1200px) { grid-template-columns: repeat(4, 1fr); }
`,f=t.div`
  background: white;
  padding: 1.5rem;
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.6);
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02), 0 10px 15px -3px rgba(0,0,0,0.03);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s;
  animation: ${M} 0.5s ease-out forwards;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
  }

  /* Gradiente opcional */
  ${s=>s.gradient&&pe`
      background: ${s.gradient};
      color: white;
      border: none;
      box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.3);
      
      ${d}, ${p} { opacity: 0.9; color: white !important; }
      ${c} { color: white !important; }
  `}
`,d=t.div`
    display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;
    font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
    color: #64748b;
`,c=t.div`
    font-size: 2.2rem; font-weight: 800; letter-spacing: -0.03em;
    margin-bottom: 0.25rem; color: #0f172a;
`,p=t.div`
    font-size: 0.85rem; color: #94a3b8; font-weight: 500;
`,Be=t.div`
    display: grid; 
    grid-template-columns: 1fr; 
    gap: 1.5rem;
    margin-top: 1.5rem;
    
    @media (min-width: 1024px) { grid-template-columns: 2.2fr 1fr; } 
`,Ne=t.div`
    background: white; padding: 1.5rem; border-radius: 24px;
    border: 1px solid #f1f5f9; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
    min-height: 420px;
    display: flex; flex-direction: column;
`,Ee=t.div`
    display: flex; flex-direction: column; gap: 1.5rem;
`,O=t.div`
    background: white; padding: 1.5rem; border-radius: 24px;
    border: 1px solid #f1f5f9; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
    flex: 1;
`,T=t.h3`
    margin: 0 0 1.25rem 0; font-size: 1rem; color: #0f172a; display: flex; align-items: center; gap: 0.5rem; font-weight: 700;
`,V=t.div`
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.85rem 0; border-bottom: 1px dashed #e2e8f0;
    &:last-child { border-bottom: none; }
    
    .name { font-weight: 600; color: #334155; font-size: 0.9rem; }
    .value { font-weight: 700; color: #0f172a; font-family: 'Inter', sans-serif; }
    .rank { 
        background: #f1f5f9; color: #64748b; width: 24px; height: 24px; 
        border-radius: 8px; display: flex; align-items: center; justify-content: center; 
        font-size: 0.75rem; font-weight: bold; margin-right: 0.75rem; 
    }
    .left { display: flex; align-items: center; }
`,Le=t.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
  flex-direction: column; gap: 1rem;
  font-weight: 700; color: #3b82f6;
  font-size: 1.2rem;
`,Re=()=>{const s=se(),[h,z]=n.useState(L),[b,I]=n.useState(L),[u,$]=n.useState("today"),[F,W]=n.useState({ventas_brutas:0,ganancia_total:0}),[Y,U]=n.useState(0),[P,H]=n.useState([]),[m,G]=n.useState([]),[K,q]=n.useState({labels:[],datasets:[]}),[Z,w]=n.useState(!0),[y,j]=n.useState({isOpen:!1,title:"",message:""}),x=a=>new Intl.NumberFormat("es-NI",{style:"currency",currency:"NIO",minimumFractionDigits:2}).format(a||0),v=a=>{$(a);const r=new Date;let o=new Date,i=new Date;if(a!=="today")if(a==="week"){const l=r.getDay(),S=r.getDate()-l+(l===0?-6:1);o.setDate(S)}else a==="month"&&(o=new Date(r.getFullYear(),r.getMonth(),1));const g=l=>l.toLocaleDateString("sv-SE",{timeZone:"America/Managua"});z(g(o)),I(g(i))},k=n.useCallback(async()=>{w(!0);const a=localStorage.getItem("token");if(!a){j({isOpen:!0,title:"Sesión Expirada",message:"Por favor inicia sesión nuevamente."}),w(!1);return}try{const r="/api/reports",o={Authorization:`Bearer ${a}`},i=`?startDate=${h}&endDate=${b}`,[g,l,S,Q,J]=await Promise.all([fetch(`${r}/sales-summary${i}`,{headers:o}),fetch(`${r}/inventory-value`,{headers:o}),fetch(`${r}/sales-by-user${i}`,{headers:o}),fetch(`${r}/top-products${i}`,{headers:o}),fetch(`${r}/sales-chart${i}`,{headers:o})]),X=await g.json(),ee=await l.json(),te=await S.json(),ae=await Q.json(),B=await J.json();W(X),U(ee.valor_total_inventario),H(te),G(ae),q({labels:B.map(C=>{const re=new Date(C.dia+"T12:00:00");return new Intl.DateTimeFormat("es-NI",{day:"2-digit",month:"short"}).format(re)}),datasets:[{label:"Ventas Totales",data:B.map(C=>C.total_diario),backgroundColor:"rgba(59, 130, 246, 0.6)",borderColor:"#2563eb",borderWidth:2,borderRadius:8,hoverBackgroundColor:"#2563eb"}]})}catch(r){console.error("Error fetching reports:",r),j({isOpen:!0,title:"Error de Conexión",message:"No se pudieron cargar los datos."})}finally{w(!1)}},[h,b]);n.useEffect(()=>{k()},[k]);const _=(a,r)=>{$("custom"),a==="start"?z(r):I(r)};return e.jsxs(ke,{children:[Z&&e.jsxs(Le,{children:[e.jsx(N,{className:"spin",size:40}),"Cargando Datos..."]}),e.jsx(ve,{isOpen:y.isOpen,onClose:()=>j({isOpen:!1,title:"",message:""}),title:y.title,message:y.message}),e.jsxs(Se,{children:[e.jsxs(Ce,{children:[e.jsx(De,{onClick:()=>s("/dashboard"),title:"Volver al Dashboard",children:e.jsx(ne,{size:18})}),e.jsxs("div",{children:[e.jsx(ze,{children:"Dashboard Financiero"}),e.jsx("p",{style:{margin:"4px 0 0 0",color:"#64748b",fontSize:"0.95rem"},children:"Resumen de operaciones y auditoría"})]})]}),e.jsxs(Ie,{children:[e.jsxs($e,{children:[e.jsx(D,{active:u==="today",onClick:()=>v("today"),children:"Hoy"}),e.jsx(D,{active:u==="week",onClick:()=>v("week"),children:"Semana"}),e.jsx(D,{active:u==="month",onClick:()=>v("month"),children:"Mes"})]}),e.jsxs(Fe,{children:[e.jsx("span",{style:{fontSize:"0.85rem",color:"#64748b",fontWeight:600},children:"Rango:"}),e.jsx(A,{type:"date",value:h,onChange:a=>_("start",a.target.value)}),e.jsx("span",{style:{color:"#cbd5e0"},children:"—"}),e.jsx(A,{type:"date",value:b,onChange:a=>_("end",a.target.value)}),e.jsx(Pe,{onClick:k,title:"Recargar",children:e.jsx(N,{})})]})]})]}),e.jsxs(_e,{children:[e.jsxs(f,{gradient:"linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",dark:!0,children:[e.jsxs(d,{children:[e.jsx(oe,{})," Ventas Totales"]}),e.jsx(c,{children:x(F.ventas_brutas)}),e.jsx(p,{children:"En el periodo seleccionado"})]}),e.jsxs(f,{children:[e.jsxs(d,{style:{color:"#16a34a"},children:[e.jsx(ie,{})," Ganancia Estimada"]}),e.jsx(c,{style:{color:"#16a34a"},children:x(F.ganancia_total)}),e.jsx(p,{children:"Margen bruto calculado"})]}),e.jsxs(f,{children:[e.jsxs(d,{style:{color:"#0f172a"},children:[e.jsx(E,{})," Valor Inventario"]}),e.jsx(c,{children:x(Y)}),e.jsx(p,{children:"Capital en mercadería (Actual)"})]}),e.jsxs(f,{gradient:"linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",dark:!0,children:[e.jsxs(d,{children:[e.jsx(le,{})," Producto Top"]}),m[0]?e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{fontSize:"1.3rem",fontWeight:800,marginBottom:"0.5rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:m[0].nombre}),e.jsxs(p,{children:[m[0].total_unidades_vendidas," unidades vendidas"]})]}):e.jsx(c,{style:{fontSize:"1.5rem"},children:"—"})]})]}),e.jsxs(Be,{children:[e.jsxs(Ne,{children:[e.jsx("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"1.5rem"},children:e.jsx("h3",{style:{margin:0,color:"#0f172a"},children:"Tendencia de Ventas"})}),e.jsx("div",{style:{flex:1,position:"relative"},children:e.jsx(de,{data:K,options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{backgroundColor:"rgba(15, 23, 42, 0.9)",padding:12,cornerRadius:8,titleFont:{size:14},bodyFont:{size:14,weight:"bold"}}},scales:{y:{grid:{color:"#f1f5f9"},border:{display:!1}},x:{grid:{display:!1},border:{display:!1}}},animation:{duration:1e3}}})})]}),e.jsxs(Ee,{children:[e.jsxs(O,{children:[e.jsxs(T,{children:[e.jsx(ce,{style:{color:"#3b82f6"}})," Top Vendedores"]}),e.jsx("div",{style:{display:"flex",flexDirection:"column"},children:P.length>0?P.map((a,r)=>e.jsxs(V,{children:[e.jsxs("div",{className:"left",children:[e.jsx("span",{className:"rank",children:r+1}),e.jsx("span",{className:"name",children:a.nombre_usuario})]}),e.jsx("span",{className:"value",children:x(a.total_vendido)})]},r)):e.jsx("p",{style:{color:"#94a3b8",textAlign:"center"},children:"Sin datos de ventas"})})]}),e.jsxs(O,{children:[e.jsxs(T,{children:[e.jsx(E,{style:{color:"#f59e0b"}})," Más Vendidos"]}),e.jsx("div",{style:{display:"flex",flexDirection:"column"},children:m.slice(0,5).map((a,r)=>e.jsxs(V,{children:[e.jsxs("div",{className:"left",children:[e.jsx("span",{className:"rank",children:r+1}),e.jsx("span",{className:"name",style:{maxWidth:"140px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},title:a.nombre,children:a.nombre})]}),e.jsxs("span",{className:"value",children:[a.total_unidades_vendidas," und."]})]},r))})]})]})]})]})};export{Re as default};
