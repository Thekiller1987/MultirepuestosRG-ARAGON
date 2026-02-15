// fixInventoryBuild.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client/src/pages/InventoryManagement.jsx');

let content = fs.readFileSync(filePath, 'utf-8');

// Esto elimina las claves duplicadas "minimo", "maximo", "descripcion" después de ...product
content = content.replace(/(\.\.\.product,?\s*)(minimo: product\.minimo \|\| '',\s*maximo: product\.maximo \|\| '',\s*descripcion: product\.descripcion \|\| '')/g, '$1');

fs.writeFileSync(filePath, content, 'utf-8');

console.log('✅ Duplicados eliminados en InventoryManagement.jsx. Ahora puedes hacer npm run build sin errores.');
