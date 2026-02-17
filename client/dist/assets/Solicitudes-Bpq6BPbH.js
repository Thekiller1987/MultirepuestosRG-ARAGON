import{r as n,j as t,U as L,S as j,t as k,V as $,b7 as T,g as A,ad as N,a3 as U,a4 as G,q as i,T as P}from"./vendor-Dp7SZ6lv.js";import{u as V,K as W,L as Y,M as H,N as M,O as K}from"./index-CRUdEL4u.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-DjsH35t9.js";const O=i.div`
  padding: 20px;
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  
  @media(max-width: 640px) {
    padding: 10px;
  }
`,Q=i.div`
  display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;

  @media(min-width: 768px) { 
    flex-direction: row; justify-content: space-between; align-items: center; 
  }
`,X=i.h1`
  font-size: 1.8rem; color: #1e293b; display: flex; align-items: center; gap: 0.75rem; margin: 0; font-weight: 800;
  svg { color: #f59e0b; }
`,J=i(P)`
  display: inline-flex; align-items: center; gap: 8px;
  color: #64748b; text-decoration: none; font-weight: 600; font-size: 0.95rem;
  padding: 8px 16px; margin-bottom: 1rem; border-radius: 99px;
  background: white; border: 1px solid #cbd5e1;
  transition: all 0.2s;
  width: fit-content;
  
  &:hover { color: #3b82f6; background: #eff6ff; border-color: #bfdbfe; transform: translateX(-2px); }
`,Z=i.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
  border: 1px solid #e2e8f0;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`,w=i.input`
  flex: 1;
  padding: 1rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
  background: #f8fafc;

  &:focus {
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`,v=i.button`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  padding: 0 2rem;
  height: 54px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
  }
  
  &:active { transform: translateY(0); }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`,q=i.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`,ee=i.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  /* Estado Completado */
  ${r=>r.completed&&`
    background: #f1f5f9;
    opacity: 0.85;
    border-color: #cbd5e1;
    &:hover { opacity: 1; }
  `}

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    border-color: #cbd5e1;
  }

  /* Borde lateral de estado */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 6px;
    background: ${r=>r.completed?"#10b981":"#f59e0b"};
  }
`,te=i.div`
  flex: 1;
  margin-bottom: 1.5rem;
  padding-right: 2rem; /* Espacio para el check button */
`,re=i.p`
  font-size: 1.15rem;
  color: ${r=>r.completed?"#64748b":"#1e293b"};
  text-decoration: ${r=>r.completed?"line-through":"none"};
  margin: 0;
  line-height: 1.5;
  font-weight: 500;
`,oe=i.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
  font-size: 0.85rem;
  color: #64748b;
`,ie=i.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  padding: 4px 10px;
  border-radius: 99px;
  border: 1px solid #e2e8f0;
  font-weight: 600;
  color: #475569;
`,ae=i.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
`,ne=i.button`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: white;
  border: 2px solid ${r=>r.completed?"#10b981":"#cbd5e1"};
  color: ${r=>r.completed?"#10b981":"#cbd5e1"};
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem;
  transition: all 0.2s;

  &:hover {
    border-color: ${r=>r.completed?"#059669":"#3b82f6"};
    color: ${r=>r.completed?"#059669":"#3b82f6"};
    transform: scale(1.1);
  }
`,E=i.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  color: #94a3b8;
  background: white;
  border-radius: 16px;
  border: 2px dashed #e2e8f0;
  
  svg { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }
  p { font-size: 1.1rem; margin: 0; }
