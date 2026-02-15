import{u as Ne,r as a,b as ne,j as e,W as ae,b3 as T,aA as Ce,H as Se,Z as W,a0 as ke,a_ as Le,h as ze,C as Fe,b7 as Pe,b8 as De,L as Te,s as d,t as Ee}from"./vendor-BMIwBeBI.js";import{u as Me}from"./index-CLPd0yE4.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-qNamXCRA.js";const de="https://www.multirepuestosrgaragon.com/api";function le(){const o=new Date,b=o.getFullYear(),f=String(o.getMonth()+1).padStart(2,"0"),j=String(o.getDate()).padStart(2,"0");return`${b}-${f}-${j}`}const n=o=>`C$${Number(o||0).toFixed(2)}`,$=o=>o?new Date(o).toLocaleString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0}):"—",ce=o=>o?new Date(o).toLocaleDateString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric"}):"—",r={primary:"#0f172a",secondary:"#475569",success:"#16a34a",info:"#0284c7",bg:"#f8fafc",border:"#e2e8f0",text:"#1e293b",textLight:"#64748b"},A=Ee`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`,Ae=d.div`
  max-width: 1500px;
  margin: 0 auto;
  padding: 2rem;
  background: ${r.bg};
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: ${r.text};
`,Re=d.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  background: white;
  padding: 1.25rem 2rem;
  border-radius: 12px;
  border: 1px solid ${r.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  flex-wrap: wrap;
  gap: 1rem;
`,Ie=d.button`
  background: white;
  border: 1px solid ${r.border};
  width: 40px; height: 40px;
  border-radius: 8px;
  display: grid; place-items: center;
  cursor: pointer;
  color: ${r.text};
  transition: all 0.2s;
  &:hover { background: ${r.bg}; color: ${r.primary}; }
`,Be=d.div`
  display: flex;
  gap: 0;
  background: white;
  border-radius: 12px;
  border: 1px solid ${r.border};
  overflow: hidden;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`,U=d.button`
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  background: ${o=>o.active?r.primary:"white"};
  color: ${o=>o.active?"white":r.secondary};
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  border-right: 1px solid ${r.border};
  &:last-child { border-right: none; }
  &:hover {
    background: ${o=>o.active?r.primary:"#f1f5f9"};
  }
`,Ve=d.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  input[type="date"], input[type="text"] {
    padding: 10px 14px;
    border: 1px solid ${r.border};
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.9rem;
    color: ${r.text};
    background: white;
    outline: none;
    transition: border-color 0.2s;
    &:focus { border-color: ${r.primary}; }
  }

  select {
    padding: 10px 14px;
    border: 1px solid ${r.border};
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.9rem;
    color: ${r.text};
    background: white;
    outline: none;
    cursor: pointer;
  }
`,_=d.button`
  padding: 10px 18px;
  border: 1px solid ${r.border};
  border-radius: 8px;
  background: ${o=>o.variant==="primary"?r.primary:"white"};
  color: ${o=>o.variant==="primary"?"white":r.secondary};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  &:hover {
    background: ${o=>o.variant==="primary"?"#1e293b":r.bg};
    transform: translateY(-1px);
  }
