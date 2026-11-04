'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?page=1&limit=100')
      .then((r) => r.json())
      .then((d) => setAllProducts(d.products || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
    setActiveCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  const categories = ['All', ...new Set(allProducts.map((p) => p.category).filter(Boolean))];

  const filtered = allProducts.filter((p) => {
    const matchesSearch = searchQuery
      ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    const matchesCategory = activeCategory === 'All' ? true : p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'calc(var(--nav-height) + 80px)', paddingBottom: '60px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <h1 className="section-title">
            {searchQuery ? `Search: "${searchQuery}"` : 'All Products'}
          </h1>
          <p className="section-subtitle" style={{ marginBottom: '24px' }}>
            {searchQuery ? `${filtered.length} result${filtered.length === 1 ? '' : 's'} found` : 'Browse our collection of premium items.'}
          </p>

          {/* Category Pills */}
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 16px', borderRadius: '100px', border: '1px solid var(--border)',
                  background: activeCategory === cat ? 'var(--primary)' : 'var(--bg-elevated)',
                  color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
                  fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="products-grid">
              {[...Array(10)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-search"></i>
              <h3>No products found</h3>
              <p>Try a different search term or category.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}