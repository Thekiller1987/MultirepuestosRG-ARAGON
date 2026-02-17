import{u as Q,r as h,j as e,V as J,s,b2 as X,b3 as ee,a7 as re,a8 as te,t as z,b4 as oe,v as ae,n as ne}from"./vendor-BJZlzDLx.js";import{E as se}from"./index-eefq-jxX.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-BoQlG7Vl.js";const ie=z`from { opacity: 0; } to { opacity: 1; }`,ce=z`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`,le=s.div`
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    box-sizing: border-box;

    @media (max-width: 768px) {
        padding: 1rem;
    }
`,de=s.div`
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    gap: 1rem;
    width: 100%;
    max-width: 800px;
`,pe=s.button`
    padding: 0.75rem 1.5rem;
    border: none;
    background: rgba(255, 255, 255, 0.9);
    color: #667eea;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;

    &:hover {
        background: white;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
`,ge=s.div`
    background: rgba(255, 255, 255, 0.95);
    padding: 2.5rem;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: ${ie} 0.5s ease-out forwards;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    position: relative;
    box-sizing: border-box;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
`,he=s.label`
    border: 3px dashed ${t=>t.hasFile?"#10b981":t.isDragOver?"#667eea":"#d1d5db"};
    border-radius: 16px;
    padding: 3rem 2rem;
    width: 100%;
    cursor: pointer;
    transition: all 0.3s ease;
    background: ${t=>t.hasFile?"rgba(16, 185, 129, 0.05)":"rgba(255, 255, 255, 0.8)"};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    text-align: center;
    min-height: 200px;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        transition: left 0.5s;
    }

    &:hover::before {
        left: 100%;
    }

    &:hover {
        border-color: #667eea;
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
`;s.input` 
    display: none; 
`;const ue=s.code` 
    display: block; 
    padding: 1rem; 
    background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
    color: #e2e8f0;
    border-radius: 12px; 
    font-size: 0.9em; 
    margin-top: 1rem; 
    font-family: 'Fira Code', 'Consolas', monospace;
    width: 100%;
    overflow-x: auto;
    border: 1px solid #4a5568;
    line-height: 1.4;
`,I=s(ae)` 
    animation: ${ce} 1s linear infinite; 
`,xe=s.div`
    width: 100%;
    max-height: 400px;
    overflow: auto;
    margin-top: 2rem;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    background: white;
`,me=s.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
    background: white;

    th, td {
        padding: 12px 15px;
        text-align: left;
        border-bottom: 1px solid #f1f5f9;
        white-space: nowrap;
    }

    th {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        position: sticky;
        top: 0;
        z-index: 10;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: 0.75rem;
    }

    tr:hover {
        background-color: #f8fafc;
    }

    td {
        color: #475569;
    }
`,be=s.button`
    padding: 1.25rem 3rem;
    border: none;
    border-radius: 12px;
    background: ${t=>t.success?"linear-gradient(135deg, #10b981 0%, #059669 100%)":t.error?"linear-gradient(135deg, #ef4444 0%, #dc2626 100%)":t.disabled?"linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)":"linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
    color: white;
    cursor: ${t=>t.disabled?"not-allowed":"pointer"};
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    margin-top: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
    }

    &:hover:not(:disabled)::before {
        left: 100%;
    }

    &:hover:not(:disabled) {
        transform: translateY(-3px);
        box-shadow: 0 12px 35px rgba(0,0,0,0.2);
    }

    &:active:not(:disabled) {
        transform: translateY(-1px);
    }
`,fe=s.p`
    font-size: 1.1rem;
    font-weight: 500;
    color: ${t=>{switch(t.status){case"success":return"#10b981";case"error":return"#ef4444";case"uploading":return"#667eea";case"parsing":return"#f59e0b";default:return"#6b7280"}}};
    text-align: center;
    margin: 1rem 0;
    padding: 1rem;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);
`,ye=s(ne)`
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
    color: #ef4444;
    z-index: 100;
    background: rgba(239, 68, 68, 0.1);
    border-radius: 50%;
    padding: 5px;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(239, 68, 68, 0.2);
        transform: scale(1.1);
    }
