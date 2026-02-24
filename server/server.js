// 1. Importar las librerías
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importamos la conexión a la BD
const db = require('./src/config/db.js');

// Importamos nuestras rutas
const authRoutes = require('./src/routes/authRoutes.js');
const userRoutes = require('./src/routes/userRoutes.js');
const productRoutes = require('./src/routes/productRoutes.js');
const categoryRoutes = require('./src/routes/categoryRoutes.js');
const providerRoutes = require('./src/routes/providerRoutes.js');
const clientRoutes = require('./src/routes/clientRoutes.js');
const orderRoutes = require('./src/routes/orderRoutes.js');
const financeRoutes = require('./src/routes/financeRoutes.js');
const salesRoutes = require('./src/routes/salesRoutes.js');
const reportRoutes = require('./src/routes/reportRoutes.js');
const uploadRoutes = require('./src/routes/uploadRouter.js');
const cajaRoutes = require('./src/routes/cajaRoutes.js');
// NUEVA RUTA AGREGADA
const providerInvoiceRoutes = require('./src/routes/providerInvoiceRoutes.js');
const requestRoutes = require('./src/routes/requestRoutes.js');
const outflowRoutes = require('./src/routes/outflowRoutes.js'); // FIXED: Missing import

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
  // Log request origin for debugging
  // console.log("Incoming Origin:", origin); 

  // Permitir requests sin origin (como apps móviles o Postman)
  if (!origin) return callback(null, true);

  // Allow all origins matching the main domains (http/https, www/non-www)
  // Also allows localhost and local IPs
  // For production stability, we will be permissive with the specific domains
  if (allowedOrigins.includes(origin) ||
    origin.includes('multirepuestos') || // Safe fallback for subdomains
    origin.includes('localhost') ||
    origin.startsWith('http://192') ||
    origin.startsWith('http://10')) {
    return callback(null, true);
  }

  // FALLBACK: Permitir todo para evitar "Server Error" en socket.io si el origen es legítimo pero no listado
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
// Usamos BACKEND_PORT si existe (según tu .env), o PORT, o 3003 por defecto
const PORT = process.env.BACKEND_PORT || process.env.PORT || 3003;

// 5. Usar las rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/finances', financeRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/caja', cajaRoutes);
// NUEVA RUTA AGREGADA
app.use('/api/facturas-proveedores', providerInvoiceRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/outflow', outflowRoutes);

const settingsRoutes = require('./src/routes/settingsRoutes.js');
const { initSettings } = require('./src/controllers/settingsController.js');

// Inicializar configuración (asegurar que exista tabla)
initSettings().catch(err => console.error("Error init settings:", err));

app.use('/api/settings', settingsRoutes);

app.get('/', (_req, res) => {
  res.send('¡API de MultirepuestosRG funcionando! 🚀');
});

// 6. Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
});

// 7. Configuración de Socket.IO
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

// 8. Iniciar Servidor
// Importante: Usamos httpServer.listen en lugar de app.listen para que WS funcione
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});