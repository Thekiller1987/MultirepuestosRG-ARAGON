// client/src/context/OrdersContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as api from '../service/api';

const OrdersContext = createContext(null);

export const OrdersProvider = ({ children }) => {
    // Intentar obtener usuario desde AuthContext si es posible, o props
    // Nota: Como estamos dentro de AuthProvider, deberíamos poder usar useAuth.
    // Pero si hay dependencia circular, evaluar. (Auth usa API, Orders usa API).
    // Asumiremos que es seguro.
    const [orders, setOrders] = useState([]);
    const [activeOrderId, setActiveOrderId] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);

    const activeOrder = orders.find(o => o.id === activeOrderId) || { items: [] };

    const loadOrdersFromDB = useCallback(async (userId) => {
        if (!userId) return;
        setCurrentUserId(userId);

        try {
            // 1. Try to fetch from API first (Source of Truth)
            // Need token? useAuth usually provides it, but here we might need to rely on localStorage token if not passed.
            const token = localStorage.getItem('token');
            const serverCarts = await api.getCart(userId, token);

            if (serverCarts && Array.isArray(serverCarts) && serverCarts.length > 0) {
                setOrders(serverCarts);
                setActiveOrderId(serverCarts[0].id);
                return;
            }
        } catch (e) {
            console.error("Error loading carts from DB, falling back to local:", e);
        }

        // 2. Fallback to localStorage if API fails or is empty (and we want to preserve local?)
        // Actually, if API is empty, it means empty. But let's check local just in case?
        // No, if migration happens, we want DB.

        const initial = [{ id: Date.now(), name: 'Ticket 1', items: [] }];
        setOrders(initial);
        setActiveOrderId(initial[0].id);
    }, []);

    // Persistencia Automática (Debounced)
    useEffect(() => {
        if (currentUserId && orders.length > 0) {
            // Debounce save to avoid spamming API on every keystroke
            const timer = setTimeout(() => {
                const token = localStorage.getItem('token');
                api.saveCart(currentUserId, orders, token).catch(e => console.error("Error saving cart:", e));
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [orders, currentUserId]);

    const handleNewOrder = () => {
        const newOrder = { id: Date.now(), name: `Ticket ${orders.length + 1}`, items: [] };
        setOrders(prev => {
            const next = [...prev, newOrder];
            return next;
        });
        setActiveOrderId(newOrder.id);
    };

    const handleRemoveOrder = (id) => {
        setOrders(prev => {
            const newOrders = prev.filter(o => o.id !== id);
            if (newOrders.length === 0) {
                const initial = { id: Date.now(), name: 'Ticket 1', items: [] };
                return [initial]; // Debe devolver estado
            }
            return newOrders;
        });
        // Logic for activeID update needs to be outside or careful
        // React batching might make this tricky if we depend on 'newOrders' immediately.
        // Better:
    };

    // Wrapper para remove que maneje el ID
    const removeOrderWrapper = (id) => {
        // Mark as deleted so polling doesn't resurrect it immediately
        if (recentlyDeletedIds.current) {
            recentlyDeletedIds.current.add(String(id));
            // Clean up memory after safe margin (e.g., 10 seconds)
            setTimeout(() => {
                if (recentlyDeletedIds.current) recentlyDeletedIds.current.delete(String(id));
            }, 10000);
        }

        let nextOrders = [];
        let nextActiveId = activeOrderId;

        setOrders(prev => {
            const remaining = prev.filter(o => o.id !== id);
            if (remaining.length === 0) {
                const initial = { id: Date.now(), name: 'Ticket 1', items: [] };
                nextOrders = [initial];
                nextActiveId = initial.id;
            } else {
                nextOrders = remaining;
                if (activeOrderId === id) {
                    nextActiveId = remaining[0].id;
                }
            }
            return nextOrders;
        });
        // Update active ID after render? Or immediately?
        // setState is async. We can't guarantee 'nextActiveId' is perfectly synced if we don't set it in the same tick if possible.
        // But here we split logic. 
        // Actually, if we use the function form for setOrders, we can't side-effect setActiveOrderId easily inside.
        // We should calculate logic first.
        // But 'orders' state is a dependency.

        // Simplified: Use current 'orders' state since 'handleRemoveOrder' is closure.
        const newOrders = orders.filter(o => o.id !== id);
        if (newOrders.length === 0) {
            const initial = { id: Date.now(), name: 'Ticket 1', items: [] };
            setOrders([initial]);
            setActiveOrderId(initial.id);
        } else {
            setOrders(newOrders);
            if (activeOrderId === id) {
                setActiveOrderId(newOrders[0].id);
            }
        }
    };

    const updateActiveOrder = (key, value) => {
        setOrders(prev => prev.map(o => o.id === activeOrderId ? { ...o, [key]: value } : o));
    };

    const loadPendingOrdersFromServer = async () => {
        try {
            const token = localStorage.getItem('token');
            const pending = await api.fetchPendingOrders(token);
            if (pending && pending.length > 0) {
                const serverTickets = pending.map(p => ({
                    id: `server_${p.id_pedido}`,
                    serverSaleId: p.id_pedido,
                    name: `Pedido #${p.id_pedido}`,
                    items: p.items || [],
                    client: p.cliente
                }));
                setOrders(prev => {
                    // Evitar duplicados
                    const existingIds = new Set(prev.map(o => o.id));
                    const toAdd = serverTickets.filter(t => !existingIds.has(t.id));
                    return [...prev, ...toAdd];
                });
            }
        } catch (e) { console.error("Error loading pending orders", e); }
    };

    // Track deleted IDs to prevent "Zombie" resurrection during polling race conditions
    const recentlyDeletedIds = React.useRef(new Set());

    // SAFE SYNC: Only append NEW tickets from other users (e.g., Proforma)
    // Does NOT overwrite local changes to existing tickets.
    const checkForNewOrders = useCallback(async (userId) => {
        if (!userId) return;
        try {
            const token = localStorage.getItem('token');
            const serverCarts = await api.getCart(userId, token);

            if (serverCarts && Array.isArray(serverCarts)) {
                setOrders(prev => {
                    const existingIds = new Set(prev.map(o => o.id));
                    // Find tickets in server that we don't have locally
                    // AND that we haven't recently deleted explicitly
                    const newTickets = serverCarts.filter(t =>
                        !existingIds.has(t.id) &&
                        !recentlyDeletedIds.current.has(String(t.id))
                    );

                    if (newTickets.length > 0) {
                        return [...prev, ...newTickets];
                    }
                    return prev;
                });
            }
        } catch (e) {
            // silent fail for polling
        }
    }, []);

    const value = {
        orders, setOrders, activeOrderId, setActiveOrderId, activeOrder,
        handleNewOrder, handleRemoveOrder: removeOrderWrapper, updateActiveOrder, loadOrdersFromDB,
        loadPendingOrdersFromServer, checkForNewOrders
    };

    return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

export const useOrders = () => {
    const context = useContext(OrdersContext);
    if (!context) throw new Error('useOrders must be used within OrdersProvider');
    return context;
};
