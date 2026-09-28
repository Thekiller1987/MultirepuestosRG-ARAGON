/**
 * @file migrate_all.js
 * @description Script CLI independiente para ejecutar la migración completa de la BD.
 * Ejecutar con: node scripts/migrate_all.js  (o 'npm run migrate')
 */

require('dotenv').config();
const db = require('../src/config/db');
const { runAllMigrations } = require('../src/config/migrateAll');

(async () => {
  try {
    console.log('🔄 Conectando a la base de datos para migración...');
    const conn = await db.getConnection();
    console.log('🔌 Conexión establecida con MySQL.');
    conn.release();

    const ok = await runAllMigrations(db);
    if (ok) {
      console.log('🎉 Migración finalizada exitosamente.');
      process.exit(0);
    } else {
      console.warn('⚠️ La migración terminó con advertencias.');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error fatal ejecutando migraciones:', error.message);
    process.exit(1);
  }
})();
