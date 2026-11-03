'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const isAdmin = user?.role === 'admin';

  const hasDiscount = product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsSaved(wishlist.includes(product._id));
  }, [product._id]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    if (!user) return alert('Please login');
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (isSaved) wishlist = wishlist.filter(id => id !== product._id);
    else wishlist.push(product._id);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    setIsSaved(!isSaved);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to add items to cart');
    addToCart({ id: product._id, title: product.title, price: displayPrice, image: product.images?.[0] || '', qty: 1, deliveryFee: product.deliveryFee || 0 });
  };

  return (
    <div className="product-card">
      <Link href={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="product-image">
          <img src={product.images?.[0]} alt={product.title} />
          
          {/* FEATURE L: Stock Alerts / Badges */}
          <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {product.stock === 0 && <span className="badge badge-danger">Out of Stock</span>}
            {product.stock > 0 && product.stock <= 5 && <span className="badge badge-warning">Only {product.stock} left!</span>}
            {hasDiscount && <span className="badge badge-success">Sale</span>}
          </div>

          {!isAdmin && (
            <button onClick={toggleWishlist} style={{ position: 'absolute', top: '8px', right: '8px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-heart" style={{ color: isSaved ? 'var(--danger)' : 'var(--text-tertiary)' }}></i>
            </button>
          )}
        </div>
        <div className="product-body">
          <h4 className="product-title">{product.title}</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="product-price">₦{Number(displayPrice).toLocaleString()}</span>
            {hasDiscount && <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textDecoration: 'line-through' }}>₦{Number(product.price).toLocaleString()}</span>}
          </div>
        </div>
      </Link>
      
      {!isAdmin && (
        <div style={{ padding: '0 14px 14px' }}>
          <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-add-cart">
            <i className="fas fa-shopping-cart"></i> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      )}
    </div>
  );
}