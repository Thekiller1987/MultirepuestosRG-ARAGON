import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { ModalOverlay, ModalContent, Button } from '../POS.styles.jsx';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <ModalOverlay>
            <ModalContent style={{ maxWidth: '450px', textAlign: 'center' }}>
                <FaExclamationTriangle size="2.5em" color="#ffc107" />
                <h2 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>{title}</h2>
                <p style={{ color: '#6c757d', marginBottom: '2rem' }}>{message}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <Button onClick={onClose} style={{ backgroundColor: '#6c757d' }}>Cancelar</Button>
                    <Button onClick={onConfirm} cancel>Sí, Continuar</Button>
                </div>
            </ModalContent>
        </ModalOverlay>
    );
};

export default ConfirmationModal;