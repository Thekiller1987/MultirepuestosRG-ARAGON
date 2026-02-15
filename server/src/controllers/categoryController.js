const db = require('../config/db.js');

// Obtener todas las categorías
exports.getAllCategories = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categorias ORDER BY nombre');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener categorías' });
  }
};

// Crear una nueva categoría
exports.createCategory = async (req, res) => {
  const { nombre } = req.body;
  try {
    const [result] = await db.query('INSERT INTO categorias (nombre) VALUES (?)', [nombre]);
    res.status(201).json({ id_categoria: result.insertId, nombre });
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear la categoría' });
  }
};

// Eliminar una categoría
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM categorias WHERE id_categoria = ?', [id]);
    res.json({ msg: 'Categoría eliminada' });
  } catch (error) {
    res.status(400).json({ msg: 'No se puede eliminar la categoría porque está en uso.' });
  }
};

