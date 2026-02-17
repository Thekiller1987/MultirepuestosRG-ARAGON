import{r as n,b as z,j as e,V as mo,L as uo,W as Re,I as go,O as ho,X as Te,Y as fo,Z as jo,$ as bo,a0 as vo,a1 as qe,a2 as yo,a3 as Co,a4 as wo,a5 as Ue,A as R,s as m,t as ko,m as ie,n as We,v as So,U as Po}from"./vendor-BJZlzDLx.js";import"./scanner-vendor-DfxRpMWJ.js";const Ce=m.div`
  padding: 20px;
  background-color: #f8fafc; /* Color de fondo más limpio (Slate-50) */
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  
  @media(max-width: 640px) {
    padding: 10px;
  }
`,Le=m.div`
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  height: 60vh; opacity: 0.8; font-size: 1.1rem; color: #64748b;
  text-align: center;
`,Se=m(So)`
  animation: ${ko`from {transform:rotate(0deg);} to {transform:rotate(360deg);}`} 0.8s linear infinite;
  font-size: 2.5rem; margin-bottom: 1.5rem; color: #3b82f6;
`,Io=m(Po)`
  display: inline-flex; align-items: center; gap: 8px;
  color: #64748b; text-decoration: none; font-weight: 600; font-size: 0.95rem;
  padding: 8px 12px; margin-bottom: 1rem; border-radius: 8px;
  transition: all 0.2s;
  &:hover { color: #3b82f6; background: #eff6ff; transform: translateX(-4px); }
`,_o=m.div`
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
`,Ao=m.h1`
  font-size: 1.5rem; color: #1e293b; display: flex; align-items: center; gap: 0.75rem; margin: 0; font-weight: 800;
  svg { color: #3b82f6; }
`,$o=m.div`
  display: flex; gap: 0.75rem; flex-wrap: wrap;
`,J=m.button`
  border: none;
  padding: 0.65rem 1.2rem; 
  border-radius: 99px; /* Pill shape */
  font-weight: 600; font-size: 0.9rem;
  cursor: pointer; display: flex; align-items: center; gap: 0.5rem; 
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  /* Variantes de Color */
  ${a=>a.primary&&`
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white;
    &:hover { box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); transform: translateY(-1px); }
  `}
  ${a=>a.secondary&&`
    background: white; color: #475569; border: 1px solid #cbd5e1;
    &:hover { border-color: #94a3b8; background: #f8fafc; color: #1e293b; }
  `}
  ${a=>a.tertiary&&`
    background: transparent; color: #64748b; border: 1px dashed #cbd5e1;
    &:hover { color: #3b82f6; border-color: #3b82f6; background: #eff6ff; }
  `}
  
  &:active { transform: translateY(0); }
`,Eo=m.div`
  display: flex; flex-direction: column; gap: 1rem; 
  background: white; padding: 1.25rem; 
  border-radius: 16px; 
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); 
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;

  @media(min-width: 1024px) { 
    flex-direction: row; align-items: center; 
  }
`,Fo=m.div`
  position: relative; flex: 1; min-width: 250px;
`,Mo=m.input`
  width: 100%; padding: 0.75rem 1rem 0.75rem 2.8rem; 
  border: 1px solid #cbd5e1; border-radius: 12px; 
  font-size: 0.95rem; background-color: #f8fafc;
  transition: all 0.2s; outline: none;

  &:focus { 
    border-color: #3b82f6; background: white; 
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); 
  }
`,De=m.button`
  width: 42px; height: 42px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: ${a=>a.$active?"#dbeafe":"#f1f5f9"};
  color: ${a=>a.$active?"#1d4ed8":"#64748b"};
  border: 1px solid ${a=>a.$active?"#bfdbfe":"transparent"};
  border-radius: 10px; cursor: pointer; transition: all 0.2s;
  &:hover { background: #e2e8f0; }
`,U=m.select`
  padding: 0.7rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; 
  background-color: #f8fafc; color: #334155; outline: none; flex: 1;
  font-size: 0.9rem; cursor: pointer;
  &:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); background: white; }
`,No=m.div`
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); 
  gap: 1.5rem;
  padding-bottom: 40px;
`,zo=m(ie.div)`
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
`,Lo=m.div` padding: 1.25rem 1rem 0.5rem; `,Do=m.h3` font-size: 1.15rem; margin: 0; color: #0f172a; font-weight: 700; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; `,Oo=m.div` font-size: 0.85rem; color: #64748b; font-family: monospace; letter-spacing: 0.05em; margin-top: 4px; `,Bo=m.div` padding: 0.5rem 1rem 1.25rem; display: flex; flex-wrap: wrap; gap: 0.5rem; `,me=m.div`
  background: white; border: 1px solid #e2e8f0;
  padding: 6px 10px; border-radius: 8px; 
  display: flex; flex-direction: column; align-items: flex-start; flex: 1; min-width: 80px;
  
  span { font-size: 0.65rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
  strong { color: #334155; font-size: 1rem; font-weight: 700; }
`,Ro=m(me)`
  background: ${a=>a.$out?"#fef2f2":a.$low?"#fffbeb":"#f0fdf4"};
  border-color: ${a=>a.$out?"#fecaca":a.$low?"#fde68a":"#bbf7d0"};
  strong { color: ${a=>a.$out?"#b91c1c":a.$low?"#b45309":"#15803d"}; }
`,To=m.div`
  margin-top: auto; padding: 1rem; background: #f8fafc; border-top: 1px solid #f1f5f9; display: flex; gap: 0.75rem;
`,we=m.button`
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
`,H=m(ie.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
  background: rgba(15, 23, 42, 0.6); z-index: 50; 
  display: flex; align-items: center; justify-content: center; padding: 1rem;
  backdrop-filter: blur(4px);
`,K=m.div`
  background: white; width: 100%; max-width: ${a=>a.$large?"800px":"550px"}; 
  border-radius: 20px; padding: 2rem; 
  max-height: 90vh; overflow-y: auto; 
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`,Z=m.h2` margin-top: 0; color: #1e293b; margin-bottom: 1.5rem; font-size: 1.5rem; display: flex; align-items: center; gap: 10px; `,Ve=m.div`
  background: #fef2f2; color: #991b1b; padding: 12px; border-radius: 8px; 
  margin-bottom: 1.5rem; border: 1px solid #fecaca; font-size: 0.9rem; display: flex; gap: 8px; align-items: center;
`,He=m.div` display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; margin-bottom: 1.5rem; @media(max-width: 640px){ grid-template-columns: 1fr; } `,h=m.div` display: flex; flex-direction: column; gap: 6px; `,f=m.label` font-size: 0.9rem; font-weight: 600; color: #475569; `,C=m.input`
  padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 1rem; color: #1e293b;
  &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
  &:disabled { background: #f1f5f9; color: #94a3b8; }
`,oe=m.div` display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; border-top: 1px solid #f1f5f9; padding-top: 1.5rem; `,te=m.button` 
  background: white; color: #64748b; border: 1px solid #cbd5e1; 
  padding: 10px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; 
  transition: all 0.2s;
  &:hover { background: #f8fafc; color: #1e293b; } 
`,re=m.button` 
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); 
  color: white; border: none; 
  padding: 10px 24px; border-radius: 10px; font-weight: 600; cursor: pointer; 
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
  transition: all 0.2s;
  &:hover { opacity: 0.95; transform: translateY(-1px); box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3); } 
`,Ge=({currentImage:a,onImageChange:g})=>{const v=n.useRef(null),[u,y]=n.useState(a||null),[I,d]=n.useState(!1);n.useEffect(()=>{y(a)},[a]);const i=async S=>{const w=S.target.files[0];if(w){if(!w.type.startsWith("image/")){alert("Solo se permiten imágenes.");return}d(!0);try{const p=await b(w);y(p),g(p)}catch(p){console.error(p),alert("Error al procesar la imagen.")}finally{d(!1)}}},b=S=>new Promise((w,p)=>{const x=new FileReader;x.readAsDataURL(S),x.onload=k=>{const A=new Image;A.src=k.target.result,A.onload=()=>{const $=document.createElement("canvas"),j=500,t=j/A.width;$.width=j,$.height=A.height*t,$.getContext("2d").drawImage(A,0,0,$.width,$.height);const P=$.toDataURL("image/jpeg",.7);w(P)},A.onerror=$=>p($)},x.onerror=k=>p(k)});return e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"10px",marginBottom:"1rem",border:"1px dashed #ccc",padding:"1rem",borderRadius:"8px"},children:[I?e.jsx(Se,{}):u?e.jsxs("div",{style:{position:"relative",width:"120px",height:"120px"},children:[e.jsx("img",{src:u,alt:"Preview",style:{width:"100%",height:"100%",objectFit:"cover",borderRadius:"8px",border:"1px solid #ddd"}}),e.jsx("button",{type:"button",onClick:S=>{S.stopPropagation(),y(null),g(null),v.current&&(v.current.value="")},style:{position:"absolute",top:"-8px",right:"-8px",background:"#dc3545",color:"white",border:"none",borderRadius:"50%",width:"24px",height:"24px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(We,{size:12})})]}):e.jsxs("div",{onClick:()=>v.current.click(),style:{cursor:"pointer",color:"#6c757d",display:"flex",flexDirection:"column",alignItems:"center"},children:[e.jsx(qe,{size:32}),e.jsx("span",{style:{fontSize:"0.9rem",marginTop:"5px"},children:"Subir Foto"})]}),e.jsx("input",{type:"file",ref:v,onChange:i,accept:"image/*",style:{display:"none"}})]})},qo=({isOpen:a,imageSrc:g,onClose:v})=>!a||!g?null:e.jsx(H,{onClick:v,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(ie.div,{initial:{scale:.8,opacity:0},animate:{scale:1,opacity:1},style:{position:"relative",maxWidth:"90%",maxHeight:"90vh"},children:[e.jsx("button",{onClick:v,style:{position:"absolute",top:-15,right:-15,background:"white",width:30,height:30,borderRadius:"50%",border:"none",cursor:"pointer",fontWeight:"bold"},children:"X"}),e.jsx("img",{src:g,alt:"Full view",style:{maxWidth:"100%",maxHeight:"80vh",borderRadius:"8px",boxShadow:"0 5px 20px rgba(0,0,0,0.5)"}})]})}),ae=a=>String(a||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),ke=50,Uo=500,Wo=({isOpen:a,onClose:g,title:v,message:u})=>a?e.jsx(H,{onClick:g,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(K,{as:"div",onClick:y=>y.stopPropagation(),style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx(Z,{children:v}),e.jsx("p",{style:{color:"#4a5568",marginBottom:"20px"},children:u}),e.jsx(re,{onClick:g,style:{width:"100%"},children:"Aceptar"})]})}):null,Oe=({open:a,onCancel:g,onConfirm:v,title:u,message:y,confirmLabel:I,danger:d})=>a?e.jsx(H,{onClick:g,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(K,{as:"div",onClick:i=>i.stopPropagation(),style:{maxWidth:"450px"},children:[e.jsx(Z,{style:{color:d?"#e53e3e":"#2d3748"},children:u}),e.jsx("div",{style:{marginBottom:"25px",color:"#4a5568"},children:y}),e.jsxs(oe,{children:[e.jsx(te,{onClick:g,children:"Cancelar"}),e.jsx(re,{onClick:v,style:{background:d?"#e53e3e":"#3b82f6"},children:I||"Confirmar"})]})]})}):null,Be=({title:a,items:g,onAdd:v,onDelete:u,onClose:y})=>{const[I,d]=n.useState(""),i=b=>{b.preventDefault(),I.trim()&&(v(I),d(""))};return e.jsx(H,{onClick:y,children:e.jsxs(K,{onClick:b=>b.stopPropagation(),children:[e.jsx(Z,{children:a}),e.jsxs("form",{onSubmit:i,style:{display:"flex",gap:"10px",marginBottom:"20px"},children:[e.jsx(C,{value:I,onChange:b=>d(b.target.value),placeholder:"Nuevo nombre...",style:{flex:1}}),e.jsxs(re,{type:"submit",children:[e.jsx(Re,{})," Agregar"]})]}),e.jsxs("div",{style:{maxHeight:"300px",overflowY:"auto",display:"flex",flexDirection:"column",gap:"8px"},children:[g.map((b,S)=>{const w=b.id_categoria||b.id_proveedor||S,p=b.nombre;return e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"10px",background:"#f7fafc",borderRadius:"8px",alignItems:"center"},children:[e.jsx("span",{children:p}),e.jsx("button",{onClick:()=>u(w),style:{color:"#e53e3e",background:"none",border:"none",cursor:"pointer"},children:e.jsx(Ue,{})})]},w)}),g.length===0&&e.jsx("p",{style:{textAlign:"center",color:"#a0aec0"},children:"No hay elementos registrados."})]}),e.jsx(oe,{children:e.jsx(te,{onClick:y,children:"Cerrar"})})]})})},Vo=({isOpen:a,product:g,onClose:v,onConfirm:u})=>{const[y,I]=n.useState(""),[d,i]=n.useState(""),[b,S]=n.useState("");if(!a||!g)return null;const w=p=>{const x=p.target.value;S(x),i(x||"")};return e.jsx(H,{onClick:v,children:e.jsxs(K,{onClick:p=>p.stopPropagation(),style:{maxWidth:"400px"},children:[e.jsxs(Z,{children:["Ajustar Stock: ",g.nombre]}),e.jsx("div",{style:{marginBottom:"15px"},children:e.jsxs("p",{children:[e.jsx("strong",{children:"Stock Actual:"})," ",g.existencia]})}),e.jsxs(h,{style:{marginBottom:"15px"},children:[e.jsx(f,{children:"Cantidad (Positivo para agregar, Negativo para restar)"}),e.jsx(C,{type:"number",value:y,onChange:p=>I(p.target.value),placeholder:"Ej: 10 o -5",autoFocus:!0})]}),e.jsxs(h,{style:{marginBottom:"10px"},children:[e.jsx(f,{children:"Razón (Seleccionar)"}),e.jsxs(U,{value:b,onChange:w,children:[e.jsx("option",{value:"",children:"-- Escribir manualmente --"}),e.jsx("option",{value:"Compra",children:"Compra / Resurtido"}),e.jsx("option",{value:"Ajuste Inventario",children:"Ajuste de Inventario"}),e.jsx("option",{value:"Devolución",children:"Devolución Cliente"}),e.jsx("option",{value:"Dañado",children:"Producto Dañado/Merma"}),e.jsx("option",{value:"Uso Interno",children:"Uso Interno"})]})]}),e.jsxs(h,{style:{marginBottom:"20px"},children:[e.jsx(f,{children:"Razón (Manual)"}),e.jsx(C,{type:"text",value:d,onChange:p=>{i(p.target.value),S("")},placeholder:"Especifique el motivo..."})]}),e.jsxs(oe,{children:[e.jsx(te,{onClick:v,children:"Cancelar"}),e.jsx(re,{onClick:()=>{const p=parseInt(y,10);!isNaN(p)&&p!==0&&d.trim()?u(g,p,d):alert("Debe ingresar una cantidad válida y una razón.")},children:"Aplicar Ajuste"})]})]})})},Ho=({onClose:a})=>{const[g,v]=n.useState([]),[u,y]=n.useState(!0),[I,d]=n.useState("");return n.useEffect(()=>{(async()=>{try{const b=localStorage.getItem("token"),S=await z.get("/api/products/inventory/history",{headers:{Authorization:`Bearer ${b}`}});v(S.data)}catch(b){console.error(b),d("No se pudo cargar el historial.")}finally{y(!1)}})()},[]),e.jsx(H,{onClick:a,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(K,{onClick:i=>i.stopPropagation(),$large:!0,children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"},children:[e.jsxs(Z,{style:{margin:0},children:[e.jsx(Te,{})," Historial de Movimientos"]}),e.jsx("button",{onClick:a,style:{border:"none",background:"transparent",fontSize:"1.2rem",cursor:"pointer"},children:e.jsx(We,{})})]}),u?e.jsx("div",{style:{textAlign:"center",padding:"2rem"},children:e.jsx(Se,{})}):I?e.jsx("div",{style:{color:"red",textAlign:"center"},children:I}):e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:"0.9rem"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{background:"#f7fafc",borderBottom:"2px solid #e2e8f0",textAlign:"left"},children:[e.jsx("th",{style:{padding:"10px"},children:"Fecha"}),e.jsx("th",{style:{padding:"10px"},children:"Producto"}),e.jsx("th",{style:{padding:"10px"},children:"Movimiento"}),e.jsx("th",{style:{padding:"10px"},children:"Detalles"}),e.jsx("th",{style:{padding:"10px"},children:"Usuario"})]})}),e.jsxs("tbody",{children:[g.map(i=>e.jsxs("tr",{style:{borderBottom:"1px solid #edf2f7"},children:[e.jsx("td",{style:{padding:"10px"},children:new Date(i.fecha).toLocaleString()}),e.jsx("td",{style:{padding:"10px",fontWeight:"600"},children:i.nombre_producto||i.codigo_producto||"N/A"}),e.jsx("td",{style:{padding:"10px"},children:e.jsx("span",{style:{padding:"2px 6px",borderRadius:"4px",fontSize:"0.8rem",fontWeight:"bold",background:i.tipo_movimiento==="VENTA"?"#c6f6d5":i.tipo_movimiento==="CREACION"?"#bee3f8":"#fed7d7",color:i.tipo_movimiento==="VENTA"?"#22543d":i.tipo_movimiento==="CREACION"?"#2b6cb0":"#822727"},children:i.tipo_movimiento})}),e.jsx("td",{style:{padding:"10px",color:"#4a5568"},children:i.detalles}),e.jsx("td",{style:{padding:"10px",color:"#718096"},children:i.nombre_usuario||"Sistema"})]},i.id_movimiento)),g.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:"5",style:{textAlign:"center",padding:"20px"},children:"No hay movimientos registrados."})})]})]})}),e.jsx(oe,{children:e.jsx(te,{onClick:a,children:"Cerrar"})})]})})},Go=({isOpen:a,onClose:g,onSave:v,categories:u,providers:y,allProductsRaw:I})=>{const[d,i]=n.useState({codigo:"",nombre:"",costo:"",venta:"",mayoreo:"",id_categoria:"",existencia:"",minimo:"",maximo:"",tipo_venta:"Unidad",id_proveedor:"",descripcion:"",imagen:null}),[b,S]=n.useState(""),[w,p]=n.useState(""),x=j=>{const{name:t,value:l}=j.target,P={...d,[t]:l};if(t==="costo"||t==="venta"){const _=parseFloat(P.costo),L=parseFloat(P.venta);S(_>0&&L>0?((L-_)/_*100).toFixed(2):"")}i(P),p("")},k=j=>i(t=>({...t,imagen:j})),A=j=>{const t=j.target.value;S(t);const l=parseFloat(d.costo);l>0&&t&&i(P=>({...P,venta:(l*(1+parseFloat(t)/100)).toFixed(2)}))},$=j=>{j.preventDefault(),p("");const t=d;if(["codigo","nombre","costo","venta","existencia"].some(O=>!t[O]||!String(t[O]).trim())){p("Código, Nombre, Costo, Venta y Existencia son obligatorios.");return}const P=parseFloat(t.costo),_=parseFloat(t.venta),L=t.mayoreo?parseFloat(t.mayoreo):null,D=parseInt(t.existencia,10);if(t.minimo&&parseInt(t.minimo,10),t.maximo&&parseInt(t.maximo,10),[P,_,D].some(isNaN)){p("Costo, Venta y Existencia deben ser números válidos.");return}if(t.mayoreo&&isNaN(L)){p("Precio Mayoreo debe ser un número válido o estar vacío.");return}if(P<0||_<0||D<0){p("Precios y cantidades no pueden ser negativos.");return}if(_<P){p("El precio de venta no puede ser menor que el costo.");return}const T=I.find(O=>{var Q,se;return((Q=O.codigo)==null?void 0:Q.toLowerCase())===t.codigo.trim().toLowerCase()||((se=O.nombre)==null?void 0:se.toLowerCase())===t.nombre.trim().toLowerCase()});if(T){(T.codigo||"").toLowerCase()===t.codigo.trim().toLowerCase()?p(`Ya existe un producto con el código "${t.codigo}".`):p(`Ya existe un producto con el nombre "${t.nombre}".`);return}v({...t,mayoreo:t.mayoreo||null,minimo:t.minimo||null,maximo:t.maximo||null,id_categoria:t.id_categoria||null,id_proveedor:t.id_proveedor||null})};return a?e.jsx(H,{onClick:g,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsx(ie.div,{initial:{y:-50,opacity:0},animate:{y:0,opacity:1},exit:{y:50,opacity:0},children:e.jsx(K,{as:"div",onClick:j=>j.stopPropagation(),children:e.jsxs("form",{onSubmit:$,children:[e.jsx(Z,{children:"Crear Nuevo Producto"}),w&&e.jsx(Ve,{children:w}),e.jsx(Ge,{currentImage:d.imagen,onImageChange:k}),e.jsxs(He,{children:[e.jsxs(h,{children:[e.jsx(f,{children:"Código"}),e.jsx(C,{name:"codigo",value:d.codigo,onChange:x,required:!0})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Nombre"}),e.jsx(C,{name:"nombre",value:d.nombre,onChange:x,required:!0})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Costo (C$)"}),e.jsx(C,{type:"number",step:"0.01",name:"costo",value:d.costo,onChange:x,required:!0})]}),e.jsxs(h,{children:[e.jsx(f,{children:"% Ganancia"}),e.jsx(C,{type:"number",step:"0.01",value:b,onChange:A,placeholder:"ej: 50"})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Precio Venta (C$)"}),e.jsx(C,{type:"number",step:"0.01",name:"venta",value:d.venta,onChange:x,required:!0})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Precio Mayoreo (C$)"}),e.jsx(C,{type:"number",step:"0.01",name:"mayoreo",value:d.mayoreo,onChange:x})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Existencia Inicial"}),e.jsx(C,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"existencia",value:d.existencia,onChange:x,required:!0})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Stock Mínimo"}),e.jsx(C,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"minimo",value:d.minimo,onChange:x})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Stock Máximo"}),e.jsx(C,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"maximo",value:d.maximo,onChange:x})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Descripción"}),e.jsx(C,{name:"descripcion",value:d.descripcion,onChange:x,placeholder:"Detalles del producto"})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Categoría"}),e.jsxs(U,{name:"id_categoria",value:d.id_categoria,onChange:x,children:[e.jsx("option",{value:"",children:"-- Sin Categoría --"}),u.map(j=>e.jsx("option",{value:j.id_categoria,children:j.nombre},j.id_categoria))]})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Proveedor"}),e.jsxs(U,{name:"id_proveedor",value:d.id_proveedor,onChange:x,children:[e.jsx("option",{value:"",children:"-- Sin Proveedor --"}),y.map(j=>e.jsx("option",{value:j.id_proveedor,children:j.nombre},j.id_proveedor))]})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Tipo de Venta"}),e.jsxs(U,{name:"tipo_venta",value:d.tipo_venta,onChange:x,children:[e.jsx("option",{value:"Unidad",children:"Unidad"}),e.jsx("option",{value:"Juego",children:"Juego"}),e.jsx("option",{value:"Kit",children:"Kit"})]})]})]}),e.jsxs(oe,{children:[e.jsx(te,{type:"button",onClick:g,children:"Cancelar"}),e.jsx(re,{type:"submit",children:"Crear Producto"})]})]})})})}):null},Yo=({isOpen:a,onClose:g,onSave:v,productToEdit:u,categories:y,providers:I,allProductsRaw:d})=>{const[i,b]=n.useState({}),[S,w]=n.useState(""),[p,x]=n.useState("");n.useEffect(()=>{if(u){b({...u,mayoreo:u.mayoreo??"",minimo:u.minimo??"",maximo:u.maximo??"",id_categoria:u.id_categoria??"",id_proveedor:u.id_proveedor??"",descripcion:u.descripcion??"",imagen:u.imagen??null});const t=parseFloat(u.costo),l=parseFloat(u.venta);w(t>0&&l>0?((l-t)/t*100).toFixed(2):""),x("")}},[u]);const k=t=>{const{name:l,value:P}=t.target;if(l==="existencia")return;const _={...i,[l]:P};if(l==="costo"||l==="venta"){const L=parseFloat(_.costo),D=parseFloat(_.venta);w(L>0&&D>0?((D-L)/L*100).toFixed(2):"")}b(_),x("")},A=t=>b(l=>({...l,imagen:t})),$=t=>{const l=t.target.value;w(l);const P=parseFloat(i.costo);P>0&&l&&b(_=>({..._,venta:(P*(1+parseFloat(l)/100)).toFixed(2)}))},j=t=>{t.preventDefault(),x("");const l=i;if(!l.codigo||!l.nombre||!l.costo||!l.venta){x("Código, Nombre, Costo y Venta son obligatorios.");return}if(parseFloat(l.venta)<parseFloat(l.costo)){x("El precio de venta no puede ser menor que el costo.");return}if(d.find(D=>{var T,O;return D.id_producto!==u.id_producto&&(((T=D.codigo)==null?void 0:T.toLowerCase())===l.codigo.trim().toLowerCase()||((O=D.nombre)==null?void 0:O.toLowerCase())===l.nombre.trim().toLowerCase())})){x("Ya existe otro producto con ese código o nombre.");return}const{existencia:_,...L}={...l,mayoreo:l.mayoreo||null,minimo:l.minimo||null,maximo:l.maximo||null,id_categoria:l.id_categoria||null,id_proveedor:l.id_proveedor||null};v(L,u.id_producto)};return!a||!u?null:e.jsx(H,{onClick:g,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsx(ie.div,{initial:{y:-50,opacity:0},animate:{y:0,opacity:1},exit:{y:50,opacity:0},children:e.jsx(K,{as:"div",onClick:t=>t.stopPropagation(),children:e.jsxs("form",{onSubmit:j,children:[e.jsx(Z,{children:"Editar Producto"}),p&&e.jsx(Ve,{children:p}),e.jsx(Ge,{currentImage:i.imagen,onImageChange:A}),e.jsxs(He,{children:[e.jsxs(h,{children:[e.jsx(f,{children:"Código"}),e.jsx(C,{name:"codigo",value:i.codigo||"",onChange:k,required:!0})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Nombre"}),e.jsx(C,{name:"nombre",value:i.nombre||"",onChange:k,required:!0})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Costo (C$)"}),e.jsx(C,{type:"number",step:"0.01",name:"costo",value:i.costo||"",onChange:k,required:!0})]}),e.jsxs(h,{children:[e.jsx(f,{children:"% Ganancia"}),e.jsx(C,{type:"number",step:"0.01",value:S||"",onChange:$,placeholder:"ej: 50"})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Precio Venta (C$)"}),e.jsx(C,{type:"number",step:"0.01",name:"venta",value:i.venta||"",onChange:k,required:!0})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Precio Mayoreo (C$)"}),e.jsx(C,{type:"number",step:"0.01",name:"mayoreo",value:i.mayoreo||"",onChange:k})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Existencia"}),e.jsx(C,{name:"existencia",value:i.existencia||"",disabled:!0,style:{backgroundColor:"#f0f0f0"}}),e.jsx("small",{style:{marginTop:"5px",color:"#dc3545",fontWeight:"bold"},children:"¡Ajustar solo con el botón de stock!"})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Stock Mínimo"}),e.jsx(C,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"minimo",value:i.minimo||"",onChange:k})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Stock Máximo"}),e.jsx(C,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"maximo",value:i.maximo||"",onChange:k})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Descripción"}),e.jsx(C,{name:"descripcion",value:i.descripcion||"",onChange:k,placeholder:"Detalles del producto"})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Categoría"}),e.jsxs(U,{name:"id_categoria",value:i.id_categoria||"",onChange:k,children:[e.jsx("option",{value:"",children:"-- Sin Categoría --"}),y.map(t=>e.jsx("option",{value:t.id_categoria,children:t.nombre},t.id_categoria))]})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Proveedor"}),e.jsxs(U,{name:"id_proveedor",value:i.id_proveedor||"",onChange:k,children:[e.jsx("option",{value:"",children:"-- Sin Proveedor --"}),I.map(t=>e.jsx("option",{value:t.id_proveedor,children:t.nombre},t.id_proveedor))]})]}),e.jsxs(h,{children:[e.jsx(f,{children:"Tipo de Venta"}),e.jsxs(U,{name:"tipo_venta",value:i.tipo_venta||"Unidad",onChange:k,children:[e.jsx("option",{value:"Unidad",children:"Unidad"}),e.jsx("option",{value:"Juego",children:"Juego"}),e.jsx("option",{value:"Kit",children:"Kit"})]})]})]}),e.jsxs(oe,{children:[e.jsx(te,{type:"button",onClick:g,children:"Cancelar"}),e.jsx(re,{type:"submit",children:"Guardar Cambios"})]})]})})})})},Ko=()=>{var Me,Ne,ze;const[a,g]=n.useState([]),[v,u]=n.useState([]),[y,I]=n.useState([]),[d,i]=n.useState([]),[b,S]=n.useState(!1),[w,p]=n.useState(""),[x,k]=n.useState("description"),A=n.useDeferredValue(w),$=n.useRef(null),[j,t]=n.useState(""),[l,P]=n.useState(""),[_,L]=n.useState(null),[D,T]=n.useState(!1),[O,Q]=n.useState(!1),[se,Ye]=n.useState(null),[Pe,le]=n.useState(!1),[G,ue]=n.useState(null),[Xe,Ie]=n.useState(!1),[Je,_e]=n.useState(!1),[Ke,Ae]=n.useState(!1),[ge,he]=n.useState({isOpen:!1,product:null}),[ce,$e]=n.useState({isOpen:!1,title:"",message:""}),[ee,fe]=n.useState({open:!1,product:null,detail:null}),[q,de]=n.useState(1),[je,Ee]=n.useState({isOpen:!1,imageUrl:null});n.useEffect(()=>{de(1)},[A,j,l,x]),n.useEffect(()=>{window.scrollTo({top:0,behavior:"smooth"})},[q]);const E=n.useCallback(({title:o,message:c,type:r})=>$e({isOpen:!0,title:o,message:c,type:r}),[]),Ze=()=>$e({isOpen:!1}),Fe=n.useCallback(async()=>{const o=localStorage.getItem("token");return(await z.get("/api/products",{headers:{Authorization:`Bearer ${o}`}})).data},[]),B=n.useCallback(async()=>{try{const o=localStorage.getItem("token"),[c,r,s]=await Promise.all([Fe(),z.get("/api/categories",{headers:{Authorization:`Bearer ${o}`}}),z.get("/api/providers",{headers:{Authorization:`Bearer ${o}`}})]);g(c);const M=c.map(N=>{const ne=N.nombre??"",ye=N.codigo??"",F=N.descripcion??"",W=`${ae(ne)}|${ae(ye)}|${ae(F)}`,V=[ae(ne),ae(ye)],X=Number(N.costo||0),pe=Number(N.venta||0),xe=Number(N.existencia||0);return{...N,__fmt:{costo:`C$${X.toFixed(2)}`,venta:`C$${pe.toFixed(2)}`,costoTotal:`C$${(X*xe).toFixed(2)}`},q:W,qStarts:V}});u(M),I(r.data),i(s.data),S(!0)}catch{L("Error al cargar los datos.")}},[Fe]);n.useEffect(()=>{B()},[B]);const{filtered:be,totalFilteredCount:ve}=n.useMemo(()=>{const o=(A||"").toLowerCase().trim(),c=String(j||""),r=String(l||"");let s=v;c&&(s=s.filter(F=>String(F.id_categoria)===c)),r&&(s=s.filter(F=>String(F.id_proveedor)===r));const M=s.filter(F=>{if(x==="code"){const W=String(F.codigo||"").toLowerCase(),V=String(F.codigo_barras||"").toLowerCase();return W.includes(o)||V.includes(o)}else{const W=(F.nombre||"").toLowerCase(),V=(F.descripcion||"").toLowerCase(),X=String(F.codigo||"").toLowerCase();return W.includes(o)||V.includes(o)||X.includes(o)}});M.sort((F,W)=>{if(!o)return 0;const V=(F.nombre||"").toLowerCase().startsWith(o),X=(W.nombre||"").toLowerCase().startsWith(o);if(V&&!X)return-1;if(!V&&X)return 1;const pe=(F.codigo||"").toLowerCase().startsWith(o),xe=(W.codigo||"").toLowerCase().startsWith(o);return pe&&!xe?-1:!pe&&xe?1:0});const N=M.length,ne=(q-1)*ke;return{filtered:M.slice(ne,ne+ke),totalFilteredCount:N}},[v,A,j,l,q,x]),Qe=()=>T(!0),eo=o=>{Ye(o),Q(!0)},oo=o=>{ue(o),le(!0)},to=async o=>{var c,r;try{console.log("CLIENT SENDING CREATE PAYLOAD:",{...o,imagenLength:o.imagen?o.imagen.length:"NULL"});const s=localStorage.getItem("token");await z.post("/api/products",o,{headers:{Authorization:`Bearer ${s}`}}),T(!1),E({title:"Éxito",message:"Producto creado correctamente."}),await B()}catch(s){console.error("CLIENT CREATE ERROR:",s),E({title:"Error",message:((r=(c=s.response)==null?void 0:c.data)==null?void 0:r.msg)||"Error al crear el producto.",type:"error"})}},ro=async(o,c)=>{var r,s;try{console.log("CLIENT SENDING UPDATE PAYLOAD:",{...o,imagenLength:o.imagen?o.imagen.length:"NULL"});const M=localStorage.getItem("token");await z.put(`/api/products/${c}`,o,{headers:{Authorization:`Bearer ${M}`}}),Q(!1),E({title:"Éxito",message:"Producto actualizado correctamente."}),await B()}catch(M){console.error("CLIENT UPDATE ERROR:",M),E({title:"Error",message:((s=(r=M.response)==null?void 0:r.data)==null?void 0:s.msg)||"Error al actualizar el producto.",type:"error"})}},no=async()=>{var o;if(G)try{const c=localStorage.getItem("token");await z.delete(`/api/products/${G.id_producto}`,{headers:{Authorization:`Bearer ${c}`}}),await B(),le(!1),ue(null),E({title:"Éxito",message:`El producto ${G.nombre} fue eliminado.`})}catch(c){const r=(o=c==null?void 0:c.response)==null?void 0:o.data,s=(r==null?void 0:r.msg)||"No se pudo eliminar el producto.";E({title:"Error",message:s,type:"error"}),r!=null&&r.reasons&&fe({open:!0,product:G,detail:r.reasons})}},ao=async o=>{var c,r;try{const s=localStorage.getItem("token");await z.patch(`/api/products/${o.id_producto}/archive`,{},{headers:{Authorization:`Bearer ${s}`}}),fe({open:!1,product:null,detail:null}),le(!1),ue(null),await B(),E({title:"Archivado",message:`"${o.nombre}" fue archivado (inactivo).`})}catch(s){E({title:"Error",message:((r=(c=s==null?void 0:s.response)==null?void 0:c.data)==null?void 0:r.msg)||"No se pudo archivar el producto.",type:"error"})}},io=async(o,c,r)=>{var s,M;try{const N=localStorage.getItem("token");await z.patch(`/api/products/${o.id_producto}/stock`,{cantidad:c,razon:r},{headers:{Authorization:`Bearer ${N}`}}),he({isOpen:!1,product:null}),E({title:"Éxito",message:"Stock actualizado correctamente."}),await B()}catch(N){E({title:"Error",message:((M=(s=N.response)==null?void 0:s.data)==null?void 0:M.msg)||"No se pudo ajustar el stock."})}},so=async o=>{var c,r;try{const s=localStorage.getItem("token");await z.post("/api/categories",{nombre:o},{headers:{Authorization:`Bearer ${s}`}}),await B()}catch(s){E({title:"Error",message:((r=(c=s.response)==null?void 0:c.data)==null?void 0:r.msg)||"No se pudo agregar la categoría."})}},lo=async o=>{var c,r;try{const s=localStorage.getItem("token");await z.delete(`/api/categories/${o}`,{headers:{Authorization:`Bearer ${s}`}}),await B()}catch(s){E({title:"Error",message:((r=(c=s.response)==null?void 0:c.data)==null?void 0:r.msg)||"No se pudo eliminar la categoría. (Verifique que no esté en uso)"})}},co=async o=>{var c,r;try{const s=localStorage.getItem("token");await z.post("/api/providers",{nombre:o},{headers:{Authorization:`Bearer ${s}`}}),await B()}catch(s){E({title:"Error",message:((r=(c=s.response)==null?void 0:c.data)==null?void 0:r.msg)||"No se pudo agregar el proveedor."})}},po=async o=>{var c,r;try{const s=localStorage.getItem("token");await z.delete(`/api/providers/${o}`,{headers:{Authorization:`Bearer ${s}`}}),await B()}catch(s){E({title:"Error",message:((r=(c=s.response)==null?void 0:c.data)==null?void 0:r.msg)||"No se pudo eliminar el proveedor. (Verifique que no esté en uso)"})}};if(!b)return e.jsx(Ce,{children:e.jsxs(Le,{children:[e.jsx(Se,{}),e.jsx("p",{children:"Cargando Inventario..."})]})});if(_)return e.jsx(Ce,{children:e.jsx(Le,{style:{color:"#c53030"},children:_})});const xo=be.length<=Uo,Y=Math.ceil(ve/ke);return e.jsxs(Ce,{children:[e.jsxs(Io,{to:"/dashboard",children:[e.jsx(mo,{})," Volver al Dashboard"]}),e.jsxs(_o,{children:[e.jsxs(Ao,{children:[e.jsx(uo,{})," Gestión de Inventario"]}),e.jsxs($o,{children:[e.jsxs(J,{primary:!0,onClick:Qe,children:[e.jsx(Re,{})," Crear Producto"]}),e.jsxs(J,{secondary:!0,onClick:()=>Ie(!0),children:[e.jsx(go,{})," Categorías"]}),e.jsxs(J,{secondary:!0,onClick:()=>_e(!0),children:[e.jsx(ho,{})," Proveedores"]}),e.jsxs(J,{tertiary:!0,onClick:()=>Ae(!0),children:[e.jsx(Te,{})," Historial"]})]})]}),e.jsxs(Eo,{children:[e.jsxs("div",{style:{display:"flex",gap:"0.5rem"},children:[e.jsxs(Fo,{style:{flex:1},children:[e.jsx(fo,{style:{position:"absolute",left:12,top:14,color:"#a0aec0"}}),e.jsx(Mo,{ref:$,placeholder:x==="code"?"Buscar código...":"Buscar nombre...",value:w,onChange:o=>p(o.target.value),autoComplete:"off",autoCorrect:"off",spellCheck:!1})]}),e.jsx(De,{$active:x==="description",onClick:()=>k("description"),title:"Por Nombre",children:e.jsx(jo,{})}),e.jsx(De,{$active:x==="code",onClick:()=>k("code"),title:"Por Código",children:e.jsx(bo,{})})]}),e.jsxs(U,{value:j,onChange:o=>t(o.target.value),children:[e.jsx("option",{value:"",children:"Todas las categorías"}),y.map(o=>e.jsx("option",{value:o.id_categoria,children:o.nombre},o.id_categoria))]}),e.jsxs(U,{value:l,onChange:o=>P(o.target.value),children:[e.jsx("option",{value:"",children:"Todos los proveedores"}),d.map(o=>e.jsx("option",{value:o.id_proveedor,children:o.nombre},o.id_proveedor))]})]}),e.jsxs("div",{style:{textAlign:"right",marginBottom:".5rem",color:"#4a5568",fontWeight:"bold",fontSize:"0.9rem"},children:["Página ",q," de ",Y||1," | Mostrando ",be.length," de ",ve," productos filtrados"]}),e.jsx(No,{children:be.map(o=>{const c=xo?{initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{duration:.12}}:{},r=o.existencia>0&&o.existencia<=(o.minimo||5),s=o.existencia<=0;return e.jsxs(zo,{...c,children:[e.jsx("div",{className:"image-placeholder",onClick:()=>o.imagen&&Ee({isOpen:!0,imageUrl:o.imagen}),children:o.imagen?e.jsxs(e.Fragment,{children:[e.jsx("img",{src:o.imagen,alt:o.nombre}),e.jsx("div",{className:"overlay",children:e.jsx(vo,{})})]}):e.jsx("div",{className:"no-image-text",children:e.jsx(qe,{})})}),e.jsxs(Lo,{children:[e.jsx(Do,{title:o.nombre,children:o.nombre}),e.jsxs(Oo,{children:["Código: ",o.codigo]})]}),e.jsxs(Bo,{children:[e.jsxs(me,{children:[e.jsx("span",{children:"Costo"}),e.jsx("strong",{children:o.__fmt.costo})]}),e.jsxs(me,{children:[e.jsx("span",{children:"Venta"}),e.jsx("strong",{children:o.__fmt.venta})]}),e.jsxs(Ro,{$low:r,$out:s,children:[e.jsx("span",{children:"Existencia"}),e.jsx("strong",{children:o.existencia})]}),e.jsxs(me,{children:[e.jsx("span",{children:"Costo Total"}),e.jsx("strong",{children:o.__fmt.costoTotal})]})]}),e.jsxs(To,{children:[e.jsxs(we,{className:"adjust",title:"Ajustar Stock",onClick:()=>he({isOpen:!0,product:o}),children:[e.jsx(yo,{}),e.jsx(Co,{style:{marginLeft:4}})]}),e.jsxs(we,{className:"edit",onClick:()=>eo(o),children:[e.jsx(wo,{})," Editar"]}),e.jsxs(we,{className:"delete",onClick:()=>oo(o),children:[e.jsx(Ue,{})," Eliminar"]})]})]},o.id_producto)})}),ve>0&&e.jsxs("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",gap:"1.5rem",marginTop:"2rem",marginBottom:"3rem"},children:[e.jsx(J,{secondary:!0,onClick:()=>de(o=>Math.max(1,o-1)),disabled:q===1,children:"Anterior"}),e.jsx("div",{style:{display:"flex",gap:"8px"},children:[...Array(Y)].map((o,c)=>{const r=c+1;return Y>7&&r>2&&r<Y-1&&Math.abs(r-q)>1?r===3||r===Y-2?e.jsx("span",{children:"..."},r):null:e.jsx(J,{secondary:r!==q,primary:r===q,style:{minWidth:"40px",padding:"0.5rem"},onClick:()=>de(r),children:r},r)})}),e.jsx(J,{secondary:!0,onClick:()=>de(o=>Math.min(Y,o+1)),disabled:q===Y,children:"Siguiente"})]}),e.jsx(R,{children:D&&e.jsx(Go,{isOpen:D,onClose:()=>T(!1),onSave:to,categories:y,providers:d,allProductsRaw:a})}),e.jsx(R,{children:O&&e.jsx(Yo,{isOpen:O,onClose:()=>Q(!1),onSave:ro,productToEdit:se,categories:y,providers:d,allProductsRaw:a})}),e.jsx(R,{children:Pe&&e.jsx(Oe,{open:Pe,title:"Confirmar Eliminación",message:`¿Estás seguro de que quieres eliminar el producto "${G==null?void 0:G.nombre}"?`,onCancel:()=>le(!1),onConfirm:no,confirmLabel:"Sí, eliminar",danger:!0})}),e.jsx(R,{children:ee.open&&e.jsx(Oe,{open:ee.open,title:"Eliminación bloqueada",message:e.jsxs("div",{style:{textAlign:"left",lineHeight:1.6},children:["Este producto tiene referencias y no puede eliminarse.",e.jsx("br",{}),e.jsx("strong",{children:"Referencias:"}),e.jsx("br",{}),"Ventas: ",((Me=ee.detail)==null?void 0:Me.ventas)??0,e.jsx("br",{}),"Compras: ",((Ne=ee.detail)==null?void 0:Ne.compras)??0,e.jsx("br",{}),"Movimientos (kardex): ",((ze=ee.detail)==null?void 0:ze.kardex)??0,e.jsx("br",{}),e.jsx("br",{}),"Puedes ",e.jsx("strong",{children:"archivarlo"})," para ocultarlo del sistema sin perder historial."]}),onCancel:()=>fe({open:!1,product:null,detail:null}),onConfirm:()=>ao(ee.product),confirmLabel:"Archivar producto",danger:!1})}),e.jsx(R,{children:Xe&&e.jsx(Be,{title:"Gestionar Categorías",items:y,onAdd:so,onDelete:lo,onClose:()=>Ie(!1)})}),e.jsx(R,{children:Je&&e.jsx(Be,{title:"Gestionar Proveedores",items:d,onAdd:co,onDelete:po,onClose:()=>_e(!1)})}),e.jsx(R,{children:Ke&&e.jsx(Ho,{onClose:()=>Ae(!1)})}),e.jsx(R,{children:ge.isOpen&&e.jsx(Vo,{isOpen:ge.isOpen,product:ge.product,onClose:()=>he({isOpen:!1,product:null}),onConfirm:io})}),e.jsx(R,{children:ce.isOpen&&e.jsx(Wo,{isOpen:ce.isOpen,onClose:Ze,title:ce.title,message:ce.message})}),e.jsx(R,{children:je.isOpen&&e.jsx(qo,{isOpen:je.isOpen,imageSrc:je.imageUrl,onClose:()=>Ee({isOpen:!1,imageUrl:null})})})]})};export{Ko as default};
