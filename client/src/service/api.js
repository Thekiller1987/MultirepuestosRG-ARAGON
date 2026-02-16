import axios from 'axios';

// ===================================================================
// === MODIFICACIÓN OBLIGATORIA: CONEXIÓN DIRECTA A DIGITALOCEAN ===
// RAW_BASE DEBE TERMINAR SIN SLASH PARA UNIÓN LIMPIA
const RAW_BASE = '/api';
// ===================================================================

const API_URL = RAW_BASE; // Simplificado

export { API_URL };

const REQUEST_TIMEOUT = 15000; // 15 segundos máximo por request
const MAX_RETRIES = 2; // Reintentos solo para GET

const request = async (method, path, token = null, data = null, config = {}) => {
    const headers = { 'Content-Type': 'application/json', ...(config.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;

    const fullUrl = `${RAW_BASE}${path}`;
    const normalizedMethod = String(method || 'get').toLowerCase();
    const isGet = normalizedMethod === 'get';
    const retries = isGet ? MAX_RETRIES : 0; // Solo reintentar GETs (evita duplicar ventas/pagos)

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const requestConfig = {
                url: fullUrl,
                method: normalizedMethod,
                headers,
                timeout: config.timeout || REQUEST_TIMEOUT,
                withCredentials: !!config.withCredentials,
                ...config,
            };

            if (data !== null && normalizedMethod !== 'get') {
                requestConfig.data = data;
            }

            if (config.params && normalizedMethod === 'get') {
                requestConfig.params = config.params;
            }

            const res = await axios.request(requestConfig);
            return res.data;

        } catch (err) {
            // Error de servidor (respuesta con código de error) — no reintentar
            if (err.response) {
                const msg = err.response.data?.message || err.response.data?.msg || JSON.stringify(err.response.data);
                const error = new Error(msg || `HTTP ${err.response.status}`);
                error.status = err.response.status;
                throw error;
            }

            // Error de red/timeout — reintentar si quedan intentos
            const isLastAttempt = attempt >= retries;
            if (isLastAttempt) {
                const networkError = new Error(
                    err.code === 'ECONNABORTED'
                        ? 'Tiempo de espera agotado. Verifica tu conexión a internet.'
                        : (err.message || 'Error de conexión con el servidor.')
                );
                networkError.isNetworkError = true;
                throw networkError;
            }

            // Espera exponencial antes de reintentar (500ms, 1500ms)
            const delay = 500 * Math.pow(2, attempt);
            console.warn(`⚠️ Reintentando ${path} (intento ${attempt + 2}/${retries + 1}) en ${delay}ms...`);
            await new Promise(r => setTimeout(r, delay));
        }
    }
};

export const login = async (credentials) => {
    const { username, nombre_usuario, password } = credentials;
    const body = { nombre_usuario: nombre_usuario ?? username, password };
    return await request('post', '/auth/login', null, body);
};

export const fetchMe = async (token) => {
    if (!token) throw new Error('fetchMe requires token');
    return await request('get', '/auth/me', token);
};
export const fetchUsers = async (token) => {
    return await request('get', '/users', token);
};

// --- Manejo de Productos ---
export const fetchProducts = async (token) => {
    const data = await request('get', '/products', token);
    const list = Array.isArray(data) ? data : [];
    return list.map(p => ({
        id: p.id_producto ?? p.id ?? p._id,
        id_producto: p.id_producto ?? p.id ?? p._id, // Duplicado por compatibilidad
        codigo: p.codigo ?? p.code ?? '',
        nombre: p.nombre ?? p.nombre_producto ?? p.name ?? 'Sin nombre',
        precio: Number(p.venta ?? p.precio ?? p.price ?? 0),
        precio_venta: Number(p.venta ?? p.precio ?? p.price ?? 0),
        existencia: Number(p.existencia ?? p.stock ?? 0),
        imagen: p.imagen || null,
        descripcion: p.descripcion || '',
        categoria: p.nombre_categoria || '',
        costo: Number(p.costo || 0),
        mayorista: Number(p.mayoreo || p.mayorista || 0),
        raw: p,
    }));
};

// ===================================================================
// =================== SECCIÓN DE CLIENTES ===========================
// ===================================================================

