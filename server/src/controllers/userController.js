const db = require('../config/db.js');
const bcrypt = require('bcryptjs');

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id_usuario, nombre_usuario, rol FROM usuarios');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
};

// @desc    Actualizar un usuario (rol y/o contraseña)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { rol, password } = req.body;

  try {
    const [users] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    let hashedPassword = users[0].password;
    // Si se envía una nueva contraseña, la encriptamos
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Actualizamos la base de datos
    await db.query('UPDATE usuarios SET rol = ?, password = ? WHERE id_usuario = ?', [
      rol || users[0].rol, // Si no se envía un nuevo rol, mantenemos el existente
      hashedPassword,
      id,
    ]);

    res.json({ msg: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
      return res.status(400).json({ msg: 'El nombre de usuario ya está en uso.' });
    }
    res.status(500).send('Error en el servidor: ' + error.message);
  }
};

// @desc    Eliminar un usuario
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    res.json({ msg: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_ROW_IS_REFERENCED' || error.errno === 1451) {
      return res.status(400).json({ msg: 'No se puede eliminar: El usuario tiene ventas o historial registrado. Intente cambiar su rol o contraseña.' });
    }
    res.status(500).send('Error en el servidor: ' + error.message);
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
};

