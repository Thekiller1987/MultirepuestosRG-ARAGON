import{r as o,j as e,h as T,i as z,k as B,n as L,o as q,p as R,q as U,s as t,t as m,v as H}from"./vendor-BHEUBfle.js";import{u as X,l as Y}from"./index-CwDrMf7i.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-BzGOTXeo.js";const K="/icons/logo.png",W="#0b1220",J="#1d2b64",k="#4A90E2",F="#3B7ADF",b="#e6ecff",d="#99a3c4",$="rgba(255, 255, 255, 0.08)",S="rgba(255, 255, 255, 0.18)",Q=m`to { transform: rotate(360deg); }`,V=m`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`,G=m`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`,Z=U`
  html, body, #root {
    height: 100%;
    margin: 0;
    font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial;
    color: ${b};
    background:
      radial-gradient(1200px 800px at 15% 10%, #2b3d6d 0%, transparent 60%),
      radial-gradient(900px 600px at 85% 90%, #18325b 0%, transparent 60%),
      linear-gradient(135deg, ${W} 0%, ${J} 100%);
    -webkit-tap-highlight-color: transparent;
    
    // 💡 INICIO CÓDIGO AÑADIDO/MODIFICADO: Ajuste de scroll en móvil
    @media (max-width: 768px) {
        // Esto asegura que el fondo y el scroll se manejen bien en pantallas pequeñas
        min-height: 100vh;
        min-height: 100dvh; /* Para Safari y Chrome móvil */
    }
    // 💡 FIN CÓDIGO AÑADIDO/MODIFICADO
  }
`,ee=t.main`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
  
  // 💡 INICIO CÓDIGO AÑADIDO/MODIFICADO: Ajuste de padding en móvil
  @media (max-width: 768px) {
    padding: 16px; 
    // Evita que el teclado virtual empuje el contenido si el foco está en un input
    align-items: flex-start; 
    padding-top: 5vh; 
    padding-bottom: 5vh;
  }
  // 💡 FIN CÓDIGO AÑADIDO/MODIFICADO
`,ae=t.div`
  position: absolute;
  inset: -20%;
  background: linear-gradient(-45deg, #4674ff, #3f7efb, #21c8f6, #7f53ac);
  filter: blur(72px) saturate(120%);
  opacity: 0.13;
  background-size: 400% 400%;
  animation: ${V} 22s ease infinite;
  animation-play-state: ${r=>r.$paused?"paused":"running"};
  pointer-events: none;
`,te=t.form`
  width: min(440px, 94vw);
  background: ${$};
  border: 1px solid ${S};
  border-radius: 28px;
  backdrop-filter: ${r=>r.$typing?"saturate(120%) blur(6px)":"saturate(120%) blur(14px)"};
  -webkit-backdrop-filter: ${r=>r.$typing?"saturate(120%) blur(6px)":"saturate(120%) blur(14px)"};
  box-shadow:
    0 18px 48px rgba(0,0,0,0.42),
    inset 0 1px 0 rgba(255,255,255,0.08);
  padding: clamp(22px, 5.2vw, 34px);
  display: grid;
  gap: clamp(12px, 2.8vw, 18px);
  animation: ${G} .5s ease both;
  
  // 💡 INICIO CÓDIGO AÑADIDO/MODIFICADO: Ajuste del formulario en móvil
  @media (max-width: 768px) {
      width: 100%; /* Ocupa todo el ancho en móvil */
      max-width: 400px; 
      padding: 24px;
      margin-top: auto; /* Permite centrar mejor si Stage tiene flex */
      margin-bottom: auto;
  }
  // 💡 FIN CÓDIGO AÑADIDO/MODIFICADO
`,ne=t.div`
  display: grid;
  place-items: center;
  padding: 20px;
  background: transparent;
  margin-bottom: 10px;
`,oe=t.img`
  width: clamp(180px, 60vw, 240px);
  max-height: 180px;
  object-fit: contain;
  display: block;
  user-select: none;
  pointer-events: none;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));
  
  @media (max-width: 480px) {
    width: 160px;
  }
`,re=t.h2`
  margin: 2px 0 0;
  font-size: clamp(1.5rem, 4.8vw, 1.9rem);
  text-align: center;
  font-weight: 800;
`,ie=t.p`
  margin: -2px 0 6px;
  color: ${d};
  text-align: center;
  font-size: clamp(.9rem, 3.4vw, .95rem);
`,C=t.label`
  display: grid;
  grid-template-columns: 42px 1fr;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 16px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.14);
  transition: box-shadow .25s ease, border-color .25s ease, background .25s ease;
  &:focus-within {
    background: rgba(255,255,255,0.08);
    border-color: rgba(118,166,255,0.6);
    box-shadow: 0 0 0 3px rgba(74,144,226,0.25);
  }
  
  // 💡 INICIO CÓDIGO AÑADIDO/MODIFICADO: Padding más generoso en móvil
  @media (max-width: 768px) {
    padding: 14px 10px;
    border-radius: 18px;
  }
  // 💡 FIN CÓDIGO AÑADIDO/MODIFICADO
`,v=t.span`
  display: grid;
  place-items: center;
  font-size: 18px;
  color: ${d};
`,j=t.input`
  border: none;
  outline: none;
  background: transparent;
  color: ${b};
  font-size: 16px;
  padding: 8px 2px;
  &::placeholder { color: ${d}; }
  
  // 💡 INICIO CÓDIGO AÑADIDO/MODIFICADO: Fuente un poco más grande en móvil
  @media (max-width: 768px) {
    font-size: 17px; 
    padding: 6px 2px;
  }
  // 💡 FIN CÓDIGO AÑADIDO/MODIFICADO
`,y=t.p`
  margin: 0;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: .92rem;
  text-align: center;
  color: #ffe6eb;
  background: rgba(255,70,104,0.12);
  border: 1px solid rgba(255,70,104,0.35);
`,se=t.button`
  display: grid;
  grid-auto-flow: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 14px 18px;
  border-radius: 16px;
  border: none;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  background: linear-gradient(180deg, ${k} 0%, ${F} 100%);
  box-shadow: 0 14px 24px rgba(74,144,226,0.35);
  transition: all .25s ease;
  &:hover { filter: brightness(1.05); }
  &:disabled { opacity: .6; cursor: not-allowed; }
  
  // 💡 INICIO CÓDIGO AÑADIDO/MODIFICADO: Botón más grande en móvil
  @media (max-width: 768px) {
    padding: 16px 20px;
    font-size: 17px;
    border-radius: 18px;
  }
  // 💡 FIN CÓDIGO AÑADIDO/MODIFICADO
`,de=t(H)`animation: ${Q} 1s linear infinite;`,pe=t.div`
  position: fixed;
  left: 12px; right: 12px;
  bottom: 16px;
  background: ${$};
  border: 1px solid ${S};
  backdrop-filter: blur(14px);
  border-radius: 18px;
  padding: 14px;
  z-index: 50;
  box-shadow: 0 18px 40px rgba(0,0,0,0.45);
  animation: ${G} .35s ease both;
  @media (min-width: 768px) { display: none; }
`,le=t.div`
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  font-weight: 800; color: ${b};
  margin-bottom: 6px;
  svg { cursor: pointer; color: ${d}; }
`,ce=t.p`
  margin: 0 0 10px;
  color: ${d};
  font-size: .95rem;
`,ge=t.button`
  width: 100%;
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 14px;
  border: none;
  border-radius: 12px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(180deg, ${k} 0%, ${F} 100%);
  box-shadow: 0 12px 22px rgba(74,144,226,.35);
`,he=()=>{const{login:r}=X(),[h,P]=o.useState(""),[f,N]=o.useState(""),[i,I]=o.useState(!1),[w,D]=o.useState(null),[E,p]=o.useState(!1),[u,M]=o.useState(null),[O,l]=o.useState(!1);o.useEffect(()=>{const n=window.navigator.userAgent.toLowerCase(),s=/iphone|ipad|ipod/.test(n),c=/android/.test(n),g=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone;(s||c)&&!g?(M(s?"ios":"android"),p(!0)):p(!1)},[]);const _=async n=>{var s,c,g;n.preventDefault(),D(null),I(!0);try{const a=await Y({nombre_usuario:h,password:f}),x=(a==null?void 0:a.token)??(a==null?void 0:a.accessToken)??((s=a==null?void 0:a.data)==null?void 0:s.token)??null,A=(a==null?void 0:a.user)??(a==null?void 0:a.usuario)??((c=a==null?void 0:a.data)==null?void 0:c.user)??null;if(!x||!A)throw new y("Respuesta de login inválida");await r(A,x)}catch(a){const x=(g=a==null?void 0:a.message)!=null&&g.includes("401")?"Credenciales inválidas.":(a==null?void 0:a.message)||"Error al conectar con el servidor.";D(x)}finally{I(!1)}};return e.jsxs(e.Fragment,{children:[e.jsx(Z,{}),e.jsxs(ee,{children:[e.jsx(ae,{$paused:O}),e.jsxs(te,{onSubmit:_,$typing:O,children:[e.jsx(ne,{children:e.jsx(oe,{src:K,alt:"Logo Multirepuestos RG"})}),e.jsx(re,{children:"Acceso al Sistema"}),e.jsx(ie,{children:"Introduce tus credenciales de usuario para ingresar."}),w&&e.jsx(y,{children:w}),e.jsxs(C,{children:[e.jsx(v,{children:e.jsx(T,{})}),e.jsx(j,{type:"text",placeholder:"Nombre de usuario",value:h,onChange:n=>P(n.target.value),onFocus:()=>l(!0),onBlur:()=>l(!1),required:!0,disabled:i,autoComplete:"username",spellCheck:!1})]}),e.jsxs(C,{children:[e.jsx(v,{children:e.jsx(z,{})}),e.jsx(j,{type:"password",placeholder:"Contraseña",value:f,onChange:n=>N(n.target.value),onFocus:()=>l(!0),onBlur:()=>l(!1),required:!0,disabled:i,autoComplete:"current-password"})]}),e.jsxs(se,{type:"submit",disabled:i,children:[i?e.jsx(de,{}):e.jsx(B,{}),i?"Cargando…":"Ingresar"]})]}),E&&e.jsxs(pe,{children:[e.jsxs(le,{children:[e.jsx("span",{children:"¡Descarga MultirepuestosRG! 📲"}),e.jsx(L,{onClick:()=>p(!1)})]}),e.jsx(ce,{children:u==="ios"?"Para instalar la app, toca el botón de Compartir (⬆️) y luego “Añadir a pantalla de inicio”.":"Toca el menú (⋮) de tu navegador y luego “Instalar aplicación”."}),e.jsxs(ge,{onClick:()=>p(!1),children:[u==="ios"?e.jsx(q,{}):e.jsx(R,{}),u==="ios"?"Entendido":"Instalar ahora"]})]})]})]})};export{he as default};
