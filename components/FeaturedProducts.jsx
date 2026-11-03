'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products and filter only featured ones
    fetch('/api/products?limit=50') 
      .then((r) => r.json())
      .then((d) => {
        const allProducts = d.products || [];
        const featured = allProducts.filter(p => p.isFeatured);
        // Show max 8 featured products, or fallback to first 4 if none are featured yet
        setProducts(featured.length > 0 ? featured.slice(0, 8) : allProducts.slice(0, 4));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    
    <section className="featured-section" style={{ padding: '80px 0', background: 'var(--bg)' }}>
      <div className="section-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="section-eyebrow" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>
              FEATURED COLLECTIONS
            </span>
            <h2 className="section-title" style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
              Handpicked For You
            </h2>
          </div>
          <Link href="/products" className="view-all-link" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 600 }}>
            View All <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        {loading ? (
          <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ height: '340px', background: 'var(--border)', borderRadius: '16px', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : (
          <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}