import React, { createContext, useState, useEffect, useContext } from 'react';
import { getSettings } from '../service/settingsApi';
import { useAuth } from './AuthContext';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const { token } = useAuth();
    const [settings, setSettings] = useState({
        empresa_nombre: 'Multirepuestos RG',
        empresa_ruc: '1211812770001E',
        empresa_telefono: '84031936 / 84058142',
        empresa_direccion: 'Del portón de la normal 75 varas al este. Juigalpa, Chontales.',
        empresa_eslogan: 'Repuestos de confianza al mejor precio — calidad que mantiene tu motor en marcha.',
        empresa_logo_url: ''
    });
    const [loading, setLoading] = useState(true);

    const refreshSettings = async () => {
        if (!token) return;
        try {
            const data = await getSettings(token);
            if (data) setSettings(prev => ({ ...prev, ...data }));
        } catch (error) {
            console.error("Error loading settings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshSettings();
    }, [token]);

    return (
        <SettingsContext.Provider value={{ settings, refreshSettings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
