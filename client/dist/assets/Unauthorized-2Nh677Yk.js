import{j as o,s as r,t as e,U as t}from"./vendor-BMIwBeBI.js";import"./scanner-vendor-DfxRpMWJ.js";const n=()=>o.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"64",height:"64",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[o.jsx("rect",{x:"3",y:"11",width:"18",height:"11",rx:"2",ry:"2"}),o.jsx("path",{d:"M7 11V7a5 5 0 0 1 10 0v4"})]}),s=e`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`,a=r.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  text-align: center;
  padding: 2rem;
`,i=r.div`
  animation: ${s} 0.5s ease-out;
  background-color: white;
  padding: 3rem 4rem;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  color: #dc3545;
`,c=r.h1`
  font-size: 2.5rem;
  margin-top: 1.5rem;
  color: #343a40;
`,d=r.p`
  font-size: 1.2rem;
  color: #6c757d;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
`,l=r(t)`
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #007bff;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`,p=()=>o.jsx(a,{children:o.jsxs(i,{children:[o.jsx(n,{}),o.jsx(c,{children:"Acceso Denegado"}),o.jsx(d,{children:"No tienes los permisos suficientes para acceder a esta página."}),o.jsx(l,{to:"/dashboard",children:"Volver al Dashboard"})]})});export{p as default};
