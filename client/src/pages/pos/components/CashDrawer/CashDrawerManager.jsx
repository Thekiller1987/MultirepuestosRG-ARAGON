import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUsb, FaBoxOpen } from 'react-icons/fa';

const Container = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
`;

const Button = styled.button`
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 1rem;
  &:hover { background: #2563eb; }
  &:disabled { background: #94a3b8; cursor: not-allowed; }
`;

export const CashDrawerManager = () => {
    const [status, setStatus] = useState('No configurado');
    const [device, setDevice] = useState(null);

    // Comando ESC/POS genérico para abrir el cajón (ESC p m t1 t2)
    // 27, 112, 0, 25, 250 -> Configuración de pulsos más común (0x1B 0x70 0x00 0x19 0xFA)
    const openDrawerCommand = new Uint8Array([27, 112, 0, 25, 250]);

    const connectUSB = async () => {
        try {
            if (!navigator.usb) {
                setStatus("Error: Tu navegador no soporta WebUSB. Usa Chrome o Edge.");
                return;
            }

            // Pedir al usuario que seleccione el dispositivo USB
            const selectedDevice = await navigator.usb.requestDevice({ filters: [] }); // Sin filtros para ver todos
            await selectedDevice.open();

            if (selectedDevice.configuration === null) {
                await selectedDevice.selectConfiguration(1);
            }

            await selectedDevice.claimInterface(0); // Normalmente interfaz 0

            setDevice(selectedDevice);
            setStatus(`Conectado: ${selectedDevice.productName || 'Dispositivo USB'}`);

        } catch (error) {
            console.error(error);
            setStatus(`Error de conexión: ${error.message}`);
        }
    };

    const openDrawer = async () => {
        if (!device) {
            setStatus("Primero debes conectar el dispositivo USB.");
            return;
        }

        try {
            // Encontrar el endpoint de salida (Out endpoint)
            const outEndpoint = device.configuration.interfaces[0].alternate.endpoints.find(e => e.direction === 'out');

            if (!outEndpoint) {
                throw new Error("No se encontró endpoint de salida en el dispositivo.");
            }

            await device.transferOut(outEndpoint.endpointNumber, openDrawerCommand);
            setStatus("Comando enviado exitosamente para abrir el cajón.");
        } catch (error) {
            console.error(error);
            setStatus(`Error al abrir: ${error.message}`);
        }
    };

    return (
        <Container>
            <h3><FaUsb /> Configuración de Cajón Eléctrico (USB Directo)</h3>
            <p style={{ marginTop: '10px', color: '#64748b' }}>
                Si tu cajón está conectado directamente por cable USB a la computadora (y no a la impresora térmica),
                requieres emparejarlo usando WebUSB (compatible con Google Chrome y Edge).
            </p>

            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '4px' }}>
                <strong>Estado actual:</strong> {status}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <Button onClick={connectUSB}>
                    <FaUsb /> Emparejar Cajón USB
                </Button>

                <Button onClick={openDrawer} disabled={!device} style={{ background: device ? '#10b981' : '#94a3b8' }}>
                    <FaBoxOpen /> Probar Apertura
                </Button>
            </div>
        </Container>
    );
};
