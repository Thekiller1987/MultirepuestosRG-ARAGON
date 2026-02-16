import{r as x,j as e,y as v,b9 as F,ba as E,bb as P,a2 as z,aI as L,C as T,az as D,D as G,s as r}from"./vendor-BHEUBfle.js";import{a as I,u as R,c as A,b as H}from"./index-CwDrMf7i.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-BzGOTXeo.js";const M=r.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`,U=r.h2`
  color: #1e293b;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 10px;
`,V=r.form`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`,C=r.h3`
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #334155;
  font-size: 1.1rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 8px;
`,o=r.div`
  margin-bottom: 1.5rem;
`,t=r.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 8px;
`,l=r.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`,m=r.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`,B=r.button`
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
  &:hover { background: #2563eb; }
  &:disabled { background: #94a3b8; cursor: not-allowed; }
`,$=r.div`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 6px;
  background: ${n=>n.error?"#fee2e2":"#dcfce7"};
  color: ${n=>n.error?"#991b1b":"#166534"};
  display: flex;
  align-items: center;
  gap: 8px;
`,q=r.img`
    max-width: 150px;
    border: 1px solid #ddd;
    padding: 5px;
    border-radius: 4px;
    margin-top: 10px;
    display: block;
`,Q=()=>{const{settings:n,refreshSettings:k}=I(),{token:f}=R(),[a,g]=x.useState({}),[j,_]=x.useState(!1),[u,i]=x.useState(null),[h,y]=x.useState(!1);x.useEffect(()=>{n&&g(n)},[n]);const s=d=>{const{name:c,value:p}=d.target;g(b=>({...b,[c]:p}))},w=async d=>{const c=d.target.files[0];if(c){y(!0),i(null);try{const p=await H(f,c);g(b=>({...b,empresa_logo_url:p})),i({type:"success",text:"Logo subido correctamente. Recuerda Guardar Cambios."})}catch(p){console.error(p),i({type:"error",text:"Error al subir el logo."})}finally{y(!1)}}},S=async d=>{d.preventDefault(),_(!0),i(null);try{await A(f,a),await k(),i({type:"success",text:"Configuración actualizada correctamente"})}catch{i({type:"error",text:"Error al actualizar configuración"})}finally{_(!1)}};return e.jsxs(M,{children:[e.jsxs(U,{children:[e.jsx(v,{})," Configuración de Empresa"]}),e.jsxs(V,{onSubmit:S,children:[e.jsx(C,{children:"Datos Generales"}),e.jsxs(o,{children:[e.jsxs(t,{children:[e.jsx(v,{})," Nombre de la Empresa"]}),e.jsx(l,{name:"empresa_nombre",value:a.empresa_nombre||"",onChange:s,required:!0})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px"},children:[e.jsxs(o,{children:[e.jsxs(t,{children:[e.jsx(F,{})," RUC"]}),e.jsx(l,{name:"empresa_ruc",value:a.empresa_ruc||"",onChange:s})]}),e.jsxs(o,{children:[e.jsxs(t,{children:[e.jsx(E,{})," Teléfono(s)"]}),e.jsx(l,{name:"empresa_telefono",value:a.empresa_telefono||"",onChange:s})]})]}),e.jsxs(o,{children:[e.jsxs(t,{children:[e.jsx(P,{})," Dirección"]}),e.jsx(m,{name:"empresa_direccion",value:a.empresa_direccion||"",onChange:s,style:{minHeight:"80px"}})]}),e.jsxs(o,{children:[e.jsx(t,{children:"Eslogan"}),e.jsx(l,{name:"empresa_eslogan",value:a.empresa_eslogan||"",onChange:s})]}),e.jsxs(o,{children:[e.jsxs(t,{children:[e.jsx(z,{})," Logo del Ticket"]}),e.jsxs("div",{style:{display:"flex",gap:"10px",alignItems:"center"},children:[e.jsx(l,{type:"file",accept:"image/*",onChange:w,disabled:h}),h&&e.jsx("span",{children:"Subiendo..."})]}),a.empresa_logo_url&&e.jsx(q,{src:a.empresa_logo_url,alt:"Vista previa logo"}),e.jsx(l,{style:{marginTop:"10px"},name:"empresa_logo_url",value:a.empresa_logo_url||"",onChange:s,placeholder:"O ingresa una URL manual (https://...)"})]}),e.jsx(C,{children:"Personalización de Tickets"}),e.jsxs(o,{children:[e.jsxs(t,{children:[e.jsx(L,{})," Pie de Página (Ventas)"]}),e.jsx(m,{name:"ticket_sales_footer",value:a.ticket_sales_footer||"",onChange:s,placeholder:"Ej: ¡Gracias por su compra! Vuelva pronto.",style:{minHeight:"60px"}})]}),e.jsxs(o,{children:[e.jsxs(t,{children:[e.jsx(T,{})," Pie de Página (Proformas)"]}),e.jsx(m,{name:"ticket_proforma_footer",value:a.ticket_proforma_footer||"",onChange:s,placeholder:"Ej: Cotización válida por 15 días.",style:{minHeight:"60px"}})]}),e.jsxs(o,{children:[e.jsxs(t,{children:[e.jsx(D,{})," Pie de Página (Traslados/Salidas)"]}),e.jsx(m,{name:"ticket_transfer_footer",value:a.ticket_transfer_footer||"",onChange:s,placeholder:"Ej: Salida de inventario autorizada.",style:{minHeight:"60px"}})]}),e.jsxs(B,{type:"submit",disabled:j||h,children:[e.jsx(G,{})," ",j?"Guardando...":"Guardar Cambios"]}),u&&e.jsx($,{error:u.type==="error",children:u.text})]})]})};export{Q as default};
