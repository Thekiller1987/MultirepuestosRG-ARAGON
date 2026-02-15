const db = require('../config/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Función para registrar un nuevo usuario
const register = async (req, res) => {
  const { nombre_usuario, password, rol } = req.body;

  if (!nombre_usuario || !password || !rol) {
    return res.status(400).json({ msg: 'Por favor, envía todos los campos' });
  }

  try {
    // Verificar si el usuario ya existe
    const [existingUsers] = await db.query('SELECT * FROM usuarios WHERE nombre_usuario = ?', [nombre_usuario]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ msg: 'El nombre de usuario ya está en uso' });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertar el nuevo usuario
    await db.query('INSERT INTO usuarios (nombre_usuario, password, rol) VALUES (?, ?, ?)', [nombre_usuario, hashedPassword, rol]);

    res.status(201).json({ msg: 'Usuario creado exitosamente' });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
};


// Función para el login de un usuario
const login = async (req, res) => {
  const { nombre_usuario, password } = req.body;

  // Validar que se recibieron los datos
  if (!nombre_usuario || !password) {
    return res.status(400).json({ msg: 'Por favor, envía usuario y contraseña' });
  }

  try {
    // 1. Buscar al usuario en la base de datos
    const [users] = await db.query('SELECT * FROM usuarios WHERE nombre_usuario = ?', [nombre_usuario]);

    if (users.length === 0) {
      return res.status(400).json({ msg: 'Usuario no encontrado' });
    }
    const user = users[0];

    // 2. Comparar la contraseña enviada con la encriptada en la BD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Contraseña incorrecta' });
    }

    // 3. Si todo es correcto, crear el token
    const payload = {
      id: user.id_usuario,
      rol: user.rol,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret_key_reemplazo_seguro', {
      expiresIn: '8h', // El token expirará en 8 horas
    });

    // 4. Enviar el token al cliente
    res.json({
      msg: 'Login exitoso',
      token,
      user: {
        id: user.id_usuario,
        nombre: user.nombre_usuario,
        rol: user.rol,
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
};

module.exports = { login, register };
