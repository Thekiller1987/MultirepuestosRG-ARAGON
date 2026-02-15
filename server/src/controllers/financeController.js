const db = require('../config/db'); 

// 1. Obtener todos los Ingresos
const getAllIngresos = async (req, res) => {
    try {
        // Ejecutar consulta SQL para obtener ingresos. Añadir ORDER BY fecha para un mejor reporte.
        const [ingresos] = await db.query('SELECT * FROM ingresos ORDER BY fecha DESC');
        res.json(ingresos);
    } catch (error) {
        console.error("Error al obtener ingresos:", error);
        res.status(500).json({ msg: "Error al obtener ingresos", error });
    }
};

// 2. Crear un nuevo Ingreso
const createIngreso = async (req, res) => {
    // Asegúrate de tener 'monto', 'descripcion', y el id_usuario que registra el ingreso
    const { monto, descripcion, id_usuario } = req.body;
    const fecha = new Date(); 
    
    try {
        // Insertar el nuevo ingreso en la tabla 'ingresos'
        const [result] = await db.query(
            'INSERT INTO ingresos (fecha, monto, descripcion, id_usuario) VALUES (?, ?, ?, ?)', 
            [fecha, monto, descripcion, id_usuario || req.user.id_usuario]
        );
        res.status(201).json({ msg: "Ingreso registrado exitosamente", id: result.insertId });
    } catch (error) {
        console.error("Error al crear ingreso:", error);
        res.status(500).json({ msg: "Error al crear ingreso", error });
    }
};

// 3. Obtener todos los Egresos
const getAllEgresos = async (req, res) => {
    try {
        // Ejecutar consulta SQL para obtener egresos.
        const [egresos] = await db.query('SELECT * FROM egresos ORDER BY fecha DESC'); 
        res.json(egresos);
    } catch (error) {
        console.error("Error al obtener egresos:", error);
        res.status(500).json({ msg: "Error al obtener egresos", error });
    }
};

// 4. Crear un nuevo Egreso
const createEgreso = async (req, res) => {
    // Asegúrate de tener el tipo_egreso (ej: Compra, Salario, Gasto Operativo) y id_usuario
    const { monto, descripcion, tipo_egreso, id_usuario } = req.body;
    const fecha = new Date(); 
    
    try {
        // Insertar el nuevo egreso en la tabla 'egresos'
        const [result] = await db.query(
            'INSERT INTO egresos (fecha, monto, descripcion, tipo_egreso, id_usuario) VALUES (?, ?, ?, ?, ?)', 
            [fecha, monto, descripcion, tipo_egreso, id_usuario || req.user.id_usuario]
        );
        res.status(201).json({ msg: "Egreso registrado exitosamente", id: result.insertId });
    } catch (error) {
        console.error("Error al crear egreso:", error);
        res.status(500).json({ msg: "Error al crear egreso", error });
    }
};

// 5. Obtener resumen financiero (ej. total de Ingresos - total de Egresos)
const getFinancialSummary = async (req, res) => {
    try {
        // En un entorno real, usarías parámetros de fecha para filtrar.
        
        // Lógica para calcular el total de Ingresos
        const [totalIngresos] = await db.query('SELECT SUM(monto) AS total FROM ingresos');
        
        // Lógica para calcular el total de Egresos
        const [totalEgresos] = await db.query('SELECT SUM(monto) AS total FROM egresos');
        
        const ingresos = totalIngresos[0].total || 0;
        const egresos = totalEgresos[0].total || 0;
        const balance = ingresos - egresos;

        res.json({ 
            balance: parseFloat(balance).toFixed(2), 
            total_ingresos: parseFloat(ingresos).toFixed(2), 
            total_egresos: parseFloat(egresos).toFixed(2) 
        });
    } catch (error) {
        console.error("Error al obtener resumen financiero:", error);
        res.status(500).json({ msg: "Error al obtener resumen financiero", error });
    }
};


// 🔑 EXPORTACIÓN CRÍTICA: Exportar todas las funciones como un objeto
module.exports = {
    getAllIngresos,
    createIngreso,
    getAllEgresos,
    createEgreso,
    getFinancialSummary,
};