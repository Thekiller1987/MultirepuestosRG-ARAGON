import{R as C,r as a,j as e,C as oe,x as me,a7 as ge,s as o,t as $,a8 as ue,a9 as be,aa as ye,v as je,W as we,ab as xe,$ as ve,a0 as ne,Z as ae,a1 as Ce,a2 as ke,H as Se,n as pe,ac as se,ad as Ae,X as ze,a6 as Fe,A as Ne,m as re,ae as Pe}from"./vendor-BHEUBfle.js";import{f as Ee,g as Te,s as Ie,u as Oe,d as Re}from"./index-CRFpa_vU.js";import{h as $e,E as De}from"./pdf-vendor-BzGOTXeo.js";import{H as Le}from"./scanner-vendor-DfxRpMWJ.js";const Me=$`from { opacity: 0; } to { opacity: 1; }`,Be=$`from { transform: scale(0.95); } to { transform: scale(1); }`,We=$`0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }`,ee=o.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
    display: flex; justify-content: center; align-items: center; z-index: 1100;
    animation: ${Me} 0.2s;
`,te=o.div`
    background: white; padding: 2.5rem; border-radius: 24px;
    width: 95%; max-width: 680px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    animation: ${Be} 0.3s;
    max-height: 90vh; overflow-y: auto;

    @media (max-width: 768px) {
        padding: 1rem;
        border-radius: 12px;
    }
`,R=o.button`
    padding: 1rem 1.5rem; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s;
    background: ${i=>i.$cancel?"#e2e8f0":"#2563eb"};
    color: ${i=>i.$cancel?"#475569":"white"};
    &:hover { background: ${i=>i.$cancel?"#cbd5e1":"#1d4ed8"}; }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
