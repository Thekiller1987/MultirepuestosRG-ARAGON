// 1. Importar las librerías
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importamos la conexión a la BD
const db = require('./src/config/db.js');

// Helper to wait for DB connection
const waitForDb = async (retries = 20, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await db.getConnection();
      console.log('¡Conexión a la base de datos establecida exitosamente! 🎉');
      conn.release();
      return true;
    } catch (e) {
      console.log(`⏳ Esperando a la base de datos (intento ${i + 1}/${retries})... ${e.message}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('❌ No se pudo conectar a la base de datos después de varios intentos.');
};

// 2. Crear una instancia de Express
const app = express();

// Helper para CORS dinámico (permite LAN IPs)
const allowedOrigins = [
  'https://multirepuestosrg.netlify.app',
  'https://www.multirepuestosrgaragon.com',
  'https://multirepuestosrgaragon.com',
  'https://multirepuestosrg.com',
  'http://localhost:5173',
  'http://64.23.228.145',
  'https://64.23.228.145',
  'http://206.189.73.145',
  'https://206.189.73.145'
];

const corsOriginHelper = (origin, callback) => {
  if (!origin) return callback(null, true);

  if (allowedOrigins.includes(origin) ||
    origin.includes('multirepuestos') || // Safe fallback for subdomains
    origin.includes('localhost') ||
    origin.startsWith('http://192') ||
    origin.startsWith('http://10')) {
    return callback(null, true);
  }

  console.log(`⚠️ Permissive CORS for: ${origin}`);
  return callback(null, true);
};

const corsOptions = {
  origin: corsOriginHelper,
  credentials: true
};

// 3. Configurar Middlewares
app.use(cors(corsOptions));

// Evita 413: payload grande
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Servir archivos estáticos (Imágenes subidas)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// 4. Definir el puerto
const PORT = process.env.BACKEND_PORT || process.env.PORT || 3003;

app.get('/', (_req, res) => {
  res.send('¡API de MultirepuestosRG funcionando! 🚀');
});

// 5. Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
});

// 6. Configuración de Socket.IO
const { Server } = require('socket.io');
const http = require('http');

// Crear servidor HTTP explícito para soportar Socket.IO + Express
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: corsOptions,
  path: '/api/socket.io/' // Match client path for Nginx routing
});

io.on('connection', (socket) => {
  console.log('Cliente conectado al socket:', socket.id);
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

app.set('io', io);

// 7. Arrancar servidor y montar rutas dinámicamente cuando la BD esté lista
async function startServer() {
  try {
    // A. Esperar a la base de datos
    await waitForDb();

    // B. Ejecutar migraciones iniciales de tablas (asegurar configuración y trabajadores)
    const { initSettings } = require('./src/controllers/settingsController.js');
    const { initEmployeesTable } = require('./src/controllers/employeeController.js');

    await initSettings();
    await initEmployeesTable();

    // C. Importar y usar las rutas (se importan después de conectar para que las consultas de sus IIFEs no fallen)
    app.use('/api/auth', require('./src/routes/authRoutes.js'));
    app.use('/api/users', require('./src/routes/userRoutes.js'));
    app.use('/api/products', require('./src/routes/productRoutes.js'));
    app.use('/api/categories', require('./src/routes/categoryRoutes.js'));
    app.use('/api/providers', require('./src/routes/providerRoutes.js'));
    app.use('/api/clients', require('./src/routes/clientRoutes.js'));
    app.use('/api/orders', require('./src/routes/orderRoutes.js'));
    app.use('/api/finances', require('./src/routes/financeRoutes.js'));
    app.use('/api/sales', require('./src/routes/salesRoutes.js'));
    app.use('/api/reports', require('./src/routes/reportRoutes.js'));
    app.use('/api/upload', require('./src/routes/uploadRouter.js'));
    app.use('/api/caja', require('./src/routes/cajaRoutes.js'));
    app.use('/api/facturas-proveedores', require('./src/routes/providerInvoiceRoutes.js'));
    app.use('/api/requests', require('./src/routes/requestRoutes.js'));
    app.use('/api/outflow', require('./src/routes/outflowRoutes.js'));
    app.use('/api/employees', require('./src/routes/employeeRoutes.js'));
    app.use('/api/settings', require('./src/routes/settingsRoutes.js'));

    // D. Iniciar la escucha del servidor HTTP
    httpServer.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });

  } catch (error) {
    console.error('Error FATAL inicializando la aplicación:', error.message);
    process.exit(1);
  }
}

startServer();