`,pe=()=>{const{user:r,token:s}=V(),[f,c]=n.useState([]),[u,h]=n.useState(""),[x,y]=n.useState(!1),[S,C]=n.useState(!0),[l,m]=n.useState(null),[p,g]=n.useState(""),d=n.useCallback(async()=>{try{const e=await W(s);e&&c(e)}catch(e){console.error("Error loading requests",e)}finally{C(!1)}},[s]);n.useEffect(()=>{d();const e=setInterval(()=>{!document.hidden&&!l&&d()},5e3);return()=>clearInterval(e)},[d,l]);const z=async e=>{if(e.preventDefault(),!!u.trim()){y(!0);try{await Y({descripcion:u,usuario_id:(r==null?void 0:r.id)||(r==null?void 0:r.id_usuario),usuario_nombre:(r==null?void 0:r.nombre)||(r==null?void 0:r.nombre_usuario)||"Usuario"},s),h(""),d()}catch(o){console.error("Error adding request",o),alert("Error al crear solicitud")}finally{y(!1)}}},_=async e=>{const o=!e.check_mark;c(a=>a.map(b=>b.id===e.id?{...b,check_mark:o,estado:o?"completado":"pendiente"}:b));try{await H(e.id,o,s)}catch(a){console.error("Error toggling",a),d()}},D=async e=>{if(window.confirm("¿Seguro que deseas eliminar esta solicitud?"))try{await K(e,s),c(o=>o.filter(a=>a.id!==e))}catch(o){console.error("Error deleting",o),alert("Error al eliminar")}},F=e=>{m(e.id),g(e.descripcion)},I=()=>{m(null),g("")},R=async e=>{if(p.trim())try{await M(e,p,s),c(o=>o.map(a=>a.id===e?{...a,descripcion:p}:a)),m(null)}catch(o){console.error("Error updating",o),alert("Error al actualizar")}},B=e=>{if(!e)return"";const o=new Date(e);return o.toLocaleDateString("es-NI",{month:"short",day:"numeric"})+" "+o.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};return t.jsxs(O,{children:[t.jsxs(J,{to:"/dashboard",children:[t.jsx(L,{})," Regresar al Dashboard"]}),t.jsxs(Q,{children:[t.jsxs(X,{children:[t.jsx(j,{})," Solicitudes de Productos"]}),t.jsx("div",{style:{color:"#64748b",fontWeight:"500"},children:"Gestiona los pedidos y requerimientos del equipo"})]}),t.jsx("form",{onSubmit:z,children:t.jsxs(Z,{children:[t.jsx(w,{placeholder:"¿Qué producto necesitas pedir? Escribe aquí...",value:u,onChange:e=>h(e.target.value),disabled:x}),t.jsx(v,{type:"submit",disabled:x,children:x?t.jsx(k,{className:"fa-spin"}):t.jsxs(t.Fragment,{children:[t.jsx($,{})," Agregar Solicitud"]})})]})}),S?t.jsxs(E,{children:[t.jsx(k,{className:"fa-spin"}),t.jsx("p",{children:"Cargando solicitudes..."})]}):t.jsxs(q,{children:[f.map(e=>t.jsxs(ee,{completed:!!e.check_mark,children:[t.jsx(ne,{completed:!!e.check_mark,onClick:()=>_(e),title:e.check_mark?"Marcar como pendiente":"Completar solicitud",children:e.check_mark?t.jsx(T,{}):null}),t.jsx(te,{children:l===e.id?t.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:[t.jsx(w,{autoFocus:!0,value:p,onChange:o=>g(o.target.value),style:{padding:"8px",fontSize:"0.95rem"}}),t.jsxs("div",{style:{display:"flex",gap:"10px",marginTop:"5px"},children:[t.jsx(v,{onClick:()=>R(e.id),style:{height:"36px",fontSize:"0.9rem",padding:"0 1rem"},children:"Guardar"}),t.jsx("button",{onClick:I,style:{background:"white",border:"1px solid #cbd5e1",borderRadius:"8px",padding:"0 1rem",cursor:"pointer",color:"#64748b",fontWeight:600},children:"Cancelar"})]})]}):t.jsx(re,{completed:!!e.check_mark,children:e.descripcion})}),t.jsxs(oe,{children:[t.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[t.jsxs(ie,{title:`ID: ${e.usuario_id}`,children:[t.jsx(A,{size:11})," ",e.usuario_nombre||"Desconocido"]}),t.jsxs(ae,{children:[t.jsx(N,{size:11})," ",B(e.fecha_creacion)]})]}),t.jsxs("div",{style:{display:"flex",gap:"8px"},children:[!e.check_mark&&l!==e.id&&t.jsx("button",{onClick:()=>F(e),style:{border:"none",background:"transparent",cursor:"pointer",color:"#3b82f6",fontSize:"1.1rem"},title:"Editar",children:t.jsx(U,{})}),t.jsx("button",{onClick:()=>D(e.id),style:{border:"none",background:"transparent",cursor:"pointer",color:"#ef4444",fontSize:"1rem"},title:"Eliminar",children:t.jsx(G,{})})]})]})]},e.id)),f.length===0&&t.jsxs(E,{children:[t.jsx(j,{}),t.jsx("p",{children:"No hay solicitudes pendientes."}),t.jsx("small",{children:"¡Agrega una nueva solicitud arriba!"})]})]})]})};export{pe as default};
