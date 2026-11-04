'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?limit=50') 
      .then((r) => r.json())
      .then((d) => {
        const allProducts = d.products || [];
        const featured = allProducts.filter(p => p.isFeatured);
        setProducts(featured.length > 0 ? featured.slice(0, 8) : allProducts.slice(0, 4));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="featured-section" style={{ padding: '80px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>
              FEATURED COLLECTIONS
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
              Handpicked For You
            </h2>
          </div>
          <Link href="/products" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 600 }}>
            View All <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        {loading ? (
          <div className="featured-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ height: '340px', background: 'var(--border)', borderRadius: '16px', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : (
          <div className="featured-grid">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>

      <style jsx global>{`
        .featured-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 1024px) {
          .featured-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .featured-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px; }
        }
      `}</style>
    </section>
  );
}