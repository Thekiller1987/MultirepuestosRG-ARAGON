const fs = require('fs');
const path = require('path');

// Ruta a tu archivo
const filePath = path.join(__dirname, 'client/src/pages/InventoryManagement.jsx');

// Lee el archivo
let content = fs.readFileSync(filePath, 'utf-8');

// Regex para localizar el objeto que tiene ...product y duplicados
// Esto busca líneas que tengan "...product," seguido de mayoreo, minimo, maximo, descripcion
const regex = /\{[\s\S]*?\.\.\.product,[\s\S]*?mayoreo:.*?descripcion:.*?\}/g;

content = content.replace(regex, (match) => {
  // Solo reconstruimos el objeto eliminando duplicados, conservando product
  return `{
  ...product,
  mayoreo: product.mayoreo || '',
  minimo: product.minimo || '',
  maximo: product.maximo || '',
  descripcion: product.descripcion || ''
}`;
});

// Guarda los cambios en el archivo original
fs.writeFileSync(filePath, content, 'utf-8');

console.log('✅ Se corrigieron los duplicados en InventoryManagement.jsx');
