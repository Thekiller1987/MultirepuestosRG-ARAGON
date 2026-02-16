import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  FaArrowLeft, FaShoppingCart, FaPlus, FaMinus, FaTrashAlt, FaLock,
  FaHistory, FaSync, FaKeyboard, FaTimes,
  FaFileInvoice, FaMoneyBillWave, FaArrowDown, FaArrowUp,
  FaPercentage, FaTag, FaEdit, FaPencilAlt
} from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';

import * as S from './POS.styles.jsx';
import * as api from '../../service/api';
import { useAuth } from '../../context/AuthContext';
import { useCaja } from '../../context/CajaContext';
import { useOrders } from '../../context/OrdersContext';

import ProductPanel from './components/ProductPanel.jsx';
import CajaModal from './components/CajaModal.jsx';
import PaymentModal from './components/PaymentModal.jsx';
import SalesHistoryModal from './components/SalesHistoryModal.jsx';
import ProformaModal from './components/ProformaModal.jsx';
import PromptModal from './components/PromptModal.jsx';
import TicketModal from './components/TicketModal.jsx';
import ConfirmationModal from './components/ConfirmationModal.jsx';
import SecretAdjustModal from './components/SecretAdjustModal.jsx';

const fmt = (n) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const POS = () => {
  // Contextos
  const { user, products: initialProducts, token, refreshProducts, clients, allUsers } = useAuth();
  const { isCajaOpen, setIsCajaOpen, cajaSession, setCajaSession, tasaDolar, setTasaDolar, closeCajaSession, refreshSession } = useCaja();
  const {
    orders, activeOrderId, setActiveOrderId, activeOrder,
    handleNewOrder, handleRemoveOrder, updateActiveOrder, loadOrdersFromDB, checkForNewOrders
  } = useOrders();

  const userId = user?.id_usuario || user?.id;
  const currentUser = user;
  const isAdmin = user?.rol === 'admin';

  // Estados Locales
  const [products, setProductsState] = useState(initialProducts || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('description');
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [modal, setModal] = useState({ name: null, data: null });
  const [ticketData, setTicketData] = useState(null); // State for the ticket to print
  const [alert, setAlert] = useState({ isOpen: false, title: '', message: '' });
  const [confirmation, setConfirmation] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [secretModalOpen, setSecretModalOpen] = useState(false);

  const searchRef = useRef(null);

  // ... (Calculations)

  // Calculate Current Stats for Secret Modal
  const currentStats = useMemo(() => {
    if (!cajaSession?.transactions) return { netCordobas: 0, netDolares: 0 };
    let netC = 0, netD = 0;
    const txs = cajaSession.transactions;
    const initial = Number(cajaSession.initialAmount || 0);

    // Start with initial? Actually expected usually includes initial. 
    // The user wants to match "What is inside the box". The box includes Initial + Sales.
    // So yes, include initial.
    netC += initial;

    for (const tx of txs) {
      const t = (tx.type || '').toLowerCase();
      let pd = tx.pagoDetalles || {};
      if (typeof pd === 'string') { try { pd = JSON.parse(pd); } catch { pd = {}; } }

      let rawAmount = Number(pd.ingresoCaja !== undefined ? pd.ingresoCaja : (tx.amount || 0));
      if (t === 'salida' || t.includes('devolucion')) rawAmount = -Math.abs(rawAmount);

      // Same logic as CajaModal for CASH
      if (t.startsWith('venta')) {
        if (pd.efectivo !== undefined || pd.dolares !== undefined) {
          netC += (Number(pd.efectivo || 0) - Number(pd.cambio || 0));
          netD += Number(pd.dolares || 0);
        } else {
          netC += (rawAmount - Number(pd.tarjeta || 0) - Number(pd.transferencia || 0) - Number(pd.credito || 0));
        }
      } else if (t.includes('abono')) {
        if (pd.dolares !== undefined) {
          netD += Number(pd.dolares || 0);
          netC += Number(pd.efectivo || 0);
        } else {
          netC += rawAmount;
        }
      } else if (t === 'entrada') {
        netC += Math.abs(rawAmount);
      } else if (t === 'salida') {
        netC -= Math.abs(rawAmount);
      } else if (t === 'ajuste') {
        if (pd.target === 'efectivo') netC += Number(tx.amount || 0);
        if (pd.target === 'dolares') netD += Number(tx.amount || 0);
      } else {
        netC += rawAmount;
      }
    }
    return { netCordobas: netC, netDolares: netD };
  }, [cajaSession]);
  const playBeep = useCallback(() => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine'; // 'square' for more 8-bit feel
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // Ignore audio errors (interaction requirement)
    }
  }, []);

  // Cálculos del Carrito Activo
  const cart = activeOrder?.items || [];
  const subtotal = cart.reduce((s, i) => s + (i.precio_venta * i.quantity), 0);
  const discountAmount = activeOrder?.discount?.type === 'percentage'
    ? (subtotal * activeOrder.discount.value / 100)
    : (activeOrder?.discount?.value || 0);
  const total = subtotal - discountAmount;

  /* -----------------------------------------------------------------
   * EFECTOS E INICIALIZACIÓN
   * ----------------------------------------------------------------- */
  useEffect(() => {
    if (initialProducts) setProductsState(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    if (userId) {
      // 1. Initial Load: Get everything
      loadOrdersFromDB(userId);

      // 2. Poll for NEW orders safely without overwriting current work
      const intervalId = setInterval(() => {
        if (!document.hidden) {
          checkForNewOrders(userId);
        }
      }, 15000);

      return () => clearInterval(intervalId);
    }
  }, [userId, loadOrdersFromDB, checkForNewOrders]);

  /* -----------------------------------------------------------------
   * ACCIONES Y MANEJADORES
   * ----------------------------------------------------------------- */
  const showAlert = ({ title, message }) => setAlert({ isOpen: true, title, message });
  const closeAlert = () => setAlert({ isOpen: false });

  const showConfirmation = ({ title, message, onConfirm }) => {
    setConfirmation({ isOpen: true, title, message, onConfirm });
  };
  const closeConfirmation = () => setConfirmation({ isOpen: false, title: '', message: '', onConfirm: null });

  const openModal = (name, data = null) => setModal({ name, data });
  const closeModal = () => setModal({ name: null, data: null });

  const refreshData = async () => {
    try {
      await refreshProducts();
      if (userId) await loadOrdersFromDB(userId);
    } catch (e) { console.error("Error refreshing data", e); }
  };

  const updateActiveCart = (newCart) => updateActiveOrder('items', newCart);

  const handleSecretTrigger = () => {
    openModal('pinPrompt', {
      action: () => setSecretModalOpen(true)
    });
  };

  const handleSecretAdjust = async (adjustments) => {
    for (const adj of adjustments) {
      const transaction = {
        type: 'ajuste',
        amount: adj.amount,
        at: new Date().toISOString(),
        userId,
        note: `Ajuste Interno (${adj.target})`,
        pagoDetalles: {
          target: adj.target,
          hidden: true,
          amount: adj.amount,
          efectivo: adj.target === 'efectivo' ? adj.amount : 0,
          dolares: adj.target === 'dolares' ? adj.amount : 0,
          credito: adj.target === 'credito' ? adj.amount : 0,
          tarjeta: adj.target === 'tarjeta' ? adj.amount : 0
        },
        id: 'ADJ-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5)
      };

      try {
        await api.addCajaTx({ userId, tx: transaction }, token);
      } catch (e) {
        console.error("Error saving secret adjust:", e);
      }
    }
    await refreshSession();
    showAlert({ title: "Procesado", message: "Ajustes aplicados correctamente." });
  };

  // ... (Calculations)

  // Calculate Current Stats for Secret Modal
  // ... (rest of code)

  // ...

  const handleAddToCart = (product, quantity = 1) => {
    if (window.innerWidth <= 960) setIsMobileCartOpen(true);
    const pid = product.id_producto || product.id;
    const existing = cart.find(i => (i.id_producto || i.id) === pid);
    const newQty = (existing?.quantity || 0) + quantity;

    if (product.existencia <= 0) {
      showAlert({ title: "Sin Stock", message: `El producto "${product.nombre}" no tiene existencia disponible.` });
      return;
    }

    if (newQty > product.existencia) {
      showAlert({ title: "Stock Insuficiente", message: `Solo hay ${product.existencia} unidades disponibles.` });
      return;
    }

    // Play Sound
    playBeep();

    const price = existing?.precio_venta || product.venta || product.precio || 0;
    const newItem = { ...product, id: pid, id_producto: pid, quantity: newQty, precio_venta: price };

    const newCart = existing
      ? cart.map(i => (i.id_producto || i.id) === pid ? newItem : i)
      : [...cart, newItem];

    updateActiveCart(newCart);
  };

  const handleUpdateCartQuantity = (id, qty) => {
    const pid = id;
    const pRef = products.find(p => (p.id_producto || p.id) === pid) || cart.find(c => (c.id_producto || c.id) === pid);
    if (!pRef) return;

    let q = parseInt(qty, 10) || 0;
    if (q <= 0) {
      updateActiveCart(cart.filter(i => (i.id_producto || i.id) !== pid));
      return;
    }
    if (q > (pRef.existencia || 9999)) {
      q = pRef.existencia;
      showAlert({ title: "Stock", message: "Cantidad máxima alcanzada según inventario." });
    }

    // Sound on manual increase too? Maybe.
    if (q > (cart.find(c => (c.id_producto || c.id) === pid)?.quantity || 0)) {
      playBeep();
    }

    updateActiveCart(cart.map(i => (i.id_producto || i.id) === pid ? { ...i, quantity: q } : i));
  };

  const handleFinishSale = async (pagoDetalles) => {
    const orderToCloseId = activeOrderId;
    const currentOrder = orders.find(o => o.id === orderToCloseId);

    if (cart.length === 0) {
      showAlert({ title: "Carrito Vacío", message: "No hay productos para facturar." });
      return false;
    }

    const payloadItems = cart.map(i => ({
      id_producto: i.id_producto || i.id,
      quantity: i.quantity,
      precio: i.precio_venta,
      nombre: i.nombre,
      codigo: i.codigo,
      costo: i.costo || 0
    }));

    const saleData = {
      totalVenta: total,
      subtotal,
      descuento: discountAmount,
      items: payloadItems,
      pagoDetalles,
      userId,
      clientId: Number(pagoDetalles.clienteId || 0),
      tasaDolarAlMomento: tasaDolar,
      originalOrderId: currentOrder?.serverSaleId || null
    };

    // --- LÓGICA DE COBRO INSTANTÁNEO ---

    // 1. Preparar datos
    // ... (payloadItems y saleData ya definidos) ...

    // 2. Si se requiere IMPRESIÓN, debemos esperar (Await) para tener el ID real
    //    Si NO se requiere, hacemos "Fire and Forget" para ser instantáneos.
    const isInstant = !pagoDetalles.shouldPrintNow;

    const processSalePromise = async () => {
      try {
        const response = await api.createSale(saleData, token);

        // Background refresh inventory
        refreshProducts().catch(console.error);

        const responseData = response.data || response || {};
        const savedSale = { ...saleData, ...responseData };
        savedSale.id = responseData.id || responseData.saleId || responseData._id || 'N/A';
        savedSale.items = payloadItems;
        savedSale.pagoDetalles = pagoDetalles;
        savedSale.fecha = new Date().toISOString();

        if (pagoDetalles.shouldPrintNow) {
          setTicketData(savedSale); // Abre Modal Ticket con ID real
          // Clear cart AFTER setting ticket data to ensure UI consistency behind modal
          handleRemoveOrder(orderToCloseId);
        } else {
          // Éxito silencioso o pequeño toast (ya mostramos alerta abajo si era instant)
          // If not printing, clear immediately
          handleRemoveOrder(orderToCloseId);
        }

        // Registrar en Caja (Background)
        if (isCajaOpen && cajaSession) {
          const details = { ...pagoDetalles };
          const isCash = !details.tarjeta && !details.transferencia && !details.credito;
          if (isCash && details.efectivo === undefined) details.efectivo = saleData.totalVenta;

          const clientNameFound = clients.find(c => c.id_cliente === Number(pagoDetalles.clienteId))?.nombre || "Consumidor Final";
          const totalSale = Number(saleData.totalVenta || 0);
          details.efectivo = Number(details.efectivo || 0);

          const newTransaction = {
            type: 'venta',
            amount: totalSale,
            at: new Date().toISOString(),
            userId,
            note: `Venta #${savedSale.id} - ${clientNameFound}`,
            pagoDetalles: details,
            id: savedSale.id
          };

          // Enviar a servidor sin esperar en UI
          api.addCajaTx({ userId, tx: newTransaction }, token).catch(console.error);

          // Actualizar sesión local (si no lo hicimos antes)
          // Nota: Si ya lo hicimos antes, esto podría duplicar visualmente si no tenemos cuidado, 
          // pero como estamos en la promesa, esto corre "después".
          // Mejor: Actualizar la sesión local SOLO si es await. Si es instant, lo hacemos afuera.
          if (!isInstant) {
            const updatedSession = { ...cajaSession, transactions: [newTransaction, ...(cajaSession.transactions || [])] };
            setCajaSession(updatedSession);
          }
        }

      } catch (err) {
        console.error("CRITICAL: Error saving sale in background:", err);
        // ★ NOTIFICACIÓN DE FALLO (User Request)
        showAlert({
          title: "⚠️ Error de Sincronización",
          message: `La venta por C$ ${fmt(total)} NO se guardó en el servidor.\nError: ${err.message}.\n\nPor favor, anote los detalles o reintente.`
        });
        // TODO: En un sistema real, guardaríamos esto en IndexedDB para reintento automático.
      }
    };

    if (isInstant) {
      // --- MODO INSTANTÁNEO ---
      // 1. Actualizar UI inmediatamente (Optimistic)
      handleRemoveOrder(orderToCloseId);

      setProductsState(prev => prev.map(p => {
        const sold = payloadItems.find(i => i.id_producto === (p.id_producto || p.id));
        if (sold) return { ...p, existencia: Math.max(0, p.existencia - sold.quantity) };
        return p;
      }));

      // Actualizar Caja Localmente (Optimistic)
      if (isCajaOpen && cajaSession) {
        const details = { ...pagoDetalles };
        const clientNameFound = clients.find(c => c.id_cliente === Number(pagoDetalles.clienteId))?.nombre || "Consumidor Final";
        const totalSale = Number(saleData.totalVenta || 0);
        // ... (Logic duplicated largely for local show) ...
        const tempTx = {
          type: 'venta',
          amount: totalSale,
          at: new Date().toISOString(),
          userId,
          note: `Venta (Pendiente) - ${clientNameFound}`,
          pagoDetalles: details,
          id: 'PEND-' + Date.now()
        };
        const updatedSession = { ...cajaSession, transactions: [tempTx, ...(cajaSession.transactions || [])] };
        setCajaSession(updatedSession);
      }

      showAlert({ title: "¡Éxito!", message: "Venta procesada." });

      // 2. Ejecutar proceso en background
      processSalePromise(); // No awaits

      return true;

    } else {
      // --- MODO CON ESPERA (IMPRESIÓN) ---
      // Debemos esperar para tener el ID y mostrar el ticket
      await processSalePromise();
      return true;
    }
  };

  // Handlers for cash entry/exit
  const handleCashEntry = () => {
    openModal('cashEntry');
  };

  const handleCashExit = () => {
    openModal('cashExit');
  };

  const processCashTransaction = async (type, amount, note) => {
    if (!amount || amount <= 0) {
      showAlert({ title: "Error", message: "Ingrese un monto válido" });
      return;
    }

    const transaction = {
      type,
      amount: parseFloat(amount),
      note,
      at: new Date().toISOString(),
      userId
    };

    try {
      await api.addCajaTx({ userId, tx: transaction }, token);
    } catch (e) {
      console.error("Error saving manual tx:", e);
      showAlert({ title: "Error Servidor", message: "No se guardó en el servidor, pero se actualizará localmente." });
    }

    // Strict Sync: Refresh from server
    await refreshSession();
    closeModal();
    showAlert({
      title: "Éxito",
      message: type === 'entrada' ? 'Entrada registrada' : 'Salida registrada'
    });
  };

  const renameTicket = (newName) => {
    if (newName && newName.trim()) {
      updateActiveOrder('name', newName.trim());
      closeModal();
      showAlert({ title: "Ticket Renombrado", message: `Nombre actualizado a: ${newName.trim()} ` });
    }
  };



  // Handlers for Item Actions
  const handleUpdateItemPrice = (newItemPrice) => {
    const item = modal.data?.item;
    if (!item) return;

    const price = parseFloat(newItemPrice);
    const costo = item.costo || item.raw?.costo || 0;

    if (price < costo) {
      showAlert({ title: "Precio Inválido", message: `El precio C$${price.toFixed(2)} es menor al costo(C$${costo.toFixed(2)}).` });
      return;
    }

    const pid = item.id_producto || item.id;
    const newCart = cart.map(i => (i.id_producto || i.id) === pid ? { ...i, precio_venta: price } : i);
    updateActiveCart(newCart);
    closeModal();
  };

  const handleItemWholesale = (item) => {
    const pid = item.id_producto || item.id;
    const product = products.find(p => (p.id_producto || p.id) === pid) || item;
    const mayorista = Number(product.mayorista || product.mayoreo || 0);

    if (!mayorista) {
      showAlert({ title: "Aviso", message: "Este producto no tiene precio mayorista." });
      return;
    }

    // Toggle: if current price is equal to wholesale price (approx), switch back to retail
    const currentPrice = Number(item.precio_venta || 0);
    const isWholesaleConfigured = Math.abs(currentPrice - mayorista) < 0.01;

    // Retail price fallback: product.venta, product.precio, or current item price if we are not wholesale
    const retailPrice = Number(product.venta || product.precio || (isWholesaleConfigured ? item.originalPrice : item.precio_venta) || 0);

    const newPrice = isWholesaleConfigured ? retailPrice : mayorista;

    const newCart = cart.map(i => (i.id_producto || i.id) === pid ? { ...i, precio_venta: newPrice } : i);
    updateActiveCart(newCart);

    if (isWholesaleConfigured) {
      showAlert({ title: "Precio Revertido", message: "Se ha restablecido el precio regular." });
    } else {
      showAlert({ title: "Precio Mayorista", message: "✅ ACTIVADO Precio Mayorista" });
    }
  };

  const handleItemDiscount = (val, type) => {
    const item = modal.data?.item;
    if (!item) return;

    const pid = item.id_producto || item.id;
    let newPrice = item.precio_venta;
    const value = parseFloat(val);

    if (isNaN(value) || value < 0) {
      showAlert({ title: "Valor Inválido", message: "Ingrese un valor de descuento válido." });
      return;
    }

    if (type === 'percentage') {
      newPrice = newPrice - (newPrice * (value / 100));
    } else {
      newPrice = newPrice - value;
    }

    // Cost check
    const costo = item.costo || item.raw?.costo || 0;
    if (newPrice < costo) {
      showAlert({ title: "Precio Inválido", message: `El descuento deja el precio(C$${newPrice.toFixed(2)}) por debajo del costo.` });
      return;
    }

    const newCart = cart.map(i => (i.id_producto || i.id) === pid ? { ...i, precio_venta: newPrice } : i);
    updateActiveCart(newCart);
    closeModal();
  };

  // Calculate Reserved Stock from other open tickets
  const reservedStock = useMemo(() => {
    const reserved = new Map();
    orders.forEach(order => {
      // Skip the current active order to avoid double counting (ProductPanel handles current cart)
      if (order.id === activeOrder?.id) return;

      order.items.forEach(item => {
        const pid = item.id_producto || item.id;
        const qty = Number(item.cantidad || item.quantity || 0);
        reserved.set(pid, (reserved.get(pid) || 0) + qty);
      });
    });
    return reserved;
  }, [orders, activeOrder]);

  // Handler for global wholesale price toggle
  const toggleWholesalePrice = () => {
    let updatedCount = 0;
    const newCart = cart.map(item => {
      const product = products.find(p => (p.id_producto || p.id) === (item.id_producto || item.id));
      if (!product) return item;

      const mayorista = Number(product.mayorista || product.mayoreo || 0);
      if (!mayorista) return item;

      const currentPrice = Number(item.precio_venta || 0);
      const isCurrentlyWholesale = Math.abs(currentPrice - mayorista) < 0.01;

      const retailPrice = Number(product.venta || product.precio || item.originalPrice || item.precio_venta || 0);
      const targetPrice = isCurrentlyWholesale ? retailPrice : mayorista;

      // Only update if price actually changes
      if (Math.abs(currentPrice - targetPrice) > 0.01) {
        updatedCount++;
        return { ...item, precio_venta: targetPrice };
      }
      return item;
    });

    if (updatedCount > 0) {
      updateActiveCart(newCart);
      const firstChanged = newCart.find((item, i) => Math.abs(item.precio_venta - (cart[i]?.precio_venta || 0)) > 0.01);
      const product = products.find(p => (p.id_producto || p.id) === (firstChanged?.id_producto || firstChanged?.id));
      const isNowWholesale = product && Math.abs(firstChanged.precio_venta - Number(product.mayorista || 0)) < 0.01;

      showAlert({
        title: "Precio Actualizado",
        message: `${isNowWholesale ? "ACTIVADO" : "DESACTIVADO"} precio mayorista en ${updatedCount} producto(s).`
      });
    } else {
      showAlert({ title: "Sin Cambios", message: "No hay productos con precio mayorista disponible o ya están aplicados." });
    }
  };

  // Handler for discount
  const applyDiscount = (discountData) => {
    updateActiveOrder('discount', discountData);
    closeModal();
  };

  /* -----------------------------------------------------------------
   * VISTA DE CAJA CERRADA
   * ----------------------------------------------------------------- */
  if (!isCajaOpen) {
    return (
      <S.PageWrapper style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <FaLock size={50} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
        <h1 style={{ color: '#64748b', margin: '0 0 0.5rem 0' }}>Caja Cerrada</h1>
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Debes realizar la apertura de caja para procesar ventas.</p>
        <S.Button primary onClick={() => openModal('caja')}><FaKeyboard /> Abrir Caja (F9)</S.Button>
        {modal.name === 'caja' && (
          <CajaModal
            isOpen={true}
            onClose={closeModal}
            currentUser={currentUser}
            isCajaOpen={isCajaOpen}
            session={cajaSession}
            isAdmin={isAdmin}
            showAlert={showAlert}
            showConfirmation={showConfirmation}
            initialTasaDolar={tasaDolar}
            onOpenCaja={async (montoInicial, tasa) => {
              try {
                const newSession = await api.openCajaSession({
                  userId,
                  openedAt: new Date().toISOString(),
                  openedBy: { id: userId, name: currentUser?.nombre || currentUser?.nombre_usuario },
                  initialAmount: montoInicial,
                  tasaDolar: tasa
                }, token);

                // Strict Sync:
                await refreshSession(); // Gets the new session with ID and Tasa
                closeModal();
              } catch (e) {
                showAlert({ title: 'Error', message: 'No se pudo abrir la caja en el servidor.' });
              }
            }}
            onCloseCaja={async (montoCounted) => {
              try {
                const closed = await api.closeCajaSession({
                  userId,
                  closedAt: new Date().toISOString(),
                  closedBy: { id: userId, name: currentUser?.nombre || currentUser?.nombre_usuario },
                  countedAmount: montoCounted,
                  notes: 'Cierre desde POS'
                }, token);

                // Strict Sync:
                await refreshSession(); // Should return null/closed
                closeModal();
                showAlert({ title: 'Caja Cerrada', message: 'La sesión se ha cerrado y guardado correctamente.' });
              } catch (e) {
                console.error(e);
                // NO ZOMBIE RECOVERY. Server error is displayed.
                showAlert({ title: 'Error', message: 'Error cerrando caja en servidor: ' + (e.message || 'Desconocido') });
              }
            }}
          />
        )}
      </S.PageWrapper>
    );
  }

  /* -----------------------------------------------------------------
   * RENDER PRINCIPAL POS
   * ----------------------------------------------------------------- */
  return (
    <S.PageWrapper>
      <S.HeaderActions>
        <S.BackButton to="/dashboard"><FaArrowLeft /> Regresar</S.BackButton>
        <div style={{ fontWeight: '800', letterSpacing: '1px', userSelect: 'none' }} onDoubleClick={handleSecretTrigger}>SISTEMA POS</div>
        <div className="right-actions">
          <S.Button secondary onClick={refreshData} title="Sincronizar">
            <FaSync />
          </S.Button>
          <S.Button secondary onClick={() => openModal('salesHistory')} title="Historial de Ventas">
            <FaHistory />
          </S.Button>
          <S.Button secondary onClick={() => openModal('cashEntry')} title="Entrada de Dinero">
            <FaArrowDown color="#10b981" />
          </S.Button>
          <S.Button secondary onClick={() => openModal('cashExit')} title="Salida de Dinero">
            <FaArrowUp color="#ef4444" />
          </S.Button>
          <S.Button secondary onClick={() => openModal('caja')}>
            <FaLock /> {currentUser?.nombre_usuario || 'Caja'}
          </S.Button>
        </div>
      </S.HeaderActions>

      <S.PageContentWrapper>
        {/* PANEL IZQUIERDO: PRODUCTOS */}
        <S.MainPanel>
          <ProductPanel
            products={products}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchType={searchType}
            setSearchType={setSearchType}
            onProductClick={(p) => handleAddToCart(p, 1)}
            cartItems={cart}
            inputRef={searchRef}
            reservedStock={reservedStock} // Pass the reservation map
          />
        </S.MainPanel>

        {/* PANEL DERECHO: CARRITO / TICKETS */}
        <S.CartPanel isOpen={isMobileCartOpen}>
          <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaShoppingCart color="#2563eb" /> Carrito
              </h3>
              {window.innerWidth <= 960 && <S.Button onClick={() => setIsMobileCartOpen(false)}><FaTimes /></S.Button>}
            </div>

            {/* Gestión de Multi-Tickets */}
            <S.TicketContainer>
              {orders.map(o => (
                <S.Button
                  key={o.id}
                  primary={o.id === activeOrderId}
                  secondary={o.id !== activeOrderId}
                  onClick={() => setActiveOrderId(o.id)}
                  onDoubleClick={() => openModal('renameTicket')}
                  style={{ fontSize: '0.75rem', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  {o.name}
                  <span
                    style={{ marginLeft: 5, fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={(e) => { e.stopPropagation(); handleRemoveOrder(o.id); }}
                  >
                    ×
                  </span>
                </S.Button>
              ))}
              <S.Button secondary onClick={handleNewOrder} title="Nuevo Ticket"><FaPlus /></S.Button>
            </S.TicketContainer>

            {/* Action Buttons for Cart Management */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <S.Button
                secondary
                onClick={toggleWholesalePrice}
                title="Cambiar a Precio Mayorista"
                disabled={cart.length === 0}
                style={{ flex: 1, fontSize: '0.75rem', padding: '8px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}
              >
                <FaTag size={12} /> Mayorista
              </S.Button>
              <S.Button
                secondary
                onClick={() => openModal('discount')}
                title="Aplicar Descuento"
                disabled={cart.length === 0}
                style={{ flex: 1, fontSize: '0.75rem', padding: '8px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}
              >
                <FaPercentage size={12} /> Descuento
              </S.Button>
            </div>

            {/* Lista de Items en Carrito */}
            <div style={{ flex: 1, overflowY: 'auto', margin: '1rem 0', paddingRight: '5px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '2rem' }}>Selecciona productos para vender</div>
              ) : (
                cart.map(item => (
                  <S.CartItemWrapper key={item.id_producto || item.id}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e293b' }}>{item.nombre}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#334155', fontStyle: 'normal' }}>{item.codigo}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Unit: C$ {fmt(item.precio_venta)}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#2563eb', marginTop: '2px' }}>
                        Total: C$ {fmt(Number(item.quantity || 1) * Number(item.precio_venta || 0))}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        <S.RoundBtn title="Editar Precio" onClick={() => openModal('editPrice', { item })} style={{ width: 26, height: 26, background: '#f1f5f9', color: '#334155' }}>
                          <FaPencilAlt size={10} />
                        </S.RoundBtn>
                        <S.RoundBtn title="Precio Mayorista" onClick={() => handleItemWholesale(item)} style={{ width: 26, height: 26, background: '#f1f5f9', color: '#334155' }}>
                          <FaTag size={10} />
                        </S.RoundBtn>
                        <S.RoundBtn title="Descuento Item" onClick={() => openModal('itemDiscount', { item })} style={{ width: 26, height: 26, background: '#f1f5f9', color: '#334155' }}>
                          <FaPercentage size={10} />
                        </S.RoundBtn>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <S.QtyControl>
                        <S.RoundBtn onClick={() => handleUpdateCartQuantity(item.id_producto || item.id, item.quantity - 1)}><FaMinus size={8} /></S.RoundBtn>
                        <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center', fontSize: '0.9rem' }}>{item.quantity}</span>
                        <S.RoundBtn onClick={() => handleUpdateCartQuantity(item.id_producto || item.id, item.quantity + 1)}><FaPlus size={8} /></S.RoundBtn>
                      </S.QtyControl>
                      <S.RoundBtn onClick={() => updateActiveCart(cart.filter(x => (x.id_producto || x.id) !== (item.id_producto || item.id)))} style={{ color: '#ef4444' }}><FaTrashAlt size={12} /></S.RoundBtn>
                    </div>
                  </S.CartItemWrapper>
                ))
              )}
            </div>

            {/* Totales y Botón Cobrar */}
            <div style={{ borderTop: '2px solid #f1f5f9', paddingTop: '1rem' }}>
              <S.TotalsRow><span>Subtotal</span><span>C$ {fmt(subtotal)}</span></S.TotalsRow>
              <S.TotalsRow style={{ color: '#ef4444' }}><span>Descuento</span><span>- C$ {fmt(discountAmount)}</span></S.TotalsRow>
              <S.TotalsRow className="grand-total" style={{ fontSize: '1.4rem', marginTop: '5px' }}>
                <span>TOTAL</span><span>C$ {fmt(total)}</span>
              </S.TotalsRow>

              {/* Botón de Proforma */}
              <S.Button
                secondary
                style={{ width: '100%', marginTop: '1rem', padding: '10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
                onClick={() => openModal('proformaName')}
              >
                <FaFileInvoice /> Crear Proforma
              </S.Button>

              <S.Button
                primary
                style={{ width: '100%', marginTop: '12px', padding: '16px', fontSize: '1.2rem', fontWeight: 'bold' }}
                onClick={() => openModal('payment', { total })}
                disabled={cart.length === 0}
              >
                $ COBRAR (F2)
              </S.Button>
            </div>
          </div>
        </S.CartPanel>

        <S.MobileCartToggle onClick={() => setIsMobileCartOpen(true)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ background: '#3b82f6', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
              {cart.reduce((a, c) => a + (c.quantity || 0), 0)}
            </div>
            <span>Ver Venta</span>
          </div>
          <span>C$ {fmt(total)}</span>
        </S.MobileCartToggle>

      </S.PageContentWrapper>

      {/* Modales y Alertas */}
      <AnimatePresence>
        {alert.isOpen && (
          <S.ModalOverlay onClick={closeAlert}>
            <S.ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '380px', textAlign: 'center' }}>
              <h2 style={{ marginTop: 0 }}>{alert.title}</h2>
              <p style={{ color: '#475569' }}>{alert.message}</p>
              <S.Button primary onClick={closeAlert} style={{ width: '100%', marginTop: '1rem' }}>Entendido</S.Button>
            </S.ModalContent>
          </S.ModalOverlay>
        )}

        {confirmation.isOpen && (
          <S.ModalOverlay onClick={closeConfirmation}>
            <S.ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '380px', textAlign: 'center' }}>
              <h2 style={{ marginTop: 0 }}>{confirmation.title}</h2>
              <p style={{ color: '#475569' }}>{confirmation.message}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                <S.Button onClick={closeConfirmation} style={{ flex: 1 }}>Cancelar</S.Button>
                <S.Button primary onClick={() => { confirmation.onConfirm?.(); closeConfirmation(); }} style={{ flex: 1 }}>Confirmar</S.Button>
              </div>
            </S.ModalContent>
          </S.ModalOverlay>
        )}

        {modal.name === 'payment' && (
          <PaymentModal
            isOpen={true}
            onClose={closeModal}
            total={modal.data.total}
            onFinishSale={handleFinishSale} // Corrected prop name
            tasaDolar={tasaDolar}
            clientes={clients || []} // Pass clients from auth context
            showAlert={showAlert} // Pass alert handler
          />
        )}

        {modal.name === 'caja' && (
          <CajaModal
            isOpen={true}
            onClose={closeModal}
            currentUser={currentUser}
            isCajaOpen={isCajaOpen}
            session={cajaSession}
            isAdmin={isAdmin}
            clients={clients || []} // Pass clients for name resolution
            showAlert={showAlert}
            showConfirmation={showConfirmation}
            initialTasaDolar={tasaDolar}
            onOpenCaja={async (montoInicial, tasa) => {
              try {
                const newSession = await api.openCajaSession({
                  userId,
                  openedAt: new Date().toISOString(),
                  openedBy: { id: userId, name: currentUser?.nombre_usuario },
                  initialAmount: montoInicial,
                  tasaDolar: tasa
                }, token);

                // Strict Sync:
                await refreshSession();
                closeModal();
              } catch (e) {
                showAlert({ title: 'Error', message: 'No se pudo abrir la caja en el servidor.' });
              }
            }}
            onCloseCaja={async (montoCounted) => {
              try {
                await api.closeCajaSession({
                  userId,
                  closedAt: new Date().toISOString(),
                  closedBy: { id: userId, name: currentUser?.nombre_usuario },
                  countedAmount: montoCounted,
                  notes: 'Cierre desde POS'
                }, token);

                // Strict Sync:
                await refreshSession();
                closeModal();
                showAlert({ title: 'Caja Cerrada', message: 'La sesión se ha cerrado y guardado correctamente.' });
              } catch (e) {
                console.error(e);
                showAlert({ title: 'Error', message: 'Error cerrando caja en servidor.' });
              }
            }}
          />
        )}

        {modal.name === 'salesHistory' && (
          <SalesHistoryModal
            isOpen={true}
            onClose={closeModal}
            dailySales={[]}
            loadSales={async (date) => {
              try {
                // Correctly call fetchSales from api.js with (token, date)
                const data = await api.fetchSales(token, date);
                return data || [];
              } catch (error) {
                console.error('Error loading sales:', error);
                return [];
              }
            }}
            isAdmin={isAdmin}
            users={allUsers} // Fixed: Pass ALL users so history shows seller names
            clients={clients || []} // Pass clients from auth context
            onReprintTicket={(sale) => {
              setTicketData(sale); // Open TicketModal for reprint
            }}
            onCancelSale={async (sale) => {
              try {
                // Determine sale ID whether passing object or just ID (legacy safety)
                const saleId = sale?.id || sale;
                await api.cancelSale(saleId, token);
                showAlert({ title: "Venta Cancelada", message: `La venta #${saleId} ha sido cancelada exitosamente.` });

                // --- CRITICAL UPDATE: Update Caja with Cancellation ---
                if (isCajaOpen && cajaSession && typeof sale === 'object') {
                  // Calculate amount to deduct (similar to logic in backend or return)
                  // We assume we revert the CASH portion. Or if it was all cash, revert all.
                  // SafeParse payment details
                  let detalles = typeof sale.pagoDetalles === 'string'
                    ? JSON.parse(sale.pagoDetalles || '{}')
                    : (sale.pagoDetalles || {});

                  // Check how much cash was actually in the box for this sale
                  // If 'ingresoCaja' exists, use it. Otherwise calculate.
                  let cashToRevert = Number(detalles.ingresoCaja || 0);

                  // Fallback if ingresoCaja not set but efectivo is
                  if (!cashToRevert && detalles.efectivo) {
                    cashToRevert = Number(detalles.efectivo);
                    // If there was change given, net might be less? 
                    // Usually 'ingresoCaja' = efectivo - cambio. 
                    // If only 'efectivo' is stored, we might assume it's the net paid?
                    // Let's safe bet on totalVenta if it was a cash sale.
                  }

                  // If logic is ambiguous, default to Sale Total if it was CASH/CONTADO
                  const isCredit = detalles.credito > 0;
                  if (cashToRevert === 0 && !isCredit && sale.totalVenta) {
                    cashToRevert = Number(sale.totalVenta);
                  }

                  // Don't deduct if it was purely credit or transfer (unless transfer is counted in box? Usually not physical)
                  // We only deduct PHYSICAL CASH.
                  if (cashToRevert > 0) {
                    const cancelTx = {
                      type: 'cancelacion',
                      amount: -cashToRevert,
                      at: new Date().toISOString(),
                      userId,
                      userName: currentUser?.nombre_usuario || 'Caja',
                      note: `Cancelación Venta #${saleId}`,
                      pagoDetalles: { efectivo: cashToRevert, ingresoCaja: -cashToRevert },
                      id: 'CANCEL-' + Date.now()
                    };

                    const updatedSession = {
                      ...cajaSession,
                      transactions: [cancelTx, ...(cajaSession.transactions || [])]
                    };
                    setCajaSession(updatedSession);
                    console.log("Caja actualizada por cancelación:", cancelTx);
                  }
                }
                // -----------------------------------------------------

              } catch (error) {
                console.error('Cancel error:', error);
                showAlert({ title: "Error", message: "No se pudo cancelar la venta: " + (error.message || 'Error desconocido') });
                throw error;
              }
            }}
            onReturnItem={async (sale, item, qty) => {
              try {
                // 1. Call Backend API to process return logic (Inventory, Status update)
                // FIXED: Payload to match server expectation: { originalSaleId, item, quantity, userId }
                const payload = {
                  originalSaleId: sale.id,
                  item: item,
                  quantity: qty,
                  userId
                };
                await api.returnItem(payload, token);

                // 2. Calculate refund amount for Cash Register
                const unitPrice = item.precio || item.precio_venta || 0;
                const refundAmount = unitPrice * qty;

                // 3. Update Caja Session locally to reflect cash outflow (Return)
                if (isCajaOpen && cajaSession) {
                  const refundTransaction = {
                    type: 'devolucion',
                    amount: -refundAmount, // Negative amount for deduction
                    at: new Date().toISOString(),
                    userId,
                    userName: currentUser?.nombre_usuario || 'Caja',
                    note: `Devolución: ${qty}x ${item.nombre}`,
                    pagoDetalles: { efectivo: refundAmount, ingresoCaja: -refundAmount }, // Explicit cash details
                    id: 'REFUND-' + Date.now()
                  };
                  const updatedSession = {
                    ...cajaSession,
                    transactions: [refundTransaction, ...(cajaSession.transactions || [])]
                  };
                  setCajaSession(updatedSession);

                  showAlert({ title: "Devolución Exitosa", message: `Devolución registrada en sistema y C$${refundAmount.toFixed(2)} descontados de caja.` });
                } else {
                  showAlert({ title: "Devolución Exitosa (Caja Cerrada)", message: "Devolución registrada, pero NO se descontó de caja porque está cerrada." });
                }

              } catch (error) {
                console.error('Return error:', error);
                showAlert({ title: "Error", message: "Error al procesar devolución: " + (error.message || 'Error desconocido') });
                throw error;
              }
            }}
            onAbonoSuccess={() => {
              console.log('Abono success');
            }}
          />
        )}

        {/* Ticket Modal for Printing */}
        {ticketData && (
          <TicketModal
            isOpen={true}
            transaction={ticketData}
            onClose={() => setTicketData(null)}
            clients={clients}
            users={[user]}
            currentUser={user}
          />
        )}

        {modal.name === 'proformaName' && (
          <PromptModal
            isOpen={true}
            onClose={closeModal}
            title="Datos de Proforma"
            fields={[{ name: 'name', label: 'A nombre de:', type: 'text', placeholder: 'Nombre del Cliente (Opcional)' }]}
            onSubmit={(values) => {
              closeModal();
              setTimeout(() => openModal('proforma', { proformaFor: values.name }), 200);
            }}
            icon={<FaFileInvoice color="#0b72b9" />}
          />
        )}

        {modal.name === 'proforma' && (
          <ProformaModal
            isOpen={true}
            onClose={closeModal}
            cart={cart}
            total={total}
            subtotal={subtotal}
            discount={discountAmount}
            proformaFor={modal.data?.proformaFor}
            currentUser={currentUser}
          />
        )}

        {modal.name === 'cashEntry' && (
          <PromptModal
            isOpen={true}
            onClose={closeModal}
            title="Entrada de Dinero"
            fields={[
              { name: 'amount', label: 'Monto (C$)', type: 'number', placeholder: '0.00' },
              { name: 'note', label: 'Motivo', type: 'text', placeholder: 'Descripción de la entrada' }
            ]}
            onSubmit={(values) => processCashTransaction('entrada', values.amount, values.note)}
            icon={<FaMoneyBillWave color="#10b981" />}
          />
        )}

        {modal.name === 'cashExit' && (
          <PromptModal
            isOpen={true}
            onClose={closeModal}
            title="Salida de Dinero"
            fields={[
              { name: 'amount', label: 'Monto (C$)', type: 'number', placeholder: '0.00' },
              { name: 'note', label: 'Motivo', type: 'text', placeholder: 'Descripción de la salida' }
            ]}
            onSubmit={(values) => processCashTransaction('salida', values.amount, values.note)}
            icon={<FaMoneyBillWave color="#ef4444" />}
          />
        )}

        {modal.name === 'renameTicket' && (
          <PromptModal
            isOpen={true}
            onClose={closeModal}
            title="Renombrar Ticket"
            fields={[
              { name: 'name', label: 'Nuevo Nombre', type: 'text', defaultValue: activeOrder?.name || 'Ticket' }
            ]}
            onSubmit={(values) => renameTicket(values.name)}
            icon={<FaEdit color="#2563eb" />}
          />
        )}

        {modal.name === 'editPrice' && (
          <PromptModal
            isOpen={true}
            onClose={closeModal}
            title="Editar Precio"
            fields={[
              {
                name: 'price',
                label: `Nuevo Precio(C$)[Costo: C$${(modal.data?.item?.costo || 0).toFixed(2)}]`,
                type: 'number',
                defaultValue: modal.data?.item?.precio_venta
              }
            ]}
            onSubmit={(values) => handleUpdateItemPrice(values.price)}
            icon={<FaPencilAlt color="#f59e0b" />}
          />
        )}

        {modal.name === 'itemDiscount' && (
          <PromptModal
            isOpen={true}
            onClose={closeModal}
            title="Descuento al Producto"
            fields={[
              {
                name: 'type', label: 'Tipo', type: 'select', options: [
                  { value: 'fixed', label: 'Monto Fijo (C$)' },
                  { value: 'percentage', label: 'Porcentaje (%)' }
                ], defaultValue: 'fixed'
              },
              { name: 'value', label: 'Valor', type: 'number', placeholder: '0.00' }
            ]}
            onSubmit={(values) => handleItemDiscount(values.value, values.type)}
            icon={<FaPercentage color="#2563eb" />}
          />
        )}

        {modal.name === 'discount' && (
          <PromptModal
            isOpen={true}
            onClose={closeModal}
            title="Aplicar Descuento"
            fields={[
              {
                name: 'type', label: 'Tipo', type: 'select', options: [
                  { value: 'fixed', label: 'Monto Fijo (C$)' },
                  { value: 'percentage', label: 'Porcentaje (%)' }
                ], defaultValue: 'fixed'
              },
              { name: 'value', label: 'Valor', type: 'number', placeholder: '0.00' }
            ]}
            onSubmit={(values) => {
              const discountData = {
                type: values.type,
                value: parseFloat(values.value) || 0
              };
              applyDiscount(discountData);
            }}
            icon={<FaPercentage color="#2563eb" />}
          />
        )}

        <ConfirmationModal
          isOpen={confirmation.isOpen}
          onClose={closeConfirmation}
          title={confirmation.title}
          message={confirmation.message}
          onConfirm={() => {
            if (confirmation.onConfirm) confirmation.onConfirm();
            closeConfirmation();
          }}
        />

        {modal.name === 'pinPrompt' && (
          <PromptModal
            isOpen={true}
            onClose={closeModal}
            title="Acceso Restringido"
            fields={[{ name: 'pin', label: 'PIN de Seguridad', type: 'password', autoFocus: true }]}
            onSubmit={(values) => {
              if (values.pin === '111987') {
                closeModal();
                modal.data?.action?.();
              } else {
                showAlert({ title: 'Error', message: 'PIN Incorrecto', type: 'error' });
              }
            }}
            icon={<FaLock color="#dc3545" />}
          />
        )}

        {secretModalOpen && (
          <SecretAdjustModal
            isOpen={true}
            onClose={() => setSecretModalOpen(false)}
            session={cajaSession}
            currentStats={currentStats}
            onConfirm={handleSecretAdjust}
          />
        )}
      </AnimatePresence>

      {/* Botón flotante para móviles */}
      <S.MobileCartToggle onClick={() => setIsMobileCartOpen(true)}>
        <span>🛒 Carrito ({cart.length})</span>
        <span style={{ fontWeight: 'bold' }}>C$ {fmt(total)}</span>
      </S.MobileCartToggle>
    </S.PageWrapper>
  );
};

export default POS;