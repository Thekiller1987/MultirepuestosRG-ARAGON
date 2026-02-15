import React from 'react';
import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { ModalOverlay, ModalContent, Button } from '../POS.styles.jsx';
import styled, { css } from 'styled-components';

/* =================================================================
 * ESTILOS LOCALES PARA ALERT MODAL (Mejorados)
 * ================================================================= */

const IconWrapper = styled.div`
    margin-bottom: 1rem;
    color: #007bff; /* Color por defecto: Info */

    ${({ type }) => type === 'error' && css`
        color: #dc3545;
    `}
    ${({ type }) => type === 'success' && css`
        color: #28a745;
    `}
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 2rem;
    width: 100%;
    
    /* Estilo para los botones dentro del grupo */
    ${Button} {
        flex-grow: 1;
        max-width: 150px; 
    }
`;


/* =================================================================
 * COMPONENTE ALERT MODAL MEJORADO
 * ================================================================= */

/**
 * Componente de Modal de Alerta genérico, capaz de mostrar mensajes simples 
 * o botones de acción personalizados (type="custom").
 * * @param {boolean} isOpen - Controla la visibilidad.
 * @param {function} onClose - Función de cierre.
 * @param {string} title - Título del modal.
 * @param {string} message - Cuerpo del mensaje.
 * @param {string} [type='info'] - Tipo de alerta ('info', 'success', 'error', 'custom').
 * @param {Array<object>} [buttons] - Array de objetos { label, action, isPrimary, isCancel } para type="custom".
 */
const AlertModal = ({ isOpen, onClose, title, message, type = 'info', buttons }) => {
    if (!isOpen) return null;

    // 1. Determinar el ícono y color basado en el tipo
    const getIcon = () => {
        switch (type) {
            case 'error':
                return <FaExclamationTriangle size="2.5em" />;
            case 'success':
                return <FaCheckCircle size="2.5em" />;
            case 'info':
            case 'custom':
            default:
                return <FaInfoCircle size="2.5em" />;
        }
    };

    // 2. Determinar qué botones renderizar
    const renderButtons = () => {
        // Caso: Botones personalizados (para impresión 80mm/A4)
        if (type === 'custom' && buttons && buttons.length > 0) {
            return buttons.map((btn, index) => (
                <Button
                    key={index}
                    onClick={() => {
                        // Ejecuta la acción personalizada
                        if (btn.action) btn.action();
                        // El POS ya maneja el closeModal() en el callback de la acción
                    }}
                    primary={btn.isPrimary}
                    $cancel={btn.isCancel}
                    dark={!btn.isPrimary && !btn.isCancel}
                >
                    {btn.label}
                </Button>
            ));
        }

        // Caso: Alerta estándar (solo botón "Entendido")
        return (
            <Button onClick={onClose} primary>
                {type === 'error' ? 'Aceptar' : 'Entendido'}
            </Button>
        );
    };

    return (
        <ModalOverlay>
            <ModalContent style={{ maxWidth: '450px', textAlign: 'center' }}>
                
                <IconWrapper type={type}>
                    {getIcon()}
                </IconWrapper>
                
                <h2 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>{title}</h2>
                <p style={{ color: '#6c757d', marginBottom: '1rem', lineHeight: '1.6' }}>{message}</p>
                
                <ButtonGroup>
                    {renderButtons()}
                </ButtonGroup>
                
            </ModalContent>
        </ModalOverlay>
    );
};

export default AlertModal;