export const fetchClients = async (token) => {
    const data = await request('get', '/clients', token);
    const list = Array.isArray(data) ? data : [];

    const contado = list.find(c => (c.nombre || '').toLowerCase().includes('contado'));
    const others = list.filter(c => contado ? c.id_cliente !== contado.id_cliente : true);

    return contado ? [contado, ...others] : list;
};

export const fetchCategories = async (token) => {
    return await request('get', '/categories', token);
};

export const fetchProviders = async (token) => {
    return await request('get', '/providers', token);
};

// ===================================================================
// ==================== TERMINA SECCIÓN CLIENTES =====================
// ===================================================================


// --- Funciones para Ventas ---
/**
 * Obtiene ventas, opcionalmente filtradas por fecha.
 * @param {string} token 
 * @param {string} date - Fecha en formato 'YYYY-MM-DD'.
 * @returns {Promise<Array>}
 */
export const fetchSales = async (token, date = null) => {
    const config = {};
    if (date) {
        // Axios usará esto para añadir ?date=YYYY-MM-DD a la URL
        config.params = { date };
    }
    return await request('get', '/sales', token, null, config);
};

export const createSale = async (saleData, token) => {
    return await request('post', '/sales', token, saleData);
};

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
// === AQUÍ ESTABA EL ERROR: FALTABA ESTA FUNCIÓN ===
export const addPaymentToSale = async (paymentData, token) => {
    // paymentData = { saleId, amount, method, userId }
    return await request('post', '/sales/payment', token, paymentData);
};
// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

// ==================== DEVOLUCIONES (AJUSTADO) ====================
export const returnItem = async (returnData, token) => {
    // Ahora apunta al endpoint correcto del servidor
    return await request('post', '/sales/returns', token, returnData);
};
export const createReturn = returnItem;
// ================================================================

export const cancelSale = async (saleId, token) => {
    return await request('delete', `/sales/${saleId}`, token);
};


// ===================================================================
// --- SECCIÓN DE PEDIDOS Y APARTADOS ---
// ===================================================================

export const fetchOrders = async (token) => {
    return await request('GET', '/orders', token);
};

export const fetchOrderDetails = async (orderId, token) => {
    return await request('GET', `/orders/${orderId}`, token);
};

export const createOrder = async (orderData, token) => {
    return await request('POST', '/orders', token, orderData);
};

// ===================================================================
// === NUEVAS FUNCIONES PARA MANEJO DE PEDIDOS ===
// ===================================================================

/**
 * Actualiza un pedido existente
 * @param {number} orderId - ID del pedido
 * @param {object} updateData - Datos a actualizar
 * @param {string} token - Token de autenticación
 */
export const updateOrder = async (orderId, updateData, token) => {
    return await request('PUT', `/orders/${orderId}`, token, updateData);
};

/**
 * Elimina un pedido
 * @param {number} orderId - ID del pedido
 * @param {string} token - Token de autenticación
 */
export const deleteOrder = async (orderId, token) => {
    return await request('DELETE', `/orders/${orderId}`, token);
};

/**
 * Marca un pedido como completado (liquidado desde POS)
 * @param {number} orderId - ID del pedido
 * @param {object} paymentData - Datos del pago
 * @param {string} token - Token de autenticación
 */
export const completeOrder = async (orderId, paymentData, token) => {
    return await request('POST', `/orders/${orderId}/complete`, token, paymentData);
};

/**
 * Obtiene los pedidos pendientes (para el modal del POS)
 * @param {string} token - Token de autenticación
 */
export const fetchPendingOrders = async (token) => {
    return await request('GET', '/orders/pending', token);
};

/**
 * Agrega un abono parcial a un pedido
 * @param {number} orderId - ID del pedido
 * @param {object} abonoData - Datos del abono {amount, method, notes}
 * @param {string} token - Token de autenticación
 */
export const addAbonoToOrder = async (orderId, abonoData, token) => {
    return await request('POST', `/orders/${orderId}/abono`, token, abonoData);
};

/**
 * Líquida completamente un pedido
 * @param {number} orderId - ID del pedido
 * @param {object} paymentData - Datos del pago completo
 * @param {string} token - Token de autenticación
 */
export const liquidateOrder = async (orderId, paymentData, token) => {
    return await request('POST', `/orders/${orderId}/liquidar`, token, paymentData);
};

/**
 * Cancela un pedido (marca como cancelado)
 * @param {number} orderId - ID del pedido
 * @param {string} token - Token de autenticación
 */
