/**
 * @file employeeController.js
 * @description CRUD completo para la tabla de empleados/trabajadores.
 * La tabla se crea automáticamente al iniciar si no existe.
 */

const db = require('../config/db.js');

// ─── AUTO-MIGRATE: Crear tabla si no existe ───
const initEmployeesTable = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS empleados (
                id_empleado INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(150) NOT NULL,
                telefono VARCHAR(20) DEFAULT NULL,
                cargo VARCHAR(100) DEFAULT NULL,
                activo TINYINT(1) NOT NULL DEFAULT 1,
                fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        `);
        console.log('✅ Tabla "empleados" lista.');

        // Verificar si la columna id_empleado existe en la tabla ventas
        const [columns] = await db.query("SHOW COLUMNS FROM ventas LIKE 'id_empleado'");
        if (columns.length === 0) {
            // Añadir columna id_empleado
            await db.query("ALTER TABLE ventas ADD COLUMN id_empleado INT NULL");
            // Intentar añadir la llave foránea de manera segura
            try {
                await db.query("ALTER TABLE ventas ADD CONSTRAINT fk_ventas_empleados FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado) ON DELETE SET NULL");
                console.log('✅ Columna id_empleado y llave foránea añadidas a la tabla ventas.');
            } catch (fkError) {
                console.warn('⚠️ No se pudo añadir la llave foránea (posiblemente ya existe o motor no compatible), pero la columna se creó:', fkError.message);
            }
        }
    } catch (error) {
        console.error('❌ Error creando tabla empleados o alterando tabla ventas:', error.message);
    }
};

// ─── GET ALL EMPLOYEES ───
// GET /api/employees?includeInactive=true
const getAllEmployees = async (req, res) => {
    try {
        const includeInactive = req.query.includeInactive === 'true';
        const sql = includeInactive
            ? 'SELECT * FROM empleados ORDER BY activo DESC, nombre ASC'
            : 'SELECT * FROM empleados WHERE activo = 1 ORDER BY nombre ASC';
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (error) {
        console.error('Error en getAllEmployees:', error);
        res.status(500).json({ msg: 'Error al obtener empleados.' });
    }
};

// ─── CREATE EMPLOYEE ───
// POST /api/employees
const createEmployee = async (req, res) => {
    const { nombre, telefono, cargo } = req.body;

    if (!nombre || !nombre.trim()) {
        return res.status(400).json({ msg: 'El nombre del empleado es obligatorio.' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO empleados (nombre, telefono, cargo) VALUES (?, ?, ?)',
            [nombre.trim(), telefono?.trim() || null, cargo?.trim() || null]
        );

        // Emitir evento en tiempo real
        const io = req.app.get('io');
        if (io) io.emit('employees:update');

        res.status(201).json({
            msg: 'Empleado creado exitosamente.',
            employee: {
                id_empleado: result.insertId,
                nombre: nombre.trim(),
                telefono: telefono?.trim() || null,
                cargo: cargo?.trim() || null,
                activo: 1
            }
        });
    } catch (error) {
        console.error('Error en createEmployee:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ msg: 'Ya existe un empleado con ese nombre.' });
        }
        res.status(500).json({ msg: 'Error al crear empleado.' });
    }
};

// ─── UPDATE EMPLOYEE ───
// PUT /api/employees/:id
const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, cargo, activo } = req.body;

    if (!nombre || !nombre.trim()) {
        return res.status(400).json({ msg: 'El nombre del empleado es obligatorio.' });
    }

    try {
        const [existing] = await db.query('SELECT * FROM empleados WHERE id_empleado = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ msg: 'Empleado no encontrado.' });
        }

        await db.query(
            'UPDATE empleados SET nombre = ?, telefono = ?, cargo = ?, activo = ? WHERE id_empleado = ?',
            [
                nombre.trim(),
                telefono?.trim() || null,
                cargo?.trim() || null,
                activo !== undefined ? (activo ? 1 : 0) : existing[0].activo,
                id
            ]
        );

        // Emitir evento en tiempo real
        const io = req.app.get('io');
        if (io) io.emit('employees:update');

        res.json({ msg: 'Empleado actualizado correctamente.' });
    } catch (error) {
        console.error('Error en updateEmployee:', error);
        res.status(500).json({ msg: 'Error al actualizar empleado.' });
    }
};

// ─── DELETE (SOFT) EMPLOYEE ───
// DELETE /api/employees/:id
const deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        const [existing] = await db.query('SELECT * FROM empleados WHERE id_empleado = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ msg: 'Empleado no encontrado.' });
        }

        // Soft delete: marcar como inactivo
        await db.query('UPDATE empleados SET activo = 0 WHERE id_empleado = ?', [id]);

        // Emitir evento en tiempo real
        const io = req.app.get('io');
        if (io) io.emit('employees:update');

        res.json({ msg: 'Empleado desactivado correctamente.' });
    } catch (error) {
        console.error('Error en deleteEmployee:', error);
        res.status(500).json({ msg: 'Error al desactivar empleado.' });
    }
};

module.exports = {
    initEmployeesTable,
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
};
