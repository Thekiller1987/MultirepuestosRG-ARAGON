import{r as t,j as e,A as q,a as b,q as o,m as Z,T as oe}from"./vendor-Dp7SZ6lv.js";import"./scanner-vendor-DfxRpMWJ.js";const ae=({closed:n})=>e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:n?e.jsxs(e.Fragment,{children:[e.jsx("path",{d:"M9.88 9.88a3 3 0 1 0 4.24 4.24"}),e.jsx("path",{d:"M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"}),e.jsx("path",{d:"M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"}),e.jsx("line",{x1:"2",y1:"2",x2:"22",y2:"22"})]}):e.jsxs(e.Fragment,{children:[e.jsx("path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"})]})}),te=()=>e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"m15 18-6-6 6-6"})}),C=o.div`
  padding: 2rem 4rem;
  background-color: #f8f9fa;
  min-height: 100vh;

  // 💡 MOBILE: Ajustar padding
  @media (max-width: 768px) {
    padding: 1rem;
    min-height: 100dvh;
  }
`,ne=o.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  // 💡 MOBILE: Apilar en pantallas pequeñas
  @media (max-width: 500px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`,ie=o.h1`
  font-size: 2.5rem;
  color: #343a40;

  // 💡 MOBILE: Reducir tamaño de fuente
  @media (max-width: 768px) {
    font-size: 1.8rem;
    text-align: center;
  }
`,l=o.button`
  padding: 0.7rem 1.3rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);

  &:active {
    transform: scale(0.98);
    box-shadow: none;
  }
`,se=o(oe)`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: #495057;
    font-weight: 600;
    margin-bottom: 2rem;
    &:hover {
        color: #007bff;
    }

    // 💡 MOBILE: Centrar y hacer el botón más visible
    @media (max-width: 768px) {
      margin-bottom: 1.5rem;
      font-size: 1rem;
      align-self: flex-start;
    }
`,de=o(l)`
  background-color: #28a745;
  color: white;
  &:hover { background-color: #218838; }

  // 💡 MOBILE: Ocupar todo el ancho cuando apilado
  @media (max-width: 500px) {
    width: 100%;
    justify-content: center;
  }
`,M=o(l)`
  background: none;
  border: 1px solid #ffc107;
  color: #ffc107;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  &:hover { 
    background-color: #ffc107;
    color: #212529;
  }
`,w=o(l)`
  background: none;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 0.5rem 1rem;
  &:hover { 
    background-color: #dc3545;
    color: white;
  }
`,le=o.div`
  display: none; /* Oculto por defecto */

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`,ce=o.div`
  background-color: white;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-left: 5px solid ${n=>n.$roleColor||"#007bff"};
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: 
    "name role"
    "id id"
    "actions actions";
  gap: 0.5rem;
`,me=o.p`
  margin: 0;
  font-size: 0.9rem;
  color: #6c757d;
  strong {
    color: #343a40;
    font-weight: 700;
  }
`,pe=o.p`
  grid-area: name;
  font-size: 1.1rem;
  font-weight: 700;
  color: #343a40;
  margin: 0;
`,he=o.span`
  grid-area: role;
  text-align: right;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${n=>n.$roleColor};
`,ue=o.div`
  grid-area: actions;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.8rem;

  ${M}, ${w} {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
    margin-right: 0;
  }
