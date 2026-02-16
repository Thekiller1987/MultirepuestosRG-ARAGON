const mysql = require('mysql2/promise');
require('dotenv').config();

console.log("=== Diagnóstico de Conexión a Base de Datos ===");
console.log("Intentando conectar con las siguientes credenciales:");
console.log(`HOST: ${process.env.DB_HOST}`);
console.log(`USER: ${process.env.DB_USER}`);
console.log(`PORT: ${process.env.DB_PORT}`);
console.log(`DATABASE: ${process.env.DB_DATABASE}`);
console.log(`PASSWORD: ${process.env.DB_PASSWORD ? '******' : '(vacío)'}`);

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT || 3306
        });
        console.log("\n✅ ¡ÉXITO! Conexión a la base de datos establecida correctamente.");
        await connection.end();
    } catch (error) {
        console.error("\n❌ ERROR DE CONEXIÓN:");
        console.error(error.message);
        console.log("\nPosibles causas:");
        console.log("1. La contraseña o usuario son incorrectos en el archivo .env");
        console.log("2. El servidor MySQL no está corriendo");
        console.log("3. El puerto (3306) está bloqueado o es incorrecto");
    }
})();
