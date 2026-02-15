// src/utils/tickets.js

// Clave base para el almacenamiento local. Usamos el ID del usuario para aislar sesiones.
const getStorageKey = (userId) => `pos_tickets_${userId}`;
const STORAGE_EVENT_KEY = 'tickets_storage_update';

// ==========================================================
// 1. Helper para crear un ticket vacío (necesario aquí también)
// ==========================================================
const createEmptyTicket = (clientId = 0) => ({
    id: Date.now(),
    name: 'Ticket Nuevo',
    items: [],
    clientId,
    discount: { type: 'none', value: 0 }
});

// ==========================================================
// 2. Función SAVE TICKETS (Ajustada para garantizar dispatch)
// ==========================================================
export const saveTickets = (userId, orders, activeOrderId) => {
    if (userId === 'anon') return;
    
    const key = getStorageKey(userId);
    const dataToSave = { orders, activeOrderId };
    const dataString = JSON.stringify(dataToSave);
    
    try {
        // 1. Guardar en localStorage
        localStorage.setItem(key, dataString);
        
        // 2. Disparar evento Customizado (más fiable para cross-tab sync)
        // Usamos un pequeño timeout para que el evento se dispare después del commit del estado de React
        setTimeout(() => {
            const event = new CustomEvent(STORAGE_EVENT_KEY, { detail: dataToSave });
            window.dispatchEvent(event);
        }, 10); // Pequeño delay para asegurar la secuencia

        // console.log(`[SAVE] Tickets guardados para ${userId}.`);
    } catch (error) {
        console.error("Error guardando tickets en localStorage:", error);
    }
};

// ==========================================================
// 3. Función LOAD TICKETS (Robustez mejorada)
// ==========================================================
export const loadTickets = (userId) => {
    if (userId === 'anon') {
        const initialTicket = createEmptyTicket(0);
        return { orders: [initialTicket], activeOrderId: initialTicket.id };
    }
    
    const key = getStorageKey(userId);
    const savedData = localStorage.getItem(key);
    
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            
            if (Array.isArray(parsed.orders) && parsed.orders.length > 0 && parsed.activeOrderId != null) {
                const currentOrders = parsed.orders;
                // Verificar que el activeId aún existe, si no, usar el primero
                const activeId = currentOrders.find(o => String(o.id) === String(parsed.activeOrderId)) 
                    ? parsed.activeOrderId 
                    : currentOrders[0].id;
                
                return { orders: currentOrders, activeOrderId: activeId };
            }
        } catch (error) {
            console.error("Error cargando/parseando tickets desde localStorage:", error);
        }
    }

    // Fallback: Estado inicial (un ticket nuevo)
    const initialTicket = createEmptyTicket(0);
    return { orders: [initialTicket], activeOrderId: initialTicket.id };
};


// ==========================================================
// 4. Función SUBSCRIBE TICKET CHANGES (Cross-Tab Sync)
// ==========================================================
export const subscribeTicketChanges = (userId, callback) => {
    const handleCustomStorageEvent = (event) => {
        if (event.detail) {
            // Asegúrate de que el evento no es de la pestaña actual (solo escucha)
            callback(event.detail);
        }
    };

    window.addEventListener(STORAGE_EVENT_KEY, handleCustomStorageEvent);

    // Mantenemos la escucha de 'storage' nativa para compatibilidad, 
    // pero la principal es el CustomEvent.
    const handleNativeStorageEvent = (e) => {
        const key = getStorageKey(userId);
        if (e.key === key && e.newValue) {
             try {
                const data = JSON.parse(e.newValue);
                // Si la pestaña actual NO generó el evento (la data cambió)
                // Esto es difícil de filtrar sin un ID de pestaña, pero el CustomEvent lo mejora.
                callback(data);
             } catch (error) {
                console.error("Error al sincronizar tickets desde evento de almacenamiento nativo:", error);
             }
        }
    };

    window.addEventListener('storage', handleNativeStorageEvent);

    return () => {
        window.removeEventListener(STORAGE_EVENT_KEY, handleCustomStorageEvent);
        window.removeEventListener('storage', handleNativeStorageEvent);
    };
};

// Exportar helper para que POS.jsx pueda usarlo
export { createEmptyTicket };