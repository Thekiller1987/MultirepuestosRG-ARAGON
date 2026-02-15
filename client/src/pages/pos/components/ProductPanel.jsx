// client/src/pages/pos/components/ProductPanel.jsx
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { FaStore, FaExclamationTriangle, FaTags, FaBarcode, FaFont, FaImage, FaEye, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import * as S from '../POS.styles.jsx';

const PRODUCTS_PER_PAGE = 100;

const fmt = (n) =>
  Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const FilterButton = styled.button`
  display: flex; align-items: center; justify-content: center;
  width: 42px; height: 42px;
  border: 1px solid ${props => props.$active ? '#3b82f6' : '#cbd5e1'};
  background-color: ${props => props.$active ? '#eff6ff' : '#fff'};
  color: ${props => props.$active ? '#3b82f6' : '#64748b'};
  border-radius: 8px; cursor: pointer; transition: all 0.2s;

  &:hover { border-color: #3b82f6; color: #3b82f6; }
`;

const ImageViewModal = ({ isOpen, imageSrc, onClose }) => {
  if (!isOpen || !imageSrc) return null;
  return (
    <S.ModalOverlay onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', maxWidth: '95%', maxHeight: '90vh' }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: -15, right: -15,
            background: 'white', width: 32, height: 32, borderRadius: '50%',
            border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10, color: '#ef4444'
          }}
        >
          <FaTimes />
        </button>
        <img
          src={imageSrc}
          alt="Vista Ampliada"
          style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '12px', boxShadow: '0 20px 25px rgba(0,0,0,0.2)', background: 'white', objectFit: 'contain' }}
        />
      </motion.div>
    </S.ModalOverlay >
  );
};

