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
// Initialize Socket with robust reconnection
import socket from './service/socket.js';

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