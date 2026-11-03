'use client';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import PaystackButton from './PaystackButton';

export default function CartDrawer({ open, onClose }) {
  const { cart, removeFromCart, updateQty, total, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentMode, setPaymentMode] = useState('instant');
  const [weeks, setWeeks] = useState(4);

  if (!open) return null;

  const weeklyAmount = total / weeks;

  const handleOrderComplete = () => {
    clearCart();
    onClose();
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="cart-drawer">
        <div className="drawer-header">
          <h2>Your Cart</h2>
          <button onClick={onClose} className="nav-icon-btn"><i className="fas fa-times"></i></button>
        </div>

        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <i className="fas fa-shopping-bag"></i>
              <p>Your cart is empty</p>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item._id} className="cart-item">
                  <img src={item.images?.[0] || 'https://picsum.photos/80/80'} alt={item.title} />
                  <div className="cart-item-info">
                    <h4>{item.title}</h4>
                    <div className="cart-item-price">₦{Number(item.price).toLocaleString()}</div>
                    <div className="qty-control">
                      <button onClick={() => updateQty(item._id, item.qty - 1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                    </div>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}

              <div className="payment-options">
                <h4>Payment Method</h4>
                <div className="payment-toggle">
                  <button
                    className={paymentMode === 'instant' ? 'active' : ''}
                    onClick={() => setPaymentMode('instant')}
                  >
                    💳 Instant
                  </button>
                  <button
                    className={paymentMode === 'installment' ? 'active' : ''}
                    onClick={() => setPaymentMode('installment')}
                  >
                    📅 Installments
                  </button>
                </div>

                {paymentMode === 'installment' && (
                  <div className="installment-picker">
                    <label>Split into:</label>
                    <div className="week-buttons">
                      {[1, 2, 3, 4, 5, 6].map((w) => (
                        <button key={w} className={weeks === w ? 'active' : ''} onClick={() => setWeeks(w)}>
                          {w}w
                        </button>
                      ))}
                    </div>
                    <div className="installment-summary">
                      <div>Weekly payment: <strong>₦{Math.round(weeklyAmount).toLocaleString()}</strong></div>
                      <div>Total: <strong>₦{total.toLocaleString()}</strong></div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="cart-total">
              <span>Total</span>
              <strong>₦{total.toLocaleString()}</strong>
            </div>
            {user ? (
              <PaystackButton
                amount={total}
                email={user.email}
                metadata={{
                  userId: user.id,
                  paymentMode,
                  weeks: paymentMode === 'installment' ? weeks : null,
                  items: cart.map((i) => ({ id: i._id, qty: i.qty, price: i.price, title: i.title })),
                }}
                onSuccess={handleOrderComplete}
              />
            ) : (
              <div className="login-notice">
                <i className="fas fa-lock"></i> Please login to checkout
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}