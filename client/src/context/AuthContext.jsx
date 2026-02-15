import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../service/api.js';
import { loadCajaSession, saveCajaSession } from '../utils/caja.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children, socket }) => {
    const [user, setUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [clients, setClients] = useState([]);
    const [categories, setCategories] = useState([]);
    const [providers, setProviders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [cajaSession, setCajaSession] = useState(null);

    // Ref for Debouncing
    const refreshTimeoutRef = useRef(null);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        navigate('/login');
    }, [navigate]);

    const CACHE_KEY = 'masterDataCache';

    const loadMasterData = useCallback(async (token, useBackground = false) => {
        try {
            const results = await Promise.allSettled([
                api.fetchUsers(token),
                api.fetchProducts(token),
                api.fetchClients(token),
                api.fetchCategories(token),
                api.fetchProviders(token),
            ]);

            // Cada uno se procesa individualmente — si uno falla, los demás aún cargan
            const newUsers = results[0].status === 'fulfilled' ? (results[0].value || []) : null;
            const newProducts = results[1].status === 'fulfilled' ? (results[1].value || []) : null;
            const newClients = results[2].status === 'fulfilled' ? (results[2].value || []) : null;
            const newCategories = results[3].status === 'fulfilled' ? (results[3].value || []) : null;
            const newProviders = results[4].status === 'fulfilled' ? (results[4].value || []) : null;

            if (newUsers) setAllUsers(newUsers);
            if (newProducts) setProducts(newProducts);
            if (newClients) setClients(newClients);
            if (newCategories) setCategories(newCategories);
            if (newProviders) setProviders(newProviders);

            // Guardar en caché local para carga instantánea futura
            try {
                const cacheData = {
                    users: newUsers || [],
                    products: newProducts || [],
                    clients: newClients || [],
                    categories: newCategories || [],
                    providers: newProviders || [],
                    timestamp: Date.now()
                };
                localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
            } catch (e) { /* localStorage lleno — ignorar */ }

            // Si TODOS fallaron con 401, hacer logout
            const allUnauth = results.every(r => r.status === 'rejected' && r.reason?.status === 401);
            if (allUnauth) logout();
        } catch (err) {
            console.error("Fallo crítico cargando datos maestros:", err);
            if (err.status === 401) logout();
        }
    }, [logout]);

    // Cargar datos desde caché local (instantáneo)
    const loadFromCache = useCallback(() => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const data = JSON.parse(cached);
                if (data.users?.length) setAllUsers(data.users);
                if (data.products?.length) setProducts(data.products);
                if (data.clients?.length) setClients(data.clients);
                if (data.categories?.length) setCategories(data.categories);
                if (data.providers?.length) setProviders(data.providers);
                return true; // Caché encontrada
            }
        } catch (e) { /* caché corrupta */ }
        return false; // Sin caché
    }, []);

    const refreshProducts = useCallback(async () => {
        if (!token) return;
        try {
            // console.log("🔄 [AuthContext] Refreshing products...");
            const data = await api.fetchProducts(token);
            setProducts(data || []);
            // console.log("✅ [AuthContext] Products updated");
        } catch (e) {
            // Suppress network errors from duplicate requests (abort controller would be better but this is simpler)
            if (e.name !== 'CanceledError') {
                console.error("Error updating inventory:", e.message);
            }
        }
    }, [token]);

    // DEBOUNCED REFRESH: Prevents "Network Error" double-fetch race conditions
    const refreshProductsDebounced = useCallback(() => {
        if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
        }
        refreshTimeoutRef.current = setTimeout(() => {
            refreshProducts();
        }, 300); // Wait 300ms for other events to settle
    }, [refreshProducts]);

    const refreshClients = useCallback(async () => {
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
            try {
                const clientsData = await api.fetchClients(currentToken);
                setClients(clientsData || []);
            } catch (error) {
                // console.error("Error al refrescar clientes:", error);
            }
        }
    }, []);

    // Socket Listeners
    useEffect(() => {
        if (!socket) return;

        const onInventoryUpdate = () => {
            // Use Debounced version!
            refreshProductsDebounced();
        };

        socket.on('inventory_update', onInventoryUpdate);
        socket.on('products:update', onInventoryUpdate);
        socket.on('clients:update', refreshClients); // Clients usually don't spam, direct call is fine
        socket.on('users:update', async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const users = await api.fetchUsers(token);
                    setAllUsers(users || []);
                } catch (e) { }
            }
        });

        return () => {
            if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
            socket.off('inventory_update', onInventoryUpdate);
            socket.off('products:update', onInventoryUpdate);
            socket.off('clients:update', refreshClients);
            socket.off('users:update');
        };
    }, [socket, refreshProductsDebounced, refreshClients]);

    useEffect(() => {
        const initializeAuth = async () => {
            setIsLoading(true);
            try {
                const tokenInStorage = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');
                if (tokenInStorage && storedUser) {
                    try {
                        const parsedUser = JSON.parse(storedUser);
                        setUser(parsedUser);
                        setToken(tokenInStorage);

                        // 1. CARGAR DESDE CACHÉ = INSTANTÁNEO (< 10ms)
                        const hadCache = loadFromCache();

                        if (hadCache) {
                            // Tenemos datos en caché — mostrar el app INMEDIATAMENTE
                            setIsLoading(false);
                            // 2. Refrescar en segundo plano sin bloquear UI
                            loadMasterData(tokenInStorage, true).catch(console.warn);
                        } else {
                            // Sin caché — primera vez, hay que esperar
                            await loadMasterData(tokenInStorage);
                            setIsLoading(false);
                        }
                    } catch (error) {
                        logout();
                    }
                }
            } finally {
                // Failsafe: si algo salió mal, asegurar que loading se apague
                setIsLoading(prev => prev ? false : prev);
            }
        };
        initializeAuth();
    }, [logout, loadMasterData, loadFromCache]);

    const login = async (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setToken(token);
        setIsLoading(true);
        await loadMasterData(token);
        setIsLoading(false);
        navigate('/dashboard');
    };

    useEffect(() => {
        if (user) {
            const userId = user.id_usuario || user.id;
            setCajaSession(loadCajaSession(userId));
        } else {
            setCajaSession(null);
        }
    }, [user]);

    const addCajaTransaction = useCallback(async (transaction) => {
        if (!user) return;
        const userId = user.id_usuario || user.id;

        // 1. Actualización Local (Optimista)
        const session = loadCajaSession(userId);
        if (session && !session.closedAt) {
            session.transactions = [...(session.transactions || []), transaction];
            saveCajaSession(userId, session);
            setCajaSession(session);
        }

        // 2. Sincronización con Servidor
        try {
            await api.addCajaTx({ userId, tx: transaction }, token);
            // console.log("✅ Transacción de caja sincronizada con servidor");
        } catch (error) {
            console.error("❌ Error sincronizando transacción de caja:", error);
        }
    }, [user, token]);

    const value = {
        user,
        token,
        allUsers,
        products,
        clients,
        categories,
        providers,
        isLoading,
        login,
        logout,
        loadMasterData,
        refreshProducts,
        refreshClients,
        cajaSession,
        setCajaSession,
        addCajaTransaction
    };

    if (isLoading && !user) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: '#f8fafc',
                color: '#64748b'
            }}>
                <div className="spinner" style={{
                    width: '50px',
                    height: '50px',
                    border: '5px solid #e2e8f0',
                    borderTop: '5px solid #3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <h3 style={{ marginTop: '20px', fontWeight: 600 }}>Cargando Sistema...</h3>
                <style>{`
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};