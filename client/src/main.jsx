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

// FORCE SW UNREGISTER TO FIX CACHE ISSUES
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister();
      console.log("Service Worker Unregistered to force update");
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider socket={socket}>
        <AppProviders socket={socket} />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);