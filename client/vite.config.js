// Archivo: vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Configuración de la PWA (sin cambios)
const pwaConfig = {
    registerType: 'autoUpdate',
    workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
    },
    manifest: {
        name: 'MultirepuestosRG POS',
        short_name: 'RG POS',
        description: 'Sistema de Punto de Venta y Gestión de Inventario',
        theme_color: '#007bff',
        background_color: '#f0f2f5',
        display: 'standalone',
        start_url: '/',
        icons: [
            {
                src: 'icons/192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any maskable'
            },
            {
                src: 'icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable'
            }
        ]
    }
};

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA(pwaConfig)
    ],

    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('jspdf') || id.includes('html2canvas')) {
                            return 'pdf-vendor';
                        }
                        if (id.includes('html5-qrcode')) {
                            return 'scanner-vendor';
                        }
                        return 'vendor';
                    }
                }
            }
        },
        chunkSizeWarningLimit: 2000
    }
});