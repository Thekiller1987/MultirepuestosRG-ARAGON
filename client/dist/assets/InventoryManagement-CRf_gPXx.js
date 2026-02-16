import{r as s,V as L,j as e,W as lo,L as co,X as De,I as po,O as xo,Y as Re,Z as uo,$ as mo,a0 as go,a1 as ho,a2 as Oe,a3 as fo,a4 as bo,a5 as jo,a6 as Be,A as B,s as m,t as vo,m as te,b as D,n as Te,v as yo,U as Co}from"./vendor-BHEUBfle.js";import{u as wo}from"./index-CRFpa_vU.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-BzGOTXeo.js";const je=m.div`
  padding: 20px;
  background-color: #f8fafc; /* Color de fondo más limpio (Slate-50) */
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  
  @media(max-width: 640px) {
    padding: 10px;
  }
`,Me=m.div`
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  height: 60vh; opacity: 0.8; font-size: 1.1rem; color: #64748b;
  text-align: center;
`,Ce=m(yo)`
  animation: ${vo`from {transform:rotate(0deg);} to {transform:rotate(360deg);}`} 0.8s linear infinite;
  font-size: 2.5rem; margin-bottom: 1.5rem; color: #3b82f6;
`,ko=m(Co)`
  display: inline-flex; align-items: center; gap: 8px;
  color: #64748b; text-decoration: none; font-weight: 600; font-size: 0.95rem;
  padding: 8px 12px; margin-bottom: 1rem; border-radius: 8px;
  transition: all 0.2s;
  &:hover { color: #3b82f6; background: #eff6ff; transform: translateX(-4px); }
`,So=m.div`
  display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  padding: 1rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  position: sticky; top: 10px; z-index: 40;
  border: 1px solid rgba(255,255,255,0.5);

  @media(min-width: 1024px) { 
    flex-direction: row; justify-content: space-between; align-items: center; 
  }
`,Po=m.h1`
  font-size: 1.5rem; color: #1e293b; display: flex; align-items: center; gap: 0.75rem; margin: 0; font-weight: 800;
  svg { color: #3b82f6; }
`,_o=m.div`
  display: flex; gap: 0.75rem; flex-wrap: wrap;
`,H=m.button`
  border: none;
  padding: 0.65rem 1.2rem; 
  border-radius: 99px; /* Pill shape */
  font-weight: 600; font-size: 0.9rem;
  cursor: pointer; display: flex; align-items: center; gap: 0.5rem; 
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  /* Variantes de Color */
  ${n=>n.primary&&`
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white;
    &:hover { box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); transform: translateY(-1px); }
  `}
  ${n=>n.secondary&&`
    background: white; color: #475569; border: 1px solid #cbd5e1;
    &:hover { border-color: #94a3b8; background: #f8fafc; color: #1e293b; }
  `}
  ${n=>n.tertiary&&`
    background: transparent; color: #64748b; border: 1px dashed #cbd5e1;
    &:hover { color: #3b82f6; border-color: #3b82f6; background: #eff6ff; }
  `}
  
  &:active { transform: translateY(0); }
`,Io=m.div`
  display: flex; flex-direction: column; gap: 1rem; 
  background: white; padding: 1.25rem; 
  border-radius: 16px; 
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); 
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;

  @media(min-width: 1024px) { 
    flex-direction: row; align-items: center; 
  }
`,Ao=m.div`
  position: relative; flex: 1; min-width: 250px;
`,Fo=m.input`
  width: 100%; padding: 0.75rem 1rem 0.75rem 2.8rem; 
  border: 1px solid #cbd5e1; border-radius: 12px; 
  font-size: 0.95rem; background-color: #f8fafc;
  transition: all 0.2s; outline: none;

  &:focus { 
    border-color: #3b82f6; background: white; 
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); 
  }
`,Ne=m.button`
  width: 42px; height: 42px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: ${n=>n.$active?"#dbeafe":"#f1f5f9"};
  color: ${n=>n.$active?"#1d4ed8":"#64748b"};
  border: 1px solid ${n=>n.$active?"#bfdbfe":"transparent"};
  border-radius: 10px; cursor: pointer; transition: all 0.2s;
  &:hover { background: #e2e8f0; }
`,T=m.select`
  padding: 0.7rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; 
  background-color: #f8fafc; color: #334155; outline: none; flex: 1;
  font-size: 0.9rem; cursor: pointer;
  &:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); background: white; }
`,$o=m.div`
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); 
  gap: 1.5rem;
  padding-bottom: 40px;
`,Eo=m(te.div)`
  background: white; border-radius: 16px; 
  overflow: hidden; 
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9; 
  display: flex; flex-direction: column; 
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover { 
    transform: translateY(-5px); 
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-color: #e2e8f0;
  }
  
  .image-placeholder {
    height: 180px; background: #f8fafc; 
    display: flex; align-items: center; justify-content: center; 
    position: relative; cursor: zoom-in; 
    border-bottom: 1px solid #f1f5f9;
    
    img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
    &:hover img { transform: scale(1.05); }
    
    .no-image-text { color: #cbd5e1; font-size: 3rem; }
    .overlay { 
      position: absolute; inset: 0; 
      background: rgba(0,0,0,0.2); 
      display: flex; align-items: center; justify-content: center; 
      opacity: 0; transition: opacity 0.2s; 
      color: white; font-size: 1.5rem; backdrop-filter: blur(2px);
    }
    &:hover .overlay { opacity: 1; }
  }
`,Mo=m.div` padding: 1.25rem 1rem 0.5rem; `,No=m.h3` font-size: 1.15rem; margin: 0; color: #0f172a; font-weight: 700; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; `,zo=m.div` font-size: 0.85rem; color: #64748b; font-family: monospace; letter-spacing: 0.05em; margin-top: 4px; `,Lo=m.div` padding: 0.5rem 1rem 1.25rem; display: flex; flex-wrap: wrap; gap: 0.5rem; `,de=m.div`
  background: white; border: 1px solid #e2e8f0;
  padding: 6px 10px; border-radius: 8px; 
  display: flex; flex-direction: column; align-items: flex-start; flex: 1; min-width: 80px;
  
  span { font-size: 0.65rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
  strong { color: #334155; font-size: 1rem; font-weight: 700; }
`,Do=m(de)`
  background: ${n=>n.$out?"#fef2f2":n.$low?"#fffbeb":"#f0fdf4"};
  border-color: ${n=>n.$out?"#fecaca":n.$low?"#fde68a":"#bbf7d0"};
  strong { color: ${n=>n.$out?"#b91c1c":n.$low?"#b45309":"#15803d"}; }
`,Ro=m.div`
  margin-top: auto; padding: 1rem; background: #f8fafc; border-top: 1px solid #f1f5f9; display: flex; gap: 0.75rem;
`,ve=m.button`
  flex: 1; padding: 0.6rem; 
  border-radius: 10px; border: 1px solid; cursor: pointer; 
  font-size: 0.85rem; font-weight: 600; 
  display: flex; align-items: center; justify-content: center; gap: 6px;
  transition: all 0.2s;

  &.adjust { 
    background: white; border-color: #cbd5e1; color: #475569; 
    &:hover { background: #f1f5f9; border-color: #94a3b8; color: #1e293b; } 
  }
  &.edit { 
    background: #f0f9ff; border-color: #bae6fd; color: #0284c7; 
    &:hover { background: #e0f2fe; border-color: #7dd3fc; color: #0369a1; } 
  }
  &.delete { 
    background: #fef2f2; border-color: #fecaca; color: #ef4444; 
    &:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; } 
  }
`,G=m(te.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
  background: rgba(15, 23, 42, 0.6); z-index: 50; 
  display: flex; align-items: center; justify-content: center; padding: 1rem;
  backdrop-filter: blur(4px);
`,K=m.div`
  background: white; width: 100%; max-width: ${n=>n.$large?"800px":"550px"}; 
  border-radius: 20px; padding: 2rem; 
  max-height: 90vh; overflow-y: auto; 
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`,Z=m.h2` margin-top: 0; color: #1e293b; margin-bottom: 1.5rem; font-size: 1.5rem; display: flex; align-items: center; gap: 10px; `,qe=m.div`
  background: #fef2f2; color: #991b1b; padding: 12px; border-radius: 8px; 
  margin-bottom: 1.5rem; border: 1px solid #fecaca; font-size: 0.9rem; display: flex; gap: 8px; align-items: center;
`,Ue=m.div` display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; margin-bottom: 1.5rem; @media(max-width: 640px){ grid-template-columns: 1fr; } `,h=m.div` display: flex; flex-direction: column; gap: 6px; `,f=m.label` font-size: 0.9rem; font-weight: 600; color: #475569; `,y=m.input`
  padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 1rem; color: #1e293b;
  &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
  &:disabled { background: #f1f5f9; color: #94a3b8; }
`,Q=m.div` display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; border-top: 1px solid #f1f5f9; padding-top: 1.5rem; `,ee=m.button` 
  background: white; color: #64748b; border: 1px solid #cbd5e1; 
  padding: 10px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; 
  transition: all 0.2s;
  &:hover { background: #f8fafc; color: #1e293b; } 
`,ne=m.button` 
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); 
  color: white; border: none; 
  padding: 10px 24px; border-radius: 10px; font-weight: 600; cursor: pointer; 
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
  transition: all 0.2s;
  &:hover { opacity: 0.95; transform: translateY(-1px); box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3); } 
`,Ve=({currentImage:n,onImageChange:g})=>{const v=s.useRef(null),[x,P]=s.useState(n||null),[_,d]=s.useState(!1);s.useEffect(()=>{P(n)},[n]);const a=async k=>{const C=k.target.files[0];if(C){if(!C.type.startsWith("image/")){L.error("Solo se permiten imágenes.");return}d(!0);try{const p=await j(C);P(p),g(p)}catch(p){console.error(p),L.error("Error al procesar la imagen.")}finally{d(!1)}}},j=k=>new Promise((C,p)=>{const u=new FileReader;u.readAsDataURL(k),u.onload=w=>{const A=new Image;A.src=w.target.result,A.onload=()=>{const F=document.createElement("canvas"),b=500,r=b/A.width;F.width=b,F.height=A.height*r,F.getContext("2d").drawImage(A,0,0,F.width,F.height);const S=F.toDataURL("image/jpeg",.7);C(S)},A.onerror=F=>p(F)},u.onerror=w=>p(w)});return e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"10px",marginBottom:"1rem",border:"1px dashed #ccc",padding:"1rem",borderRadius:"8px"},children:[_?e.jsx(Ce,{}):x?e.jsxs("div",{style:{position:"relative",width:"120px",height:"120px"},children:[e.jsx("img",{src:x,alt:"Preview",style:{width:"100%",height:"100%",objectFit:"cover",borderRadius:"8px",border:"1px solid #ddd"}}),e.jsx("button",{type:"button",onClick:k=>{k.stopPropagation(),P(null),g(null),v.current&&(v.current.value="")},style:{position:"absolute",top:"-8px",right:"-8px",background:"#dc3545",color:"white",border:"none",borderRadius:"50%",width:"24px",height:"24px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(Te,{size:12})})]}):e.jsxs("div",{onClick:()=>v.current.click(),style:{cursor:"pointer",color:"#6c757d",display:"flex",flexDirection:"column",alignItems:"center"},children:[e.jsx(Oe,{size:32}),e.jsx("span",{style:{fontSize:"0.9rem",marginTop:"5px"},children:"Subir Foto"})]}),e.jsx("input",{type:"file",ref:v,onChange:a,accept:"image/*",style:{display:"none"}})]})},Oo=({isOpen:n,imageSrc:g,onClose:v})=>!n||!g?null:e.jsx(G,{onClick:v,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(te.div,{initial:{scale:.8,opacity:0},animate:{scale:1,opacity:1},style:{position:"relative",maxWidth:"90%",maxHeight:"90vh"},children:[e.jsx("button",{onClick:v,style:{position:"absolute",top:-15,right:-15,background:"white",width:30,height:30,borderRadius:"50%",border:"none",cursor:"pointer",fontWeight:"bold"},children:"X"}),e.jsx("img",{src:g,alt:"Full view",style:{maxWidth:"100%",maxHeight:"80vh",borderRadius:"8px",boxShadow:"0 5px 20px rgba(0,0,0,0.5)"}})]})}),re=n=>String(n||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),ye=50,Bo=500,ze=({open:n,onCancel:g,onConfirm:v,title:x,message:P,confirmLabel:_,danger:d})=>n?e.jsx(G,{onClick:g,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(K,{as:"div",onClick:a=>a.stopPropagation(),style:{maxWidth:"450px"},children:[e.jsx(Z,{style:{color:d?"#e53e3e":"#2d3748"},children:x}),e.jsx("div",{style:{marginBottom:"25px",color:"#4a5568"},children:P}),e.jsxs(Q,{children:[e.jsx(ee,{onClick:g,children:"Cancelar"}),e.jsx(ne,{onClick:v,style:{background:d?"#e53e3e":"#3b82f6"},children:_||"Confirmar"})]})]})}):null,Le=({title:n,items:g,onAdd:v,onDelete:x,onClose:P})=>{const[_,d]=s.useState(""),a=j=>{j.preventDefault(),_.trim()&&(v(_),d(""))};return e.jsx(G,{onClick:P,children:e.jsxs(K,{onClick:j=>j.stopPropagation(),children:[e.jsx(Z,{children:n}),e.jsxs("form",{onSubmit:a,style:{display:"flex",gap:"10px",marginBottom:"20px"},children:[e.jsx(y,{value:_,onChange:j=>d(j.target.value),placeholder:"Nuevo nombre...",style:{flex:1}}),e.jsxs(ne,{type:"submit",children:[e.jsx(De,{})," Agregar"]})]}),e.jsxs("div",{style:{maxHeight:"300px",overflowY:"auto",display:"flex",flexDirection:"column",gap:"8px"},children:[g.map((j,k)=>{const C=j.id_categoria||j.id_proveedor||k,p=j.nombre;return e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"10px",background:"#f7fafc",borderRadius:"8px",alignItems:"center"},children:[e.jsx("span",{children:p}),e.jsx("button",{onClick:()=>x(C),style:{color:"#e53e3e",background:"none",border:"none",cursor:"pointer"},children:e.jsx(Be,{})})]},C)}),g.length===0&&e.jsx("p",{style:{textAlign:"center",color:"#a0aec0"},children:"No hay elementos registrados."})]}),e.jsx(Q,{children:e.jsx(ee,{onClick:P,children:"Cerrar"})})]})})},To=({isOpen:n,product:g,onClose:v,onConfirm:x})=>{const[P,_]=s.useState(""),[d,a]=s.useState(""),[j,k]=s.useState("");if(!n||!g)return null;const C=p=>{const u=p.target.value;k(u),a(u||"")};return e.jsx(G,{onClick:v,children:e.jsxs(K,{onClick:p=>p.stopPropagation(),style:{maxWidth:"400px"},children:[e.jsxs(Z,{children:["Ajustar Stock: ",g.nombre]}),e.jsx("div",{style:{marginBottom:"15px"},children:e.jsxs("p",{children:[e.jsx("strong",{children:"Stock Actual:"})," ",g.existencia]})}),e.jsxs(h,{style:{marginBottom:"15px"},children:[e.jsx(f,{children:"Cantidad (Positivo para agregar, Negativo para restar)"}),e.jsx(y,{type:"number",value:P,onChange:p=>_(p.target.value),placeholder:"Ej: 10 o -5",autoFocus:!0})]}),e.jsxs(h,{style:{marginBottom:"10px"},children:[e.jsx(f,{children:"Razón (Seleccionar)"}),e.jsxs(T,{value:j,onChange:C,children:[e.jsx("option",{value:"",children:"-- Escribir manualmente --"}),e.jsx("option",{value:"Compra",children:"Compra / Resurtido"}),e.jsx("option",{value:"Ajuste Inventario",children:"Ajuste de Inventario"}),e.jsx("option",{value:"Devolución",children:"Devolución Cliente"}),e.jsx("option",{value:"Dañado",children:"Producto Dañado/Merma"}),e.jsx("option",{value:"Uso Interno",children:"Uso Interno"})]})]}),e.jsxs(h,{style:{marginBottom:"20px"},children:[e.jsx(f,{children:"Razón (Manual)"}),e.jsx(y,{type:"text",value:d,onChange:p=>{a(p.target.value),k("")},placeholder:"Especifique el motivo..."})]}),e.jsxs(Q,{children:[e.jsx(ee,{onClick:v,children:"Cancelar"}),e.jsx(ne,{onClick:()=>{const p=parseInt(P,10);!isNaN(p)&&p!==0&&d.trim()?x(g,p,d):L.error("Debe ingresar una cantidad válida y una razón.")},children:"Aplicar Ajuste"})]})]})})},qo=({onClose:n})=>{const[g,v]=s.useState([]),[x,P]=s.useState(!0),[_,d]=s.useState("");return s.useEffect(()=>{(async()=>{try{const j=localStorage.getItem("token"),k=await D.get("/api/products/inventory/history",{headers:{Authorization:`Bearer ${j}`}});v(k.data)}catch(j){console.error(j),d("No se pudo cargar el historial.")}finally{P(!1)}})()},[]),e.jsx(G,{onClick:n,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(K,{onClick:a=>a.stopPropagation(),$large:!0,children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"},children:[e.jsxs(Z,{style:{margin:0},children:[e.jsx(Re,{})," Historial de Movimientos"]}),e.jsx("button",{onClick:n,style:{border:"none",background:"transparent",fontSize:"1.2rem",cursor:"pointer"},children:e.jsx(Te,{})})]}),x?e.jsx("div",{style:{textAlign:"center",padding:"2rem"},children:e.jsx(Ce,{})}):_?e.jsx("div",{style:{color:"red",textAlign:"center"},children:_}):e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:"0.9rem"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{background:"#f7fafc",borderBottom:"2px solid #e2e8f0",textAlign:"left"},children:[e.jsx("th",{style:{padding:"10px"},children:"Fecha"}),e.jsx("th",{style:{padding:"10px"},children:"Producto"}),e.jsx("th",{style:{padding:"10px"},children:"Movimiento"}),e.jsx("th",{style:{padding:"10px"},children:"Detalles"}),e.jsx("th",{style:{padding:"10px"},children:"Usuario"})]})}),e.jsxs("tbody",{children:[g.map(a=>e.jsxs("tr",{style:{borderBottom:"1px solid #edf2f7"},children:[e.jsx("td",{style:{padding:"10px"},children:new Date(a.fecha).toLocaleString()}),e.jsx("td",{style:{padding:"10px",fontWeight:"600"},children:a.nombre_producto||a.codigo_producto||"N/A"}),e.jsx("td",{style:{padding:"10px"},children:e.jsx("span",{style:{padding:"2px 6px",borderRadius:"4px",fontSize:"0.8rem",fontWeight:"bold",background:a.tipo_movimiento==="VENTA"?"#c6f6d5":a.tipo_movimiento==="CREACION"?"#bee3f8":"#fed7d7",color:a.tipo_movimiento==="VENTA"?"#22543d":a.tipo_movimiento==="CREACION"?"#2b6cb0":"#822727"},children:a.tipo_movimiento})}),e.jsx("td",{style:{padding:"10px",color:"#4a5568"},children:a.detalles}),e.jsx("td",{style:{padding:"10px",color:"#718096"},children:a.nombre_usuario||"Sistema"})]},a.id_movimiento)),g.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:"5",style:{textAlign:"center",padding:"20px"},children:"No hay movimientos registrados."})})]})]})}),e.jsx(Q,{children:e.jsx(ee,{onClick:n,children:"Cerrar"})})]})})},Uo=({isOpen:n,onClose:g,onSave:v,categories:x,providers:P,allProductsRaw:_})=>{const[d,a]=s.useState({codigo:"",nombre:"",costo:"",venta:"",mayoreo:"",id_categoria:"",existencia:"",minimo:"",maximo:"",tipo_venta:"Unidad",id_proveedor:"",descripcion:"",imagen:null}),[j,k]=s.useState(""),[C,p]=s.useState(""),u=b=>{const{name:r,value:c}=b.target,S={...d,[r]:c};if(r==="costo"||r==="venta"){const I=parseFloat(S.costo),M=parseFloat(S.venta);k(I>0&&M>0?((M-I)/I*100).toFixed(2):"")}a(S),p("")},w=b=>a(r=>({...r,imagen:b})),A=b=>{const r=b.target.value;k(r);const c=parseFloat(d.costo);c>0&&r&&a(S=>({...S,venta:(c*(1+parseFloat(r)/100)).toFixed(2)}))},F=b=>{b.preventDefault(),p("");const r=d;if(["codigo","nombre","costo","venta","existencia"].some(N=>!r[N]||!String(r[N]).trim())){p("Código, Nombre, Costo, Venta y Existencia son obligatorios.");return}const S=parseFloat(r.costo),I=parseFloat(r.venta),M=r.mayoreo?parseFloat(r.mayoreo):null,E=parseInt(r.existencia,10);if(r.minimo&&parseInt(r.minimo,10),r.maximo&&parseInt(r.maximo,10),[S,I,E].some(isNaN)){p("Costo, Venta y Existencia deben ser números válidos.");return}if(r.mayoreo&&isNaN(M)){p("Precio Mayoreo debe ser un número válido o estar vacío.");return}if(S<0||I<0||E<0){p("Precios y cantidades no pueden ser negativos.");return}if(I<S){p("El precio de venta no puede ser menor que el costo.");return}const R=_.find(N=>{var Y,ae;return((Y=N.codigo)==null?void 0:Y.toLowerCase())===r.codigo.trim().toLowerCase()||((ae=N.nombre)==null?void 0:ae.toLowerCase())===r.nombre.trim().toLowerCase()});if(R){(R.codigo||"").toLowerCase()===r.codigo.trim().toLowerCase()?p(`Ya existe un producto con el código "${r.codigo}".`):p(`Ya existe un producto con el nombre "${r.nombre}".`);return}v({...r,mayoreo:r.mayoreo||null,minimo:r.minimo||null,maximo:r.maximo||null,id_categoria:r.id_categoria||null,id_proveedor:r.id_proveedor||null})};return n?e.jsx(G,{onClick:g,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsx(te.div,{initial:{y:-50,opacity:0},animate:{y:0,opacity:1},exit:{y:50,opacity:0},children:e.jsx(K,{as:"div",onClick:b=>b.stopPropagation(),children:e.jsxs("form",{onSubmit:F,children:[e.jsx(Z,{children:"Crear Nuevo Producto"}),C&&e.jsx(qe,{children:C}),e.jsx(Ve,{currentImage:d.imagen,onImageChange:w}),e.jsxs(Ue,{children:[e.jsxs(h,{children:[e.jsx(f,{children:"Código"}),e.jsx(y,{name:"codigo",value:d.codigo,onChange:u,required:!0})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Nombre"}),e.jsx(y,{name:"nombre",value:d.nombre,onChange:u,required:!0})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Costo (C$)"}),e.jsx(y,{type:"number",step:"0.01",name:"costo",value:d.costo,onChange:u,required:!0})]}),e.jsxs(h,{children:[e.jsx(f,{children:"% Ganancia"}),e.jsx(y,{type:"number",step:"0.01",value:j,onChange:A,placeholder:"ej: 50"})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Precio Venta (C$)"}),e.jsx(y,{type:"number",step:"0.01",name:"venta",value:d.venta,onChange:u,required:!0})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Precio Mayoreo (C$)"}),e.jsx(y,{type:"number",step:"0.01",name:"mayoreo",value:d.mayoreo,onChange:u})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Existencia Inicial"}),e.jsx(y,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"existencia",value:d.existencia,onChange:u,required:!0})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Stock Mínimo"}),e.jsx(y,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"minimo",value:d.minimo,onChange:u})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Stock Máximo"}),e.jsx(y,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"maximo",value:d.maximo,onChange:u})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Descripción"}),e.jsx(y,{name:"descripcion",value:d.descripcion,onChange:u,placeholder:"Detalles del producto"})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Categoría"}),e.jsxs(T,{name:"id_categoria",value:d.id_categoria,onChange:u,children:[e.jsx("option",{value:"",children:"-- Sin Categoría --"}),x.map(b=>e.jsx("option",{value:b.id_categoria,children:b.nombre},b.id_categoria))]})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Proveedor"}),e.jsxs(T,{name:"id_proveedor",value:d.id_proveedor,onChange:u,children:[e.jsx("option",{value:"",children:"-- Sin Proveedor --"}),P.map(b=>e.jsx("option",{value:b.id_proveedor,children:b.nombre},b.id_proveedor))]})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Tipo de Venta"}),e.jsxs(T,{name:"tipo_venta",value:d.tipo_venta,onChange:u,children:[e.jsx("option",{value:"Unidad",children:"Unidad"}),e.jsx("option",{value:"Juego",children:"Juego"}),e.jsx("option",{value:"Kit",children:"Kit"})]})]})]}),e.jsxs(Q,{children:[e.jsx(ee,{type:"button",onClick:g,children:"Cancelar"}),e.jsx(ne,{type:"submit",children:"Crear Producto"})]})]})})})}):null},Vo=({isOpen:n,onClose:g,onSave:v,productToEdit:x,categories:P,providers:_,allProductsRaw:d})=>{const[a,j]=s.useState({}),[k,C]=s.useState(""),[p,u]=s.useState("");s.useEffect(()=>{if(x){j({...x,mayoreo:x.mayoreo??"",minimo:x.minimo??"",maximo:x.maximo??"",id_categoria:x.id_categoria??"",id_proveedor:x.id_proveedor??"",descripcion:x.descripcion??"",imagen:x.imagen??null});const r=parseFloat(x.costo),c=parseFloat(x.venta);C(r>0&&c>0?((c-r)/r*100).toFixed(2):""),u("")}},[x]);const w=r=>{const{name:c,value:S}=r.target;if(c==="existencia")return;const I={...a,[c]:S};if(c==="costo"||c==="venta"){const M=parseFloat(I.costo),E=parseFloat(I.venta);C(M>0&&E>0?((E-M)/M*100).toFixed(2):"")}j(I),u("")},A=r=>j(c=>({...c,imagen:r})),F=r=>{const c=r.target.value;C(c);const S=parseFloat(a.costo);S>0&&c&&j(I=>({...I,venta:(S*(1+parseFloat(c)/100)).toFixed(2)}))},b=r=>{r.preventDefault(),u("");const c=a;if(!c.codigo||!c.nombre||!c.costo||!c.venta){u("Código, Nombre, Costo y Venta son obligatorios.");return}if(parseFloat(c.venta)<parseFloat(c.costo)){u("El precio de venta no puede ser menor que el costo.");return}if(d.find(E=>{var R,N;return E.id_producto!==x.id_producto&&(((R=E.codigo)==null?void 0:R.toLowerCase())===c.codigo.trim().toLowerCase()||((N=E.nombre)==null?void 0:N.toLowerCase())===c.nombre.trim().toLowerCase())})){u("Ya existe otro producto con ese código o nombre.");return}const{existencia:I,...M}={...c,mayoreo:c.mayoreo||null,minimo:c.minimo||null,maximo:c.maximo||null,id_categoria:c.id_categoria||null,id_proveedor:c.id_proveedor||null};v(M,x.id_producto)};return!n||!x?null:e.jsx(G,{onClick:g,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsx(te.div,{initial:{y:-50,opacity:0},animate:{y:0,opacity:1},exit:{y:50,opacity:0},children:e.jsx(K,{as:"div",onClick:r=>r.stopPropagation(),children:e.jsxs("form",{onSubmit:b,children:[e.jsx(Z,{children:"Editar Producto"}),p&&e.jsx(qe,{children:p}),e.jsx(Ve,{currentImage:a.imagen,onImageChange:A}),e.jsxs(Ue,{children:[e.jsxs(h,{children:[e.jsx(f,{children:"Código"}),e.jsx(y,{name:"codigo",value:a.codigo||"",onChange:w,required:!0})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Nombre"}),e.jsx(y,{name:"nombre",value:a.nombre||"",onChange:w,required:!0})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Costo (C$)"}),e.jsx(y,{type:"number",step:"0.01",name:"costo",value:a.costo||"",onChange:w,required:!0})]}),e.jsxs(h,{children:[e.jsx(f,{children:"% Ganancia"}),e.jsx(y,{type:"number",step:"0.01",value:k||"",onChange:F,placeholder:"ej: 50"})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Precio Venta (C$)"}),e.jsx(y,{type:"number",step:"0.01",name:"venta",value:a.venta||"",onChange:w,required:!0})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Precio Mayoreo (C$)"}),e.jsx(y,{type:"number",step:"0.01",name:"mayoreo",value:a.mayoreo||"",onChange:w})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Existencia"}),e.jsx(y,{name:"existencia",value:a.existencia||"",disabled:!0,style:{backgroundColor:"#f0f0f0"}}),e.jsx("small",{style:{marginTop:"5px",color:"#dc3545",fontWeight:"bold"},children:"¡Ajustar solo con el botón de stock!"})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Stock Mínimo"}),e.jsx(y,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"minimo",value:a.minimo||"",onChange:w})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Stock Máximo"}),e.jsx(y,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"maximo",value:a.maximo||"",onChange:w})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Descripción"}),e.jsx(y,{name:"descripcion",value:a.descripcion||"",onChange:w,placeholder:"Detalles del producto"})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Categoría"}),e.jsxs(T,{name:"id_categoria",value:a.id_categoria||"",onChange:w,children:[e.jsx("option",{value:"",children:"-- Sin Categoría --"}),P.map(r=>e.jsx("option",{value:r.id_categoria,children:r.nombre},r.id_categoria))]})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Proveedor"}),e.jsxs(T,{name:"id_proveedor",value:a.id_proveedor||"",onChange:w,children:[e.jsx("option",{value:"",children:"-- Sin Proveedor --"}),_.map(r=>e.jsx("option",{value:r.id_proveedor,children:r.nombre},r.id_proveedor))]})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Tipo de Venta"}),e.jsxs(T,{name:"tipo_venta",value:a.tipo_venta||"Unidad",onChange:w,children:[e.jsx("option",{value:"Unidad",children:"Unidad"}),e.jsx("option",{value:"Juego",children:"Juego"}),e.jsx("option",{value:"Kit",children:"Kit"})]})]})]}),e.jsxs(Q,{children:[e.jsx(ee,{type:"button",onClick:g,children:"Cancelar"}),e.jsx(ne,{type:"submit",children:"Guardar Cambios"})]})]})})})})},Xo=()=>{var Ie,Ae,Fe;const{products:n,categories:g,providers:v,refreshProducts:x,loadMasterData:P,token:_}=wo(),[d,a]=s.useState([]),[j,k]=s.useState(!1),[C,p]=s.useState(""),[u,w]=s.useState("description"),A=s.useDeferredValue(C),F=s.useRef(null),[b,r]=s.useState(""),[c,S]=s.useState(""),[I,M]=s.useState(null),[E,R]=s.useState(!1),[N,Y]=s.useState(!1),[ae,We]=s.useState(null),[we,ie]=s.useState(!1),[U,pe]=s.useState(null),[He,ke]=s.useState(!1),[Ge,Se]=s.useState(!1),[Ye,Pe]=s.useState(!1),[xe,ue]=s.useState({isOpen:!1,product:null}),[X,me]=s.useState({open:!1,product:null,detail:null}),[O,se]=s.useState(1),[ge,_e]=s.useState({isOpen:!1,imageUrl:null});s.useEffect(()=>{se(1)},[A,b,c,u]),s.useEffect(()=>{window.scrollTo({top:0,behavior:"smooth"})},[O]),s.useEffect(()=>{if(!n)return;const o=n.map(l=>{const t=l.nombre??"",i=l.codigo??"",z=l.descripcion??"",W=`${re(t)}|${re(i)}|${re(z)}`,le=[re(t),re(i)],be=Number(l.costo||0),$=Number(l.venta||0),q=Number(l.existencia||0);return{...l,__fmt:{costo:`C$${be.toFixed(2)}`,venta:`C$${$.toFixed(2)}`,costoTotal:`C$${(be*q).toFixed(2)}`},q:W,qStarts:le}});a(o),k(!0)},[n]);const oe=s.useCallback(async()=>{try{await x()}catch{L.error("Error al actualizar inventario.")}},[x]),{filtered:he,totalFilteredCount:fe}=s.useMemo(()=>{const o=(A||"").toLowerCase().trim(),l=String(b||""),t=String(c||"");let i=d;l&&(i=i.filter($=>String($.id_categoria)===l)),t&&(i=i.filter($=>String($.id_proveedor)===t));const z=i.filter($=>{if(u==="code"){const q=String($.codigo||"").toLowerCase(),J=String($.codigo_barras||"").toLowerCase();return q.includes(o)||J.includes(o)}else{const q=($.nombre||"").toLowerCase(),J=($.descripcion||"").toLowerCase(),ce=String($.codigo||"").toLowerCase();return q.includes(o)||J.includes(o)||ce.includes(o)}});z.sort(($,q)=>{if(!o)return 0;const J=($.nombre||"").toLowerCase().startsWith(o),ce=(q.nombre||"").toLowerCase().startsWith(o);if(J&&!ce)return-1;if(!J&&ce)return 1;const $e=($.codigo||"").toLowerCase().startsWith(o),Ee=(q.codigo||"").toLowerCase().startsWith(o);return $e&&!Ee?-1:!$e&&Ee?1:0});const W=z.length,le=(O-1)*ye;return{filtered:z.slice(le,le+ye),totalFilteredCount:W}},[d,A,b,c,O,u]),Xe=()=>R(!0),Je=o=>{We(o),Y(!0)},Ke=o=>{pe(o),ie(!0)},Ze=async o=>{var l,t;try{console.log("CLIENT SENDING CREATE PAYLOAD:",{...o,imagenLength:o.imagen?o.imagen.length:"NULL"});const i=localStorage.getItem("token");await D.post("/api/products",o,{headers:{Authorization:`Bearer ${i}`}}),R(!1),L.success("Producto creado correctamente."),await x()}catch(i){console.error("CLIENT CREATE ERROR:",i),L.error(((t=(l=i.response)==null?void 0:l.data)==null?void 0:t.msg)||"Error al crear el producto.")}},Qe=async(o,l)=>{var t,i;try{console.log("CLIENT SENDING UPDATE PAYLOAD:",{...o,imagenLength:o.imagen?o.imagen.length:"NULL"}),await D.put(`/api/products/${l}`,o,{headers:{Authorization:`Bearer ${_}`}}),Y(!1),L.success("Producto actualizado correctamente."),await x()}catch(z){console.error("CLIENT UPDATE ERROR:",z),L.error(((i=(t=z.response)==null?void 0:t.data)==null?void 0:i.msg)||"Error al actualizar el producto.")}},eo=async()=>{var o;if(U)try{const l=localStorage.getItem("token");await D.delete(`/api/products/${U.id_producto}`,{headers:{Authorization:`Bearer ${l}`}}),await x(),ie(!1),pe(null),L.success(`El producto ${U.nombre} fue eliminado.`)}catch(l){const t=(o=l==null?void 0:l.response)==null?void 0:o.data,i=(t==null?void 0:t.msg)||"No se pudo eliminar el producto.";showAlert({title:"Error",message:i,type:"error"}),t!=null&&t.reasons&&me({open:!0,product:U,detail:t.reasons})}},oo=async o=>{var l,t;try{const i=localStorage.getItem("token");await D.patch(`/api/products/${o.id_producto}/archive`,{},{headers:{Authorization:`Bearer ${i}`}}),me({open:!1,product:null,detail:null}),ie(!1),pe(null),await oe(),showAlert({title:"Archivado",message:`"${o.nombre}" fue archivado (inactivo).`})}catch(i){showAlert({title:"Error",message:((t=(l=i==null?void 0:i.response)==null?void 0:l.data)==null?void 0:t.msg)||"No se pudo archivar el producto.",type:"error"})}},ro=async(o,l,t)=>{var i,z;try{const W=localStorage.getItem("token");await D.patch(`/api/products/${o.id_producto}/stock`,{cantidad:l,razon:t},{headers:{Authorization:`Bearer ${W}`}}),ue({isOpen:!1,product:null}),L.success("Stock actualizado correctamente."),await x()}catch(W){L.error(((z=(i=W.response)==null?void 0:i.data)==null?void 0:z.msg)||"No se pudo ajustar el stock.")}},to=async o=>{var l,t;try{const i=localStorage.getItem("token");await D.post("/api/categories",{nombre:o},{headers:{Authorization:`Bearer ${i}`}}),await oe()}catch(i){showAlert({title:"Error",message:((t=(l=i.response)==null?void 0:l.data)==null?void 0:t.msg)||"No se pudo agregar la categoría."})}},no=async o=>{var l,t;try{const i=localStorage.getItem("token");await D.delete(`/api/categories/${o}`,{headers:{Authorization:`Bearer ${i}`}}),await oe()}catch(i){showAlert({title:"Error",message:((t=(l=i.response)==null?void 0:l.data)==null?void 0:t.msg)||"No se pudo eliminar la categoría. (Verifique que no esté en uso)"})}},ao=async o=>{var l,t;try{const i=localStorage.getItem("token");await D.post("/api/providers",{nombre:o},{headers:{Authorization:`Bearer ${i}`}}),await oe()}catch(i){showAlert({title:"Error",message:((t=(l=i.response)==null?void 0:l.data)==null?void 0:t.msg)||"No se pudo agregar el proveedor."})}},io=async o=>{var l,t;try{const i=localStorage.getItem("token");await D.delete(`/api/providers/${o}`,{headers:{Authorization:`Bearer ${i}`}}),await oe()}catch(i){showAlert({title:"Error",message:((t=(l=i.response)==null?void 0:l.data)==null?void 0:t.msg)||"No se pudo eliminar el proveedor. (Verifique que no esté en uso)"})}};if(!j)return e.jsx(je,{children:e.jsxs(Me,{children:[e.jsx(Ce,{}),e.jsx("p",{children:"Cargando Inventario..."})]})});if(I)return e.jsx(je,{children:e.jsx(Me,{style:{color:"#c53030"},children:I})});const so=he.length<=Bo,V=Math.ceil(fe/ye);return e.jsxs(je,{children:[e.jsxs(ko,{to:"/dashboard",children:[e.jsx(lo,{})," Volver al Dashboard"]}),e.jsxs(So,{children:[e.jsxs(Po,{children:[e.jsx(co,{})," Gestión de Inventario"]}),e.jsxs(_o,{children:[e.jsxs(H,{primary:!0,onClick:Xe,children:[e.jsx(De,{})," Crear Producto"]}),e.jsxs(H,{secondary:!0,onClick:()=>ke(!0),children:[e.jsx(po,{})," Categorías"]}),e.jsxs(H,{secondary:!0,onClick:()=>Se(!0),children:[e.jsx(xo,{})," Proveedores"]}),e.jsxs(H,{tertiary:!0,onClick:()=>Pe(!0),children:[e.jsx(Re,{})," Historial"]})]})]}),e.jsxs(Io,{children:[e.jsxs("div",{style:{display:"flex",gap:"0.5rem"},children:[e.jsxs(Ao,{style:{flex:1},children:[e.jsx(uo,{style:{position:"absolute",left:12,top:14,color:"#a0aec0"}}),e.jsx(Fo,{ref:F,placeholder:u==="code"?"Buscar código...":"Buscar nombre...",value:C,onChange:o=>p(o.target.value),autoComplete:"off",autoCorrect:"off",spellCheck:!1})]}),e.jsx(Ne,{$active:u==="description",onClick:()=>w("description"),title:"Por Nombre",children:e.jsx(mo,{})}),e.jsx(Ne,{$active:u==="code",onClick:()=>w("code"),title:"Por Código",children:e.jsx(go,{})})]}),e.jsxs(T,{value:b,onChange:o=>r(o.target.value),children:[e.jsx("option",{value:"",children:"Todas las categorías"}),g.map(o=>e.jsx("option",{value:o.id_categoria,children:o.nombre},o.id_categoria))]}),e.jsxs(T,{value:c,onChange:o=>S(o.target.value),children:[e.jsx("option",{value:"",children:"Todos los proveedores"}),v.map(o=>e.jsx("option",{value:o.id_proveedor,children:o.nombre},o.id_proveedor))]})]}),e.jsxs("div",{style:{textAlign:"right",marginBottom:".5rem",color:"#4a5568",fontWeight:"bold",fontSize:"0.9rem"},children:["Página ",O," de ",V||1," | Mostrando ",he.length," de ",fe," productos filtrados"]}),e.jsx($o,{children:he.map(o=>{const l=so?{initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{duration:.12}}:{},t=o.existencia>0&&o.existencia<=(o.minimo||5),i=o.existencia<=0;return e.jsxs(Eo,{...l,children:[e.jsx("div",{className:"image-placeholder",onClick:()=>o.imagen&&_e({isOpen:!0,imageUrl:o.imagen}),children:o.imagen?e.jsxs(e.Fragment,{children:[e.jsx("img",{src:o.imagen,alt:o.nombre}),e.jsx("div",{className:"overlay",children:e.jsx(ho,{})})]}):e.jsx("div",{className:"no-image-text",children:e.jsx(Oe,{})})}),e.jsxs(Mo,{children:[e.jsx(No,{title:o.nombre,children:o.nombre}),e.jsxs(zo,{children:["Código: ",o.codigo]})]}),e.jsxs(Lo,{children:[e.jsxs(de,{children:[e.jsx("span",{children:"Costo"}),e.jsx("strong",{children:o.__fmt.costo})]}),e.jsxs(de,{children:[e.jsx("span",{children:"Venta"}),e.jsx("strong",{children:o.__fmt.venta})]}),e.jsxs(Do,{$low:t,$out:i,children:[e.jsx("span",{children:"Existencia"}),e.jsx("strong",{children:o.existencia})]}),e.jsxs(de,{children:[e.jsx("span",{children:"Costo Total"}),e.jsx("strong",{children:o.__fmt.costoTotal})]})]}),e.jsxs(Ro,{children:[e.jsxs(ve,{className:"adjust",title:"Ajustar Stock",onClick:()=>ue({isOpen:!0,product:o}),children:[e.jsx(fo,{}),e.jsx(bo,{style:{marginLeft:4}})]}),e.jsxs(ve,{className:"edit",onClick:()=>Je(o),children:[e.jsx(jo,{})," Editar"]}),e.jsxs(ve,{className:"delete",onClick:()=>Ke(o),children:[e.jsx(Be,{})," Eliminar"]})]})]},o.id_producto)})}),fe>0&&e.jsxs("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",gap:"1.5rem",marginTop:"2rem",marginBottom:"3rem"},children:[e.jsx(H,{secondary:!0,onClick:()=>se(o=>Math.max(1,o-1)),disabled:O===1,children:"Anterior"}),e.jsx("div",{style:{display:"flex",gap:"8px"},children:[...Array(V)].map((o,l)=>{const t=l+1;return V>7&&t>2&&t<V-1&&Math.abs(t-O)>1?t===3||t===V-2?e.jsx("span",{children:"..."},t):null:e.jsx(H,{secondary:t!==O,primary:t===O,style:{minWidth:"40px",padding:"0.5rem"},onClick:()=>se(t),children:t},t)})}),e.jsx(H,{secondary:!0,onClick:()=>se(o=>Math.min(V,o+1)),disabled:O===V,children:"Siguiente"})]}),e.jsx(B,{children:E&&e.jsx(Uo,{isOpen:E,onClose:()=>R(!1),onSave:Ze,categories:g,providers:v,allProductsRaw:d})}),e.jsx(B,{children:N&&e.jsx(Vo,{isOpen:N,onClose:()=>Y(!1),onSave:Qe,productToEdit:ae,categories:g,providers:v,allProductsRaw:d})}),e.jsx(B,{children:we&&e.jsx(ze,{open:we,title:"Confirmar Eliminación",message:`¿Estás seguro de que quieres eliminar el producto "${U==null?void 0:U.nombre}"?`,onCancel:()=>ie(!1),onConfirm:eo,confirmLabel:"Sí, eliminar",danger:!0})}),e.jsx(B,{children:X.open&&e.jsx(ze,{open:X.open,title:"Eliminación bloqueada",message:e.jsxs("div",{style:{textAlign:"left",lineHeight:1.6},children:["Este producto tiene referencias y no puede eliminarse.",e.jsx("br",{}),e.jsx("strong",{children:"Referencias:"}),e.jsx("br",{}),"Ventas: ",((Ie=X.detail)==null?void 0:Ie.ventas)??0,e.jsx("br",{}),"Compras: ",((Ae=X.detail)==null?void 0:Ae.compras)??0,e.jsx("br",{}),"Movimientos (kardex): ",((Fe=X.detail)==null?void 0:Fe.kardex)??0,e.jsx("br",{}),e.jsx("br",{}),"Puedes ",e.jsx("strong",{children:"archivarlo"})," para ocultarlo del sistema sin perder historial."]}),onCancel:()=>me({open:!1,product:null,detail:null}),onConfirm:()=>oo(X.product),confirmLabel:"Archivar producto",danger:!1})}),e.jsx(B,{children:He&&e.jsx(Le,{title:"Gestionar Categorías",items:g,onAdd:to,onDelete:no,onClose:()=>ke(!1)})}),e.jsx(B,{children:Ge&&e.jsx(Le,{title:"Gestionar Proveedores",items:v,onAdd:ao,onDelete:io,onClose:()=>Se(!1)})}),e.jsx(B,{children:Ye&&e.jsx(qo,{onClose:()=>Pe(!1)})}),e.jsx(B,{children:xe.isOpen&&e.jsx(To,{isOpen:xe.isOpen,product:xe.product,onClose:()=>ue({isOpen:!1,product:null}),onConfirm:ro})}),e.jsx(B,{children:ge.isOpen&&e.jsx(Oo,{isOpen:ge.isOpen,imageSrc:ge.imageUrl,onClose:()=>_e({isOpen:!1,imageUrl:null})})})]})};export{Xo as default};
