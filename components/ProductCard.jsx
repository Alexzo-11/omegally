'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Safely handle array or string format from DB
  const sizes = Array.isArray(product.sizes) ? product.sizes : (product.sizes ? product.sizes.split(',').map(s => s.trim()).filter(Boolean) : []);
  const colors = Array.isArray(product.colors) ? product.colors : (product.colors ? product.colors.split(',').map(c => c.trim()).filter(Boolean) : []);

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;
  const hasOptions = sizes.length > 0 || colors.length > 0;

  const handleAddToCartClick = (e) => {
    e.preventDefault(); // Prevent navigating to product page when clicking the button
    
    if (!user) {
      alert('Please login to add items to cart');
      return router.push('/login');
    }

    if (hasOptions) {
      // If it has sizes/colors, open the modal to select
      setSelectedSize(sizes[0] || '');
      setSelectedColor(colors[0] || '');
      setIsModalOpen(true);
    } else {
      // Otherwise, add directly
      addToCart({
        id: product._id,
        title: product.title,
        price: displayPrice,
        image: product.images?.[0] || '',
        qty: 1,
        deliveryFee: product.deliveryFee || 0,
      });
      alert('Added to cart!');
    }
  };

  const confirmAddToCart = () => {
    addToCart({
      id: product._id,
      title: product.title,
      price: displayPrice,
      image: product.images?.[0] || '',
      qty: 1,
      size: selectedSize,
      color: selectedColor,
      deliveryFee: product.deliveryFee || 0,
    });
    setIsModalOpen(false);
    alert('Added to cart!');
  };

  return (
    <>
      <div className="product-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Link href={`/products/${product._id}`} style={{ flex: 1, textDecoration: 'none', color: 'inherit' }}>
          
          {/* Image Area */}
          <div className="product-image" style={{ position: 'relative', aspectRatio: '1', background: 'var(--border-light)' }}>
            <img src={product.images?.[0] || '/placeholder.png'} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            
            {hasDiscount && (
              <span className="product-badge" style={{ background: 'var(--danger)' }}>
                SALE
              </span>
            )}
            {product.stock <= 0 && (
              <span className="product-badge out" style={{ background: '#000', color: '#fff' }}>
                Out of Stock
              </span>
            )}
          </div>

          {/* Body Area */}
          <div className="product-body" style={{ padding: '14px 14px 8px', flex: 1 }}>
            <h3 className="product-title" style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', lineHeight: 1.4 }}>
              {product.title}
            </h3>
            
            <div className="product-price" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ₦{displayPrice.toLocaleString()}
              {hasDiscount && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textDecoration: 'line-through', fontWeight: 500 }}>
                  ₦{product.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Add to Cart Button */}
        <div style={{ padding: '0 14px 14px' }}>
          <button 
            onClick={handleAddToCartClick}
            disabled={product.stock <= 0}
            className="btn-add-cart"
            style={{ 
              width: '100%', justifyContent: 'center', padding: '10px', 
              background: product.stock <= 0 ? 'var(--border)' : 'var(--primary)', 
              color: product.stock <= 0 ? 'var(--text-tertiary)' : '#fff',
              border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem',
              cursor: product.stock <= 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <i className="fas fa-shopping-cart"></i> 
            {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* SIZE & COLOR SELECTION MODAL */}
      {isModalOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }} 
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', maxWidth: '400px', width: '100%', padding: '24px', boxShadow: 'var(--shadow-xl)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <img src={product.images?.[0]} alt={product.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '4px' }}>{product.title}</h3>
                  <div style={{ color: 'var(--primary)', fontWeight: 800 }}>₦{displayPrice.toLocaleString()}</div>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'var(--bg)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', color: 'var(--text)' }}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Size Selector */}
            {sizes.length > 0 && (
              <div style={{ marginBottom: '20px', marginTop: '24px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '10px', color: 'var(--text-secondary)' }}>Select Size</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '8px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                        border: selectedSize === size ? '2px solid var(--primary)' : '1px solid var(--border)',
                        background: selectedSize === size ? 'rgba(37,99,235,0.1)' : 'var(--bg)',
                        color: selectedSize === size ? 'var(--primary)' : 'var(--text)',
                        transition: 'all 0.2s'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {colors.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '10px', color: 'var(--text-secondary)' }}>Select Color</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        padding: '8px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                        border: selectedColor === color ? '2px solid var(--primary)' : '1px solid var(--border)',
                        background: selectedColor === color ? 'rgba(37,99,235,0.1)' : 'var(--bg)',
                        color: selectedColor === color ? 'var(--primary)' : 'var(--text)',
                        transition: 'all 0.2s'
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button onClick={confirmAddToCart} className="btn-primary" style={{ width: '100%', padding: '14px', justifyContent: 'center', borderRadius: '8px' }}>
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </>
  );
}