`,xe=o.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.07);
  border-radius: 12px;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none; /* Ocultar la tabla en móvil */
  }
`,j=o.th`
  background-color: #343a40;
  color: white;
  padding: 1.2rem 1rem;
  text-align: left;
  font-weight: 600;
`,p=o.td`
  padding: 1.2rem 1rem;
  border-bottom: 1px solid #dee2e6;
  color: #495057;
`,T=o.tr`
    &:last-child ${p} {
        border-bottom: none;
    }
    &:hover {
        background-color: #f8f9fa;
    }
`,V=o.p`
  font-size: 1.2rem;
  color: #6c757d;
`,N=o(Z.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`,F=o(Z.form)`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  // 💡 MOBILE: Ocupar más espacio en pantalla y ajuste de padding
  @media (max-width: 500px) {
    width: 95%;
    padding: 1.5rem;
    margin: 1rem;
  }
`,R=o.h2`
  margin-top: 0;
  margin-bottom: 2rem;
  color: #343a40;
  text-align: center;

  @media (max-width: 500px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`,E=o.input`
  width: 100%;
  padding: 0.8rem 1rem;
  margin-bottom: 1.2rem;
  border-radius: 8px;
  border: 1px solid #ced4da;
  font-size: 1rem;

  // 💡 MOBILE: Fuente ligeramente más grande para tacto
  @media (max-width: 768px) {
    padding: 0.9rem 1rem;
    font-size: 1.05rem;
  }
`,ge=o.select`
  width: 100%;
  padding: 0.8rem 1rem;
  margin-bottom: 1.2rem;
  border-radius: 8px;
  border: 1px solid #ced4da;
  font-size: 1rem;

  // 💡 MOBILE: Fuente ligeramente más grande para tacto
  @media (max-width: 768px) {
    padding: 0.9rem 1rem;
    font-size: 1.05rem;
  }
`,W=o.div`
  position: relative;
  width: 100%;
`,fe=o.span`
  position: absolute;
  right: 15px;
  top: 15px;
  cursor: pointer;
  user-select: none;
  color: #adb5bd;

  // 💡 MOBILE: Ajustar posición
  @media (max-width: 768px) {
    top: 17px;
    right: 18px;
  }
`,G=o.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;

  // 💡 MOBILE: Ocupar todo el ancho en móvil
  @media (max-width: 500px) {
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1.5rem;

    ${l} {
      width: 100%;
      justify-content: center;
    }
  }
`,be=o(l)`
  background-color: #007bff;
  color: white;
  &:hover { background-color: #0069d9; }
`,H=o(l)`
  background-color: #f8f9fa;
  color: #6c757d;
  border: 1px solid #ced4da;
  &:hover { background-color: #e2e6ea; }
`,je=o.p`
  color: #dc3545;
  font-size: 0.9rem;
  text-align: center;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
  min-height: 1.2rem;
`,ke=()=>{const[n,B]=t.useState([]),[J,I]=t.useState(!0),[z,y]=t.useState(null),[K,c]=t.useState(!1),[i,O]=t.useState(null),[a,k]=t.useState({nombre_usuario:"",password:"",confirmPassword:"",rol:"Vendedor"}),[h,v]=t.useState(!1),[Q,m]=t.useState(""),[X,u]=t.useState(!1),[s,S]=t.useState(null),_=async()=>{try{I(!0),y(null);const g={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},{data:d}=await b.get("/api/users",g);B(d)}catch{y("Error al cargar los usuarios.")}finally{I(!1)}};t.useEffect(()=>{_()},[]);const A=r=>{switch(r){case"Administrador":return"#dc3545";case"Contador":return"#ffc107";case"Vendedor":return"#007bff";default:return"#6c757d"}},x=r=>{k({...a,[r.target.name]:r.target.value})},Y=()=>{O(null),k({nombre_usuario:"",password:"",confirmPassword:"",rol:"Vendedor"}),m(""),v(!1),c(!0)},L=r=>{O(r),k({nombre_usuario:r.nombre_usuario,password:"",confirmPassword:"",rol:r.rol}),m(""),v(!1),c(!0)},$=r=>{S(r),u(!0)},ee=async()=>{if(s)try{const g={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}};await b.delete(`/api/users/${s.id_usuario}`,g),B(n.filter(d=>d.id_usuario!==s.id_usuario)),u(!1),S(null)}catch{y("Error al eliminar el usuario.")}},re=async r=>{var D,U;if(r.preventDefault(),m(""),(!i||a.password)&&a.password!==a.confirmPassword){m("Las contraseñas no coinciden.");return}const d={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}};try{if(i){const f={rol:a.rol};a.password&&(f.password=a.password),await b.put(`/api/users/${i.id_usuario}`,f,d)}else await b.post("/api/auth/register",{nombre_usuario:a.nombre_usuario,password:a.password,rol:a.rol},d);c(!1),_()}catch(f){m(((U=(D=f.response)==null?void 0:D.data)==null?void 0:U.msg)||"Error al guardar. Verifique los datos.")}},P={hidden:{opacity:0,y:-50,scale:.95},visible:{opacity:1,y:0,scale:1},exit:{opacity:0,y:50,scale:.95}};return J?e.jsx(C,{children:e.jsx(V,{children:"Cargando usuarios..."})}):z?e.jsx(C,{children:e.jsx(V,{style:{color:"red"},children:z})}):e.jsxs(C,{children:[e.jsxs(se,{to:"/dashboard",children:[e.jsx(te,{})," Volver al Dashboard"]}),e.jsxs(ne,{children:[e.jsx(ie,{children:"Gestión de Usuarios"}),e.jsxs(de,{onClick:Y,children:[e.jsx("span",{style:{fontSize:"1.2rem"},children:"+"})," Crear Nuevo Usuario"]})]}),e.jsxs(xe,{children:[e.jsx("thead",{children:e.jsxs(T,{children:[e.jsx(j,{children:"ID"}),e.jsx(j,{children:"Nombre de Usuario"}),e.jsx(j,{children:"Rol"}),e.jsx(j,{children:"Acciones"})]})}),e.jsx("tbody",{children:n.map(r=>e.jsxs(T,{children:[e.jsx(p,{children:r.id_usuario}),e.jsx(p,{children:r.nombre_usuario}),e.jsx(p,{children:r.rol}),e.jsxs(p,{children:[e.jsx(M,{onClick:()=>L(r),children:"✏️ Editar"}),e.jsx(w,{onClick:()=>$(r),children:"🗑️ Eliminar"})]})]},r.id_usuario))})]}),e.jsx(le,{children:n.map(r=>e.jsxs(ce,{$roleColor:A(r.rol),children:[e.jsx(pe,{children:r.nombre_usuario}),e.jsx(he,{$roleColor:A(r.rol),children:r.rol}),e.jsxs(me,{style:{gridArea:"id"},children:["ID: ",e.jsx("strong",{children:r.id_usuario})]}),e.jsxs(ue,{children:[e.jsx(M,{onClick:()=>L(r),children:"✏️ Editar"}),e.jsx(w,{onClick:()=>$(r),children:"🗑️ Eliminar"})]})]},r.id_usuario))}),e.jsx(q,{children:K&&e.jsx(N,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>c(!1),children:e.jsxs(F,{variants:P,initial:"hidden",animate:"visible",exit:"exit",onSubmit:re,onClick:r=>r.stopPropagation(),children:[e.jsx(R,{children:i?"Editar Usuario":"Crear Nuevo Usuario"}),e.jsx(je,{children:Q}),e.jsx(E,{type:"text",name:"nombre_usuario",placeholder:"Nombre de usuario",value:a.nombre_usuario,onChange:x,disabled:!!i,required:!0}),e.jsxs(W,{children:[e.jsx(E,{type:h?"text":"password",name:"password",placeholder:i?"Nueva contraseña (opcional)":"Contraseña",value:a.password,onChange:x,required:!i}),e.jsx(fe,{onClick:()=>v(!h),children:e.jsx(ae,{closed:!h})})]}),(!i||i&&a.password)&&e.jsx(W,{children:e.jsx(E,{type:h?"text":"password",name:"confirmPassword",placeholder:"Confirmar contraseña",value:a.confirmPassword,onChange:x,required:!0})}),e.jsxs(ge,{name:"rol",value:a.rol,onChange:x,children:[e.jsx("option",{value:"Vendedor",children:"Vendedor"}),e.jsx("option",{value:"Contador",children:"Contador"}),e.jsx("option",{value:"Administrador",children:"Administrador"})]}),e.jsxs(G,{children:[e.jsx(H,{type:"button",onClick:()=>c(!1),children:"Cancelar"}),e.jsx(be,{type:"submit",children:"Guardar Cambios"})]})]})})}),e.jsx(q,{children:X&&e.jsx(N,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>u(!1),children:e.jsxs(F,{as:"div",variants:P,initial:"hidden",animate:"visible",exit:"exit",onClick:r=>r.stopPropagation(),children:[e.jsx(R,{children:"Confirmar Eliminación"}),e.jsxs("p",{children:["¿Estás seguro de que quieres eliminar al usuario ",e.jsx("strong",{children:s==null?void 0:s.nombre_usuario}),"? Esta acción no se puede deshacer."]}),e.jsxs(G,{children:[e.jsx(H,{onClick:()=>u(!1),children:"Cancelar"}),e.jsx(w,{style:{backgroundColor:"#dc3545",color:"white"},onClick:ee,children:"Sí, Eliminar"})]})]})})})]})};export{ke as default};
