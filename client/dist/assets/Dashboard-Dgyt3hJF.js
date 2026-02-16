const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/POS-BwlVS5y8.js","assets/vendor-BHEUBfle.js","assets/scanner-vendor-DfxRpMWJ.js","assets/POS.styles-Dbi1_TMg.js","assets/index-WS_0-QTp.js","assets/pdf-vendor-BzGOTXeo.js","assets/index-CJIrVlr0.css","assets/SalesHistoryModal-DK3u_9kg.js","assets/AlertModal-DAjc3Hhf.js","assets/ConfirmationModal-B5FLFSjM.js","assets/InventoryManagement-DJmi5rLp.js","assets/InventoryOutflowPage-BK4cqVng.js","assets/ClientesYCreditos-M6jF02eI.js","assets/FacturasProveedores-L_9Qz4aL.js","assets/PedidosYApartados-_EX3P-g2.js"])))=>i.map(i=>d[i]);
import{_ as j}from"./pdf-vendor-BzGOTXeo.js";import{r as x,j as e,w as V,x as B,y as U,C as G,D as N,s as r,E as A,G as $,H as q,I as W,J as I,K as H,L as Y,M as J,O as K,P as Q,Q as X,S as Z,T as ee,U as oe}from"./vendor-BHEUBfle.js";import{a as re,b as se,c as ae,u as ne}from"./index-WS_0-QTp.js";import{C as ie}from"./ConfirmationModal-B5FLFSjM.js";import"./scanner-vendor-DfxRpMWJ.js";import"./POS.styles-Dbi1_TMg.js";const te=r.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
    animation: fadeIn 0.2s ease-out;
`,le=r.div`
    background: white;
    width: 90%; max-width: 800px;
    max-height: 90vh; overflow-y: auto;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    display: flex; flex-direction: column;
