'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalDelivery = cart.reduce((sum, item) => sum + (item.deliveryFee || 0) * item.qty, 0);
  const grandTotal = subtotal + totalDelivery;

  const handleSaveForLater = (item) => {
    const saved = JSON.parse(localStorage.getItem('savedForLater') || '[]');
    if (!saved.find(s => s.id === item.id)) {
      saved.push(item);
      localStorage.setItem('savedForLater', JSON.stringify(saved));
      removeFromCart(item.cartItemId || item.id); 
      alert('Saved for later!');
    } else {
      alert('Item is already in your saved list.');
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: 'calc(var(--nav-height) + 80px)', paddingBottom: '100px', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: '500px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
            <div style={{ width: '96px', height: '96px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '2.5rem', color: 'var(--text-tertiary)' }}>
              <i className="fas fa-shopping-bag"></i>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.02em' }}>Your cart is empty</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1rem' }}>Looks like you haven't added anything to your cart yet.</p>
            <Link href="/products" className="btn-primary" style={{ display: 'inline-flex', padding: '14px 32px', borderRadius: '100px' }}>
              Start Shopping <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '100px', minHeight: '80vh', background: 'var(--bg)' }}>
        
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '32px' }}>Shopping Cart</h1>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px', alignItems: 'start' }} className="cart-grid">
            
            {/* LEFT: Cart Items List */}
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Items ({cart.length})</h2>
                <button onClick={clearCart} style={{ color: 'var(--danger)', fontWeight: 600, fontSize: '0.85rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>Clear Cart</button>
              </div>
              
              <div style={{ padding: '0 32px' }}>
                {cart.map((item) => (
                  <div key={item.cartItemId || item.id} style={{ display: 'flex', gap: '20px', padding: '24px 0', borderBottom: '1px solid var(--border)' }}>
                    <Link href={`/products/${item.id}`} style={{ width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', background: 'var(--border-light)', flexShrink: 0, border: '1px solid var(--border)' }}>
                      <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Link>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link href={`/products/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</h3>
                      </Link>
                      <div style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '16px' }}>₦{Number(item.price).toLocaleString()}</div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg)' }}>
                          <button onClick={() => updateQuantity(item.cartItemId || item.id, item.qty - 1)} style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1rem', color: 'var(--text)' }}>-</button>
                          <span style={{ width: '40px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>{item.qty}</span>
                          <button onClick={() => updateQuantity(item.cartItemId || item.id, item.qty + 1)} style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1rem', color: 'var(--text)' }}>+</button>
                        </div>
                        
                        <button onClick={() => removeFromCart(item.cartItemId || item.id)} style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Remove</button>
                        
                        <button onClick={() => handleSaveForLater(item)} style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 500, background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Save for Later</button>
                      </div>
                    </div>
                    
                    <div style={{ fontWeight: 700, textAlign: 'right', fontSize: '1.05rem' }}>
                      ₦{(item.price * item.qty).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Order Summary */}
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px', position: 'sticky', top: 'calc(var(--nav-height) + 24px)', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px' }}>Order Summary</h2>
              
              <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '16px', paddingRight: '8px' }}>
                {cart.map((item) => (
                  <div key={`summary-${item.cartItemId || item.id}`} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)', paddingRight: '12px' }}>{item.title} × {item.qty}</span>
                    <span style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>₦{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div style={{ height: '1px', background: 'var(--border)', margin: '24px 0' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <span>Delivery Fee</span>
                <span>₦{totalDelivery.toLocaleString()}</span>
              </div>
              
              <div style={{ height: '1px', background: 'var(--border)', margin: '24px 0' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.3rem', marginBottom: '32px' }}>
                <span>Total</span>
                <span>₦{grandTotal.toLocaleString()}</span>
              </div>

              <Link href="/payment" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', borderRadius: '100px', textDecoration: 'none' }}>
                Proceed to Checkout <i className="fas fa-arrow-right"></i>
              </Link>
              
              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <i className="fas fa-lock"></i> Secure Checkout
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />

      <style jsx global>{`
        @media (max-width: 768px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .cart-grid > div[style*="position: sticky"] {
            position: static !important;
          }
        }
      `}</style>
    </>
  );
}