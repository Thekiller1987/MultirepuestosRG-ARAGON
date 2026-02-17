import{r as c,j as e,A as Q,C as O,O as L,aC as Z,x as ie,s as o,m as $,u as ne,R as ae,U as se,V as le,X as de,Y as ce,h as pe,n as B,$ as xe,a5 as me,D as ue,ak as w,a9 as he}from"./vendor-BJZlzDLx.js";import{a as fe,u as E,P as ge,Q as be}from"./index-eefq-jxX.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-BoQlG7Vl.js";const we=()=>new URL("/icons/logo.png",window.location.origin).toString(),ye=o($.div)`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1100;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
`,je=o($.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex; flex-direction: column;
  overflow: hidden;
  max-width: 520px;
  width: 96%;
  padding: 1.2rem;
  max-height: 90vh;
  overflow-y: auto;
`,N=o.button`
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  display: flex; align-items: center; gap: 0.5rem;
  transition: all 0.2s;
  font-size: 0.9rem;
  
  ${u=>u.$cancel?`
    background: #fee2e2; color: #b91c1c;
    &:hover { background: #fecaca; }
  `:`
    background: #0f172a; color: white;
    &:hover { background: #334155; transform: translateY(-1px); }
  `}
`,Ce=o.div`
  font-family: 'Consolas','Courier New',monospace;
  color: #000;
  background: #fff;
  margin: 0 auto;
  padding: 12px 10px;
  box-shadow: 0 0 10px rgba(0,0,0,.08);
  border: 1px solid #eee;
  border-radius: 8px;
  width: 310px; /* Previsualización por defecto tipo 80mm */

  &.compact { padding: 8px 6px; }

  .brand {
    text-align: center;
    border-bottom: 1px dashed #333;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  .brand h1 {
    margin: 6px 0 2px;
    font-size: 1.35rem;
    font-weight: 700;
    color: #1e3a8a;
    line-height: 1.25;
  }
  .brand small {
    color: #555;
    display: block;
    margin: 3px 0;
    line-height: 1.35;
  }

  .meta {
    font-size: .9rem;
    margin-bottom: 12px;
    border-bottom: 1px dashed #ccc;
    padding-bottom: 8px;
  }
  .meta p {
    margin: 2px 0;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: flex-start;
  }
  .meta-label { font-weight: 700; }
  .meta-value { text-align: right; max-width: 65%; }

  table.items { width: 100%; border-collapse: collapse; font-size: .85rem; table-layout: fixed; }
  table.items th, table.items td { padding: 4px 2px; vertical-align: top; word-wrap: break-word; }
  table.items th {
    border-bottom: 2px solid #333;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.75rem;
    color: #1e3a8a;
    text-align: left;
  }
  .text-right { text-align: right; }
  .col-qty { width: 12%; text-align: center; }
  .col-code { width: 22%; } /* Columna extra para Código */
  .col-price { width: 25%; text-align: right; } /* Mostrar Precio unitario */

  .totals { border-top: 2px solid #333; padding-top: 6px; margin-top: 12px; }
  .grand-total { font-size: 1.1rem; font-weight: 900; border-top: 2px solid #333; padding-top: 5px; display: flex; justify-content: space-between; margin-top: 5px; }

  .thanks {
    text-align: center; font-size: .85rem; border-top: 1px dashed #333;
    padding-top: 10px; margin-top: 12px; color: #444; line-height: 1.4;
  }
  
  .tag {
    display: inline-block; padding: 4px 8px; border-radius: 4px; 
    background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd;
    font-weight: 700; font-size: 0.8rem; margin-top: 5px;
  }

  /* Clases para modo impresión dinámica (se inyectan en ventana nueva) */
  &.print-a4 { width: 190mm !important; font-size: 10pt !important; }
  &.print-80 { width: 80mm !important; font-size: 8pt !important; }
`,ve=o.img`
  width: 120px;
  max-width: 160px;
  height: auto;
  display: block;
  margin: 0 auto 6px;
`,ke=o.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: .75rem;
`,_e=({isOpen:u,onClose:g,transaction:n})=>{var y;const{settings:r}=fe(),f={name:(r==null?void 0:r.empresa_nombre)||"Multirepuestos RG",ruc:(r==null?void 0:r.empresa_ruc)||"1211812770001E",phone:(r==null?void 0:r.empresa_telefono)||"84031936 / 84058142",address:(r==null?void 0:r.empresa_direccion)||"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",slogan:(r==null?void 0:r.empresa_eslogan)||"Repuestos de confianza al mejor precio — calidad que mantiene tu motor en marcha.",logo:(r==null?void 0:r.empresa_logo_url)||new URL("/icons/logo.png",window.location.origin).toString()};if(!u||!n)return null;const p=i=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(i||0)),b=c.useCallback((i="80")=>{const a=document.getElementById("print-wrapper-outflow");if(!a)return;const j=a.outerHTML,x=`
      @page {
        size: ${i==="A4"?"A4 portrait":"80mm auto"};
        margin: ${i==="A4"?"15mm":"0"};
      }
      body { margin: 0; padding: 0; font-family: ${i==="A4"?"'Inter', Helvetica, Arial, sans-serif":"'Consolas', monospace"}; }
      
      #print-wrapper-outflow {
        width: ${i==="A4"?"100%":"80mm"} !important;
        max-width: ${i==="A4"?"none":"80mm"} !important;
        margin: 0 auto !important;
        border: none !important;
        box-shadow: none !important;
        font-size: ${i==="A4"?"10pt":"8pt"} !important;
        padding: ${i==="A4"?"0":"5px"} !important;
      }

      /* A4 Grid / Cuadrícula Styling */
      /* A4 Grid / Cuadrícula Styling */
      ${i==="A4"?`
        #print-wrapper-outflow .brand { 
          text-align: left !important; 
          border-bottom: 3px solid #1e293b !important; 
          padding-bottom: 20px !important; 
          margin-bottom: 30px !important; 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
        }
        #print-wrapper-outflow .brand img { width: 140px !important; margin: 0 !important; }
        #print-wrapper-outflow .brand-info { text-align: right; }
        #print-wrapper-outflow .brand h1 { color: #1e293b; font-size: 24pt !important; margin-bottom: 5px; letter-spacing: -0.5px; }
        #print-wrapper-outflow .brand small { color: #64748b; font-size: 10pt; display: block; margin-bottom: 2px; }

        #print-wrapper-outflow .meta { 
            display: flex; 
            justify-content: space-between;
            background: #f8fafc;
            border: 1px solid #e2e8f0; 
            padding: 15px 20px; 
            margin-bottom: 30px; 
            border-radius: 6px; 
        }
        #print-wrapper-outflow .meta p { margin: 5px 0; font-size: 10pt; color: #334155; }
        #print-wrapper-outflow .meta-label { font-weight: 600; color: #475569; width: 120px; display: inline-block; }
        #print-wrapper-outflow .meta-value { font-weight: 500; color: #0f172a; }

        #print-wrapper-outflow table.items { border-collapse: collapse; width: 100%; margin-bottom: 30px; }
        #print-wrapper-outflow table.items th { 
            background: #f1f5f9; 
            color: #334155;
            border-bottom: 2px solid #cbd5e1; 
            padding: 12px 8px; 
            text-align: left; 
            font-weight: 700; 
            font-size: 9pt;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        #print-wrapper-outflow table.items td { 
            border-bottom: 1px solid #e2e8f0; 
            padding: 10px 8px; 
            font-size: 10pt;
            color: #334155;
        }
        #print-wrapper-outflow table.items tr:nth-child(even) { background-color: #f8fafc; }
        #print-wrapper-outflow .col-qty { text-align: center; width: 80px; font-weight: 600; }
        #print-wrapper-outflow .col-code { width: 120px; font-family: 'Roboto Mono', monospace; font-size: 9pt; }
        #print-wrapper-outflow .text-right { text-align: right; }
        
        #print-wrapper-outflow .totals { border-top: 2px solid #e2e8f0; padding-top: 20px; }
        #print-wrapper-outflow .grand-total-box { 
            background: #f8fafc; 
            border: 1px solid #e2e8f0; 
            border-radius: 8px;
            padding: 15px 20px; 
            width: 40%; 
            margin-left: auto; 
        }
        #print-wrapper-outflow .grand-total { 
            border-top: 2px solid #cbd5e1; 
            margin-top: 10px; 
            padding-top: 10px; 
            font-size: 14pt;
            color: #0f172a;
        }

        #print-wrapper-outflow .thanks { 
            position: fixed; 
            bottom: 30px; 
            left: 0; 
            right: 0; 
            border: none;
        }
      `:""}

      .brand h1 { font-size: ${i==="A4"?"22pt":"12pt"} !important; margin: 0; }
      .brand img { width: ${i==="A4"?"180px":"150px"} !important; }
      
      /* Ocultar scrollbars */
      ::-webkit-scrollbar { display: none; }
    `,m=window.open("","_blank",`width=${i==="A4"?1e3:400},height=700`);m&&(m.document.write(`
      <html>
        <head>
          <title>Imprimir Comprobante - ${i}</title>
          <style>${x}</style>
        </head>
        <body>${j}</body>
      </html>
    `),m.document.close(),m.onload=()=>{setTimeout(()=>{m.focus(),m.print()},500)})},[]);return c.useEffect(()=>{},[u,b]),e.jsx(Q,{children:u&&e.jsx(ye,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(je,{initial:{y:50,opacity:0,scale:.95},animate:{y:0,opacity:1,scale:1},exit:{y:50,opacity:0,scale:.95},transition:{type:"spring",stiffness:300,damping:30},children:[e.jsxs(ke,{className:"no-print",children:[e.jsxs("h3",{style:{margin:0,display:"flex",alignItems:"center",gap:"8px"},children:[n.isQuote?e.jsx(O,{}):e.jsx(L,{}),n.isQuote?"Cotización Generada":"Salida Exitosa"]}),e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.jsxs(N,{onClick:()=>b("80"),title:"Imprimir Ticket 80mm",children:[e.jsx(Z,{})," 80mm"]}),e.jsxs(N,{onClick:()=>b("A4"),title:"Imprimir Carta A4",children:[e.jsx(O,{})," A4"]}),e.jsx(N,{$cancel:!0,onClick:g,children:e.jsx(ie,{})})]})]}),e.jsx("div",{style:{display:"flex",justifyContent:"center",background:"#f8fafc",padding:"10px",borderRadius:"8px"},children:e.jsxs(Ce,{id:"print-wrapper-outflow",children:[e.jsxs("div",{className:"brand",children:[e.jsx(ve,{src:we(),alt:"Logo",onError:i=>i.target.style.display="none"}),e.jsxs("div",{className:"brand-info",children:[e.jsx("h1",{children:f.name}),e.jsx("small",{children:f.slogan}),e.jsxs("small",{children:["RUC: ",f.ruc]}),e.jsx("small",{children:f.address}),e.jsx("div",{className:"tag",children:n.isQuote?"COTIZACIÓN":"COMPROBANTE DE SALIDA"})]})]}),e.jsxs("div",{className:"meta",children:[e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr",gap:"4px"},children:[e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Fecha:"})," ",e.jsx("span",{className:"meta-value",children:new Date(n.fecha).toLocaleString()})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:n.isQuote?"N° Cotización:":"N° Comprobante:"})," ",e.jsx("span",{className:"meta-value",children:n.id})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr",gap:"4px"},children:[e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:n.isQuote?"Cliente:":"Motivo/Ref:"})," ",e.jsx("span",{className:"meta-value",children:((y=n.clienteNombre)==null?void 0:y.replace("MOTIVO: ",""))||n.motivo})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:n.isQuote?"Cotizado por:":"Autorizado por:"})," ",e.jsx("span",{className:"meta-value",children:n.usuarioNombre})]})]})]}),e.jsxs("table",{className:"items",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"col-qty",children:"Cant"}),e.jsx("th",{className:"col-code",children:"Cód."}),e.jsx("th",{children:"Desc."}),!n.isQuote&&e.jsx("th",{className:"text-right",children:"Costo U."}),e.jsx("th",{className:"text-right",children:"P. Venta"}),e.jsx("th",{className:"text-right",children:"Total"})]})}),e.jsx("tbody",{children:n.items.map((i,a)=>e.jsxs("tr",{children:[e.jsx("td",{className:"col-qty",children:i.quantity}),e.jsx("td",{className:"col-code",children:i.codigo||"-"}),e.jsx("td",{children:i.nombre}),!n.isQuote&&e.jsx("td",{className:"text-right",children:p(i.cost)}),e.jsx("td",{className:"text-right",children:p(i.unit)}),e.jsx("td",{className:"text-right",children:p(i.unit*i.quantity)})]},a))})]}),e.jsxs("div",{className:"totals",children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[e.jsx("span",{children:"Items Totales:"}),e.jsx("span",{children:n.totalItems})]}),e.jsxs("div",{className:"grand-total-box",children:[!n.isQuote&&e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",marginBottom:"8px"},children:[e.jsx("span",{children:" COSTO TOTAL:"}),e.jsxs("span",{children:["C$ ",p(n.totalCosto)]})]}),e.jsxs("div",{className:"grand-total",style:{borderTop:n.isQuote?"none":"1px dashed #333"},children:[e.jsx("span",{children:n.isQuote?"TOTAL COTIZADO:":"TOTAL VALORIZADO:"}),e.jsxs("span",{children:["C$ ",p(n.totalVenta)]})]})]})]}),e.jsxs("div",{className:"thanks",children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-around",marginTop:"30px"},children:[e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("p",{children:"__________________________"}),e.jsx("p",{children:"Entregado Por"})]}),e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("p",{children:"__________________________"}),e.jsx("p",{children:"Recibido Por"})]})]}),e.jsx("p",{style:{marginTop:"20px",whiteSpace:"pre-line"},children:(r==null?void 0:r.ticket_transfer_footer)||"Salida de Inventario autorizada."})]})]})})]})})})},Se=o($.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
  background: rgba(15, 23, 42, 0.6); z-index: 50; 
  display: flex; align-items: center; justify-content: center; padding: 1rem;
  backdrop-filter: blur(4px);
`,Ae=o.div`
  background: white; width: 100%; max-width: 450px; 
  border-radius: 20px; padding: 2rem; 
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`,Ie=o.h2` margin-top: 0; color: #1e293b; margin-bottom: 1rem; font-size: 1.4rem; display: flex; align-items: center; gap: 10px; `,ze=o.div` display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; `,Te=o.button` background: white; color: #64748b; border: 1px solid #cbd5e1; padding: 10px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; `,Ne=o.button` background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; `,Oe=({open:u,onCancel:g,onConfirm:n,title:r,message:f})=>u?e.jsx(Se,{onClick:g,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(Ae,{onClick:p=>p.stopPropagation(),children:[e.jsxs(Ie,{children:[e.jsx(he,{color:"#ef4444"})," ",r]}),e.jsx("p",{style:{color:"#4b5563",lineHeight:1.5},children:f}),e.jsxs(ze,{children:[e.jsx(Te,{onClick:g,children:"Cancelar"}),e.jsx(Ne,{onClick:n,children:"Confirmar Salida"})]})]})}):null,Le=o.div`
  display: flex; flex-direction: column; height: 100vh; background-color: #f3f4f6;
  font-family: 'Inter', sans-serif;
`,$e=o.header`
  background: white; padding: 1rem 1.5rem; display: flex; align-items: center; justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05); z-index: 10;
`,De=o.h1`
  font-size: 1.5rem; font-weight: 800; color: #111827; display: flex; align-items: center; gap: 10px; margin: 0;
`,Re=o.div`
  display: flex; flex: 1; overflow: hidden; padding: 1rem; gap: 1rem;
  @media(max-width: 768px) { flex-direction: column; }
`,W=o.div`
  background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  display: flex; flex-direction: column; overflow: hidden;
`,Pe=o(W)`
  flex: 1.5; padding: 1rem;
`,Fe=o(W)`
  flex: 1; min-width: 350px; background: #fff; border-left: 1px solid #e5e7eb;
`,Me=o.div`
  position: relative; margin-bottom: 1rem;
`,Be=o.input`
  width: 100%; padding: 12px 14px 12px 45px; border: 2px solid #e5e7eb; border-radius: 8px;
  font-size: 1rem; outline: none; transition: all 0.2s;
  &:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
`,Ee=o.div`
  flex: 1; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; padding-bottom: 10px;
`,He=o.div`
  border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; cursor: pointer; transition: all 0.2s;
  background: white; display: flex; flex-direction: column; justify-content: space-between; height: 120px;
  &:hover { border-color: #3b82f6; transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
`,Qe=o.div`
  flex: 1; overflow-y: auto; padding: 10px;
`,Ze=o.div`
  display: flex; justify-content: space-between; align-items: center; padding: 10px;
  background: #f9fafb; border-bottom: 1px solid #e5e7eb; margin-bottom: 5px; border-radius: 6px;
`,We=o.textarea`
  width: 100%; padding: 10px; border: 2px solid #e5e7eb; border-radius: 8px; margin: 10px 0;
  resize: none; font-family: inherit;
  &:focus { border-color: #3b82f6; outline: none; }
`,qe=o.button`
  width: 100%; padding: 12px; background: #ef4444; color: white; font-weight: bold; border: none; border-radius: 8px;
  cursor: pointer; font-size: 1rem; transition: background 0.2s;
  &:hover { background: #dc2626; }
  &:disabled { background: #fee2e2; cursor: not-allowed; }
`,Ge=o.div`
  display: flex; background: #e2e8f0; border-radius: 10px; padding: 4px; margin-bottom: 1rem;
`,H=o.button`
  flex: 1; padding: 8px; border-radius: 7px; border: none; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
  ${u=>u.$active?"background: white; color: #1e293b; shadow: 0 2px 4px rgba(0,0,0,0.1);":"background: transparent; color: #64748b;"}
`,Ue=o.div`
  background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px; margin-bottom: 1rem; position: relative;
`,Ve=o.input`
  width: 100%; border: none; outline: none; font-size: 0.9rem; padding: 4px; border-bottom: 1px solid #f1f5f9;
`,Ye=o.div`
  position: absolute; top: 100%; left: 0; width: 100%; background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); z-index: 20; max-height: 200px; overflow-y: auto;
`,Je=o.div`
  padding: 8px 12px; cursor: pointer; &:hover { background: #f8fafc; } border-bottom: 1px solid #f1f5f9;
`,Xe=o.div`
  padding: 12px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;
  &:hover { background: #f8fafc; }
`,rt=()=>{const{user:u,products:g,refreshProducts:n}=E();ne();const[r,f]=c.useState(""),[p,b]=c.useState([]),[y,i]=c.useState(""),[a,j]=c.useState("SALIDA"),[x,m]=c.useState(null),[C,v]=c.useState(""),[q,k]=c.useState(!1),[G,_]=c.useState(!1),[D,U]=c.useState([]),[S,A]=c.useState(null),[R,P]=c.useState(!1),[F,I]=c.useState(!1),{clients:z=[]}=E(),V=c.useMemo(()=>C.trim()?z.filter(t=>t.nombre.toLowerCase().includes(C.toLowerCase())).slice(0,10):z.slice(0,10),[C,z]),M=c.useRef(null),Y=ae.useMemo(()=>{if(!r.trim())return g.slice(0,24);const t=r.toLowerCase();return g.filter(l=>{var s,d;return((s=l.nombre)==null?void 0:s.toLowerCase().includes(t))||((d=l.codigo)==null?void 0:d.toString().toLowerCase().includes(t))}).slice(0,50)},[r,g]),J=t=>{var l;b(s=>{const d=s.find(h=>h.id_producto===t.id_producto);return d?a==="SALIDA"&&d.cantidad>=t.existencia?(w.error("No hay suficiente stock."),s):s.map(h=>h.id_producto===t.id_producto?{...h,cantidad:h.cantidad+1}:h):a==="SALIDA"&&t.existencia<=0?(w.error("Producto sin existencia."),s):(w.success(`${t.nombre} añadido`),[...s,{...t,cantidad:1,unit:t.precio,precio_modificado:t.precio}])}),f(""),(l=M.current)==null||l.focus()},T=(t,l)=>{b(s=>s.map(d=>{if(d.id_producto===t){const h=d.cantidad+l;return h<=0?null:a==="SALIDA"&&h>d.existencia?d:{...d,cantidad:h}}return d}).filter(Boolean))},X=(t,l)=>{b(s=>s.map(d=>d.id_producto===t?{...d,precio_modificado:l}:d))},K=async()=>{if(a==="SALIDA"&&!y.trim())return w.error("Debe ingresar un motivo para la salida.");if(a==="COTIZACION"&&!x)return w.error("Seleccione un cliente para la cotización.");if(p.length===0)return w.error("El carrito está vacío.");I(!0)},ee=async()=>{var t,l;I(!1),P(!0);try{const s=localStorage.getItem("token"),d=await ge({motivo:y,items:p,tipo:a,id_cliente:x==null?void 0:x.id_cliente,cliente_nombre:x==null?void 0:x.nombre},s);b([]),i(""),m(null),v(""),A(d.ticket),w.success(a==="SALIDA"?"Salida procesada correctamente":"Cotización generada"),n()}catch(s){console.error(s),w.error(((l=(t=s.response)==null?void 0:t.data)==null?void 0:l.msg)||"Error al procesar salida.")}finally{P(!1)}},te=async()=>{try{const t=localStorage.getItem("token"),l=await be(t);U(l)}catch(t){console.error(t)}},oe=()=>{_(!0),te()},re=t=>{const l={id:t.tipo==="COTIZACION"?`COT-${t.id}`:`TR-${t.id}`,outflowId:t.id,type:t.tipo==="COTIZACION"?"quote":"outflow",tipo:t.tipo,fecha:t.fecha,usuarioNombre:t.usuario_nombre,clienteNombre:t.tipo==="COTIZACION"?t.cliente_nombre||"Cliente General":`MOTIVO: ${t.motivo}`,items:t.items.map(s=>({...s,total:s.quantity*s.unit})),totalVenta:t.total_venta,totalCosto:t.total_costo,isOutflow:!0,isQuote:t.tipo==="COTIZACION"};A(l)};return e.jsxs(Le,{children:[e.jsxs($e,{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:15},children:[e.jsx(se,{to:"/dashboard",style:{color:"#6b7280",fontSize:"1.2rem"},children:e.jsx(le,{})}),e.jsxs(De,{children:[e.jsx(L,{style:{color:"#ef4444"}})," Traslados / Salidas"]})]}),e.jsxs("button",{onClick:oe,style:{display:"flex",alignItems:"center",gap:8,padding:"8px 16px",borderRadius:8,border:"1px solid #e5e7eb",background:"white",cursor:"pointer"},children:[e.jsx(de,{})," Historial"]})]}),e.jsxs(Re,{children:[e.jsxs(Pe,{children:[e.jsxs(Me,{children:[e.jsx(ce,{style:{position:"absolute",left:15,top:15,color:"#9ca3af"}}),e.jsx(Be,{ref:M,placeholder:"Buscar producto por nombre o código...",value:r,onChange:t=>f(t.target.value),autoFocus:!0})]}),e.jsx(Ee,{children:Y.map(t=>e.jsxs(He,{onClick:()=>J(t),children:[e.jsx("div",{style:{fontWeight:"bold",fontSize:"0.9rem",marginBottom:5},children:t.nombre}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",color:"#6b7280"},children:[e.jsx("span",{children:t.codigo}),e.jsxs("span",{style:{color:t.existencia>0?"#10b981":"#ef4444",fontWeight:"bold"},children:["Stock: ",t.existencia]})]}),e.jsxs("div",{style:{marginTop:"auto",textAlign:"right",fontWeight:"bold",fontSize:"0.9rem"},children:["C$ ",Number(t.precio).toFixed(2)]})]},t.id_producto))})]}),e.jsxs(Fe,{children:[e.jsxs("div",{style:{padding:"1rem",borderBottom:"1px solid #eee"},children:[e.jsxs(Ge,{children:[e.jsxs(H,{$active:a==="SALIDA",onClick:()=>j("SALIDA"),children:[e.jsx(L,{size:12,style:{marginRight:5}})," Salida"]}),e.jsxs(H,{$active:a==="COTIZACION",onClick:()=>j("COTIZACION"),children:[e.jsx(O,{size:12,style:{marginRight:5}})," Cotización"]})]}),a==="COTIZACION"&&e.jsxs(Ue,{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:5},children:[e.jsx(pe,{size:14,color:"#64748b"}),e.jsx("span",{style:{fontSize:"0.85rem",fontWeight:600},children:"Cliente:"})]}),e.jsx(Ve,{placeholder:"Buscar cliente...",value:x?x.nombre:C,onChange:t=>{v(t.target.value),m(null),k(!0)},onFocus:()=>k(!0)}),x&&e.jsx("button",{onClick:()=>{m(null),v("")},style:{position:"absolute",right:10,top:32,background:"none",border:"none",color:"#94a3b8",cursor:"pointer"},children:e.jsx(B,{size:12})}),q&&e.jsx(Ye,{children:V.map(t=>e.jsx(Je,{onClick:()=>{m(t),v(t.nombre),k(!1)},children:t.nombre},t.id_cliente))})]}),e.jsxs("h2",{style:{margin:0,fontSize:"1.1rem"},children:["Carrito de ",a==="SALIDA"?"Salida":"Cotización"]}),e.jsxs("div",{style:{fontSize:"0.9rem",color:"#6b7280"},children:[p.length," items"]})]}),e.jsx(Qe,{children:p.length===0?e.jsxs("div",{style:{textAlign:"center",color:"#9ca3af",marginTop:50},children:[e.jsx(xe,{size:40,style:{marginBottom:10}}),e.jsx("p",{children:"Escanea o selecciona productos"})]}):p.map(t=>e.jsxs(Ze,{children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontWeight:"bold",fontSize:"0.9rem"},children:t.nombre}),e.jsx("div",{style:{fontSize:"0.75rem",color:"#6b7280"},children:t.codigo}),a==="COTIZACION"&&e.jsxs("div",{style:{marginTop:5,display:"flex",alignItems:"center",gap:5},children:[e.jsx("span",{style:{fontSize:"0.75rem",color:"#64748b"},children:"C$"}),e.jsx("input",{type:"number",value:t.precio_modificado,onChange:l=>X(t.id_producto,l.target.value),style:{width:80,padding:"2px 5px",fontSize:"0.85rem",border:"1px solid #e2e8f0",borderRadius:4}})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[e.jsx("button",{onClick:()=>T(t.id_producto,-1),style:{width:25,height:25,borderRadius:"50%",border:"1px solid #ddd",background:"white",cursor:"pointer"},children:"-"}),e.jsx("span",{style:{fontWeight:"bold",minWidth:20,textAlign:"center"},children:t.cantidad}),e.jsx("button",{onClick:()=>T(t.id_producto,1),style:{width:25,height:25,borderRadius:"50%",border:"1px solid #ddd",background:"white",cursor:"pointer"},children:"+"}),e.jsx("button",{onClick:()=>T(t.id_producto,-9999),style:{color:"#ef4444",background:"none",border:"none",cursor:"pointer",marginLeft:5},children:e.jsx(me,{})})]})]},t.id_producto))}),e.jsxs("div",{style:{padding:"1rem",background:"#f8fafc",borderTop:"1px solid #e5e7eb"},children:[a==="SALIDA"&&e.jsxs(e.Fragment,{children:[e.jsx("label",{style:{fontWeight:"bold",fontSize:"0.9rem",color:"#374151"},children:"Motivo / Razón:"}),e.jsx(We,{rows:"2",placeholder:"Ej: Merma, Uso Interno, Traslado a Bodega B...",value:y,onChange:t=>i(t.target.value)})]}),e.jsx(qe,{disabled:p.length===0||R,onClick:K,children:R?"Procesando...":e.jsxs(e.Fragment,{children:[e.jsx(ue,{})," ",a==="SALIDA"?"Procesar Salida":"Generar Cotización"]})})]})]})]}),G&&e.jsx("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50},onClick:()=>_(!1),children:e.jsxs("div",{style:{background:"white",width:"90%",maxWidth:600,maxHeight:"80vh",borderRadius:12,padding:20,display:"flex",flexDirection:"column"},onClick:t=>t.stopPropagation(),children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:15},children:[e.jsx("h2",{style:{margin:0},children:"Historial de Salidas"}),e.jsx("button",{onClick:()=>_(!1),style:{background:"none",border:"none",fontSize:"1.2rem",cursor:"pointer"},children:e.jsx(B,{})})]}),e.jsxs("div",{style:{overflowY:"auto",flex:1},children:[D.length===0&&e.jsx("p",{style:{textAlign:"center",padding:20},children:"No hay registros."}),D.map(t=>e.jsxs(Xe,{children:[e.jsxs("div",{children:[e.jsxs("div",{style:{fontWeight:"bold"},children:[t.tipo==="COTIZACION"?"COT":"TR","-#",t.id," - ",new Date(t.fecha).toLocaleString()]}),e.jsx("div",{style:{fontSize:"0.85rem",color:"#6b7280"},children:t.tipo==="COTIZACION"?`Cliente: ${t.cliente_nombre||"General"}`:`Motivo: ${t.motivo}`}),e.jsxs("div",{style:{fontSize:"0.8rem",color:"#6b7280"},children:["Por: ",t.usuario_nombre," | ",t.total_items," items"]})]}),e.jsxs("button",{onClick:()=>re(t),style:{padding:"6px 12px",background:"#e0f2fe",color:"#0284c7",border:"none",borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center",gap:5},children:[e.jsx(Z,{})," Imprimir"]})]},t.id))]})]})}),S&&e.jsx(_e,{isOpen:!!S,transaction:S,onClose:()=>A(null)}),e.jsx(Q,{children:F&&e.jsx(Oe,{open:F,onCancel:()=>I(!1),onConfirm:ee,title:a==="SALIDA"?"Confirmar Salida":"Confirmar Cotización",message:a==="SALIDA"?"¿Estás seguro de que deseas procesar esta salida? El inventario se descontará inmediatamente.":"¿Estás seguro de que deseas generar esta cotización? No afectará el inventario."})})]})};export{rt as default};
