import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../../context/AuthContext';
import { FaUser, FaBoxOpen, FaPlus, FaTimes, FaDollarSign } from 'react-icons/fa';
import { ModalOverlay, ModalContent, Button } from '../POS.styles';

const Grid = styled.div`
    display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;
    max-height: 70vh;
    @media (max-width: 768px) { grid-template-columns: 1fr; }
`;
const Panel = styled.div`
    display: flex; flex-direction: column; gap: 1rem;
    overflow-y: auto;
    padding-right: 10px;
`;
const Input = styled.input`
    width: 100%; padding: 0.8rem; font-size: 1rem; border-radius: 8px; border: 1px solid #ccc;
`;
const ProductListItem = styled.div`
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &:hover { background-color: #f0f4f8; }
`;

const CreateOrderModal = ({ onClose, onSubmit, showAlert }) => {
    const { products = [] } = useAuth();
    
    const [clienteNombre, setClienteNombre] = useState('');
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [abonoInicial, setAbonoInicial] = useState('');

    const total = useMemo(() => cart.reduce((sum, item) => sum + item.precio * item.quantity, 0), [cart]);

    // ✅ CAMBIO IMPORTANTE: Lógica de búsqueda mejorada (Código + Nombre)
    const filteredProducts = useMemo(() => {
        if (!searchTerm) return [];
        const term = searchTerm.toLowerCase();
        
        return products.filter(p => {
            const nombreMatch = p.nombre.toLowerCase().includes(term);
            // Validamos que exista codigo, lo pasamos a string y comparamos
            const codigoMatch = (p.codigo || '').toString().toLowerCase().includes(term);
            
            return (nombreMatch || codigoMatch) && p.existencia > 0;
        });
    }, [searchTerm, products]);

    const handleAddToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            if(existing.quantity < product.existencia) {
                setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
            } else {
                showAlert({title: 'Stock Límite', message: `No hay más stock disponible para ${product.nombre}`});
            }
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
        setSearchTerm('');
    };

    const handleUpdateQuantity = (productId, quantity) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const numQuantity = parseInt(quantity, 10);

        if (isNaN(numQuantity) || numQuantity <= 0) {
            setCart(cart.filter(item => item.id !== productId));
            return;
        }

        if (numQuantity > product.existencia) {
            showAlert({title: 'Stock Insuficiente', message: `Solo hay ${product.existencia} unidades disponibles.`});
            setCart(cart.map(item => item.id === productId ? { ...item, quantity: product.existencia } : item));
        } else {
            setCart(cart.map(item => item.id === productId ? { ...item, quantity: numQuantity } : item));
        }
    };
    
    const handleSubmit = () => {
        if (!clienteNombre.trim()) {
            showAlert({ title: "Cliente Requerido", message: "Debe escribir el nombre del cliente." });
            return;
        }
        if (cart.length === 0) {
            showAlert({ title: "Productos Requeridos", message: "Debe agregar al menos un producto al pedido." });
            return;
        }
        const abono = Number(abonoInicial || 0);
        if (abono < 0) {
            showAlert({ title: "Abono Inválido", message: "El abono inicial no puede ser un número negativo." });
            return;
        }
        if (abono > total) {
             showAlert({ title: "Abono Inválido", message: "El abono inicial no puede ser mayor que el total del pedido." });
            return;
        }
        
        onSubmit({
            clienteNombre: clienteNombre.trim(),
            items: cart,
            total: total,
            abonoInicial: abono,
            pagoDetalles: { efectivo: abono, ingresoCaja: abono }
        });
    };

    return (
        <ModalOverlay>
            <ModalContent $large>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h2><FaPlus /> Crear Nuevo Pedido o Apartado</h2>
                    <Button $cancel onClick={onClose} style={{padding: '0.5rem'}}>✕</Button>
                </div>
                <Grid>
                    <Panel>
                        <h3><FaUser /> 1. Nombre del Cliente</h3>
                        <Input 
                            type="text" 
                            placeholder="Escriba el nombre del cliente..." 
                            value={clienteNombre}
                            onChange={e => setClienteNombre(e.target.value)}
                        />
                        
                        <h3><FaBoxOpen /> 2. Agregar Productos</h3>
                        {/* ✅ CAMBIO: Placeholder actualizado */}
                        <Input 
                            type="text" 
                            placeholder="Buscar por nombre o código..." 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)} 
                        />
                        {filteredProducts.slice(0, 5).map(p => (
                            <ProductListItem key={p.id} onClick={() => handleAddToCart(p)}>
                                {/* ✅ CAMBIO: Mostramos Código en negrita y Nombre */}
                                <div>
                                    <strong>{p.codigo}</strong> - {p.nombre}
                                    <div style={{fontSize: '0.85rem', color: '#666'}}>
                                        Stock: {p.existencia}
                                    </div>
                                </div>
                                <div style={{fontWeight: 'bold', color: '#2ecc71'}}>
                                    C${Number(p.precio).toFixed(2)}
                                </div>
                            </ProductListItem>
                        ))}
                    </Panel>
                    <Panel>
                        <h3>3. Resumen del Pedido</h3>
                        {cart.length === 0 ? <p>El pedido está vacío.</p> : cart.map(item => (
                            <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <span>{item.nombre}</span>
                                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                    <Input 
                                        type="number" 
                                        value={item.quantity} 
                                        onChange={e => handleUpdateQuantity(item.id, e.target.value)} 
                                        style={{width: '70px'}} 
                                        min="1" 
                                    />
                                    <span>C${(item.precio * item.quantity).toFixed(2)}</span>
                                    <Button $cancel onClick={() => handleUpdateQuantity(item.id, 0)} style={{padding: '5px', minWidth: 'auto'}}>
                                        <FaTimes/>
                                    </Button>
                                </div>
                            </div>
                        ))}
                         <h3><FaDollarSign /> 4. Abono Inicial (Opcional)</h3>
                        <Input 
                            type="number" 
                            placeholder="Monto del abono" 
                            value={abonoInicial} 
                            onChange={e => setAbonoInicial(e.target.value)} 
                            min="0" 
                        />
                    </Panel>
                </Grid>
                <div style={{marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1.5rem'}}>
                    <div style={{fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'right', marginBottom: '1.5rem'}}>
                        Total del Pedido: C${total.toFixed(2)}
                    </div>
                    <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
                        <Button onClick={onClose}>Cancelar</Button>
                        <Button $primary onClick={handleSubmit} disabled={cart.length === 0 || !clienteNombre.trim()}>
                            Guardar Pedido
                        </Button>
                    </div>
                </div>
            </ModalContent>
        </ModalOverlay>
    );
};

export default CreateOrderModal;