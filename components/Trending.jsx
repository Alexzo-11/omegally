'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';

export default function Trending() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?limit=40')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch((err) => console.error('Failed to load trending products:', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [...new Set(products.map(p => p.category))].filter(Boolean);

  return (
    <section className="featured-section" style={{ padding: '80px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Trending Now</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px' }}>Popular Products</h2>
          </div>
          <Link href="/products" className="btn-primary" style={{ padding: '10px 24px', borderRadius: '100px', fontSize: '0.9rem' }}>
            See More <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        {/* Category Pills */}
        {categories.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px' }}>
            <Link href="/products" style={{ padding: '8px 16px', borderRadius: '100px', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text)', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>All</Link>
            {categories.map(cat => (
              <Link key={cat} href={`/products?category=${cat}`} style={{ padding: '8px 16px', borderRadius: '100px', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{cat}</Link>
            ))}
          </div>
        )}

        {/* Loading / Products Grid */}
        {loading ? (
          <div className="trending-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-card" style={{ height: '340px', borderRadius: '16px' }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
            <i className="fas fa-box-open" style={{ fontSize: '2rem', marginBottom: '12px' }}></i>
            <p>No products available yet.</p>
          </div>
        ) : (
          <div className="trending-grid">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>

      <style jsx global>{`
        .trending-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
        }
        @media (max-width: 1024px) {
          .trending-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .trending-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px; }
        }
      `}</style>
    </section>
  );
}