`,ce=r.div`
    padding: 1.25rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex; justify-content: space-between; align-items: center;
    h2 { margin: 0; font-size: 1.25rem; color: #1e293b; display: flex; align-items: center; gap: 10px; }
`,de=r.div`padding: 1.5rem;`,pe=r.div`
    display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid #e2e8f0;
`,T=r.button`
    padding: 0.75rem 1rem;
    background: none; border: none;
    border-bottom: 3px solid ${o=>o.active?"#007bff":"transparent"};
    color: ${o=>o.active?"#007bff":"#64748b"};
    font-weight: 600; cursor: pointer;
    display: flex; align-items: center; gap: 8px;
    &:hover { color: #007bff; }
`,d=r.div`
    margin-bottom: 1.2rem;
    label { display: block; margin-bottom: 0.4rem; font-weight: 500; color: #334155; }
    input, textarea {
        width: 100%; padding: 0.75rem;
        border: 1px solid #cbd5e1; border-radius: 6px;
        font-family: inherit; font-size: 0.95rem;
        transition: border-color 0.2s;
        &:focus { outline: none; border-color: #007bff; box-shadow: 0 0 0 3px rgba(0,123,255,0.1); }
    }
    textarea { min-height: 80px; resize: vertical; }
    small { display: block; margin-top: 0.25rem; color: #64748b; font-size: 0.85rem; }
`,xe=r.div`
    padding: 1.25rem; border-top: 1px solid #e2e8f0;
    display: flex; justify-content: flex-end; gap: 1rem;
    background: #f8fafc; border-radius: 0 0 12px 12px;
`,L=r.button`
    padding: 0.75rem 1.5rem;
    border-radius: 8px; border: none; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; gap: 0.5rem;
    background: ${o=>o.primary?"#007bff":"#e2e8f0"};
    color: ${o=>o.primary?"white":"#475569"};
    &:hover { filter: brightness(0.95); }
    &:disabled { opacity: 0.7; cursor: not-allowed; }
`,he=({isOpen:o,onClose:f})=>{const{settings:h,refreshSettings:b}=re(),C=localStorage.getItem("token"),[t,i]=x.useState({empresa_nombre:"",empresa_ruc:"",empresa_telefono:"",empresa_direccion:"",empresa_eslogan:"",empresa_logo_url:"",ticket_sales_footer:"",ticket_proforma_footer:"",ticket_transfer_footer:""}),[s,k]=x.useState("general"),[m,v]=x.useState(!1),[w,S]=x.useState(!1),[E,y]=x.useState(null);x.useEffect(()=>{o&&h&&(i(l=>({...l,...h})),h.empresa_logo_url&&y(h.empresa_logo_url))},[o,h]);const c=l=>{const{name:u,value:p}=l.target;i(_=>({..._,[u]:p}))},P=async()=>{v(!0);try{await ae(C,t),await b(),A.success("Configuración actualizada correctamente"),f()}catch(l){console.error(l),A.error("Error al guardar configuración")}finally{v(!1)}},z=async l=>{const u=l.target.files[0];if(u){S(!0);try{const p=await se(C,u);y(p),i(_=>({..._,empresa_logo_url:p})),A.success("Logo subido correctamente")}catch(p){console.error(p),A.error("Error al subir el logo")}finally{S(!1)}}};return o?e.jsx(te,{onClick:f,children:e.jsxs(le,{onClick:l=>l.stopPropagation(),children:[e.jsxs(ce,{children:[e.jsxs("h2",{children:[e.jsx(V,{})," Configuración del Sistema"]}),e.jsx(L,{onClick:f,style:{padding:"0.4rem"},children:e.jsx(B,{size:20})})]}),e.jsxs(de,{children:[e.jsxs(pe,{children:[e.jsxs(T,{active:s==="general",onClick:()=>k("general"),children:[e.jsx(U,{})," Datos Empresa"]}),e.jsxs(T,{active:s==="tickets",onClick:()=>k("tickets"),children:[e.jsx(G,{})," Personalización Tickets"]})]}),s==="general"&&e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs(d,{style:{gridColumn:"span 2"},children:[e.jsx("label",{children:"Nombre de la Empresa"}),e.jsx("input",{name:"empresa_nombre",value:t.empresa_nombre||"",onChange:c})]}),e.jsxs(d,{children:[e.jsx("label",{children:"RUC/Identificación"}),e.jsx("input",{name:"empresa_ruc",value:t.empresa_ruc||"",onChange:c})]}),e.jsxs(d,{children:[e.jsx("label",{children:"Teléfono(s)"}),e.jsx("input",{name:"empresa_telefono",value:t.empresa_telefono||"",onChange:c})]}),e.jsxs(d,{style:{gridColumn:"span 2"},children:[e.jsx("label",{children:"Dirección"}),e.jsx("textarea",{name:"empresa_direccion",value:t.empresa_direccion||"",onChange:c})]}),e.jsxs(d,{style:{gridColumn:"span 2"},children:[e.jsx("label",{children:"Eslogan / Frase"}),e.jsx("input",{name:"empresa_eslogan",value:t.empresa_eslogan||"",onChange:c})]}),e.jsxs(d,{style:{gridColumn:"span 2"},children:[e.jsx("label",{children:"Logo del Negocio (Aparecerá en Tickets)"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"20px"},children:[e.jsx("div",{style:{width:"100px",height:"100px",border:"1px dashed #cbd5e1",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",background:"#f8fafc",overflow:"hidden"},children:E?e.jsx("img",{src:E,alt:"Logo",style:{width:"100%",height:"100%",objectFit:"contain"}}):e.jsx("small",{style:{color:"#94a3b8"},children:"Sin Logo"})}),e.jsxs("div",{style:{flex:1},children:[e.jsx("input",{type:"file",accept:"image/*",onChange:z,id:"logo-upload",style:{display:"none"}}),e.jsx("label",{htmlFor:"logo-upload",style:{display:"inline-block",padding:"8px 16px",background:"#f1f5f9",border:"1px solid #cbd5e1",borderRadius:"8px",cursor:"pointer",fontWeight:"600",fontSize:"0.9rem"},children:w?"Subiendo...":"Seleccionar Imagen"}),e.jsx("p",{style:{margin:"5px 0 0 0",fontSize:"0.8rem",color:"#64748b"},children:"Recomendado: PNG fondo transparente (aprox 200x200px)"})]})]})]})]}),s==="tickets"&&e.jsxs("div",{children:[e.jsx("p",{style:{marginBottom:"1rem",color:"#64748b"},children:"Personaliza los mensajes que aparecen al final de tus documentos impresos."}),e.jsxs(d,{children:[e.jsx("label",{children:"Pie de Página: Factura de Venta"}),e.jsx("textarea",{name:"ticket_sales_footer",value:t.ticket_sales_footer||"",onChange:c,placeholder:"Ej: Gracias por su compra. No se aceptan devoluciones después de 30 días."}),e.jsx("small",{children:"Avisos legales, agradecimientos o políticas de devolución."})]}),e.jsxs(d,{children:[e.jsx("label",{children:"Pie de Página: Proforma"}),e.jsx("textarea",{name:"ticket_proforma_footer",value:t.ticket_proforma_footer||"",onChange:c,placeholder:"Ej: Cotización válida por 15 días. Sujeta a disponibilidad."}),e.jsx("small",{children:"Condiciones de validez de la oferta."})]}),e.jsxs(d,{children:[e.jsx("label",{children:"Pie de Página: Traslado / Salida"}),e.jsx("textarea",{name:"ticket_transfer_footer",value:t.ticket_transfer_footer||"",onChange:c,placeholder:"Ej: Salida autorizada por Gerencia."}),e.jsx("small",{children:"Notas internas o firmas requeridas."})]})]})]}),e.jsxs(xe,{children:[e.jsx(L,{onClick:f,children:"Cancelar"}),e.jsxs(L,{primary:!0,onClick:P,disabled:m,children:[e.jsx(N,{})," ",m?"Guardando...":"Guardar Cambios"]})]})]})}):null},R=r.div`
    padding: clamp(1rem, 5vw, 2.5rem); 
    background-color: #f0f2f5; 
    min-height: 100vh;
    box-sizing: border-box;
`,M=r.div`
    width: 100%;
    max-width: 1300px;
    margin: 0 auto;
`,me=r.div`
    display: flex;
    justify-content: space-between;
    align-items: center; 
    margin-bottom: 3rem; 
    gap: 1.5rem;
    flex-wrap: wrap;
`,fe=r.div`min-width: 0;`,D=r.h1`
    font-size: clamp(1.8rem, 4vw, 2.4rem); 
    color: #1e293b; 
    font-weight: 800;
    margin: 0;
    line-height: 1.2;
`,ue=r.p`
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    color: #64748b;
    margin: 0.4rem 0 0;
`,ge=r.button`
    padding: 0.7rem 1.4rem;
    border: none; 
    background: #fecaca; 
    color: #dc2626; 
    border-radius: 12px;
    cursor: pointer;
    font-weight: 700;
    font-size: 1rem;
    transition: all 0.2s ease;
    display: inline-flex;
    gap: 0.6rem;
    align-items: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); 
    
    &:hover, &:focus { 
        background: #dc2626; 
        color: #fff; 
        box-shadow: 0 6px 10px rgba(220, 38, 38, 0.3); 
        transform: translateY(-2px);
        outline: none; 
    }
`,je=r.main`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
    gap: clamp(1rem, 2vw, 1.5rem);
`,a=r(oe)`
    background-color: #ffffff;
    border-radius: 16px; 
    padding: 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); 
    transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.25s ease; 
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    min-height: 130px;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 6px;
        height: 100%;
        background-color: ${o=>o.color||"#007bff"};
    }

    &:hover, &:focus { 
        transform: translateY(-4px); 
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15); 
        outline: none; 
    }
    
    h2 { 
        margin: 0 0 .35rem 0; 
        font-size: 1.15rem; 
        color: #233547; 
        font-weight: 700; 
        letter-spacing: -0.5px;
    }
    p { 
        margin:0; 
        color:#6b7a86; 
        font-size: 1rem; 
    }
`,n=r.div` 
    font-size: 2.2rem; 
    margin-bottom: 0.75rem; 
    line-height:1; 
    color: ${o=>o.color||"#007bff"}; 
`,we=()=>{const{user:o,logout:f}=ne(),[h,b]=x.useState(!1),[C,t]=x.useState(!1);if(!o)return e.jsx(R,{children:e.jsx(M,{children:e.jsx(D,{children:"Cargando..."})})});const i=o.rol||"N/A",s=i==="Administrador"||i==="Admin",k=i==="Vendedor",m=i==="Encargado de Finanzas"||i==="Contador",v=i==="Encargado de Inventario",w=s,S=s||k,E=s||m,y=s||v,c=s||v,P=s||i==="Gerente"||m,z=s||i==="Gerente"||m,l=s,u=s||m,p=o.nombre_usuario||o.nombre||o.name||"Usuario",_=()=>{b(!0)},O=()=>{b(!1),f()},g=F=>{switch(F){case"/pos":j(()=>import("./POS-BwlVS5y8.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9]));break;case"/inventory":j(()=>import("./InventoryManagement-DJmi5rLp.js"),__vite__mapDeps([10,1,2,4,5,6]));break;case"/traslados":j(()=>import("./InventoryOutflowPage-BK4cqVng.js"),__vite__mapDeps([11,1,2,4,5,6]));break;case"/credits":j(()=>import("./ClientesYCreditos-M6jF02eI.js"),__vite__mapDeps([12,1,2,4,5,6,7,3,8]));break;case"/invoices":j(()=>import("./FacturasProveedores-L_9Qz4aL.js"),__vite__mapDeps([13,1,2,4,5,6]));break;case"/orders":j(()=>import("./PedidosYApartados-_EX3P-g2.js"),__vite__mapDeps([14,1,2,4,5,6]));break}};return e.jsxs(R,{children:[e.jsxs(M,{children:[e.jsxs(me,{children:[e.jsxs(fe,{children:[e.jsxs(D,{children:["Bienvenido, ",p," 👋"]}),e.jsxs(ue,{children:["Rol: ",i,". Selecciona un módulo para empezar."]})]}),e.jsxs(ge,{"aria-label":"Cerrar sesión",onClick:_,children:[e.jsx($,{})," Cerrar sesión"]})]}),e.jsxs(je,{children:[w&&e.jsxs(a,{to:"/pos",color:"#007bff",onMouseEnter:()=>g("/pos"),children:[e.jsx(n,{color:"#007bff",children:e.jsx(q,{})}),e.jsx("h2",{children:"Punto de Venta"}),e.jsx("p",{children:"Registra ventas y gestiona transacciones diarias."})]}),w&&e.jsxs(a,{to:"#",onClick:F=>F.preventDefault(),color:"#8b5cf6",style:{opacity:.9,cursor:"not-allowed"},children:[e.jsx(n,{color:"#8b5cf6",children:e.jsx(W,{})}),e.jsx("h2",{children:"Venta Mayorista"}),e.jsx("p",{style:{fontWeight:"bold",color:"#8b5cf6",marginBottom:"5px"},children:"PRÓXIMAMENTE"}),e.jsx("p",{children:"Portal exclusivo para ventas al por mayor."})]}),S&&e.jsxs(a,{to:"/orders",color:"#ffc107",onMouseEnter:()=>g("/orders"),children:[e.jsx(n,{color:"#ffc107",children:e.jsx(G,{})}),e.jsx("h2",{children:"Proformas y precios"}),e.jsx("p",{children:"Crear Proformas y ver Productos"})]}),u&&e.jsxs(a,{to:"/invoices",color:"#e83e8c",onMouseEnter:()=>g("/invoices"),children:[e.jsx(n,{color:"#e83e8c",children:e.jsx(I,{})}),e.jsx("h2",{children:"Facturas Proveedores"}),e.jsx("p",{children:"Gestionar pagos, vencimientos y proveedores."})]}),E&&e.jsxs(a,{to:"/credits",color:"#17a2b8",onMouseEnter:()=>g("/credits"),children:[e.jsx(n,{color:"#17a2b8",children:e.jsx(H,{})}),e.jsx("h2",{children:"Clientes y Créditos"}),e.jsx("p",{children:"Gestiona clientes, saldos pendientes y abonos."})]}),y&&e.jsxs(a,{to:"/inventory",color:"#28a745",onMouseEnter:()=>g("/inventory"),children:[e.jsx(n,{color:"#28a745",children:e.jsx(Y,{})}),e.jsx("h2",{children:"Inventario"}),e.jsx("p",{children:"Controla el stock de tus productos y mercancía."})]}),c&&e.jsxs(a,{to:"/upload/inventory",color:"#6f42c1",children:[e.jsx(n,{color:"#6f42c1",children:e.jsx(J,{})}),e.jsx("h2",{children:"Carga Masiva"}),e.jsx("p",{children:"Actualiza inventario desde archivos CSV."})]}),y&&e.jsxs(a,{to:"/traslados",color:"#ef4444",onMouseEnter:()=>g("/traslados"),children:[e.jsx(n,{color:"#ef4444",children:e.jsx(K,{})}),e.jsx("h2",{children:"Traslados / Salidas"}),e.jsx("p",{children:"Descontar mercancía por traslados o merma."})]}),P&&e.jsxs(a,{to:"/reports",color:"#6c757d",children:[e.jsx(n,{color:"#6c757d",children:e.jsx(Q,{})}),e.jsx("h2",{children:"Reportes"}),e.jsx("p",{children:"Visualiza el rendimiento general."})]}),z&&e.jsxs(a,{to:"/cash-report",color:"#dc3545",children:[e.jsx(n,{color:"#dc3545",children:e.jsx(X,{})}),e.jsx("h2",{children:"Gestión de Cajas"}),e.jsx("p",{children:"Cierres y arqueos de caja."})]}),P&&e.jsxs(a,{to:"/detailed-sales-report",color:"#6366f1",children:[e.jsx(n,{color:"#6366f1",children:e.jsx(I,{})}),e.jsx("h2",{children:"Reportes de Ventas Detallado"}),e.jsx("p",{children:"Ventas, devoluciones y rastreo por producto."})]}),l&&e.jsxs(a,{to:"/admin/users",color:"#ff6b6b",children:[e.jsx(n,{color:"#ff6b6b",children:e.jsx(Z,{})}),e.jsx("h2",{children:"Usuarios"}),e.jsx("p",{children:"Administra roles y accesos."})]}),e.jsxs(a,{to:"/solicitudes",color:"#fd7e14",children:[e.jsx(n,{color:"#fd7e14",children:e.jsx(ee,{})}),e.jsx("h2",{children:"Solicitudes"}),e.jsx("p",{children:"Realizar pedidos y requerimientos."})]}),s&&e.jsxs(a,{as:"button",onClick:()=>t(!0),color:"#343a40",style:{textAlign:"left",border:"none",cursor:"pointer"},children:[e.jsx(n,{color:"#343a40",children:e.jsx(V,{})}),e.jsx("h2",{children:"Configuración"}),e.jsx("p",{children:"Datos de empresa y tickets."})]})]})]}),e.jsx(ie,{isOpen:h,title:"Confirmar Cierre de Sesión",message:"¿Estás seguro de que quieres cerrar tu sesión actual?",onClose:()=>b(!1),onConfirm:O}),e.jsx(he,{isOpen:C,onClose:()=>t(!1)})]})};export{we as default};
