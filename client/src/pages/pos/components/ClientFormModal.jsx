import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaSave } from 'react-icons/fa';
import * as api from '../../../service/api'; // <-- RUTA CORREGIDA

const ModalOverlay = styled.div`
  position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:50;
`;
const ModalContainer = styled.div`
  background:white;padding:2rem;border-radius:8px;width:400px;max-width:90%;
`;
const Header = styled.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;`;
const Title = styled.h2`margin:0;font-size:1.5rem;`;
const CloseButton = styled.button`border:none;background:none;color:#dc3545;font-size:1.2rem;cursor:pointer;`;
const Form = styled.form`display:flex;flex-direction:column;gap:0.8rem;`;
const Input = styled.input`padding:0.6rem;border:1px solid #ccc;border-radius:6px;font-size:0.95rem;`;
const Button = styled.button`
  padding:0.6rem 1rem;background:#007bff;color:white;border:none;border-radius:6px;font-weight:bold;display:flex;align-items:center;gap:0.5rem;justify-content:center;
  &:hover{opacity:0.85;}
`;

export default function ClientFormModal({ client, onClose, onSave }) {
    const [nombre, setNombre] = useState('');
    const [cedula, setCedula] = useState('');
    const [telefono, setTelefono] = useState('');
    const [limite, setLimite] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (client) {
            setNombre(client.nombre || '');
            setCedula(client.cedula || '');
            setTelefono(client.telefono || '');
            setLimite(client.limite_credito || '');
        } else {
            setNombre('');
            setCedula('');
            setTelefono('');
            setLimite('');
        }
    }, [client]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const clientData = {
            nombre,
            cedula,
            telefono,
            limite_credito: limite === '' ? null : Number(limite)
        };

        try {
            if (client) {
                await api.updateClient(client.id_cliente, clientData, token);
            } else {
                await api.createClient(clientData, token);
            }
            if (onSave) onSave(); // Ensure onSave is called
            onClose();
        } catch (err) {
            console.error(err);
            alert(`Error al guardar cliente: ${err.message}`);
        }
    };

    return (
        <ModalOverlay>
            <ModalContainer>
                <Header>
                    <Title>{client ? 'Editar Cliente' : 'Nuevo Cliente'}</Title>
                    <CloseButton onClick={onClose}><FaTimes /></CloseButton>
                </Header>
                <Form onSubmit={handleSubmit}>
                    <Input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" required />
                    <Input value={cedula} onChange={e => setCedula(e.target.value)} placeholder="Cédula / RUC" />
                    <Input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Teléfono" />
                    <Input type="number" step="0.01" value={limite} onChange={e => setLimite(e.target.value)} placeholder="Límite de crédito" />
                    <Button type="submit"><FaSave /> Guardar</Button>
                </Form>
            </ModalContainer>
        </ModalOverlay>
    );
}