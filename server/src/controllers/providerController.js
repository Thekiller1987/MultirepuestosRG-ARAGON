const db = require('../config/db.js');

// Obtener todos los proveedores
exports.getAllProviders = async (req, res) => {
  try {
    const [providers] = await db.query('SELECT * FROM proveedores ORDER BY nombre');
    res.json(providers);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener proveedores' });
  }
};

// Crear un nuevo proveedor
exports.createProvider = async (req, res) => {
  const { nombre } = req.body;
  try {
    const [result] = await db.query('INSERT INTO proveedores (nombre) VALUES (?)', [nombre]);
    res.status(201).json({ id_proveedor: result.insertId, nombre });
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear el proveedor' });
  }
};

// Eliminar un proveedor
exports.deleteProvider = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM proveedores WHERE id_proveedor = ?', [id]);
    res.json({ msg: 'Proveedor eliminado' });
  } catch (error) {
    // Si el proveedor está en uso por un producto, la base de datos dará un error.
    res.status(400).json({ msg: 'No se puede eliminar el proveedor porque está en uso.' });
  }
};

