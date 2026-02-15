const jwt = require('jsonwebtoken');

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtenemos el token del encabezado 'Bearer <token>'
      token = req.headers.authorization.split(' ')[1];

      // Verificamos la validez del token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_reemplazo_seguro');

      // Adjuntamos los datos del usuario (id y rol) a la petición
      req.user = decoded;
      next(); // Pasamos al siguiente paso
      return; // Importante para evitar que se ejecute el código siguiente
    } catch (error) {
      // Si el token es inválido o expiró
      return res.status(401).json({ msg: 'No autorizado, el token falló o expiró' });
    }
  }

  if (!token) {
    // Si no se encuentra el token en los headers
    return res.status(401).json({ msg: 'No autorizado, no hay token' });
  }
};

// Middleware para verificar si el usuario es Administrador
const isAdmin = (req, res, next) => {
  // Asegúrate de que el token ya haya adjuntado el rol a req.user
  if (req.user && req.user.rol === 'Administrador') {
    next(); // Si es admin, puede continuar
  } else {
    res.status(403).json({ msg: 'Acceso denegado. Se requiere rol de Administrador.' });
  }
};

// Se exporta un objeto con ambas funciones.
// En las rutas, se debe llamar a la función específica que se necesita.
module.exports = { verifyToken, isAdmin };