export default function ProductPanel({
  products = [],
  searchTerm,
  setSearchTerm,
  onProductClick,
  cartItems = [],
  reservedStock, // Recibimos el mapa de stock reservado
  inputRef,
  searchType = 'description',
  setSearchType = () => { }
}) {
  const [viewImage, setViewImage] = useState({ isOpen: false, imageUrl: null });

  // Calcular stock disponible
  const qtyInCart = useMemo(() => {
    const map = new Map();
    for (const it of cartItems) {
      // Usar id_producto para normalización
      const id = it.id_producto || it.id;
      map.set(id, (map.get(id) || 0) + Number(it.quantity || 0));
    }
    return map;
  }, [cartItems]);

  const filteredProducts = useMemo(() => {
    const term = (searchTerm || '').toLowerCase().trim();

    const results = products.filter(p => {
      // Optimización: Búsqueda rápida ignorando acentos y mayúsculas
      const normalize = (str) => str ? String(str).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : '';
      const termNormalized = normalize(term);

      if (!termNormalized) return true;

      if (searchType === 'code') {
        const codigo = normalize(p.codigo);
        const barras = normalize(p.codigo_barras);
        return codigo.startsWith(termNormalized) || barras.startsWith(termNormalized);
      } else {
        // En description, buscamos en nombre Y código para mayor flexibilidad
        // Si el término es muy corto (1 car) y hay muchos productos, podría ser lento, pero asumimos <2000 items
        const nombre = normalize(p.nombre);
        const descripcion = normalize(p.descripcion);
        const codigo = normalize(p.codigo);

        return nombre.includes(termNormalized) || descripcion.includes(termNormalized) || codigo.includes(termNormalized);
      }
    });

    return results.slice(0, 100); // Límite visual para no saturar el DOM (virtualización sería mejor si crece mucho)
  }, [products, searchTerm, searchType]);

  const totalResults = useMemo(() => {
    const term = (searchTerm || '').toLowerCase().trim();
    if (!term) return products.length;
    return products.filter(p => {
      const nombre = (p.nombre || '').toLowerCase();
      const codigo = String(p.codigo || '').toLowerCase();
      return nombre.includes(term) || codigo.includes(term);
    }).length;
  }, [products, searchTerm]);

  return (
    <S.MainPanel>
      {/* Barra de Búsqueda */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', alignItems: 'center' }}>
        <S.SearchInput
          ref={inputRef}
          placeholder={searchType === 'code' ? "Escribe código..." : "Buscar producto..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <FilterButton
          $active={searchType === 'description'}
          onClick={() => { setSearchType('description'); inputRef.current?.focus(); }}
          title="Buscar por Nombre"
        >
          <FaFont size={16} />
        </FilterButton>

        <FilterButton
          $active={searchType === 'code'}
          onClick={() => { setSearchType('code'); inputRef.current?.focus(); }}
          title="Buscar por Código"
        >
          <FaBarcode size={18} />
        </FilterButton>
      </div>

      {/* Grid de Productos */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '0 4px', fontSize: '0.85rem', color: '#64748b' }}>
        <span><FaStore color="#3b82f6" /> {filteredProducts.length} mostrados</span>
        <span>Total: {totalResults}</span>
      </div>

      <S.ProductGrid>
        {filteredProducts.map(p => {
          const pid = p.id_producto || p.id;
          const enCarrito = qtyInCart.get(pid) || 0;
          const enOtrosTickets = reservedStock?.get(pid) || 0;
          const restante = Math.max(0, Number(p.existencia || 0) - enCarrito - enOtrosTickets);
          const agotado = restante <= 0;

          return (
            <S.ProductCard
              key={pid}
              onClick={() => !agotado && onProductClick(p)}
              outOfStock={agotado}
              title={p.nombre}
            >
              <S.StockBadge lowstock={restante < 5 && !agotado} outOfStock={agotado}>
                {agotado ? 'Agotado' : `Stock: ${restante}`}
              </S.StockBadge>

              <div className="image-placeholder" style={{ position: 'relative', height: 160, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #f1f5f9', overflow: 'hidden' }}>
                {p.imagen && (
                  <div
                    className="eye-icon"
                    onClick={(e) => { e.stopPropagation(); setViewImage({ isOpen: true, imageUrl: p.imagen }); }}
                    style={{
                      position: 'absolute', top: 10, left: 10, zIndex: 20,
                      background: 'white', borderRadius: '50%', width: 32, height: 32,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)', cursor: 'pointer',
                      transition: 'transform 0.2s',
                    }}
                    title="Ver imagen"
                  >
                    <FaEye size={14} color="#64748b" />
                  </div>
                )}
                {p.imagen ? (
                  <img src={p.imagen} alt={p.nombre} loading="lazy" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                ) : (
                  <FaImage className="no-image-icon" size={40} color="#e2e8f0" />
                )}
              </div>

              <div className="info" style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div className="product-name" style={{
                  fontWeight: 600, fontSize: '0.88rem', color: '#1e293b',
                  lineHeight: '1.25', height: '3.8rem', overflow: 'hidden',
                  display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'
                }}>
                  {p.nombre}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                  {p.codigo || 'S/C'}
                </div>
                {(Number(p.mayorista) > 0 || Number(p.mayoreo) > 0) && (
                  <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'auto', marginBottom: '1px' }}>
                    <FaTags size={10} /> May: C$ {fmt(p.mayorista || p.mayoreo)}
                  </div>
                )}
                <div className="price" style={{ fontWeight: 800, color: '#2563eb', fontSize: '1.05rem', marginTop: !((Number(p.mayorista) > 0 || Number(p.mayoreo) > 0)) ? 'auto' : 0 }}>
                  C$ {fmt(p.precio_venta || p.precio)}
                </div>
              </div>
            </S.ProductCard>
          );
        })}
      </S.ProductGrid>

      <AnimatePresence>
        {viewImage.isOpen && (
          <ImageViewModal
            isOpen={true}
            imageSrc={viewImage.imageUrl}
            onClose={() => setViewImage({ isOpen: false, imageUrl: null })}
          />
        )}
      </AnimatePresence>
    </S.MainPanel>
  );
}