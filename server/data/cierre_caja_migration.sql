CREATE TABLE IF NOT EXISTS cierres_caja (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha_apertura DATETIME NOT NULL,
  fecha_cierre DATETIME NOT NULL,
  usuario_id INT,
  usuario_nombre VARCHAR(100),
  
  /* Balances Principales */
  monto_inicial DECIMAL(12,2) DEFAULT 0.00,
  final_esperado DECIMAL(12,2) DEFAULT 0.00, -- Lo que el sistema calcula
  final_real DECIMAL(12,2) DEFAULT 0.00,     -- Lo que el cajero contó
  diferencia DECIMAL(12,2) DEFAULT 0.00,     -- final_real - final_esperado
  
  /* Desglose de Métodos de Pago (Ventas) */
  total_ventas_efectivo DECIMAL(12,2) DEFAULT 0.00,
  total_ventas_tarjeta DECIMAL(12,2) DEFAULT 0.00,
  total_ventas_transferencia DECIMAL(12,2) DEFAULT 0.00,
  total_ventas_credito DECIMAL(12,2) DEFAULT 0.00,
  
  /* Movimientos de Caja Chica */
  total_entradas DECIMAL(12,2) DEFAULT 0.00,
  total_salidas DECIMAL(12,2) DEFAULT 0.00,
  
  /* Snapshot de Auditoría */
  -- Guardamos aquí un JSON con la lista de productos vendidos, IDs de transacciones, etc.
  -- Esto permite ver el detalle histórico aunque se borren ventas después.
  detalles_json JSON, 
  
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