`,O=d.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${r.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  animation: ${A} 0.3s ease;

  thead {
    background: #f1f5f9;
    th {
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      font-size: 0.8rem;
      color: ${r.secondary};
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 2px solid ${r.border};
      white-space: nowrap;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #f1f5f9;
      transition: background 0.15s;
      cursor: ${o=>o.clickable?"pointer":"default"};
      &:hover { background: #fafbfc; }
      &:last-child { border-bottom: none; }
    }
    td {
      padding: 10px 16px;
      font-size: 0.9rem;
      color: ${r.text};
      vertical-align: top;
    }
  }

  .num { text-align: right; font-family: 'Roboto Mono', monospace; }
  .center { text-align: center; }
`,xe=d.div`
  text-align: center;
  padding: 3rem 2rem;
  color: ${r.textLight};
  background: white;
  border-radius: 12px;
  border: 1px solid ${r.border};
  animation: ${A} 0.3s ease;
  p { margin: 0.5rem 0; }
  svg { font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.4; }
`,qe=d.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  animation: ${A} 0.3s ease;
`,E=d.div`
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid ${r.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  
  .label {
    font-size: 0.8rem;
    color: ${r.textLight};
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.03em;
    margin-bottom: 0.4rem;
  }
  .value {
    font-size: 1.4rem;
    font-weight: 700;
    color: ${o=>o.color||r.primary};
    font-family: 'Roboto Mono', monospace;
  }
`,We=d.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.82rem;
  color: ${r.secondary};
  
  .item-row {
    display: flex;
    justify-content: space-between;
    padding: 2px 0;
    &:hover { color: ${r.text}; }
  }
  .item-name { flex: 1; }
  .item-qty { width: 40px; text-align: center; color: ${r.textLight}; }
  .item-price { width: 90px; text-align: right; font-family: 'Roboto Mono', monospace; }
`,Ue=d.button`
  all: unset;
  cursor: pointer;
  color: ${r.info};
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  &:hover { text-decoration: underline; }
`,pe=d.div`
  text-align: center;
  padding: 3rem;
  color: ${r.textLight};
  font-size: 1rem;
`,H=d.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 2rem;
`,Y=d.div`
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid ${r.border};
  box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  animation: ${A} 0.3s ease;
`,g=d.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  
  .label { font-size: 0.75rem; color: ${r.textLight}; font-weight: 600; text-transform: uppercase; }
  .value { font-size: 0.95rem; font-weight: 600; color: ${r.text}; }
  .price { font-family: 'Roboto Mono', monospace; font-size: 1.1rem; color: ${r.primary}; }
`,_e=d.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.85rem;
  border: 1px dashed ${r.border};
`,Oe=()=>{const[o,b]=a.useState(window.innerWidth<768);return a.useEffect(()=>{const f=()=>b(window.innerWidth<768);return window.addEventListener("resize",f),()=>window.removeEventListener("resize",f)},[]),o},He=o=>{switch(o){case"COMPLETADA":return{background:"#dcfce7",color:"#166534"};case"DEVOLUCION":return{background:"#fee2e2",color:"#991b1b"};case"CANCELADA":return{background:"#fef3c7",color:"#92400e"};default:return{background:"#f1f5f9",color:"#475569"}}},M=({type:o,children:b})=>{const f={fontSize:"0.7rem",fontWeight:700,padding:"3px 8px",borderRadius:"6px",textTransform:"uppercase",letterSpacing:"0.03em",whiteSpace:"nowrap",...He(o)};return e.jsx("span",{style:f,children:b})};function Je(){var te,re,se,oe,ie;const{token:o,products:b}=Me(),f=Ne(),j=Oe(),[i,R]=a.useState("ventas"),[N,he]=a.useState(le()),[C,me]=a.useState(le()),[w,G]=a.useState([]),[Z,K]=a.useState(!1),[ue,ge]=a.useState({}),[L,be]=a.useState(""),[h,fe]=a.useState(""),[m,z]=a.useState(null),[je,F]=a.useState(!1),[J,P]=a.useState(""),[l,I]=a.useState(null),[ye,Q]=a.useState(!1),B=a.useMemo(()=>{const t={"Content-Type":"application/json"};return o&&(t.Authorization=`Bearer ${o}`),t},[o]),v=a.useCallback(async(t,s,c)=>{K(!0);try{const x={startDate:N,endDate:C};t&&(x.tipo=t),s&&(x.keyword=s),c&&(x.clientId=c);const p=await ne.get(`${de}/reports/detailed-sales`,{headers:B,params:x});G(Array.isArray(p.data)?p.data:[])}catch(x){console.error("Error fetching detailed sales:",x),G([])}finally{K(!1)}},[B,N,C]);a.useEffect(()=>{i==="ventas"?v(null,null,m==null?void 0:m.id_cliente):i==="devoluciones"?v("DEVOLUCION"):i==="busqueda"&&h.trim().length>=3&&v(null,h)},[i,N,C,v,h,m]);const S=a.useMemo(()=>{if(!L)return b;const t=L.toLowerCase();return b.filter(s=>s.nombre.toLowerCase().includes(t)||String(s.codigo).toLowerCase().includes(t))},[b,L]),X=async t=>{if(t){Q(!0);try{const s=await ne.get(`${de}/reports/product-history`,{headers:B,params:{code:t.codigo}});I({product:t,history:Array.isArray(s.data.history)?s.data.history:Array.isArray(s.data)?s.data:[]})}catch(s){console.error("Error fetching product history:",s),I({product:t,history:[]})}finally{Q(!1)}}},ve=t=>{ge(s=>({...s,[t]:!s[t]}))},V=w.reduce((t,s)=>t+Number(s.totalVenta||0),0),D=w.length,ee=t=>{if(!t)return"—";const s=[];return t.efectivo>0&&s.push(`Efectivo: ${n(t.efectivo)}`),t.tarjeta>0&&s.push(`Tarjeta: ${n(t.tarjeta)}`),t.transferencia>0&&s.push(`Transf: ${n(t.transferencia)}`),t.credito>0&&s.push(`Crédito: ${n(t.credito)}`),t.dolares>0&&s.push(`USD: $${Number(t.dolares).toFixed(2)}`),s.length?s.join(" | "):"Efectivo"},we=()=>{var k;const t=window.open("","_blank");if(!t)return;const s=i==="producto",c=s?`Historial de Producto: ${((k=l==null?void 0:l.product)==null?void 0:k.nombre)||""}`:`Reporte de ${i==="devoluciones"?"Devoluciones":"Ventas Detalladas"}`;s||`${ce(N)}${ce(C)}`;let x="";const p=`
            @page { size: A4 landscape; margin: 10mm; }
            body { font-family: 'Inter', sans-serif; color: #1e293b; padding: 20px; }
            h1 { font-size: 18pt; margin-bottom: 5px; color: #0f172a; }
            p { margin: 0 0 20px; color: #64748b; font-size: 10pt; }
            table { width: 100%; border-collapse: collapse; font-size: 9pt; }
            th { background: #f1f5f9; text-align: left; padding: 8px; border-bottom: 2px solid #e2e8f0; }
            td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
            .num { text-align: right; font-family: 'Roboto Mono', monospace; }
            .center { text-align: center; }
            .badge { padding: 2px 6px; border-radius: 4px; font-size: 8pt; font-weight: bold; border: 1px solid #ccc; }
        `;if(s){if(!l||!l.product)return;const u=l.product,$e=l.history||[];x+=`
                 <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #cbd5e1; border-radius: 8px;">
                     <h2 style="margin:0 0 10px;">${u.nombre}</h2>
                     <div style="display:flex; gap:20px; font-size:10pt;">
                         <strong>Código: ${u.codigo}</strong>
                         <strong>Precio: ${n(u.precio)}</strong>
                         <strong>Existencia: ${u.existencia}</strong>
                     </div>
                 </div>
                 <table>
                     <thead>
                         <tr>
                             <th>Fecha</th>
                             <th>Factura</th>
                             <th>Cliente</th>
                             <th>Tipo</th>
                             <th class="center">Cant.</th>
                             <th class="num">Precio</th>
                             <th class="num">Subtotal</th>
                         </tr>
                     </thead>
                     <tbody>
                         ${$e.map(y=>`
                             <tr>
                                 <td>${$(y.fecha)}</td>
                                 <td>#${y.idVenta}</td>
                                 <td>${y.clienteNombre||"Público"}</td>
                                 <td>${y.tipo_venta}</td>
                                 <td class="center">${y.cantidad}</td>
                                 <td class="num">${n(y.precioUnitario)}</td>
                                 <td class="num">${n(y.cantidad*y.precioUnitario)}</td>
                             </tr>
                         `).join("")}
                     </tbody>
                 </table>
             `}else x+=`
                <div style="margin-bottom:20px;">
                    <strong>Total:</strong> ${n(V)} (${D} tx)
                </div>
                <table>
                    <thead>
                        <tr>
                             <th>#</th><th>Fecha</th><th>Estado</th><th>Cliente</th><th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${w.map(u=>`
                            <tr>
                                <td>${u.id}</td>
                                <td>${$(u.fecha)}</td>
                                <td>${u.estado}</td>
                                <td>${u.clienteNombre||"PG"}</td>
                                <td class="num">${n(u.totalVenta)}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            `;const q=`<html><head><title>${c}</title><style>${p}</style></head>
        <body><h1>${c}</h1>${x}<script>window.onload=()=>{window.print();}<\/script></body></html>`;t.document.write(q),t.document.close()};return e.jsxs(Ae,{children:[e.jsxs(Re,{children:[e.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[e.jsx(Ie,{onClick:()=>f("/dashboard"),children:e.jsx(ae,{})}),e.jsxs("div",{children:[e.jsx("h1",{style:{margin:0,fontSize:"1.4rem",fontWeight:700,color:r.primary},children:"Reportes de Ventas Detallado"}),e.jsx("p",{style:{margin:"2px 0 0",color:r.textLight,fontSize:"0.9rem"},children:"Ventas, devoluciones y seguimiento por producto"})]})]}),e.jsxs("div",{style:{display:"flex",gap:"10px",alignItems:"center"},children:[Z&&e.jsxs("span",{style:{color:r.textLight},children:[e.jsx(T,{className:"icon-spin"})," Cargando..."]}),e.jsxs(_,{onClick:we,children:[e.jsx(Ce,{})," Imprimir"]})]})]}),e.jsxs(Be,{children:[e.jsxs(U,{active:i==="ventas",onClick:()=>R("ventas"),children:[e.jsx(Se,{})," Ventas Detalladas"]}),e.jsxs(U,{active:i==="busqueda",onClick:()=>R("busqueda"),children:[e.jsx(W,{})," Búsqueda por Palabra"]}),e.jsxs(U,{active:i==="producto",onClick:()=>R("producto"),children:[e.jsx(ke,{})," Buscar por Producto"]})]}),(i==="ventas"||i==="devoluciones"||i==="busqueda")&&e.jsxs(e.Fragment,{children:[e.jsxs(Ve,{children:[e.jsx(Le,{style:{color:r.primary}}),e.jsx("input",{type:"date",value:N,onChange:t=>he(t.target.value)}),e.jsx("span",{style:{color:r.textLight},children:"a"}),e.jsx("input",{type:"date",value:C,onChange:t=>me(t.target.value)}),i==="ventas"&&e.jsxs("div",{style:{position:"relative",display:"flex",alignItems:"center"},children:[e.jsx(ze,{style:{position:"absolute",left:"10px",color:r.textLight}}),e.jsx("input",{type:"text",placeholder:"Filtrar por cliente...",value:m?m.nombre:J,onChange:t=>{P(t.target.value),z(null),F(!0)},onFocus:()=>F(!0),style:{paddingLeft:"35px",minWidth:"200px"}}),m&&e.jsx(FaTimes,{onClick:()=>{z(null),P("")},style:{position:"absolute",right:"10px",color:r.textLight,cursor:"pointer"}}),je&&e.jsxs("div",{style:{position:"absolute",top:"100%",left:0,width:"100%",background:"white",border:`1px solid ${r.border}`,borderRadius:"8px",boxShadow:"0 4px 6px rgba(0,0,0,0.1)",zIndex:100,maxHeight:"200px",overflowY:"auto"},children:[e.jsx("div",{onClick:()=>{z(null),P(""),F(!1)},style:{padding:"8px 12px",cursor:"pointer",borderBottom:`1px solid ${r.border}`,fontSize:"0.9rem"},children:"-- Todos los clientes --"}),clients.filter(t=>t.nombre.toLowerCase().includes(J.toLowerCase())).slice(0,20).map(t=>e.jsx("div",{onClick:()=>{z(t),P(t.nombre),F(!1)},style:{padding:"8px 12px",cursor:"pointer",borderBottom:`1px solid ${r.border}`,fontSize:"0.9rem"},children:t.nombre},t.id_cliente))]})]}),i==="busqueda"&&e.jsxs("div",{style:{position:"relative",display:"flex",alignItems:"center"},children:[e.jsx(W,{style:{position:"absolute",left:"10px",color:r.textLight}}),e.jsx("input",{type:"text",placeholder:"Buscar palabra...",value:h,onChange:t=>fe(t.target.value),style:{paddingLeft:"35px",minWidth:"180px"}})]}),e.jsxs(_,{variant:"primary",onClick:()=>{i==="ventas"?v(null,null,m==null?void 0:m.id_cliente):i==="devoluciones"?v("DEVOLUCION"):i==="busqueda"&&v(null,h)},children:[e.jsx(T,{})," ",i==="busqueda"?"Buscar":"Actualizar"]})]}),e.jsxs(qe,{children:[e.jsxs(E,{color:r.primary,children:[e.jsx("div",{className:"label",children:i==="busqueda"?`Ventas con "${h}"`:i==="devoluciones"?"Total Devoluciones":"Total Ventas"}),e.jsx("div",{className:"value",children:n(V)})]}),e.jsxs(E,{color:r.info,children:[e.jsx("div",{className:"label",children:"Transacciones"}),e.jsx("div",{className:"value",children:D})]}),e.jsxs(E,{color:r.success,children:[e.jsx("div",{className:"label",children:"Promedio por Venta"}),e.jsx("div",{className:"value",children:n(D>0?V/D:0)})]})]}),Z?e.jsxs(pe,{children:[e.jsx(T,{})," Cargando datos..."]}):w.length===0?e.jsxs(xe,{children:[e.jsx(Fe,{}),e.jsx("p",{children:i==="busqueda"?`No se encontraron resultados para "${h}"`:`No se encontraron ${i==="devoluciones"?"devoluciones":"ventas"} en este rango.`})]}):j?e.jsx(H,{children:w.map(t=>{var s;return e.jsxs(Y,{children:[e.jsxs(g,{children:[e.jsxs("div",{style:{display:"flex",gap:"8px",alignItems:"center"},children:[e.jsxs("span",{style:{fontWeight:700,color:r.info},children:["#",t.id]}),e.jsx(M,{type:t.estado,children:t.estado})]}),e.jsx("div",{className:"price",children:n(t.totalVenta)})]}),e.jsxs(g,{children:[e.jsx("div",{className:"label",children:"Fecha"}),e.jsx("div",{className:"value",children:$(t.fecha)})]}),e.jsxs(g,{children:[e.jsx("div",{className:"label",children:"Cliente"}),e.jsx("div",{className:"value",children:t.clienteNombre||"Público General"})]}),e.jsxs(_e,{children:[e.jsx("div",{className:"label",style:{marginBottom:"4px",display:"block"},children:"Productos"}),(s=t.items)==null?void 0:s.map((c,x)=>{const p=i==="busqueda"&&h&&c.nombre.toLowerCase().includes(h.toLowerCase());return e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.8rem",background:p?"#fef9c3":"transparent",padding:p?"2px 4px":"0",borderRadius:"4px",border:p?"1px dashed #facc15":"none"},children:[e.jsxs("span",{children:[c.nombre," (x",c.quantity,")"]}),e.jsx("span",{style:{fontWeight:600},children:n(c.precio*c.quantity)})]},x)})]}),e.jsxs("div",{style:{fontSize:"0.75rem",color:r.textLight,marginTop:"4px"},children:[e.jsx("strong",{children:"Vendedor:"})," ",t.vendedorNombre||"—"," | ",e.jsx("strong",{children:"Pago:"})," ",ee(t.pagoDetalles)]})]},t.id)})}):e.jsxs(O,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"#"}),e.jsx("th",{children:"Fecha / Hora"}),e.jsx("th",{children:"Estado"}),e.jsx("th",{children:"Cliente"}),e.jsx("th",{style:{width:"30%"},children:"Productos"}),e.jsx("th",{children:"Forma de Pago"}),e.jsx("th",{className:"num",children:"Total"})]})}),e.jsx("tbody",{children:w.map(t=>{const s=ue[t.id],c=t.items||[],x=s?c:c.slice(0,3);return e.jsxs("tr",{children:[e.jsxs("td",{style:{fontWeight:600,color:r.info},children:["#",t.id]}),e.jsx("td",{style:{whiteSpace:"nowrap",fontSize:"0.85rem"},children:$(t.fecha)}),e.jsx("td",{children:e.jsx(M,{type:t.estado,children:t.estado})}),e.jsxs("td",{children:[e.jsx("div",{style:{fontSize:"0.9rem"},children:t.clienteNombre||e.jsx("span",{style:{color:r.textLight},children:"Público Gral."})}),e.jsxs("div",{style:{fontSize:"0.75rem",color:r.textLight},children:["Vendedor: ",t.vendedorNombre||"—"]})]}),e.jsx("td",{children:e.jsxs(We,{children:[x.map((p,q)=>{const k=i==="busqueda"&&h&&p.nombre.toLowerCase().includes(h.toLowerCase());return e.jsxs("div",{className:"item-row",style:{background:k?"#fef9c3":"transparent",padding:k?"2px 4px":"0",borderRadius:"4px"},children:[e.jsx("span",{className:"item-name",children:p.nombre||"—"}),e.jsxs("span",{className:"item-qty",children:["x",p.quantity]}),e.jsx("span",{className:"item-price",children:n(p.precio*p.quantity)})]},q)}),c.length>3&&e.jsx(Ue,{onClick:()=>ve(t.id),children:s?e.jsxs(e.Fragment,{children:[e.jsx(Pe,{})," Menos"]}):e.jsxs(e.Fragment,{children:[e.jsx(De,{})," +",c.length-3," más"]})})]})}),e.jsx("td",{style:{fontSize:"0.82rem",color:r.secondary},children:ee(t.pagoDetalles)}),e.jsx("td",{className:"num",style:{fontWeight:700,fontSize:"1.1rem"},children:n(t.totalVenta)})]},t.id)})})]})]}),i==="producto"&&e.jsx(e.Fragment,{children:l?e.jsxs("div",{children:[e.jsx("div",{style:{marginBottom:"1rem"},children:e.jsxs(_,{onClick:()=>I(null),children:[e.jsx(ae,{})," Volver a lista de productos"]})}),e.jsxs(E,{style:{marginBottom:"1rem"},children:[e.jsx("h2",{children:(te=l.product)==null?void 0:te.nombre}),e.jsxs("div",{style:{display:"flex",gap:"20px",color:r.secondary,flexWrap:"wrap"},children:[e.jsxs("span",{children:["Código: ",e.jsx("strong",{children:(re=l.product)==null?void 0:re.codigo})]}),e.jsxs("span",{children:["Precio: ",e.jsx("strong",{children:n((se=l.product)==null?void 0:se.precio)})]}),e.jsxs("span",{children:["Existencia: ",e.jsx("strong",{children:(oe=l.product)==null?void 0:oe.existencia})]}),e.jsxs("span",{children:["Transacciones: ",e.jsx("strong",{children:((ie=l.history)==null?void 0:ie.length)||0})]})]})]}),ye?e.jsxs(pe,{children:[e.jsx(T,{className:"icon-spin"})," Cargando historial..."]}):!l.history||l.history.length===0?e.jsxs(xe,{children:[e.jsx(Te,{}),e.jsx("p",{children:"Este producto no tiene historial de ventas reciente."})]}):j?e.jsx(H,{children:l.history.map((t,s)=>e.jsxs(Y,{children:[e.jsxs(g,{children:[e.jsxs("div",{className:"value",style:{color:r.info},children:["Doc #",t.idVenta]}),e.jsx(M,{type:t.tipo_venta,children:t.tipo_venta})]}),e.jsxs(g,{children:[e.jsx("div",{className:"label",children:"Fecha"}),e.jsx("div",{className:"value",children:$(t.fecha)})]}),e.jsxs(g,{children:[e.jsx("div",{className:"label",children:"Cliente"}),e.jsx("div",{className:"value",children:t.clienteNombre||"Público"})]}),e.jsxs(g,{children:[e.jsx("div",{className:"label",children:"Cant. x Precio"}),e.jsxs("div",{className:"value",children:[t.cantidad," x ",n(t.precioUnitario)]})]}),e.jsxs(g,{children:[e.jsx("div",{className:"label",children:"Subtotal"}),e.jsx("div",{className:"price",children:n(t.cantidad*t.precioUnitario)})]})]},s))}):e.jsxs(O,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Fecha"}),e.jsx("th",{children:"Doc"}),e.jsx("th",{children:"Cliente"}),e.jsx("th",{children:"Tipo"}),e.jsx("th",{className:"center",children:"Cant."}),e.jsx("th",{className:"num",children:"Precio"}),e.jsx("th",{className:"num",children:"Total"})]})}),e.jsx("tbody",{children:l.history.map((t,s)=>e.jsxs("tr",{children:[e.jsx("td",{children:$(t.fecha)}),e.jsxs("td",{children:["#",t.idVenta]}),e.jsx("td",{children:t.clienteNombre||"Público"}),e.jsx("td",{children:e.jsx(M,{type:t.tipo_venta,children:t.tipo_venta})}),e.jsx("td",{className:"center",style:{fontWeight:700},children:t.cantidad}),e.jsx("td",{className:"num",children:n(t.precioUnitario)}),e.jsx("td",{className:"num",children:n(t.cantidad*t.precioUnitario)})]},s))})]})]}):e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{marginBottom:"1.5rem",display:"flex",gap:"10px"},children:e.jsxs("div",{style:{position:"relative",flex:1,maxWidth:j?"100%":"600px"},children:[e.jsx(W,{style:{position:"absolute",left:"12px",top:"14px",color:r.textLight}}),e.jsx("input",{type:"text",placeholder:"Filtrar por nombre o código...",value:L,onChange:t=>be(t.target.value),autoFocus:!0,style:{width:"100%",padding:"12px 14px 12px 40px",borderRadius:"8px",border:`1px solid ${r.border}`,fontSize:"1rem"}})]})}),j?e.jsx(H,{children:S.slice(0,50).map(t=>e.jsxs(Y,{onClick:()=>X(t),style:{cursor:"pointer"},children:[e.jsxs(g,{children:[e.jsx("div",{className:"value",style:{color:r.info},children:t.codigo}),e.jsx("div",{className:"price",children:n(t.precio)})]}),e.jsx("div",{style:{fontSize:"0.95rem",fontWeight:700},children:t.nombre}),e.jsxs(g,{children:[e.jsx("div",{className:"label",children:"Stock"}),e.jsx("div",{className:"value",children:e.jsx("span",{style:{padding:"2px 8px",borderRadius:"4px",fontWeight:600,fontSize:"0.8rem",background:t.existencia>0?"#dcfce7":"#fee2e2",color:t.existencia>0?"#166534":"#991b1b"},children:t.existencia})})]})]},t.id_producto))}):e.jsxs(O,{clickable:!0,children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Código"}),e.jsx("th",{children:"Nombre"}),e.jsx("th",{className:"center",children:"Existencia"}),e.jsx("th",{className:"num",children:"Precio"})]})}),e.jsxs("tbody",{children:[S.slice(0,100).map(t=>e.jsxs("tr",{onClick:()=>X(t),children:[e.jsx("td",{style:{fontWeight:600,color:r.primary},children:t.codigo}),e.jsx("td",{children:t.nombre}),e.jsx("td",{className:"center",children:e.jsx("span",{style:{padding:"2px 8px",borderRadius:"4px",fontWeight:600,fontSize:"0.8rem",background:t.existencia>0?"#dcfce7":"#fee2e2",color:t.existencia>0?"#166534":"#991b1b"},children:t.existencia})}),e.jsx("td",{className:"num",children:n(t.precio)})]},t.id_producto)),S.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:"4",className:"center",style:{padding:"2rem"},children:"No se encontraron productos."})})]})]}),S.length>(j?50:100)&&e.jsxs("div",{style:{textAlign:"center",marginTop:"1rem",color:r.textLight,fontSize:"0.9rem"},children:["Mostrando ",j?50:100," de ",S.length," productos. Refina tu búsqueda."]})]})})]})}export{Je as default};
