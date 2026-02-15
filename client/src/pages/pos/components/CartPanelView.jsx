// client/src/pages/POS/components/CartPanelView.jsx
import React, { useMemo } from 'react';
import {
  FaShoppingCart, FaPlus, FaTrashAlt, FaTimes, FaPercentage,
  FaDollarSign, FaEdit, FaRedo, FaTags
} from 'react-icons/fa';
import * as S from '../POS.styles.jsx';

export default function CartPanelView({
  currentUser,
  isAdmin,
  cajaSession,
  tasaDolar,
  orders,
  activeOrderId,
  onSetActiveOrder,
  onNewOrder,
  onRemoveOrder,
  onRenameOrder,
  products,
  cart,
  onUpdateQty,
  onRemoveFromCart,
  onSetManualPrice,
  onApplyWholesalePrice,
  onRevertRetailPrice,
  discountAmount,
  subtotal,
  total,
  onApplyOrderDiscount,
  onOpenProforma,
  onOpenPayment
}) {
  const activeOrder = useMemo(
    () => orders.find(o => o.id === activeOrderId) || { name: 'Ticket Nuevo', items: [] },
    [orders, activeOrderId]
  );

  return (
    <S.CartPanel style={{ width: '100%', maxWidth: '100%' }}>
      {/* TOP */}
      <div className="cart-fixed-top">
        <S.InfoBox className="caja-pill">
          <p style={{ margin: 0, fontWeight: 700 }}>
            CAJA: <strong>{currentUser?.nombre_usuario}</strong>
          </p>
          <p style={{ margin: 0 }}>
            Fondo: <strong>C${Number(cajaSession?.initialAmount || 0).toFixed(2)}</strong>
          </p>
        </S.InfoBox>

        <div className="tickets-header">
          <h3 style={{ margin: 0 }}>Tickets Activos ({orders.length})</h3>
          <S.Button primary onClick={onNewOrder}><FaPlus/> Nuevo</S.Button>
        </div>

        <S.TicketContainer>
          {orders.map(order => (
            <S.Button
              key={order.id}
              style={{ backgroundColor: activeOrderId === order.id ? '#007bff' : '#6c757d', color: '#fff' }}
              onClick={() => onSetActiveOrder(order.id)}
              onDoubleClick={() => onRenameOrder(order.id, order.name)}
              title={order.name}
            >
              <span style={{ maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {order.name || 'Ticket Nuevo'}
              </span>
              &nbsp;({order.items.length})
            </S.Button>
          ))}
          {orders.length > 1 && (
            <S.Button $cancel onClick={() => onRemoveOrder(activeOrderId)}><FaTrashAlt/> Cerrar Ticket</S.Button>
          )}
        </S.TicketContainer>

        <h2 className="cart-title">
          <FaShoppingCart/>
          <span className="cart-title-name" title={activeOrder.name}>{activeOrder.name}</span>
          <span className="cart-title-count">({cart.length})</span>
        </h2>
      </div>

      {/* LISTA */}
      <div className="cart-scroll">
        {cart.length === 0 ? (
          <p className="cart-empty" style={{ padding: '0.75rem', color: '#6c757d' }}>El ticket está vacío.</p>
        ) : cart.map(item => {
          const prod = products.find(p => p.id === item.id);
          const basePrice = Number(prod?.precio || 0);
          const hasWholesale = Number(prod?.raw?.mayoreo || 0) > 0;
          const code =
            item.codigo?.toString()
            || item.codigo_barras?.toString()
            || item.barcode?.toString()
            || item.id_producto?.toString()
            || item.id?.toString()
            || '';

          const unitPrice = Number(item.precio_venta ?? item.precio ?? basePrice);
          const lineTotal = unitPrice * Number(item.quantity || 0);
          const isPriceModified = unitPrice !== basePrice;

          return (
            <S.CartItemWrapper key={item.id}>
              {/* Cantidad */}
              <div className="item-qty">
                <input
                  type="number"
                  min="1"
                  max={item.existencia}
                  value={item.quantity}
                  onChange={(e) => onUpdateQty(item.id, e.target.value)}
                  title={`Máx: ${item.existencia}`}
                />
              </div>

              {/* Nombre + meta + acciones de precio */}
              <div className="item-info">
                <p className="item-name" title={item.nombre}>{item.nombre}</p>
                {/* Meta en una sola línea: código + stock */}
                <div className="item-meta" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {code && <span>Código: <strong>{code}</strong></span>}
                  <span>Stock: <strong>{item.existencia}</strong></span>
                </div>

                {/* Acciones de precio (solo admin) */}
                {isAdmin && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    <S.ActionButton title="Precio manual" onClick={() => onSetManualPrice(item)}><FaEdit/></S.ActionButton>
                    {hasWholesale && (
                      <S.ActionButton title="Aplicar mayoreo" onClick={() => onApplyWholesalePrice(item)}><FaTags/></S.ActionButton>
                    )}
                    {isPriceModified && (
                      <S.ActionButton title="Revertir precio" onClick={() => onRevertRetailPrice(item)}><FaRedo/></S.ActionButton>
                    )}
                  </div>
                )}
              </div>

              {/* Precio unitario visible */}
              <div className="item-unit">
                C${unitPrice.toFixed(2)} <span style={{ color: '#6c757d' }}>/u</span>
              </div>

              {/* Total de renglón */}
              <div className="item-total">C${lineTotal.toFixed(2)}</div>

              {/* Quitar */}
              <S.Button
                $cancel
                style={{ padding: '0.4rem', minWidth: 36 }}
                onClick={() => onRemoveFromCart(item.id)}
                title="Quitar del ticket"
              >
                <FaTimes/>
              </S.Button>
            </S.CartItemWrapper>
          );
        })}
      </div>

      {/* BOTTOM */}
      <div className="cart-fixed-bottom">
        <div>
          <S.TotalsRow><span>Subtotal:</span><span>C${subtotal.toFixed(2)}</span></S.TotalsRow>
        </div>

        <S.TotalsRow
          onClick={onApplyOrderDiscount}
          style={{ cursor: 'pointer', color: discountAmount > 0 ? '#dc3545' : 'inherit' }}
          title="Aplicar/editar descuento"
        >
          <span><FaPercentage/> Descuento Total:</span>
          <span>- C${discountAmount.toFixed(2)}</span>
        </S.TotalsRow>

        <S.TotalsRow $bordered $bold className="grand-total">
          <span>TOTAL:</span><span>C${total.toFixed(2)}</span>
        </S.TotalsRow>

        <S.InfoBox style={{ background: '#fff' }}>
          <FaDollarSign style={{ marginRight: 6 }}/>
          Tasa Dólar: <strong>C${Number(tasaDolar).toFixed(2)}</strong>
        </S.InfoBox>

        <div className="cart-actions">
          <S.Button info onClick={onOpenProforma} disabled={cart.length === 0}>Crear Proforma</S.Button>
          <S.Button pay onClick={onOpenPayment} disabled={cart.length === 0}>Proceder al Pago (F2)</S.Button>
        </div>
      </div>
    </S.CartPanel>
  );
}
