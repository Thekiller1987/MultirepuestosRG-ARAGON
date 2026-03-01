import React, { useState } from 'react';
import styled from 'styled-components';
import { FaBoxOpen, FaInfoCircle } from 'react-icons/fa';

const Container = styled.div`
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-top: 1rem;
`;

const MethodBox = styled.div`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #10b981;
  margin-bottom: 0.5rem;
`;

const Button = styled.button`
  background: #10b981;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 0.5rem;
  transition: background 0.2s;
  &:hover { background: #059669; }
`;

export const CashDrawerManager = () => {
    const [status, setStatus] = useState('');

    const openDrawer = () => {
        // Invuelve renderizar un iframe oculto e imprimirlo en blanco.
        // Esto fuerza a la cola de impresión de Windows a enviar la página, y la impresora emite el pulso por el cable RJ11 (tipo teléfono) si está configurada.
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        iframe.contentWindow.document.write('<html><body><p style="color:white; font-size:1px;">.</p></body></html>');
        iframe.contentWindow.document.close();
        iframe.contentWindow.focus();

        setTimeout(() => {
            iframe.contentWindow.print();
            setTimeout(() => document.body.removeChild(iframe), 2000);
            setStatus("Se envió la orden a la impresora térmica para abrir el cajón.");
        }, 200);
    };

    return (
        <Container>

            <MethodBox>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <FaInfoCircle color="#0f172a" size={20} />
                    <h4 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem' }}>Cajón vía Impresora (Cable tipo Teléfono / RJ11)</h4>
                </div>

                <p style={{ margin: '0 0 15px 0', color: '#475569', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    Para abrir este tipo de cajón desde aquí o automáticamente desde el Punto de Venta, tu impresora térmica debe estar configurada en Windows para patear la gaveta.
                    <br /><br />
                    <b>Configuración en Windows:</b>
                    <ol style={{ marginTop: '5px', paddingLeft: '20px' }}>
                        <li>Ve a <b>Panel de Control</b> {'>'} <b>Dispositivos e Impresoras</b>.</li>
                        <li>Clic derecho en tu Impresora Térmica y selecciona <b>"Propiedades de impresora"</b> (Printer Properties).</li>
                        <li>Ve a la pestaña <b>Configuración del Dispositivo</b> (Device Settings) o <b>Preferencias / Avanzado</b>.</li>
                        <li>Busca una opción llamada <b>Cash Drawer</b> (Gaveta de Dinero) o parecida.</li>
                        <li>Cámbiala a <b>"Open before printing"</b> (Abrir antes de imprimir) o <b>"Open after printing"</b> y guarda los cambios.</li>
                    </ol>
                </p>

                <Button onClick={openDrawer}>
                    <FaBoxOpen size={24} /> Abrir Cajón
                </Button>

                {status && (
                    <div style={{ marginTop: '1rem', padding: '0.8rem', background: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '0.9rem', fontWeight: '500' }}>
                        {status}
                    </div>
                )}

            </MethodBox>

        </Container>
    );
};
