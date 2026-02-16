import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CajaProvider } from './context/CajaContext.jsx';
import { OrdersProvider } from './context/OrdersContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';
import App from './App.jsx';
import './index.css';

// Initialize Socket with robust reconnection
import { io } from 'socket.io-client';

const URL = 'https://www.multirepuestosrgaragon.com';

const socket = io(URL, {
  path: '/socket.io/',
  transports: ['websocket', 'polling'], // Prefer websocket, fallback to polling
  reconnection: true,
  reconnectionAttempts: Infinity, // Keep trying forever
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  autoConnect: true
});

socket.on('connect', () => {
  console.log("✅ Socket Connected:", socket.id);
  console.log("🚀 APP VERSION: 2.1.0 - DOMAIN MIGRATED");
});

socket.on('connect_error', (err) => {
  console.warn("⚠️ Socket Connection Error (retrying...):", err.message);
});

socket.on('disconnect', (reason) => {
  console.warn("❌ Socket Disconnected:", reason);
  if (reason === 'io server disconnect') {
    socket.connect(); // Explicitly reconnect if server closed it
  }
});

// Wrapper to pass user AND socket
const AppProviders = ({ socket }) => {
  const { user } = useAuth();

  return (
    <CajaProvider user={user} socket={socket}>
      <SettingsProvider>
        <OrdersProvider>
          <App />
        </OrdersProvider>
      </SettingsProvider>
    </CajaProvider>
  );
};

import { registerSW } from 'virtual:pwa-register';

// Refresh prompt logic
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("Hay una nueva versión disponible. ¿Recargar ahora?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("App lista para trabajar offline");
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider socket={socket}>
        <AppProviders socket={socket} />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);