import{r as n,j as e,J as K,W as Ce,X as De,b4 as C,af as $,ag as G,a9 as V,b5 as Ne,Z as ke,ax as Se,a_ as Ae,aI as Fe,ai as Pe,n as O,b as Ee,s,ae as L,t as ae,U as _e}from"./vendor-BHEUBfle.js";import{u as $e,F as Te,G as ze,H as Ie,I as Be,J as Me}from"./index-WS_0-QTp.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-BzGOTXeo.js";const Q=()=>new Date().toLocaleDateString("sv-SE",{timeZone:"America/Managua"}),ee=a=>{if(!a)return"—";const u=new Date(a.includes("T")?a:`${a}T12:00:00`);return new Intl.DateTimeFormat("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric"}).format(u)},te=ae`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`,Re=ae`from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; }`,Ge=s.div`
    padding: clamp(1rem, 3vw, 2.5rem); 
    background: #f8fafc; /* Fondo más limpio */
    min-height: 100vh; 
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    animation: ${te} 0.5s ease-out;
`,Le=s.div`
    display: flex; 
    justify-content: space-between; 
    align-items: flex-start; 
    margin-bottom: 2rem; 
    flex-wrap: wrap; 
    gap: 1.5rem;
`,Ve=s.div`
    display: flex;
    flex-direction: column;
`,Oe=s.h1`
    font-size: clamp(1.8rem, 2.5vw, 2.2rem); 
    color: #1e293b; 
    display: flex; 
    align-items: center; 
    gap: 0.75rem; 
    margin: 0; 
    font-weight: 800;
    letter-spacing: -0.03em;
    
    svg { color: #3b82f6; } /* Azul vibrante */
`,We=s.p`
    color: #64748b;
    margin: 0.5rem 0 0 0;
    font-size: 1rem;
    font-weight: 500;
`,Ye=s.div`
    display: flex; 
    gap: 0.75rem;
    flex-wrap: wrap;
    
    @media (max-width: 600px) {
        width: 100%;
        button, a { flex: 1; justify-content: center; }
    }
`,x=s.button`
    padding: 0.75rem 1.25rem; 
    border: none; 
    border-radius: 12px; /* Más redondeado */
    font-weight: 600; 
    font-size: 0.95rem;
    cursor: pointer; 
    display: flex; 
    align-items: center; 
    justify-content: center;
    gap: 0.5rem; 
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    ${a=>a.$primary&&L`
        background: #3b82f6;
        color: white;
        box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
        &:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4); }
    `}

    ${a=>a.$secondary&&L`
        background: white;
        color: #334155;
        border: 1px solid #e2e8f0;
        &:hover { background: #f1f5f9; border-color: #cbd5e1; transform: translateY(-1px); }
    `}

    ${a=>a.$danger&&L`
        background: #fee2e2;
        color: #ef4444;
        &:hover { background: #fecaca; transform: scale(1.05); }
    `}

    &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`,qe=s(_e)`
    padding: 0.75rem 1.25rem; 
    background: white; 
    color: #475569; 
    border: 1px solid #e2e8f0;
    border-radius: 12px; 
    font-weight: 600; 
    text-decoration: none; 
    display: flex; 
    align-items: center; 
    gap: 0.5rem; 
    transition: all 0.2s;
    font-size: 0.95rem;
    &:hover { background: #f8fafc; color: #0f172a; transform: translateY(-1px); }
`,He=s.div`
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); 
    gap: 1.5rem; 
    margin-bottom: 2.5rem;
`,T=s.div`
    background: white; 
    padding: 1.75rem; 
    border-radius: 20px; 
    border: 1px solid rgba(226, 232, 240, 0.6);
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); 
    position: relative; 
    overflow: hidden;
    transition: transform 0.2s;
    
    &:hover { transform: translateY(-4px); box-shadow: 0 15px 25px -5px rgba(0,0,0,0.06); }
    
    /* Barra lateral de color */
    &::before { 
        content: ''; position: absolute; top: 0; left: 0; width: 6px; height: 100%; 
        background: ${a=>a.color}; 
    }

    .icon-wrapper {
        width: 48px; height: 48px; border-radius: 12px; background: ${a=>a.bg}; 
        display: flex; align-items: center; justify-content: center; 
        color: ${a=>a.color}; font-size: 1.4rem; margin-bottom: 1rem;
    }

    .label { font-size: 0.85rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .value { font-size: 2.2rem; font-weight: 800; color: #1e293b; margin: 0.25rem 0; letter-spacing: -0.03em; }
    .sub { font-size: 0.9rem; color: ${a=>a.color}; font-weight: 600; }
`,I=s.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
    background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); 
    display: flex; justify-content: center; align-items: center; z-index: 1200; 
    animation: ${te} 0.2s;
`,B=s.div`
    background: white; padding: 2.5rem; border-radius: 24px; 
    width: 95%; max-width: 550px; 
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); 
    animation: ${Re} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    max-height: 90vh; overflow-y: auto;
    
    h2 { margin: 0 0 1.5rem 0; color: #1e293b; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.025em; }
`,b=s.div`
    margin-bottom: 1.25rem;
    label { display: block; font-size: 0.92rem; color: #475569; margin-bottom: 0.5rem; font-weight: 600; }
    input, select, textarea { 
        width: 100%; padding: 0.9rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; 
        font-size: 1rem; color: #1e293b; background: #fff; transition: all 0.2s; 
        &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
        &::placeholder { color: #94a3b8; }
    }
`,re=s.button`
    position: absolute; top: 1.5rem; right: 1.5rem; 
    background: #f1f5f9; border-radius:50%; width:32px; height:32px; 
    border: none; color: #64748b; font-size: 1rem; cursor: pointer; display:grid; place-items:center;
    transition: all 0.2s;
    &:hover { color: #ef4444; background: #fee2e2; }
`,Xe=s.div`
    background: white; padding: 0.75rem; border-radius: 20px;
    border: 1px solid #e2e8f0; display: flex; flex-direction: column; 
    gap: 1.5rem; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01);
`,Ze=s.div`
    display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 0.75rem;
    border-bottom: 1px solid #f1f5f9;
    &::-webkit-scrollbar { height: 4px; }
    &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
`,Je=s.button`
    padding: 0.65rem 1.25rem; border-radius: 12px; border: none; 
    font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.6rem; 
    transition: all 0.2s; font-size: 0.92rem; white-space: nowrap;

    background: ${a=>a.active?a.activeBg:"transparent"};
    color: ${a=>a.active?a.activeColor:"#64748b"};
    
    &:hover { background: ${a=>a.active?a.activeBg:"#f8fafc"}; color: ${a=>a.active?a.activeColor:"#334155"}; }

    .badge {
        background: ${a=>a.active?a.activeColor:"#e2e8f0"};
        color: ${a=>a.active?"white":"#64748b"};
        padding: 0.15rem 0.6rem; border-radius: 99px; font-size: 0.75rem; 
        font-weight: 800; min-width: 24px; text-align: center;
    }
`,Ue=s.div`
    display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between;
`,Ke=s.div`
    position: relative; min-width: 280px; flex: 2;
    svg { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
    input {
        width: 100%; padding: 0.75rem 1rem 0.75rem 2.8rem;
        border: 1px solid #e2e8f0; border-radius: 12px; font-size: 0.95rem;
        &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
    }
`,z=s.div`
    min-width: 160px; flex: 1;
    display: flex; flex-direction: column; gap: 0.4rem;
    label { font-size: 0.8rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    select, input {
        width: 100%; padding: 0.7rem 1rem; border: 1px solid #e2e8f0; border-radius: 12px; 
        font-size: 0.92rem; background: #fff;
        &:focus { border-color: #3b82f6; outline: none; }
    }
`,Qe=s.div`
    display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem;
`,er=s.div`
    background: white; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column;
    
    &:hover { 
        transform: translateY(-5px); 
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); 
        border-color: #cbd5e1;
    }

    .card-header {
        padding: 1.5rem; background: linear-gradient(to bottom, #ffffff, #f8fafc);
        border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: flex-start;
    }
    .provider-info h3 { margin: 0; font-size: 1.1rem; color: #1e293b; font-weight: 800; line-height: 1.3; }
    .invoice-number { font-size: 0.85rem; color: #64748b; font-family: 'Monaco', monospace; background: #e2e8f0; padding: 4px 8px; border-radius: 6px; margin-top: 0.5rem; display: inline-block; }

    .card-body { padding: 1.5rem; flex: 1; }
    
    .meta-row {
        display: flex; justify-content: space-between; margin-bottom: 0.8rem; font-size: 0.92rem;
        .label { color: #64748b; display: flex; align-items: center; gap: 0.5rem; font-weight: 500; }
        .value { font-weight: 700; color: #334155; }
    }

    .financial-block { margin-top: 1.5rem; padding-top: 1rem; border-top: 2px dashed #f1f5f9; }
    .total-row {
        display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.75rem;
        .label { font-size: 0.85rem; font-weight: 700; color: #64748b; text-transform: uppercase; }
        .amount { font-size: 1.75rem; font-weight: 900; color: #0f172a; ; }
    }

    .progress-bar {
        height: 8px; background: #f1f5f9; border-radius: 99px; overflow: hidden; margin-bottom: 0.75rem;
        div { height: 100%; border-radius: 99px; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
    }

    .balance-text { font-size: 0.9rem; text-align: right; color: #64748b; font-weight: 500; }
    .balance-text strong { color: ${a=>a.balanceColor}; font-weight: 800; }

    .card-footer {
        padding: 1rem 1.5rem; background: #f8fafc; border-top: 1px solid #f1f5f9;
        display: flex; gap: 1rem;
    }
`,rr=s.span`
    padding: 0.4rem 1rem; border-radius: 99px; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;
    background: ${a=>a.bg}; color: ${a=>a.text}; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
`,ar=({info:a,onClose:u})=>a.show?e.jsx(I,{onClick:u,children:e.jsxs(B,{style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"3rem",marginBottom:"1rem",color:a.type==="error"?"#ef4444":a.type==="success"?"#22c55e":"#3b82f6"},children:a.type==="error"?e.jsx(O,{style:{border:"3px solid",borderRadius:"50%",padding:5}}):a.type==="success"?e.jsx(V,{}):e.jsx(C,{})}),e.jsx("h2",{children:a.title}),e.jsx("p",{style:{color:"#64748b",lineHeight:1.6,marginBottom:"2rem"},children:a.message}),e.jsx(x,{$primary:!0,onClick:u,style:{margin:"0 auto",width:"100%"},children:"Entendido"})]})}):null,ir=()=>{const{token:a}=$e(),[u,oe]=n.useState([]),[W,se]=n.useState([]),[ne,Y]=n.useState(!1),[ie,D]=n.useState(0),[y,le]=n.useState("PENDIENTE"),[w,ce]=n.useState("vencimiento_asc"),[N,de]=n.useState(""),[k,me]=n.useState(""),[S,fe]=n.useState(""),[A,ue]=n.useState(""),[q,H]=n.useState({show:!1,title:"",message:"",type:"info"}),[pe,F]=n.useState(!1),[xe,P]=n.useState(!1),[he,E]=n.useState(!1),[l,X]=n.useState(null),[m,v]=n.useState({proveedor:"",numero_factura:"",fecha_emision:Q(),fecha_vencimiento:"",monto_total:"",notas:""}),[j,M]=n.useState({amount:"",reference:""}),p=(r,t,o="info")=>{H({show:!0,title:r,message:t,type:o})};n.useEffect(()=>{a&&(async()=>{Y(!0);try{const t=await Te(a),o=Array.isArray(t)?t:(t==null?void 0:t.data)||[];oe(o);const d=await Ee.get(`${ze}/providers`,{headers:{Authorization:`Bearer ${a}`}}),i=Array.isArray(d.data)?d.data:d.data.data||[];se(i)}catch(t){console.error("Error cargando datos:",t)}finally{Y(!1)}})()},[a,ie]);const ge=r=>{X(r),M({amount:"",reference:""}),P(!0)},be=async r=>{if(r.preventDefault(),!l||!j.amount)return;const t=parseFloat(j.amount),o=(parseFloat(l.monto_total)||0)-(parseFloat(l.monto_abonado)||0);if(t<=0)return p("Error","El monto debe ser mayor a cero.","error");if(t>o+.01)return p("Error","El monto excede la deuda pendiente.","error");const i=t>=o-.1?"PAGADA":l.estado;try{await Be(l.id,t,j.reference,i,a),D(c=>c+1),P(!1),p("Pago Registrado",`Se registró el abono correctamente. Estado: ${i}`,"success")}catch(c){console.error(c),p("Error","No se pudo registrar el pago. Intente nuevamente.","error")}},ve=async r=>{if(r.preventDefault(),!m.proveedor)return p("Falta Proveedor","Seleccione un proveedor.","warning");try{await Ie(m,a),D(t=>t+1),F(!1),v({proveedor:"",numero_factura:"",fecha_emision:Q(),fecha_vencimiento:"",monto_total:"",notas:""}),p("Guardado","La factura ha sido registrada exitosamente.","success")}catch{p("Error","Error al guardar factura.","error")}},je=async()=>{if(l)try{await Me(l.id,a),D(r=>r+1),E(!1),p("Eliminada","La factura fue eliminada del sistema.","success")}catch{p("Error","No se pudo eliminar la factura.","error")}},_=n.useCallback(r=>{const t=parseFloat(r.monto_total)||0,o=parseFloat(r.monto_abonado)||0;if(t>0&&o>=t-.1)return"PAGADA";if(!r.fecha_vencimiento)return"PENDIENTE";const d=new Date;d.setHours(0,0,0,0);let i=r.fecha_vencimiento;i&&i.includes("T")&&(i=i.split("T")[0]);const c=i.split(/[-/]/);let f,g,R;c[0].length===4?(f=parseInt(c[0],10),g=parseInt(c[1],10)-1,R=parseInt(c[2],10)):(R=parseInt(c[0],10),g=parseInt(c[1],10)-1,f=parseInt(c[2],10));const J=new Date(f,g,R);J.setHours(0,0,0,0);const we=J-d,U=Math.ceil(we/(1e3*60*60*24));return U<0?"VENCIDA":U<=5?"PROXIMA":"PENDIENTE"},[]),ye=n.useCallback(r=>{switch(r){case"VENCIDA":return{color:"#dc2626",bg:"#fee2e2",activeColor:"#dc2626",activeBg:"#fef2f2",label:"Vencida"};case"PROXIMA":return{color:"#ea580c",bg:"#ffedd5",activeColor:"#c2410c",activeBg:"#fff7ed",label:"Próxima a Vencer"};case"PAGADA":return{color:"#16a34a",bg:"#dcfce7",activeColor:"#16a34a",activeBg:"#f0fdf4",label:"Pagada"};default:return{color:"#3b82f6",bg:"#dbeafe",activeColor:"#2563eb",activeBg:"#eff6ff",label:"Pendiente"}}},[]),h=n.useMemo(()=>{let r=0,t=0,o=0,d=0,i=0;return u.forEach(c=>{const f=_(c);f==="PENDIENTE"&&r++,f==="VENCIDA"&&t++,f==="PAGADA"&&o++,f==="PROXIMA"&&d++;const g=(parseFloat(c.monto_total)||0)-(parseFloat(c.monto_abonado)||0);f!=="PAGADA"&&(i+=g)}),{pend:r,venc:t,pag:o,prox:d,totalDebt:i}},[u,_]),Z=n.useMemo(()=>{let r=u.map(t=>({...t,effectiveStatus:_(t)}));if(y!=="TODAS"&&(y==="PENDIENTE"?r=r.filter(t=>t.effectiveStatus==="PENDIENTE"||t.effectiveStatus==="PROXIMA"):r=r.filter(t=>t.effectiveStatus===y)),k&&(r=r.filter(t=>t.proveedor===k)),S&&A){const t=new Date(S).getTime(),o=new Date(A).getTime()+864e5;r=r.filter(d=>{const i=new Date(d.fecha_emision).getTime();return i>=t&&i<o})}if(N){const t=N.toLowerCase();r=r.filter(o=>o.proveedor&&o.proveedor.toLowerCase().includes(t)||o.numero_factura&&o.numero_factura.toLowerCase().includes(t))}return r.sort((t,o)=>w==="vencimiento_asc"?new Date(t.fecha_vencimiento)-new Date(o.fecha_vencimiento):w==="emision_desc"?new Date(o.fecha_emision)-new Date(t.fecha_emision):w==="emision_asc"?new Date(t.fecha_emision)-new Date(o.fecha_emision):0),r},[u,y,N,k,S,A,w,_]);return e.jsxs(Ge,{children:[e.jsx(ar,{info:q,onClose:()=>H({...q,show:!1})}),e.jsxs(Le,{children:[e.jsxs(Ve,{children:[e.jsxs(Oe,{children:[e.jsx(K,{})," Facturas de Proveedores"]}),e.jsx(We,{children:"Gestión y control de cuentas por pagar"})]}),e.jsxs(Ye,{children:[e.jsx(x,{$secondary:!0,onClick:()=>D(r=>r+1),children:"Actualizar"}),e.jsxs(qe,{to:"/dashboard",children:[e.jsx(Ce,{})," Volver"]}),e.jsxs(x,{$primary:!0,onClick:()=>F(!0),children:[e.jsx(De,{})," Registrar Factura"]})]})]}),e.jsxs(He,{children:[e.jsxs(T,{color:"#ef4444",bg:"#fef2f2",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(C,{})}),e.jsx("div",{className:"label",children:"Vencidas"}),e.jsx("div",{className:"value",children:h.venc}),e.jsx("div",{className:"sub",children:"Requieren atención urgente"})]}),e.jsxs(T,{color:"#ea580c",bg:"#fff7ed",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx($,{})}),e.jsx("div",{className:"label",children:"Próximas a Vencer"}),e.jsx("div",{className:"value",children:h.prox}),e.jsx("div",{className:"sub",children:"En los próx. 5 días"})]}),e.jsxs(T,{color:"#3b82f6",bg:"#eff6ff",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx($,{})}),e.jsx("div",{className:"label",children:"Pendientes"}),e.jsx("div",{className:"value",children:h.pend}),e.jsx("div",{className:"sub",children:"Sin riesgo inmediato"})]}),e.jsxs(T,{color:"#f59e0b",bg:"#fffbeb",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(G,{})}),e.jsx("div",{className:"label",children:"Deuda Total"}),e.jsxs("div",{className:"value",style:{color:"#b45309"},children:["C$",h.totalDebt.toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsx("div",{className:"sub",style:{color:"#b45309"},children:"Saldo Pendiente Global"})]})]}),e.jsxs(Xe,{children:[e.jsx(Ze,{children:[{id:"PENDIENTE",label:"Por Pagar (Prox)",icon:$,color:"#3b82f6",bg:"#eff6ff",count:h.pend+h.prox},{id:"VENCIDA",label:"Vencidas",icon:C,color:"#dc2626",bg:"#fef2f2",count:h.venc},{id:"PAGADA",label:"Pagadas",icon:V,color:"#16a34a",bg:"#f0fdf4",count:h.pag},{id:"TODAS",label:"Todas",icon:Ne,color:"#64748b",bg:"#f1f5f9",count:null}].map(r=>e.jsxs(Je,{active:y===r.id,activeColor:r.color,activeBg:r.bg,onClick:()=>le(r.id),children:[e.jsx(r.icon,{})," ",r.label,r.count!==null&&e.jsx("span",{className:"badge",children:r.count})]},r.id))}),e.jsxs(Ue,{children:[e.jsxs(Ke,{children:[e.jsx(ke,{}),e.jsx("input",{type:"text",placeholder:"Buscar proveedor o No. factura...",value:N,onChange:r=>de(r.target.value)})]}),e.jsxs(z,{style:{minWidth:"180px"},children:[e.jsx("label",{children:"Ordenar Por"}),e.jsxs("select",{value:w,onChange:r=>ce(r.target.value),children:[e.jsx("option",{value:"vencimiento_asc",children:"Vencen Primero (Próximas)"}),e.jsx("option",{value:"emision_desc",children:"Emitidas Reciente (Nuevas)"}),e.jsx("option",{value:"emision_asc",children:"Emitidas Antiguas (Viejas)"})]})]}),e.jsxs(z,{children:[e.jsx("label",{children:"Proveedor"}),e.jsxs("select",{value:k,onChange:r=>me(r.target.value),children:[e.jsx("option",{value:"",children:"Todos"}),W.map(r=>e.jsx("option",{value:r.nombre,children:r.nombre},r.id_proveedor||r.id))]})]}),e.jsxs(z,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Desde"}),e.jsx("input",{type:"date",value:S,onChange:r=>fe(r.target.value)})]}),e.jsxs(z,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Hasta"}),e.jsx("input",{type:"date",value:A,onChange:r=>ue(r.target.value)})]})]})]}),ne?e.jsxs("div",{style:{textAlign:"center",padding:"4rem",color:"#94a3b8"},children:[e.jsx($,{className:"spin",style:{fontSize:"2rem",marginBottom:"1rem"}}),e.jsx("p",{children:"Cargando información..."})]}):Z.length>0?e.jsx(Qe,{children:Z.map(r=>{const t=r.effectiveStatus,o=ye(t),d=parseFloat(r.monto_total)||0,i=parseFloat(r.monto_abonado)||0,c=d-i,f=d>0?i/d*100:0,g=t==="PAGADA"?r.referencia_pago:null;return e.jsxs(er,{color:o.color,balanceColor:c>0?"#ef4444":"#16a34a",children:[e.jsxs("div",{className:"card-header",children:[e.jsxs("div",{className:"provider-info",children:[e.jsxs("h3",{title:r.proveedor,children:[e.jsx(Se,{style:{marginRight:6,color:"#94a3b8"}})," ",r.proveedor]}),e.jsxs("span",{className:"invoice-number",children:["#",r.numero_factura]})]}),e.jsx(rr,{bg:o.bg,text:o.color,children:o.label})]}),e.jsxs("div",{className:"card-body",children:[e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{className:"label",children:[e.jsx(Ae,{})," Emisión"]}),e.jsx("span",{className:"value",children:ee(r.fecha_emision)})]}),e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{className:"label",children:[e.jsx(C,{})," Vence"]}),e.jsx("span",{className:"value",style:{color:r.estado==="VENCIDA"?"#ef4444":"inherit"},children:ee(r.fecha_vencimiento)})]}),g&&e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{className:"label",children:[e.jsx(Fe,{})," Referencia"]}),e.jsx("span",{className:"value",children:g})]}),e.jsxs("div",{className:"financial-block",children:[e.jsxs("div",{className:"total-row",children:[e.jsx("span",{className:"label",children:"Total a Pagar"}),e.jsxs("span",{className:"amount",children:["C$",d.toLocaleString(void 0,{minimumFractionDigits:2})]})]}),e.jsx("div",{className:"progress-bar",children:e.jsx("div",{style:{width:`${f}%`,background:o.color}})}),e.jsxs("div",{className:"balance-text",children:["Abonado: C$",i.toLocaleString(void 0,{minimumFractionDigits:2})," • ",e.jsxs("strong",{children:["Resta: C$",c.toLocaleString(void 0,{minimumFractionDigits:2})]})]})]})]}),e.jsxs("div",{className:"card-footer",children:[c>0&&e.jsxs(x,{$primary:!0,style:{flex:1,justifyContent:"center"},onClick:()=>ge(r),children:[e.jsx(G,{})," Abonar"]}),e.jsx(x,{$danger:!0,style:{padding:"0.75rem"},onClick:()=>{X(r),E(!0)},children:e.jsx(Pe,{})})]})]},r.id)})}):e.jsxs("div",{style:{textAlign:"center",padding:"4rem",color:"#94a3b8",border:"2px dashed #e2e8f0",borderRadius:"24px",background:"white"},children:[e.jsx(K,{style:{fontSize:"3rem",marginBottom:"1rem",opacity:.3}}),e.jsx("h3",{style:{color:"#475569"},children:"No se encontraron facturas"}),e.jsx("p",{children:"Intenta ajustar los filtros o registra una nueva."})]}),pe&&e.jsx(I,{onClick:()=>F(!1),children:e.jsxs(B,{onClick:r=>r.stopPropagation(),children:[e.jsx(re,{onClick:()=>F(!1),children:e.jsx(O,{})}),e.jsx("h2",{children:"Registrar Factura"}),e.jsxs("form",{onSubmit:ve,children:[e.jsxs(b,{children:[e.jsx("label",{children:"Proveedor"}),e.jsxs("select",{required:!0,value:m.proveedor,onChange:r=>v({...m,proveedor:r.target.value}),children:[e.jsx("option",{value:"",children:"Seleccione un proveedor..."}),W.map(r=>e.jsx("option",{value:r.nombre,children:r.nombre},r.id_proveedor||r.id))]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs(b,{children:[e.jsx("label",{children:"No. Factura"}),e.jsx("input",{required:!0,type:"text",value:m.numero_factura,onChange:r=>v({...m,numero_factura:r.target.value}),placeholder:"Ej: F-001"})]}),e.jsxs(b,{children:[e.jsx("label",{children:"Monto Total (C$)"}),e.jsx("input",{required:!0,type:"number",step:"0.01",value:m.monto_total,onChange:r=>v({...m,monto_total:r.target.value}),placeholder:"0.00"})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs(b,{children:[e.jsx("label",{children:"Fecha Emisión"}),e.jsx("input",{required:!0,type:"date",value:m.fecha_emision,onChange:r=>v({...m,fecha_emision:r.target.value})})]}),e.jsxs(b,{children:[e.jsx("label",{children:"Fecha Vencimiento"}),e.jsx("input",{required:!0,type:"date",value:m.fecha_vencimiento,onChange:r=>v({...m,fecha_vencimiento:r.target.value})})]})]}),e.jsxs(b,{children:[e.jsx("label",{children:"Notas (Opcional)"}),e.jsx("textarea",{rows:"3",value:m.notas,onChange:r=>v({...m,notas:r.target.value}),placeholder:"Detalles extra..."})]}),e.jsxs(x,{$primary:!0,type:"submit",style:{width:"100%",padding:"1rem",fontSize:"1rem"},children:[e.jsx(V,{})," Guardar Factura"]})]})]})}),xe&&e.jsx(I,{onClick:()=>P(!1),children:e.jsxs(B,{onClick:r=>r.stopPropagation(),style:{maxWidth:"450px"},children:[e.jsx(re,{onClick:()=>P(!1),children:e.jsx(O,{})}),e.jsx("h2",{children:"Registrar Abono"}),e.jsxs("div",{style:{background:"#f1f5f9",padding:"1rem",borderRadius:"12px",marginBottom:"1.5rem"},children:[e.jsxs("div",{style:{fontSize:"0.9rem",color:"#64748b",marginBottom:"0.25rem"},children:["Factura #",l==null?void 0:l.numero_factura]}),e.jsxs("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:"#1e293b"},children:["Deuda: C$",((parseFloat(l==null?void 0:l.monto_total)||0)-(parseFloat(l==null?void 0:l.monto_abonado)||0)).toFixed(2)]})]}),e.jsxs("form",{onSubmit:be,children:[e.jsxs(b,{children:[e.jsx("label",{children:"Monto a Abonar (C$)"}),e.jsx("input",{required:!0,type:"number",step:"0.01",autoFocus:!0,placeholder:"0.00",value:j.amount,onChange:r=>M({...j,amount:r.target.value})})]}),e.jsxs(b,{children:[e.jsx("label",{children:"Referencia / Detalle (Opcional)"}),e.jsx("input",{type:"text",placeholder:"Ej: Transferencia #1234, Pago en efectivo...",value:j.reference,onChange:r=>M({...j,reference:r.target.value})})]}),e.jsxs(x,{$primary:!0,type:"submit",style:{width:"100%",padding:"1rem"},children:[e.jsx(G,{})," Confirmar Pago"]})]})]})}),he&&e.jsx(I,{onClick:()=>E(!1),children:e.jsxs(B,{style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"3rem",color:"#ef4444",marginBottom:"1rem"},children:e.jsx(C,{})}),e.jsx("h2",{children:"¿Eliminar Factura?"}),e.jsxs("p",{style:{color:"#64748b",marginBottom:"2rem"},children:["Estás a punto de eliminar la factura ",e.jsxs("b",{children:["#",l==null?void 0:l.numero_factura]}),". Esta acción no se puede deshacer."]}),e.jsxs("div",{style:{display:"flex",gap:"1rem"},children:[e.jsx(x,{$secondary:!0,onClick:()=>E(!1),style:{flex:1},children:"Cancelar"}),e.jsx(x,{$danger:!0,onClick:je,style:{flex:1},children:"Sí, Eliminar"})]})]})})]})};export{ir as default};
