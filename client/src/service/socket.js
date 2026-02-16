import { io } from 'socket.io-client';

// Determine the URL based on the current environment
const URL = window.location.host.includes('localhost')
    ? 'http://localhost:3001'
    : window.location.origin;

// Initialize the socket connection
// We use 'polling' first for maximum compatibility, then upgrade to 'websocket'
const socket = io(URL, {
    path: '/api/socket.io/', // Routing via /api/ to use existing Nginx proxy
    transports: ['polling', 'websocket'], // Critical for stability
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    autoConnect: true,
    withCredentials: true // Ensure cookies/session data are sent if needed
});

// Global debug listeners
socket.on('connect', () => {
    console.log("✅ Socket Connected (v2.1):", socket.id);
    console.log("🚀 Connection Transport:", socket.io.engine.transport.name);
});

socket.io.engine.on("upgrade", (transport) => {
    console.log("🚀 Transport Upgraded to:", transport.name);
});

socket.on('connect_error', (err) => {
    console.warn("⚠️ Socket Connection Error:", err.message);
});

socket.on('disconnect', (reason) => {
    console.warn("❌ Socket Disconnected:", reason);
    if (reason === 'io server disconnect') {
        socket.connect();
    }
});

export default socket;