`,v=t=>{if(typeof t!="string"||!t)return 0;let i=t.replace(/[$,]/g,"").trim();i=i.replace(",",".");const l=parseFloat(i);return isNaN(l)?0:parseFloat(l.toFixed(2))},ve=(t,i)=>{const l=[];for(let n=0;n<t.length;n+=i)l.push(t.slice(n,n+i));return l},we=()=>{const t=Q(),[i,l]=h.useState(null),[n,x]=h.useState([]),[m,j]=h.useState(!1),[b,d]=h.useState(null),[T,p]=h.useState("Sube un archivo CSV con tus productos."),k=localStorage.getItem("token"),[S,y]=h.useState(!1),[f,E]=h.useState(!0),M=()=>{t(-1)},A=()=>{l(null),x([]),d(null),p("Sube un archivo CSV con tus productos.")},$=r=>{r.preventDefault(),y(!0)},V=r=>{r.preventDefault(),y(!1)},K=r=>{r.preventDefault(),y(!1);const o=r.dataTransfer.files;o.length>0&&C(o[0])},N=r=>{const o=Object.keys(r),a=_=>o.find(q=>_.some(G=>q.trim().toLowerCase()===G.toLowerCase())),g=a(["Código","Codigo","Code","ID"]),c=a(["Producto","Nombre","Name","Description"]),u=a(["P. Costo","P.Costo","Costo","Cost"]),O=a(["P. Venta","P.Venta","Precio","Venta","Price"]),W=a(["P. Mayoreo","P.Mayoreo","Mayoreo","Wholesale"]),H=a(["Existencia","Cantidad","Stock","Qty"]),w=a(["Departamento","Departamento","Categoria","Category"]),P=a(["Proveedor","proveedor","Supplier"]),Y=a(["Inv. Mínimo","Minimo","Min"]),Z=a(["Inv. Máximo","Maximo","Max"]),D=a(["Tipo de Venta","Tipo","Type"]),F=a(["Descripción","Descripcion","Description","Detalles"]);return{codigo:g?String(r[g]||"").trim():"",nombre:c?String(r[c]||"").trim():"",descripcion:F?String(r[F]||"").trim():"",costo:v(r[u]),precio:v(r[O]),mayoreo:v(r[W]),existencia:parseInt(r[H]||0,10),departamento:w?String(r[w]||"N/A"):"N/A",proveedor:P?String(r[P]||"N/A"):"N/A",minimo:parseInt(r[Y]||0,10),maximo:parseInt(r[Z]||0,10),tipo_venta:D?String(r[D]||"UNIDAD"):"UNIDAD"}},C=r=>{if(!r||!r.name.endsWith(".csv")){p("Error: Por favor, selecciona un archivo CSV."),d("error"),l(null),x([]);return}l(r),d("parsing"),p(`Leyendo archivo: ${r.name}...`),oe.parse(r,{header:!0,skipEmptyLines:!0,dynamicTyping:!1,complete:function(o){if(o.errors.length){p(`Error de lectura en línea ${o.errors[0].row}. Verifica el formato.`),d("error");return}const a=o.data.map(g=>N(g)).filter(g=>g.codigo&&g.nombre);a.length===0?(p("Error: No se encontraron productos válidos o las columnas no coinciden."),d("error")):(x(a),d("ready"),p(`✅ Archivo listo: ${a.length} productos identificados.`))}})},U=r=>{const o=r.target.files[0];r.target.value=null,C(o)},B=async()=>{if(n.length===0||m||!k){p("Error: No estás autenticado o no hay datos para subir."),d("error");return}j(!0),d("uploading");const o=ve(n,500);let a=0,g=0;try{for(let c=0;c<o.length;c++){const u=o[c];p(`🚚 Procesando lote ${c+1} de ${o.length}...`),await se({items:u,replaceStock:f},k),a+=u.length,g++}d("success"),p(`🎉 ¡Carga Exitosa! ${a} productos procesados.`)}catch(c){console.error("Error en la carga masiva (API):",c),d("error");const u=c.message.includes("HTTP")?"Error de conexión.":c.message;p(`❌ Error. ${g} lotes guardados. ${u}`)}finally{j(!1),l(null),x([])}},R=()=>{switch(b){case"parsing":case"uploading":return e.jsx(I,{size:"2em",color:"#3b82f6"});case"ready":case"success":return e.jsx(te,{size:"2em",color:"#28a745"});case"error":return e.jsx(re,{size:"2em",color:"#dc3545"});default:return e.jsx(ee,{size:"3em",color:"#6c757d"})}},L=()=>{if(n.length===0)return null;const r=n.slice(0,5);return e.jsxs(xe,{children:[e.jsxs("h4",{style:{padding:"1rem",margin:0,background:"#f8fafc",borderBottom:"1px solid #e5e7eb"},children:[e.jsx(X,{style:{marginRight:"0.5rem"}}),"Previsualización (",n.length," filas totales)"]}),e.jsxs(me,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Código"}),e.jsx("th",{children:"Producto"}),e.jsx("th",{children:"P. Costo"}),e.jsx("th",{children:"P. Venta"}),e.jsx("th",{children:"Exist."}),e.jsx("th",{children:"Depto."})]})}),e.jsx("tbody",{children:r.map((o,a)=>e.jsxs("tr",{children:[e.jsx("td",{children:o.codigo}),e.jsx("td",{children:o.nombre}),e.jsx("td",{children:o.costo.toFixed(2)}),e.jsx("td",{children:o.precio.toFixed(2)}),e.jsx("td",{children:o.existencia}),e.jsx("td",{children:o.departamento})]},a))})]}),n.length>5&&e.jsxs("p",{style:{textAlign:"center",margin:"1rem 0",color:"#6b7280",fontSize:"0.8em",padding:"0.5rem",background:"#f8fafc"},children:["... y ",n.length-5," filas más."]})]})};return e.jsxs(le,{children:[e.jsxs(de,{children:[e.jsxs(pe,{onClick:M,children:[e.jsx(J,{})," Regresar"]}),e.jsx("h1",{style:{fontSize:"1.8rem",color:"white",margin:0,textShadow:"0 2px 4px rgba(0,0,0,0.1)"},children:"Carga Masiva de Inventario"})]}),e.jsxs(ge,{children:[i&&e.jsx(ye,{size:20,onClick:A,"aria-label":"Limpiar archivo"}),e.jsxs(he,{htmlFor:"file-upload",hasFile:!!i,isDragOver:S,onDragOver:$,onDragLeave:V,onDrop:K,children:[R(),e.jsx("h3",{style:{margin:0,fontWeight:600,color:S?"#667eea":"#374151"},children:i?i.name:"Arrastra o haz clic para subir el archivo CSV"}),e.jsx("p",{style:{margin:0,fontSize:"0.9em",color:"#6b7280"},children:"Máximo 10,000 filas por carga."}),'type="file" accept=".csv" onChange=',U,"disabled=",m,"/>"]}),e.jsx(fe,{status:b,children:T}),L(),e.jsxs("div",{style:{marginTop:"1.5rem",display:"flex",alignItems:"center",gap:"10px",background:"rgba(255,255,255,0.7)",padding:"10px 20px",borderRadius:"8px",border:"1px solid #e2e8f0"},children:[e.jsx("input",{type:"checkbox",id:"replaceStock",checked:f,onChange:r=>E(r.target.checked),style:{width:"18px",height:"18px",cursor:"pointer"}}),e.jsx("label",{htmlFor:"replaceStock",style:{cursor:"pointer",color:"#334155",fontWeight:"500"},children:"Reemplazar Stock Existente"})]}),e.jsx("p",{style:{margin:"5px 0 0 0",fontSize:"0.85rem",color:f?"#d97706":"#10b981"},children:f?"⚠️ Si el producto existe, su stock será SOBRESCRITO por el del archivo.":"ℹ️ El stock del archivo se SUMARÁ al existente."}),e.jsx(be,{onClick:B,disabled:n.length===0||m,success:b==="success",error:b==="error",children:m?e.jsxs(e.Fragment,{children:[e.jsx(I,{}),"Procesando..."]}):`Subir ${n.length} Productos`}),e.jsx("h4",{style:{marginTop:"2rem",marginBottom:"0.5rem",color:"#374151",textAlign:"center"},children:"Formato Requerido del CSV"}),e.jsx(ue,{children:"Código, Producto, P. Costo, P. Venta, P. Mayoreo, Existencia, Departamento, Proveedor, Inv. Mínimo, Inv. Máximo, Tipo de Venta"}),e.jsx("p",{style:{fontSize:"0.8rem",textAlign:"center",color:"#6b7280",marginTop:"5px"},children:'* Reconocimiento inteligente: "P.Venta", "Precio", "Venta" son válidos. "Proveedor" y "proveedor" también.'})]})]})};export{we as default};
