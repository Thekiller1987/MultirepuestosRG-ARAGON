import{j as r,ac as t,q as c,aT as u,a7 as f,a8 as h}from"./vendor-Dp7SZ6lv.js";import{c as j,d as g,B as i}from"./POS.styles-D5dfWbaN.js";const C=c.div`
    margin-bottom: 1rem;
    color: #007bff; /* Color por defecto: Info */

    ${({type:o})=>o==="error"&&t`
        color: #dc3545;
    `}
    ${({type:o})=>o==="success"&&t`
        color: #28a745;
    `}
`,y=c.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 2rem;
    width: 100%;
    
    /* Estilo para los botones dentro del grupo */
    ${i} {
        flex-grow: 1;
        max-width: 150px; 
    }
`,w=({isOpen:o,onClose:n,title:l,message:m,type:s="info",buttons:a})=>{if(!o)return null;const d=()=>{switch(s){case"error":return r.jsx(h,{size:"2.5em"});case"success":return r.jsx(f,{size:"2.5em"});case"info":case"custom":default:return r.jsx(u,{size:"2.5em"})}},x=()=>s==="custom"&&a&&a.length>0?a.map((e,p)=>r.jsx(i,{onClick:()=>{e.action&&e.action()},primary:e.isPrimary,$cancel:e.isCancel,dark:!e.isPrimary&&!e.isCancel,children:e.label},p)):r.jsx(i,{onClick:n,primary:!0,children:s==="error"?"Aceptar":"Entendido"});return r.jsx(j,{children:r.jsxs(g,{style:{maxWidth:"450px",textAlign:"center"},children:[r.jsx(C,{type:s,children:d()}),r.jsx("h2",{style:{marginTop:"1rem",marginBottom:"0.5rem"},children:l}),r.jsx("p",{style:{color:"#6c757d",marginBottom:"1rem",lineHeight:"1.6"},children:m}),r.jsx(y,{children:x()})]})})};export{w as A};