export const cancelOrder = async (orderId, token) => {
    return await request('DELETE', `/orders/${orderId}`, token);
};

// --- FUNCIONES PARA CLIENTES Y CRÉDITOS ---
export const fetchAllClientsWithCredit = (token) => request('GET', '/clients', token);
export const createClient = (clientData, token) => request('POST', '/clients', token, clientData);
export const updateClient = (clientId, clientData, token) => request('PUT', `/clients/${clientId}`, token, clientData);
export const deleteClient = (clientId, token) => request('DELETE', `/clients/${clientId}`, token);
export const addCreditPayment = (clientId, paymentData, token) => {
    return request('POST', `/clients/${clientId}/abono`, token, paymentData);
};
export const getCreditosByClient = (clientId, token) => {
    return request('GET', `/clients/${clientId}/creditos`, token);
};
export const getAbonosByClient = (clientId, token) => {
    return request('GET', `/clients/${clientId}/abonos`, token);
};
// NUEVO: Créditos pendientes con saldo por ticket
export const getCreditosPendientes = (clientId, token) => {
    return request('GET', `/clients/${clientId}/creditos-pendientes`, token);
};


// ===================================================================
// --- SECCIÓN DE REPORTES (NUEVO) ---
// ===================================================================

export const fetchSalesSummaryReport = (token, params) => {
    return request('get', '/reports/sales-summary', token, null, { params });
};

export const fetchInventoryValueReport = (token) => {
    return request('get', '/reports/inventory-value', token);
};

export const fetchSalesByUserReport = (token, params) => {
    return request('get', '/reports/sales-by-user', token, null, { params });
};

export const fetchTopProductsReport = (token, params) => {
    return request('get', '/reports/top-products', token, null, { params });
};

export const fetchSalesChartReport = (token, params) => {
    return request('get', '/reports/sales-chart', token, null, { params });
};

// ===================================================================
// --- SECCIÓN DE CARGA MASIVA ---
// ===================================================================
export const bulkUploadInventory = async (items, token) => {
    return await request('post', '/upload/inventory', token, { items });
};

// ===================================================================
// =================== SECCIÓN DE CAJA (ACTUALIZADO) =================
// ===================================================================

// Nota: getCajaSession acepta token opcional. Si no se pasa, lo toma de localStorage
export const getCajaSession = async (userId, token) => {
    const t = token || localStorage.getItem('token');
    return await request('get', '/caja/session', t, null, {
        params: { userId }
    });
};

export const openCajaSession = async (sessionData, token) => {
    return await request('post', '/caja/session/open', token, sessionData);
};

export const addCajaTx = async (txData, token) => {
    return await request('post', '/caja/session/tx', token, txData);
};

export const closeCajaSession = async (closeData, token) => {
    return await request('post', '/caja/session/close', token, closeData);
};


/**
 * NUEVO: Obtiene el reporte de cierres de caja para una fecha específica.
 * Asume el endpoint usado en CashReport.jsx.
 * @param {string} date - Fecha en formato 'YYYY-MM-DD'.
 * @param {string} token - Token de autenticación.
 */
export const fetchClosedCajaReport = async (date, token) => {
    return await request('get', '/caja/reporte', token, null, { params: { date } });
};

/**
 * NUEVO: Obtiene todas las sesiones de caja actualmente abiertas.
 * Asume el endpoint usado en CashReport.jsx.
 * @param {string} token - Token de autenticación.
 */
export const fetchActiveCajaSessions = async (token) => {
    return await request('get', '/caja/abiertas/activas', token);
};

/**
 * NUEVO: Permite obtener el reporte individual (PDF/HTML) por ID.
 * @param {string} sessionId - ID de la sesión (puede ser 'caja-X-TIMESTAMP').
 * @param {string} token - Token de autenticación.
 */
export const fetchCajaReportById = async (sessionId, token) => {
    // Si tu backend retorna un PDF o HTML, este endpoint solo necesita ser llamado.
    // La forma en que lo usamos en el frontend es navegar a la URL directamente.
    return await request('get', `/caja/reporte/${sessionId}`, token);
};

// --- FACTURAS PROVEEDORES ---
export const fetchProviderInvoices = async (token) => {
    return await request('get', '/facturas-proveedores', token);
};

export const createProviderInvoice = async (invoiceData, token) => {
    return await request('post', '/facturas-proveedores', token, invoiceData);
};

