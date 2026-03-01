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

        const printContent = `
          <html>
            <head>
              <style>
                @page { margin: 0; size: auto; }
                body { margin: 0; padding: 0; display: none; visibility: hidden; height: 0; overflow: hidden; }
              </style>
            </head>
            <body></body>
          </html>
        `;

        iframe.contentWindow.document.write(printContent);
        iframe.contentWindow.document.close();
        iframe.contentWindow.focus();

        setTimeout(() => {
            iframe.contentWindow.print();
            setTimeout(() => document.body.removeChild(iframe), 2000);
            setStatus("Se envió la orden de impresión invisible al navegador. (Asegúrate de tener --kiosk-printing activado)");
        }, 200);
    };

    return (
        <Container>

            <MethodBox>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <FaInfoCircle color="#0f172a" size={20} />
                    <h4 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem' }}>Cajón vía Impresora (Cero Instalación)</h4>
                </div>

                <p style={{ margin: '0 0 15px 0', color: '#475569', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    El sistema enviará una impresión silenciosa a la impresora térmica, quien se encargará de patear el cajón de forma natural sin instalar ningún programa local.
                    <br /><br />
                    <b>REQUISITO OBLIGATORIO:</b> Para que Google Chrome no te muestre la pantalla blanca de imprimir pidiendo tu permiso cada vez y abriendo el cajón al aire, debes abrir Google Chrome en modo kiosko.
                    <ul style={{ marginTop: '5px', paddingLeft: '20px', color: '#0f172a' }}>
                        <li>Cierra Chrome por completo.</li>
                        <li>Da clic derecho a tu acceso directo de Chrome y elige <b>Propiedades</b>.</li>
                        <li>Al final del renglón <b>"Destino"</b> (después de las comillas), escribe <b>--kiosk-printing</b> y guarda.</li>
                        <li>Abre el sistema con ese acceso directo, asegúrate que la térmica sea la "Impresora Predeterminada de Windows" y las gavetas abrirán instantáneamente.</li>
                    </ul>
                </p>

                <Button onClick={openDrawer}>
                    <FaBoxOpen size={24} /> Probar Envío
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
