import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaSave, FaSpinner } from 'react-icons/fa';
import * as api from '../../../service/api.js'; // asegúrate que la ruta sea correcta
import { useAuth } from '../../../context/AuthContext.jsx';

const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white; padding: 2rem; border-radius: 8px; width: 450px;
  max-width: 90%; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
`;

const Header = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  margin: 0; font-size: 1.5rem; color: #333;
`;

const CloseButton = styled.button`
  border: none; background: none; font-size: 1.5rem; cursor: pointer; color: #888;
  &:hover { color: #333; }
`;

const Form = styled.form`
  display: flex; flex-direction: column; gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem; border: 1px solid #ccc; border-radius: 6px; font-size: 1rem;
  &:focus { border-color: #007bff; outline: none; box-shadow: 0 0 0 2px rgba(0,123,255,0.25); }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem; background: #28a745; color: white; border: none;
  border-radius: 6px; font-weight: bold; display: flex; align-items: center; gap: 0.5rem;
  justify-content: center; cursor: pointer; transition: background-color 0.2s;
  &:hover:not(:disabled) { background: #218838; }
  &:disabled { background: #6c757d; cursor: not-allowed; }
`;

const InfoText = styled.p`
  margin: 0 0 1rem 0; padding: 0.75rem; background-color: #e9ecef; border-radius: 6px;
  color: #495057; text-align: center; font-size: 1rem;
  strong { color: #dc3545; }
`;

const HistorialList = styled.ul`
  margin: 1rem 0 0 0; padding: 0; list-style: none;
`;

const SpinAnimation = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

export default function AbonoCreditoModal({ client, onClose, onAbonoSuccess, showAlert }) {
  const { addCajaTransaction, user } = useAuth();
  const token = localStorage.getItem('token');
  const [monto, setMonto] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [historial, setHistorial] = useState([]);

  const formatCurrency = (amount) => `C$${Number(amount || 0).toFixed(2)}`;

  // Cargar historial de abonos del cliente
  const loadHistorial = async () => {
    try {
      const data = await api.getAbonosByClient(client.id_cliente, token);
      const cleaned = (data || []).map(a => ({
        id: a.id,
        monto: a.monto || 0,
        fecha: a.fecha || '',
        pagoDetalles: a.pagoDetalles || { usuario: 'Desconocido' }
      }));
      setHistorial(cleaned);
    } catch (err) {
      console.error("Error cargando historial:", err);
      showAlert({ title: "Error", message: "No se pudo cargar el historial de abonos." });
    }
  };

  useEffect(() => { loadHistorial(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const montoNum = parseFloat(monto);

    if (isNaN(montoNum) || montoNum <= 0) {
      showAlert({ title: "Monto Inválido", message: "Por favor, ingrese un monto mayor a cero." });
      return;
    }
    if (montoNum > client.saldo_pendiente) {
      showAlert({ title: "Monto Excedido", message: `El abono no puede ser mayor al saldo pendiente de ${formatCurrency(client.saldo_pendiente)}.` });
      return;
    }

    setIsLoading(true);
    try {
      // Registrar abono en la BD
      await api.addCreditPayment(
        client.id_cliente,
        { monto: montoNum, pagoDetalles: { metodo: 'Efectivo', usuario: user.nombre } },
        token
      );

      // Registrar en caja del día
      addCajaTransaction({
        tipo: 'Abono Crédito',
        cliente: client.nombre,
        idCliente: client.id_cliente,
        usuario: user.nombre,
        monto: montoNum,
        referencia: 'Abono a crédito'
      });

      showAlert({ title: "Éxito", message: "Abono registrado correctamente." });
      onAbonoSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      showAlert({ title: "Error", message: `No se pudo registrar el abono. ${err.message}` });
    } finally {
      setIsLoading(false);
      loadHistorial(); // refresca historial inmediatamente
    }
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <Header>
          <Title>Registrar Abono</Title>
          <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        </Header>

        <p>Cliente: <strong>{client.nombre}</strong></p>
        <InfoText>Saldo Pendiente: <strong>{formatCurrency(client.saldo_pendiente)}</strong></InfoText>

        <Form onSubmit={handleSubmit}>
          <Input
            type="number"
            value={monto}
            onChange={e => setMonto(e.target.value)}
            placeholder="Monto a abonar"
            required
            autoFocus
            step="0.01"
            min="0.01"
            max={client.saldo_pendiente.toFixed(2)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <><SpinAnimation /> Procesando...</> : <><FaSave /> Registrar Abono</>}
          </Button>
        </Form>

        <h4 style={{ marginTop: '1.5rem' }}>Historial de Abonos</h4>
        <HistorialList>
          {historial.length === 0
            ? <li>No hay abonos registrados.</li>
            : historial.map(abono => {
              let detalles = abono.pagoDetalles || {};
              if (typeof detalles === 'string') {
                try { detalles = JSON.parse(detalles); } catch (e) { }
              }
              const metodo = detalles.metodo || 'Efectivo';
              const ref = detalles.referencia ? `(Ref: ${detalles.referencia})` : '';

              return (
                <li key={abono.id}>
                  {abono.fecha ? new Date(abono.fecha).toLocaleDateString() : ''} - {formatCurrency(abono.monto)}
                  <span style={{ marginLeft: 5, color: '#555', fontStyle: 'italic' }}>
                    [{metodo} {ref}]
                  </span>
                  - por {detalles.usuario || abono.usuario}
                </li>
              )
            })
          }
        </HistorialList>
      </ModalContainer>
    </ModalOverlay>
  );
}