`,q=o.div`
    display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.95rem;
    font-weight: ${i=>i.$bold?"bold":"normal"};
    &.grand-total { border-top: 2px solid #333; font-size: 1.1rem; margin-top: 8px; padding-top: 10px; }
    .text-right { text-align: right; }
`,X=o(je)`animation: ${We} 1s linear infinite;`,I={NAME:"Multirepuestos RG",RUC:"1211812770001E",PHONE:"84031936 / 84058142",ADDRESS:"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",SLOGAN:"Tu mejor opción en repuestos de moto y carro",LOGO_URL:"/icons/logo.png"},He=o.div`
    width: 100%; max-width: 650px; padding: 1.5rem; background: #fff; border-radius: 8px; display: flex; flex-direction: column; gap: 1.5rem;

    /* Estilo CLAVE para ocultar los botones al generar el PDF */
    &.proforma-to-print .footer-actions {
        display: none;
    }
    @media (max-width: 768px) { padding: 1rem; gap: 1rem; }
`,qe=o.div`
    text-align: center; border-bottom: 2px solid #ccc; padding-bottom: 1rem;
    display: flex; flex-direction: column; align-items: center;

    .logo {
        max-width: 120px; max-height: 80px; object-fit: contain; margin-bottom: 8px;
    }
    h2 { margin: 0; font-size: 1.5rem; color: #0b72b9; }
    p { margin: 0.25rem 0; font-size: 0.9rem; }
`,Ue=o.div`
    font-size: 0.9rem; color: #555; border-bottom: 1px solid #eee; padding-bottom: 1rem;
    strong { color: #333; }
    @media (max-width: 768px) { font-size: 0.8rem; }
`,_e=o.div`
    display: flex; justify-content: space-between; padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 4px; background-color: #f9f9f9; gap: 0.5rem; flex-wrap: wrap;
    @media (max-width: 768px) { flex-direction: column; padding: 0.5rem; gap: 0.25rem; }
`,le=o.div`
    flex: 1 1 45%; 
    p { margin: 3px 0; font-size: 0.9rem; } 
    span { font-weight: bold; color: #000; }
    @media (max-width: 768px) { flex-basis: 100%; p { font-size: 0.85rem; } }
`,Ge=o.table`
    width: 100%; border-collapse: collapse;
    th, td { padding: 8px 12px; text-align: left; font-size: 0.95rem; border-bottom: 1px dashed #eee; }
    th { background-color: #f7f7f7; font-weight: bold; color: #333; }
    .text-right { text-align: right; }
    @media (max-width: 768px) {
        th, td { padding: 6px 8px; font-size: 0.8rem; }
        th:nth-child(2), td:nth-child(2) { max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    }
`,Ve=o.div`
    display: flex; justify-content: space-between; align-items: flex-start; padding-top: 1rem; gap: 1rem; flex-wrap: wrap;
    @media (max-width: 768px) { flex-direction: column; }
`,Ye=o.div`
    width: 260px; max-width: 100%;
    ${q} { padding: 4px 0; }
    ${q}.grand-total { border-top: 2px solid #333; font-size: 1.1rem; }
`,Qe=({title:i,message:f,type:g="info",onClose:m})=>{const l=()=>g==="error"?"#ef4444":g==="success"?"#10b981":"#3b82f6",d=()=>g==="error"?e.jsx(ue,{size:40,color:l()}):g==="success"?e.jsx(be,{size:40,color:l()}):e.jsx(ye,{size:40,color:l()});return e.jsx(ee,{style:{zIndex:2e3},children:e.jsxs(te,{style:{maxWidth:"350px",textAlign:"center",padding:"2rem"},children:[e.jsx("div",{style:{marginBottom:"1rem"},children:d()}),e.jsx("h3",{style:{color:"#1e293b",margin:"0 0 10px 0"},children:i}),e.jsx("p",{style:{color:"#64748b",fontSize:"0.95rem",margin:"0 0 20px 0"},children:f}),e.jsx(R,{onClick:m,style:{width:"100%",padding:"12px"},children:"Entendido"})]})})},Ke=({cart:i=[],total:f=0,subtotal:g=0,discount:m=0,proformaFor:l="",proformaNumber:d="",onClose:x,setTicketData:z,currentUser:F,client:u})=>{const[k,D]=C.useState(!1),L=a.useRef(null),[j,N]=C.useState(!1),[M,B]=C.useState(!1),[Y,ie]=C.useState([]),[P,W]=C.useState(""),[T,U]=C.useState(null),[w,H]=C.useState({isOpen:!1,title:"",message:"",type:"info"}),v=(r,b,A="info")=>{H({isOpen:!0,title:r,message:b,type:A})},_=()=>{H(r=>({...r,isOpen:!1})),w.type==="success"&&(z(),x&&x())},S=r=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(r||0)),E=(r=>(r==null?void 0:r.usuarioNombre)||(r==null?void 0:r.nombre)||"Empleado")(F),O=(u==null?void 0:u.nombre)||l||"Consumidor Final",Q=(u==null?void 0:u.telefono)||"N/D";C.useEffect(()=>{W(`Pedido - ${O}`)},[O]);const K=async()=>{if(i.length===0)return;D(!0);const r=L.current,b=l.replace(/\s/g,"_").replace(/[^a-zA-Z0-9_]/g,""),A=d.trim()?`N${d.trim()}`:"TEMP",t=`PROFORMA_${b}_${A}.pdf`,n=r.cloneNode(!0);n.classList.add("proforma-to-print"),document.body.appendChild(n);try{const s=await $e(n,{scale:2,useCORS:!0,windowWidth:n.offsetWidth,windowHeight:n.offsetHeight}),c=s.toDataURL("image/jpeg",1),y=new De("p","mm","a4"),p=210,h=s.height*p/s.width;y.addImage(c,"JPEG",0,0,p,h),y.save(t),z()}catch(s){console.error("Error al generar PDF:",s),v("Error","❌ Error al generar y descargar el PDF.","error")}finally{document.body.contains(n)&&document.body.removeChild(n),D(!1),x&&x()}},V=async()=>{if(i.length!==0){N(!0);try{const r=await Ee(),b=(r==null?void 0:r.abiertas)||[];if(b.length===0){v("Atención","⚠️ No hay cajas abiertas en este momento. No se puede enviar el pedido.","warning"),N(!1);return}ie(b),b.length>0&&U(b[0].openedBy.id),B(!0),N(!1)}catch(r){console.error("Error fetching sessions:",r),v("Error","❌ Error al buscar cajas activas.","error"),N(!1)}}},J=async()=>{if(!T)return v("Atención","Seleccione una caja.","warning");if(!P.trim())return v("Atención","Ingrese un nombre para el ticket.","warning");N(!0);try{const r=await Te(T)||[],b={id:Date.now(),name:P,items:i,createdAt:new Date().toISOString(),createdBy:E},t=[...Array.isArray(r)?r:[],b];await Ie(T,t),B(!1),v("Éxito",`✅ Ticket "${P}" enviado exitosamente a la caja.`,"success")}catch(r){console.error("Error sending ticket:",r),v("Error","❌ Error al enviar el ticket a la caja. Intente de nuevo.","error")}finally{N(!1)}};return e.jsxs(C.Fragment,{children:[e.jsx(ee,{style:{zIndex:M||w.isOpen?1099:1100},children:e.jsx(te,{children:e.jsxs(He,{ref:L,children:[e.jsxs(qe,{children:[e.jsx("img",{src:I.LOGO_URL,alt:"Logo del Negocio",className:"logo"}),e.jsx(oe,{size:32,style:{color:"#0b72b9",marginBottom:8}}),e.jsxs("h2",{children:["PROFORMA ",d&&`N° ${d}`]}),e.jsx("p",{children:"Documento No Válido como Factura Fiscal"})]}),e.jsxs(Ue,{children:[e.jsxs("p",{style:{margin:0,fontWeight:"bold"},children:[I.NAME," - ",I.SLOGAN]}),e.jsx("p",{style:{margin:"3px 0"},children:I.ADDRESS}),e.jsxs("p",{style:{margin:0},children:["Teléfonos: ",I.PHONE,"  |  RUC: ",I.RUC]})]}),e.jsxs(_e,{children:[e.jsxs(le,{children:[e.jsxs("p",{children:["Emitida a: ",e.jsx("span",{children:l||"Consumidor Final"})]}),e.jsxs("p",{children:["Por: ",e.jsx("span",{children:E})]})]}),e.jsxs(le,{children:[e.jsxs("p",{children:["Teléfono: ",e.jsx("span",{children:Q})]}),e.jsxs("p",{children:["Fecha: ",e.jsx("span",{children:new Date().toLocaleDateString("es-NI")})]})]})]}),e.jsxs(Ge,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{style:{width:"10%"},children:"CANT."}),e.jsx("th",{style:{width:"45%"},children:"DESCRIPCIÓN"}),e.jsx("th",{className:"text-right",style:{width:"25%"},children:"PRECIO UNIT."}),e.jsx("th",{className:"text-right",style:{width:"20%"},children:"TOTAL"})]})}),e.jsx("tbody",{children:i.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:"4",style:{textAlign:"center",color:"#777"},children:"No hay artículos."})}):i.map((r,b)=>{const A=parseFloat(r.precio_venta??r.precio??0),t=parseFloat(r.quantity??0);return e.jsxs("tr",{children:[e.jsx("td",{children:t}),e.jsx("td",{children:r.nombre||"Artículo sin nombre"}),e.jsxs("td",{className:"text-right",children:["C$",S(A)]}),e.jsxs("td",{className:"text-right",children:["C$",S(t*A)]})]},b)})})]}),e.jsxs(Ve,{children:[e.jsxs("div",{children:[e.jsx("p",{style:{fontWeight:"bold"},children:"Nota:"}),e.jsx("p",{style:{fontSize:"0.85rem"},children:I.SLOGAN}),e.jsx("p",{style:{fontSize:"0.85rem"},children:"Precios sujetos a cambios y stock."})]}),e.jsxs(Ye,{children:[e.jsxs(q,{children:[e.jsx("span",{children:"Subtotal:"}),e.jsxs("span",{className:"text-right",children:["C$",S(g)]})]}),m>0&&e.jsxs(q,{children:[e.jsx("span",{children:"Descuento:"}),e.jsxs("span",{className:"text-right",children:["- C$",S(m)]})]}),e.jsxs(q,{$bold:!0,className:"grand-total",children:[e.jsx("span",{children:"TOTAL:"}),e.jsxs("span",{className:"text-right",children:["C$",S(f)]})]})]})]}),e.jsxs("div",{className:"footer-actions",style:{display:"flex",gap:"1rem",marginTop:"1rem",flexWrap:"wrap"},children:[e.jsxs(R,{$cancel:!0,onClick:x,style:{flex:1},disabled:k||j,children:[e.jsx(me,{})," Cerrar"]}),e.jsxs(R,{onClick:V,disabled:i.length===0||k||j,style:{flex:1,background:"#f59e0b"},children:[j?e.jsx(X,{}):e.jsx(oe,{}),"ENVIAR A CAJA"]}),e.jsxs(R,{onClick:K,disabled:i.length===0||k||j,style:{flex:1,background:"#059669"},children:[k?e.jsx(X,{}):e.jsx(ge,{}),"PDF"]})]})]})})}),M&&e.jsx(ee,{style:{zIndex:1200},children:e.jsxs(te,{style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx("h3",{style:{color:"#0f172a",marginBottom:"1rem"},children:"Enviar Pedido a Caja"}),e.jsxs("div",{style:{textAlign:"left",marginBottom:"1rem"},children:[e.jsx("label",{style:{display:"block",marginBottom:"5px",fontWeight:"bold",fontSize:"0.9rem"},children:"Nombre del Ticket:"}),e.jsx("input",{type:"text",value:P,onChange:r=>W(r.target.value),style:{width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #ccc"}})]}),e.jsxs("div",{style:{textAlign:"left",marginBottom:"1.5rem"},children:[e.jsx("label",{style:{display:"block",marginBottom:"5px",fontWeight:"bold",fontSize:"0.9rem"},children:"Seleccionar Caja:"}),e.jsx("select",{value:T||"",onChange:r=>U(r.target.value),style:{width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #ccc"},children:Y.map(r=>e.jsxs("option",{value:r.openedBy.id,children:[r.openedBy.name," - (Abierta: ",new Date(r.openedAt).toLocaleTimeString(),")"]},r.openedBy.id))})]}),e.jsxs("div",{style:{display:"flex",gap:"10px"},children:[e.jsx(R,{$cancel:!0,onClick:()=>B(!1),style:{flex:1},children:"Cancelar"}),e.jsx(R,{onClick:J,disabled:j,style:{flex:1},children:j?e.jsx(X,{}):"Enviar Ticket"})]})]})}),w.isOpen&&e.jsx(Qe,{title:w.title,message:w.message,type:w.type,onClose:_})]})},Je=$`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;$`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;$`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;const Xe=o.div`
    display: flex; height: 100vh; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); font-family: 'Inter', sans-serif; overflow: hidden;
    @media (max-width: 960px) { flex-direction: column; overflow-y: auto; height: 100vh; } 
    /* Force height 100vh on mobile to avoid double scrollbars with drawer */
`,Ze=o.div`
    flex: 1; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; overflow-y: hidden;
    @media (max-width: 960px) { padding: 12px; height: 100%; overflow-y: auto; padding-bottom: 80px; /* Space for FAB */ }
`,et=o.div`
    width: 420px; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(16px); padding: 1.5rem; display: flex; flex-direction: column; box-shadow: -10px 0 30px rgba(0,0,0,0.03); border-left: 1px solid rgba(255,255,255,0.5); z-index: 100;
    
    @media (max-width: 960px) { 
        position: fixed; inset: 0; width: 100%; height: 100%;
        background: white; border-left: none; padding: 15px;
        transform: translateY(${i=>i.isOpen?"0":"100%"});
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex; /* Always display but hide via transform */
    }
`,tt=o.div` 
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;
`,rt=o.div`
    display: flex; gap: 10px;
`,de=o(re.button)`
    background: white; border: 1px solid #e2e8f0; color: #64748b; padding: 8px 16px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.9rem;
    &:hover { background: #f8fafc; color: #334155; border-color: #cbd5e1; }
`,it=o.div`
    background: white; padding: 1.5rem; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; gap: 12px; border: 1px solid #f1f5f9;
    @media (max-width: 960px) { padding: 1rem; border-radius: 16px; position: sticky; top: 0; z-index: 50; }
`,ot=o.div` display: flex; gap: 10px; `,ce=o.button`
    flex: 1; padding: 10px; border-radius: 12px; border: 1px solid ${i=>i.active?"#3b82f6":"#e2e8f0"};
    background: ${i=>i.active?"#eff6ff":"white"}; color: ${i=>i.active?"#2563eb":"#64748b"};
    font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;
    &:hover { border-color: #3b82f6; }
`,nt=o.div`
    display: flex; align-items: center; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 14px; padding: 0 15px; transition: all 0.2s;
    &:focus-within { border-color: #3b82f6; background: white; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
`,at=o.input` flex: 1; padding: 12px 0; border: none; background: transparent; outline: none; font-size: 1rem; color: #1e293b; `,st=o.div`
    display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
    grid-auto-rows: min-content; align-content: start;
    gap: 1.25rem; overflow-y: auto; padding-bottom: 30px; flex: 1;
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
    @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); gap: 10px; padding-bottom: 80px; }
`,lt=o.div`
    background: white; border-radius: 18px; border: 1px solid #f1f5f9; display: flex; flex-direction: column; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; position: relative; overflow: hidden;
    &:hover { transform: translateY(-4px); border-color: #3b82f680; box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.08); .eye-icon { opacity: 1; transform: scale(1); } }
    ${i=>i.outOfStock&&Pe` opacity: 0.6; filter: grayscale(0.5); background: #f8fafc; `}
    
    @media (max-width: 768px) { border-radius: 14px; } 
    /* Mobile optimization */
`,dt=o.div`
  position: absolute; top: 10px; right: 10px; background: ${i=>i.outOfStock?"#ef4444":i.lowstock?"#f59e0b":"#10b981"};
  color: white; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 30px; z-index: 10; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) { font-size: 0.65rem; padding: 3px 8px; }
`,ct=o.div` flex: 1; overflow-y: auto; margin-top: 15px; padding-right: 5px; &::-webkit-scrollbar { width: 4px; } `,xt=o.div`
    display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: white; margin-bottom: 10px; border-radius: 16px; border: 1px solid #f1f5f9;
`,pt=o.div`
    display: flex; align-items: center; gap: 10px; background: #f8fafc; padding: 6px; border-radius: 12px; border: 1px solid #f1f5f9;
`,Z=o.button`
    width: 32px; height: 32px; border-radius: 10px; border: none; background: white; color: #64748b; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); cursor: pointer; transition: all 0.2s;
    &:hover { color: #3b82f6; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
`,he=o.button`
    background: ${i=>i.bg||"#3b82f6"}; color: white; border: none; padding: 16px; border-radius: 16px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 1rem; width: 100%; transition: all 0.2s;
    &:disabled { opacity: 0.5; cursor: not-allowed; } 
    &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
`,ht=o(xe)` animation: ${Je} 1s linear infinite; `,fe=o.div`
  position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 5000;
`,ft=o.div`
  background: white; padding: 20px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; position: relative;
`,mt=o(re.button)`
    display: none;
    @media (max-width: 960px) {
        display: flex; align-items: center; justify-content: space-between;
        position: fixed; bottom: 20px; left: 20px; right: 20px;
        background: #0f172a; color: white;
        padding: 16px 24px; border-radius: 16px; border: none;
        box-shadow: 0 10px 25px rgba(15, 23, 42, 0.4);
        z-index: 90; font-weight: 700; font-size: 1rem; cursor: pointer;
    }
`,gt=({isOpen:i,imageSrc:f,onClose:g})=>!i||!f?null:e.jsx(fe,{onClick:g,children:e.jsxs(re.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},onClick:m=>m.stopPropagation(),style:{position:"relative",maxWidth:"95%",maxHeight:"90vh"},children:[e.jsx("button",{onClick:g,style:{position:"absolute",top:-15,right:-15,background:"white",width:32,height:32,borderRadius:"50%",border:"none",cursor:"pointer",boxShadow:"0 4px 10px rgba(0,0,0,0.2)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,color:"#ef4444"},children:e.jsx(pe,{})}),e.jsx("img",{src:f,alt:"Vista Completa",style:{maxWidth:"100%",maxHeight:"85vh",borderRadius:"16px",boxShadow:"0 20px 40px rgba(0,0,0,0.3)",display:"block",background:"white",objectFit:"contain"}})]})}),ut=o.div`
  width: 100%;
  height: 350px;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`,bt=o.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border: 40px solid rgba(0, 0, 0, 0.5); /* Semi-transparent border simulates viewport */
  border-radius: 12px;
  z-index: 10;
  pointer-events: none; /* Let clicks pass through if needed */
  &::before {
    content: '';
    position: absolute;
    top: 50%; left: 0; right: 0;
    height: 2px;
    background: #ef4444;
    box-shadow: 0 0 4px #ef4444;
    animation: scanAnimation 2s infinite ease-in-out;
  }
  @keyframes scanAnimation {
    0% { top: 10%; opacity: 0; }
    50% { opacity: 1; }
    100% { top: 90%; opacity: 0; }
  }
`,yt=({onClose:i,onScan:f})=>{const g=a.useRef(null);return C.useEffect(()=>{const m="reader-custom",l=new Le(m);g.current=l;const d=async()=>{try{await l.start({facingMode:"environment"},{fps:10,qrbox:{width:250,height:250},aspectRatio:1},x=>{l.stop().then(()=>{l.clear(),f(x)}).catch(z=>{console.error("Failed to stop scanner",z),f(x)})},x=>{})}catch(x){console.error("Error starting camera",x),alert("No se pudo iniciar la cámara. Verifique permisos."),i()}};return setTimeout(()=>d(),100),()=>{l.isScanning?l.stop().then(()=>l.clear()).catch(console.error):l.clear()}},[f,i]),e.jsx(fe,{style:{zIndex:6e3},onClick:i,children:e.jsx(ft,{onClick:m=>m.stopPropagation(),style:{padding:"0",width:"90%",maxWidth:"380px",background:"transparent",boxShadow:"none",border:"none"},children:e.jsxs("div",{style:{background:"white",borderRadius:"16px",padding:"16px",boxShadow:"0 20px 25px -5px rgba(0, 0, 0, 0.1)"},children:[e.jsx("h3",{style:{margin:"0 0 12px",textAlign:"center",fontSize:"1.2rem"},children:"Escanear Producto"}),e.jsxs(ut,{children:[e.jsx("div",{id:"reader-custom",style:{width:"100%",height:"100%"}}),e.jsx(bt,{})]}),e.jsx("p",{style:{textAlign:"center",fontSize:"0.85rem",color:"#64748b",marginTop:"12px"},children:"Apunta la cámara al código de barras"}),e.jsx(he,{bg:"#ef4444",onClick:i,style:{marginTop:"15px"},children:"Cancelar"})]})})})},kt=()=>{const{user:i,products:f}=Oe(),g=localStorage.getItem("token"),[m,l]=a.useState(f||[]),[d,x]=a.useState([]),[z,F]=a.useState(""),[u,k]=a.useState("nombre"),[D,L]=a.useState(!1),[j,N]=a.useState(""),[M,B]=a.useState(""),[Y,ie]=a.useState(""),[P,W]=a.useState(!1),[T,U]=a.useState(null),[w,H]=a.useState({isOpen:!1,imageUrl:null}),[v,_]=a.useState(!1),[S,G]=a.useState(!1),E=a.useRef(null);a.useEffect(()=>{f&&l(f)},[f]);const O=a.useCallback(async()=>{L(!0);try{const t=await Re(g);l(Array.isArray(t)?t:(t==null?void 0:t.data)||[])}catch(t){console.error(t)}finally{L(!1)}},[g]);a.useEffect(()=>{O()},[O]);const Q=()=>{window.location.href="/dashboard"},K=t=>{var s;if((((s=d.find(c=>c.id===t.id))==null?void 0:s.quantity)||0)>=t.existencia)return alert(`Stock máximo alcanzado (${t.existencia}).`);x(c=>c.find(p=>p.id===t.id)?c.map(p=>p.id===t.id?{...p,quantity:p.quantity+1}:p):[...c,{...t,quantity:1,precio_venta:parseFloat(t.precio_venta||t.precio||0)}])},V=(t,n)=>{x(s=>{const c=s.find(h=>h.id===t);if(!c)return s;const y=m.find(h=>h.id===t)||c,p=c.quantity+n;return p>y.existencia?(alert(`Stock máximo alcanzado (${y.existencia}).`),s):p<1?s.filter(h=>h.id!==t):s.map(h=>h.id===t?{...h,quantity:p}:h)})},J=a.useMemo(()=>{const t=z.toLowerCase().trim();return t?m.filter(n=>u==="codigo"?String(n.codigo||"").toLowerCase().includes(t):String(n.nombre||"").toLowerCase().includes(t)).slice(0,100):m.slice(0,100)},[m,z,u]),r=a.useMemo(()=>d.reduce((t,n)=>t+parseFloat(n.precio_venta)*n.quantity,0),[d]);a.useEffect(()=>{const t=n=>{var s;P||w.isOpen||v||S||["INPUT","TEXTAREA","SELECT"].includes((s=document.activeElement)==null?void 0:s.tagName)||n.key.length>1||n.ctrlKey||n.altKey||n.metaKey||(n.preventDefault(),u!=="codigo"?(k("codigo"),F(n.key)):F(c=>c+n.key),E.current&&E.current.focus())};return window.addEventListener("keydown",t),()=>window.removeEventListener("keydown",t)},[P,w,v,u,S]);const b=()=>{if(!j.trim())return alert("El nombre del cliente es obligatorio.");U({cart:d,total:r,subtotal:r,discount:0,proformaNumber:Y,client:{nombre:j,telefono:M||"N/D"}}),W(!0)},A=t=>{t&&(k("codigo"),F(t),G(!1))};return e.jsxs(Xe,{children:[e.jsxs(Ze,{children:[e.jsxs(tt,{children:[e.jsx("h2",{style:{margin:0,fontWeight:800,color:"#0f172a"},children:"Catálogo y Proformas"}),e.jsxs(rt,{children:[e.jsxs(de,{onClick:Q,whileHover:{x:-4},children:[e.jsx(we,{size:14})," Regresar"]}),e.jsxs(de,{onClick:O,disabled:D,children:[D?e.jsx(ht,{size:14}):e.jsx(xe,{size:14})," Actualizar"]})]})]}),e.jsxs(it,{children:[e.jsxs(ot,{children:[e.jsxs(ce,{active:u==="nombre",onClick:()=>{var t;k("nombre"),F(""),(t=E.current)==null||t.focus()},children:[e.jsx(ve,{})," Nombre"]}),e.jsxs(ce,{active:u==="codigo",onClick:()=>{var t;k("codigo"),F(""),(t=E.current)==null||t.focus()},children:[e.jsx(ne,{})," Código"]})]}),e.jsxs(nt,{children:[e.jsx(ae,{color:"#94a3b8"}),e.jsx(at,{ref:E,placeholder:u==="codigo"?"Escanea o escribe código...":"Escribe para buscar...",value:z,onChange:t=>F(t.target.value),autoFocus:!0}),e.jsxs("div",{onClick:()=>G(!0),style:{padding:"8px",cursor:"pointer",color:"#64748b",display:"flex",alignItems:"center",justifyContent:"center",borderLeft:"1px solid #e2e8f0",marginLeft:"5px"},title:"Usar Cámara",children:[e.jsx(ne,{size:18}),e.jsx(ae,{size:10,style:{marginLeft:-6,marginTop:-8}})," "]})]})]}),e.jsx(st,{children:J.map(t=>{var p;const n=t.id_producto||t.id,s=((p=d.find(h=>(h.id_producto||h.id)===n))==null?void 0:p.quantity)||0,c=Math.max(0,Number(t.existencia||0)-s),y=c<=0;return e.jsxs(lt,{onClick:()=>!y&&K(t),outOfStock:y,title:t.nombre,children:[e.jsx(dt,{outOfStock:y,lowstock:c<5&&!y,children:y?"Agotado":`Stock: ${c}`}),t.imagen&&e.jsx("div",{className:"eye-icon",onClick:h=>{h.stopPropagation(),H({isOpen:!0,imageUrl:t.imagen})},style:{position:"absolute",top:10,left:10,zIndex:20,background:"white",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 6px rgba(0,0,0,0.1)",cursor:"pointer",transition:"transform 0.2s"},title:"Ver imagen",children:e.jsx(Ce,{size:14,color:"#64748b"})}),e.jsx("div",{style:{height:160,background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"},children:t.imagen?e.jsx("img",{src:t.imagen,alt:t.nombre,style:{width:"100%",height:"100%",objectFit:"contain"}}):e.jsx(ke,{size:40,color:"#e2e8f0"})}),e.jsxs("div",{style:{padding:"12px",flex:1,display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("div",{style:{fontWeight:600,fontSize:"0.88rem",color:"#1e293b",lineHeight:"1.25",height:"2.5rem",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"},children:t.nombre}),e.jsxs("div",{style:{fontWeight:800,color:"#2563eb",fontSize:"1.05rem",marginTop:"auto"},children:["C$ ",parseFloat(t.precio_venta||t.precio||0).toFixed(2)]})]})]},n)})})]}),e.jsxs(et,{isOpen:v,children:[e.jsxs("div",{style:{marginBottom:"20px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("h3",{style:{margin:0,fontWeight:800,display:"flex",alignItems:"center",gap:10},children:[e.jsx(Se,{color:"#3b82f6"})," Tu Proforma"]}),e.jsx("button",{onClick:()=>_(!1),style:{display:"none",background:"#f1f5f9",border:"none",padding:"8px",borderRadius:"8px",cursor:"pointer"},className:"mobile-close-btn",children:e.jsx(pe,{})}),e.jsx("style",{children:"@media(max-width: 960px) { .mobile-close-btn { display: block !important; } }"})]}),e.jsx("input",{style:{width:"100%",padding:"12px",marginTop:15,border:"2px solid #e2e8f0",borderRadius:12,outline:"none"},placeholder:"Nombre del Cliente",value:j,onChange:t=>N(t.target.value)}),e.jsx("input",{style:{width:"100%",padding:"12px",marginTop:10,border:"2px solid #e2e8f0",borderRadius:12,outline:"none"},placeholder:"Teléfono",value:M,onChange:t=>B(t.target.value)})]}),e.jsx(ct,{children:d.length===0?e.jsxs("div",{style:{textAlign:"center",color:"#94a3b8",marginTop:40},children:[e.jsx(se,{size:48,style:{opacity:.1,marginBottom:15}}),e.jsx("p",{children:"Agrega productos"})]}):d.map(t=>e.jsxs(xt,{children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontWeight:600,fontSize:"0.9rem"},children:t.nombre}),e.jsxs("div",{style:{color:"#64748b",fontSize:"0.85rem"},children:["C$ ",parseFloat(t.precio_venta).toFixed(2)]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[e.jsxs(pt,{children:[e.jsx(Z,{onClick:()=>V(t.id,-1),children:e.jsx(Ae,{size:10})}),e.jsx("span",{style:{fontWeight:700},children:t.quantity}),e.jsx(Z,{onClick:()=>V(t.id,1),children:e.jsx(ze,{size:10})})]}),e.jsx(Z,{onClick:()=>x(n=>n.filter(s=>s.id!==t.id)),style:{color:"#ef4444"},children:e.jsx(Fe,{})})]})]},t.id))}),e.jsxs("div",{style:{borderTop:"2px dashed #e2e8f0",paddingTop:"20px",marginTop:"auto"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"1.5rem",fontWeight:900,marginBottom:20},children:[e.jsx("span",{children:"TOTAL"}),e.jsxs("span",{children:["C$ ",r.toFixed(2)]})]}),e.jsxs(he,{onClick:b,disabled:d.length===0||!j.trim(),children:[e.jsx(se,{})," GENERAR PROFORMA PDF"]})]})]}),e.jsxs(mt,{initial:{y:200},animate:{y:d.length>0?0:200},onClick:()=>_(!0),children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("div",{style:{background:"#3b82f6",borderRadius:"50%",width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem"},children:d.reduce((t,n)=>t+n.quantity,0)}),e.jsx("span",{children:"Ver Pedido"})]}),e.jsxs("span",{children:["C$ ",r.toFixed(2)]})]}),e.jsx(Ne,{children:w.isOpen&&e.jsx(gt,{isOpen:!0,imageSrc:w.imageUrl,onClose:()=>H({isOpen:!1,imageUrl:null})})}),P&&e.jsx(Ke,{...T,onClose:()=>W(!1),setTicketData:()=>x([]),currentUser:i,client:T.client}),S&&e.jsx(yt,{onClose:()=>G(!1),onScan:A})]})};export{kt as default};
