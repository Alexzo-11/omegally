'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { products as productsApi } from '@/services/api';

const USD_TO_NGN = 1500;

export default function SearchModal({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Fetch all products once on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productsApi.list({ page: 1, limit: 100 });
        setAllProducts(data.products || []);
      } catch (err) {
        console.error('Failed to fetch products for search:', err);
        // fallback to empty
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products whenever query changes
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }
    const q = query.toLowerCase().trim();
    const filtered = allProducts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.brand && p.brand.toLowerCase().includes(q))
    );
    setResults(filtered);
  }, [query, allProducts]);

  // Focus input when modal opens
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '80px',
        paddingLeft: '20px',
        paddingRight: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '700px',
          background: 'var(--bg)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-hover)',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Input area */}
        <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="fas fa-search" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}></i>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 0',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '1.2rem',
                color: 'var(--text)',
                fontWeight: '400',
              }}
            />
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.4rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Results */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <i className="fas fa-spinner fa-spin"></i> Loading products...
            </div>
          ) : query.trim() === '' ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <i className="fas fa-search" style={{ fontSize: '2rem', opacity: 0.4 }}></i>
              <p style={{ marginTop: '8px' }}>Type to search for products</p>
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p>No products found for <strong>"{query}"</strong></p>
            </div>
          ) : (
            results.map(p => (
              <Link
                key={p._id}
                href={`/products/${p._id}`}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px 24px',
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.15s',
                  color: 'var(--text)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--border)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <img
                  src={p.images?.[0] || `https://picsum.photos/seed/${p._id}/80/80`}
                  alt={p.title}
                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500' }}>{p.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    ₦{(p.price * USD_TO_NGN).toLocaleString()}
                  </div>
                </div>
                <i className="fas fa-arrow-right" style={{ color: 'var(--text-secondary)' }}></i>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}