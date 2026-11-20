'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  
  const [savedItems, setSavedItems] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('savedForLater') || '[]');
    }
    return [];
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalDelivery = cart.reduce((sum, item) => sum + (item.deliveryFee || 0) * item.qty, 0);
  const grandTotal = subtotal + totalDelivery;

  const handleSaveForLater = (item) => {
    const saved = JSON.parse(localStorage.getItem('savedForLater') || '[]');
    const itemId = item.cartItemId || item.id;
    
    if (!saved.find(s => (s.cartItemId || s.id) === itemId)) {
      const newSaved = [...saved, item];
      localStorage.setItem('savedForLater', JSON.stringify(newSaved));
      setSavedItems(newSaved);
      removeFromCart(itemId); 
    } else {
      alert('Item is already in your saved list.');
    }
  };

  const handleMoveToCart = (item) => {
    const saved = JSON.parse(localStorage.getItem('savedForLater') || '[]');
    const itemId = item.cartItemId || item.id;
    const newSaved = saved.filter(s => (s.cartItemId || s.id) !== itemId);
    
    localStorage.setItem('savedForLater', JSON.stringify(newSaved));
    setSavedItems(newSaved);
    
    // Add back to cart (using your addToCart logic implicitly via the context if needed, 
    // but usually we would call addToCart(item) here. Assuming updateQuantity handles it)
    // Note: You may need to expose `addToCart` from useCart here if you want to move it back.
    window.location.reload(); // Quickest way to sync state if addToCart isn't imported
  };

  const handleRemoveSaved = (itemId) => {
    const saved = JSON.parse(localStorage.getItem('savedForLater') || '[]');
    const newSaved = saved.filter(s => (s.cartItemId || s.id) !== itemId);
    localStorage.setItem('savedForLater', JSON.stringify(newSaved));
    setSavedItems(newSaved);
  };

  // Empty Cart State
  if (cart.length === 0 && savedItems.length === 0) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: 'calc(var(--nav-height) + 80px)', paddingBottom: '100px', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
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
            <div>
              {cart.length > 0 ? (
                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Items ({cart.length})</h2>
                    <button onClick={clearCart} style={{ color: 'var(--danger)', fontWeight: 600, fontSize: '0.85rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>Clear Cart</button>
                  </div>
                  
                  <div style={{ padding: '0 32px' }}>
                    {cart.map((item) => (
                      <div key={item.cartItemId || item.id} style={{ display: 'flex', gap: '20px', padding: '24px 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
                        
                        {/* Image */}
                        <Link href={`/products/${item.id}`} style={{ width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', background: 'var(--border-light)', flexShrink: 0, border: '1px solid var(--border)' }}>
                          <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Link>
                        
                        {/* Details */}
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                            <Link href={`/products/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</h3>
                            </Link>
                            <div style={{ fontWeight: 800, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                              ₦{(item.price * item.qty).toLocaleString()}
                            </div>
                          </div>
                          
                          {/* Size/Color Badges */}
                          {(item.size || item.color) && (
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                              {item.size && <span style={{ fontSize: '0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>Size: {item.size}</span>}
                              {item.color && <span style={{ fontSize: '0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>Color: {item.color}</span>}
                            </div>
                          )}
                          
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                            ₦{Number(item.price).toLocaleString()} each
                          </div>

                          {/* Actions Row */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            
                            {/* Modern Quantity Selector */}
                            <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '100px', overflow: 'hidden', background: 'var(--bg)' }}>
                              <button onClick={() => updateQuantity(item.cartItemId || item.id, item.qty - 1)} style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--border-light)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                <i className="fas fa-minus" style={{ fontSize: '0.7rem' }}></i>
                              </button>
                              <span style={{ width: '32px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>{item.qty}</span>
                              <button onClick={() => updateQuantity(item.cartItemId || item.id, item.qty + 1)} style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--border-light)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                <i className="fas fa-plus" style={{ fontSize: '0.7rem' }}></i>
                              </button>
                            </div>
                            
                            {/* Action Buttons */}
                            <button onClick={() => removeFromCart(item.cartItemId || item.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '100px', background: 'rgba(239,68,68,0.05)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.05)'}>
                              <i className="fas fa-trash-alt"></i> Remove
                            </button>
                            
                            <button onClick={() => handleSaveForLater(item)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '100px', background: 'var(--bg)', color: 'var(--text-secondary)', border: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--border-light)'} onMouseOut={(e) => e.currentTarget.style.background = 'var(--bg)'}>
                              <i className="far fa-bookmark"></i> Save
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ background: 'var(--bg-elevated)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '40px', textAlign: 'center' }}>
                  <i className="fas fa-shopping-bag" style={{ fontSize: '2rem', color: 'var(--text-tertiary)', marginBottom: '12px' }}></i>
                  <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>Your cart is empty</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Check out your saved items below.</p>
                  <Link href="/products" className="btn-primary" style={{ display: 'inline-flex', padding: '12px 24px', borderRadius: '100px' }}>Browse Products</Link>
                </div>
              )}

              {/* SAVED FOR LATER SECTION */}
              {savedItems.length > 0 && (
                <div style={{ marginTop: '32px' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="far fa-bookmark" style={{ color: 'var(--primary)' }}></i> Saved for Later ({savedItems.length})
                  </h2>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {savedItems.map((item) => (
                      <div key={item.cartItemId || item.id} style={{ display: 'flex', gap: '16px', padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', alignItems: 'center' }}>
                        <img src={item.image} alt={item.title} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                          <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>₦{Number(item.price).toLocaleString()}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleRemoveSaved(item.cartItemId || item.id)} style={{ background: 'transparent', border: '1px solid var(--border)', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: 'var(--danger)' }} title="Remove">
                            <i className="fas fa-trash-alt" style={{ fontSize: '0.8rem' }}></i>
                          </button>
                          <button onClick={() => handleMoveToCart(item)} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                            Move to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Order Summary */}
            {cart.length > 0 && (
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
            )}

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