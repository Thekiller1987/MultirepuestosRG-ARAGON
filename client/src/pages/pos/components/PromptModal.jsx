import React, { useState, useEffect } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { ModalOverlay, ModalContent, Button, SearchInput } from '../POS.styles.jsx';

const PromptModal = ({ isOpen, onClose, onConfirm, onSubmit, title, message, fields = [], inputType = 'number', icon }) => {
    const [formValues, setFormValues] = useState({});
    const [singleValue, setSingleValue] = useState('');

    // Initialize values when modal opens
    useEffect(() => {
        if (isOpen) {
            if (fields.length > 0) {
                const init = {};
                fields.forEach(f => {
                    init[f.name] = f.defaultValue !== undefined ? f.defaultValue : '';
                });
                setFormValues(init);
            } else {
                setSingleValue('');
            }
        }
    }, [isOpen, fields]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (fields.length > 0) {
            // Support both onConfirm and onSubmit naming
            if (onSubmit) onSubmit(formValues);
            else onConfirm && onConfirm(formValues);
        } else {
            if (onSubmit) onSubmit(singleValue);
            else onConfirm && onConfirm(singleValue);
        }
    };

    const handleFieldChange = (name, val) => {
        setFormValues(prev => ({ ...prev, [name]: val }));
    };

    return (
        <ModalOverlay>
            <ModalContent style={{ maxWidth: '450px' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    {icon ? <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div> : <FaQuestionCircle size="2.5em" color="#007bff" />}
                    <h2 style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>{title}</h2>
                    {message && <p style={{ color: '#6c757d' }}>{message}</p>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {fields.length > 0 ? (
                        fields.map((field) => (
                            <div key={field.name}>
                                {field.label && <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600, fontSize: '0.9rem' }}>{field.label}</label>}
                                {field.type === 'select' ? (
                                    <select
                                        value={formValues[field.name]}
                                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }}
                                    >
                                        {field.options && field.options.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <SearchInput
                                        type={field.type || 'text'}
                                        placeholder={field.placeholder || ''}
                                        value={formValues[field.name]}
                                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                        autoFocus={field.name === fields[0].name} // Focus first field
                                    />
                                )}
                            </div>
                        ))
                    ) : (
                        <SearchInput
                            type={inputType}
                            value={singleValue}
                            onChange={(e) => setSingleValue(e.target.value)}
                            autoFocus
                        />
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                    <Button onClick={onClose} style={{ backgroundColor: '#6c757d' }}>Cancelar</Button>
                    <Button onClick={handleConfirm} primary>Aceptar</Button>
                </div>
            </ModalContent>
        </ModalOverlay>
    );
};

export default PromptModal;