export const payProviderInvoice = async (invoiceId, amount, token) => {
    return await request('post', `/facturas-proveedores/${invoiceId}/pagar`, token, { amount });
};
export const deleteProviderInvoice = async (invoiceId, token) => {
    return await request('delete', `/facturas-proveedores/${invoiceId}`, token);
};

// ===================================================================
// === FUNCIONES PARA EL FLUJO COMPLETO PEDIDOS → POS ===
// ===================================================================

/**
 * Carga un pedido al POS (actualiza estado y devuelve datos)
 * @param {number} orderId - ID del pedido
 * @param {object} posData - Datos del POS
 * @param {string} token - Token de autenticación
 */
export const loadOrderToPOS = async (orderId, posData, token) => {
    return await request('POST', `/orders/${orderId}/load-to-pos`, token, posData);
};

/**
 * Verifica si un pedido ya fue facturado en el POS
 * @param {number} orderId - ID del pedido
 * @param {string} token - Token de autenticación
 */
export const checkOrderStatus = async (orderId, token) => {
    return await request('GET', `/orders/${orderId}/status`, token);
};

/**
 * Obtiene pedidos por estado específico
 * @param {string} estado - Estado del pedido (PENDIENTE, COMPLETADO, etc)
 * @param {string} token - Token de autenticación
 */
export const fetchOrdersByStatus = async (estado, token) => {
    return await request('GET', `/orders/status/${estado}`, token);
};

/**
 * Sincroniza pedidos con ventas (para cuando se factura en POS)
 * @param {object} syncData - Datos de sincronización {orderId, saleId, amount}
 * @param {string} token - Token de autenticación
 */
export const syncOrderWithSale = async (syncData, token) => {
    return await request('POST', '/orders/sync-sale', token, syncData);
};

// ===================================================================
// === FUNCIONES ESPECÍFICAS PARA EL MODAL DE PENDIENTES ===
// ===================================================================

/**
 * Obtiene todos los tickets pendientes de pago
 * @param {string} token - Token de autenticación
 */
export const fetchPendingTickets = async (token) => {
    return await request('GET', '/tickets/pending', token);
};

/**
 * Obtiene la deuda total de pedidos pendientes
 * @param {string} token - Token de autenticación
 */
export const fetchTotalDebt = async (token) => {
    return await request('GET', '/orders/debt/total', token);
};

/**
 * Obtiene pedidos con saldo pendiente (para cobro parcial)
 * @param {string} token - Token de autenticación
 */
export const fetchOrdersWithBalance = async (token) => {
    return await request('GET', '/orders/with-balance', token);
};


const fetchActiveBoxes = async (token) => {
    // ESTO DEBE APUNTAR A TU ENDPOINT REAL DE CAJAS
    try {
        const response = await axios.get(`${BASE_URL}/boxes/active`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data; // Esperamos un array como [{ id: 1, name: 'Caja Principal' }, ...]
    } catch (error) {
        console.error("Error al obtener cajas activas:", error);
        // Devolver un array vacío para manejarlo elegantemente
        return [];
    }
};

// ===================================================================
// === SECCIÓN DE CARRITO PERSISTENTE ===
// ===================================================================

export const getCart = async (userId, token) => {
    return await request('get', '/caja/cart', token, null, { params: { userId } });
};

export const saveCart = async (userId, carts, token) => {
    return await request('post', '/caja/cart', token, { userId, carts });
};

// ===================================================================
// === SECCIÓN DE SOLICITUDES (NUEVO) ===
// ===================================================================

export const fetchRequests = async (token) => {
    return await request('get', '/requests', token);
};

export const createRequest = async (data, token) => {
    return await request('post', '/requests', token, data);
};

export const toggleRequestStatus = async (id, completed, token) => {
    return await request('put', `/requests/${id}/toggle`, token, { completed });
};

export const updateRequest = async (id, descripcion, token) => {
    return await request('put', `/requests/${id}`, token, { descripcion });
};

export const deleteRequest = async (id, token) => {
    return await request('delete', `/requests/${id}`, token);
};

// ===================================================================
// === SECCIÓN DE TRASLADOS / SALIDAS ===
// ===================================================================

export const createOutflow = async (data, token) => {
    return await request('post', '/outflow', token, data);
};

export const fetchOutflowHistory = async (token) => {
    return await request('get', '/outflow/history', token);
};