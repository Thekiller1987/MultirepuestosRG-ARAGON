const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Configuración de usuario a crear
const NEW_USER = {
    username: 'waskar',
    password: '1987',
    role: 'administrador' // Ajusta según tus roles (admin, administrador, etc.)
};

(async () => {
    // Fix for Node.js 18+ preferring IPv6 causing ECONNREFUSED on localhost
    const dbHost = (process.env.DB_HOST === 'localhost') ? '127.0.0.1' : (process.env.DB_HOST || '127.0.0.1');

    console.log(`Conectando a BD en host: ${dbHost}...`);

    try {
        const connection = await mysql.createConnection({
            host: dbHost,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT || 3306
        });

        console.log("✅ Conexión establecida.");

        // 1. Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(NEW_USER.password, salt);

        // 2. Insertar usuario
        // Nota: Asumimos que la tabla se llama 'usuarios' y las columnas 'nombre_usuario', 'password', 'rol'
        // basado en authController.js
        const [result] = await connection.execute(
            'INSERT INTO usuarios (nombre_usuario, password, rol) VALUES (?, ?, ?)',
            [NEW_USER.username, hashedPassword, NEW_USER.role]
        );

        console.log(`\n🎉 USUARIO CREADO EXITOSAMENTE!`);
        console.log(`ID: ${result.insertId}`);
        console.log(`Usuario: ${NEW_USER.username}`);
        console.log(`Contraseña: ${NEW_USER.password}`);
        console.log(`Rol: ${NEW_USER.role}`);

        await connection.end();

    } catch (error) {
        console.error("\n❌ ERROR AL CREAR USUARIO:");
        if (error.code === 'ER_DUP_ENTRY') {
            console.error("El usuario ya existe.");
        } else {
            console.error(error.message);
        }
    }
})();
