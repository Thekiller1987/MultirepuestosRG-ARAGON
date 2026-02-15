import React from 'react';
import { FaPrint, FaTicketAlt, FaFileAlt } from 'react-icons/fa';
import { ModalOverlay, ModalContent, Button } from '../POS.styles.jsx';
import styled from 'styled-components';

const OptionsContent = styled(ModalContent)`
    max-width: 500px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
    margin-top: 1.5rem;
    
    @media (max-width: 500px) {
        flex-direction: column;
    }
`;

/**
 * Modal para seleccionar el formato de impresión.
 * @param {function} onSelect - Función que se llama con el formato ('POS' o 'A4').
 * @param {function} onClose - Función para cerrar el modal.
 */
const PrintOptionsModal = ({ onSelect, onClose }) => {
    return (
        <ModalOverlay>
            <OptionsContent>
                <FaPrint size="2.5em" color="#007bff" style={{marginBottom: '0.75rem'}} />
                <h2 style={{ marginTop: '0.5rem', marginBottom: '0.5rem', fontSize: '1.4rem' }}>Seleccionar Formato de Impresión</h2>
                <p style={{ color: '#6c757d', marginBottom: '1.5rem', lineHeight: '1.4' }}>
                    ¿En qué formato desea imprimir el recibo/factura?
                </p>
                <ButtonGroup>
                    <Button 
                        onClick={() => onSelect('POS')} 
                        primary 
                        style={{ flex: 1, padding: '1rem', height: 'auto' }}
                    >
                        <FaTicketAlt /> 80mm (Ticket POS)
                    </Button>
                    <Button 
                        onClick={() => onSelect('A4')} 
                        dark 
                        style={{ flex: 1, padding: '1rem', height: 'auto' }}
                    >
                        <FaFileAlt /> A4 (Formato Grande)
                    </Button>
                </ButtonGroup>
                <Button onClick={onClose} $cancel mt style={{ width: '100%', maxWidth: '300px', opacity: 0.8 }}>
                    Cancelar Impresión
                </Button>
            </OptionsContent>
        </ModalOverlay>
    );
};

export default PrintOptionsModal;
