'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'All';

  // Search & Category State
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // NEW: Filter States
  const [priceFilter, setPriceFilter] = useState('all');
  const [discountFilter, setDiscountFilter] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetch('/api/products')
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

  // --- FILTER LOGIC ---
  const filtered = allProducts.filter((p) => {
    // 1. Search Query
    const matchesSearch = searchQuery
      ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    // 2. Category
    const matchesCategory = activeCategory === 'All' ? true : p.category === activeCategory;

    // 3. Price Filter
    let matchesPrice = true;
    if (priceFilter === 'under10k') matchesPrice = p.price < 10000;
    else if (priceFilter === '10k-50k') matchesPrice = p.price >= 10000 && p.price <= 50000;
    else if (priceFilter === '50k-100k') matchesPrice = p.price > 50000 && p.price <= 100000;
    else if (priceFilter === 'above100k') matchesPrice = p.price > 100000;

    // 4. Discount Filter
    let matchesDiscount = true;
    if (discountFilter === 'discounted') matchesDiscount = p.discountPrice > 0;
    else if (discountFilter === 'regular') matchesDiscount = !p.discountPrice || p.discountPrice === 0;

    return matchesSearch && matchesCategory && matchesPrice && matchesDiscount;
  });

  return (
    <main style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '60px', background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 className="section-title" style={{ fontSize: '2rem', fontWeight: 800 }}>
            {searchQuery ? `Search: "${searchQuery}"` : 'All Products'}
          </h1>
          <p className="section-subtitle" style={{ marginBottom: '24px' }}>
            {searchQuery ? `${filtered.length} result${filtered.length === 1 ? '' : 's'} found` : 'Browse our collection of premium items.'}
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <button 
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          style={{ display: 'none', width: '100%', padding: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', fontWeight: 600, marginBottom: '20px', cursor: 'pointer', color: 'var(--text)' }}
          className="mobile-filter-btn"
        >
          <i className="fas fa-filter"></i> {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          
          {/* LEFT SIDEBAR: FILTERS */}
          <aside style={{ width: '250px', flexShrink: 0, position: 'sticky', top: 'calc(var(--nav-height) + 40px)' }} className={`product-filters ${showMobileFilters ? 'show-mobile' : ''}`}>
            
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Categories</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      textAlign: 'left', background: 'transparent', border: 'none', padding: '6px 0',
                      color: activeCategory === cat ? 'var(--primary)' : 'var(--text-secondary)',
                      fontWeight: activeCategory === cat ? 700 : 500, fontSize: '0.9rem', cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Price Range</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="radio" name="price" value="all" checked={priceFilter === 'all'} onChange={(e) => setPriceFilter(e.target.value)} style={{ accentColor: 'var(--primary)' }} /> All Prices
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="radio" name="price" value="under10k" checked={priceFilter === 'under10k'} onChange={(e) => setPriceFilter(e.target.value)} style={{ accentColor: 'var(--primary)' }} /> Under ₦10,000
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="radio" name="price" value="10k-50k" checked={priceFilter === '10k-50k'} onChange={(e) => setPriceFilter(e.target.value)} style={{ accentColor: 'var(--primary)' }} /> ₦10,000 - ₦50,000
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="radio" name="price" value="50k-100k" checked={priceFilter === '50k-100k'} onChange={(e) => setPriceFilter(e.target.value)} style={{ accentColor: 'var(--primary)' }} /> ₦50,000 - ₦100,000
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="radio" name="price" value="above100k" checked={priceFilter === 'above100k'} onChange={(e) => setPriceFilter(e.target.value)} style={{ accentColor: 'var(--primary)' }} /> Above ₦100,000
                </label>
              </div>
            </div>

            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Discount</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="radio" name="discount" value="all" checked={discountFilter === 'all'} onChange={(e) => setDiscountFilter(e.target.value)} style={{ accentColor: 'var(--primary)' }} /> All Items
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="radio" name="discount" value="discounted" checked={discountFilter === 'discounted'} onChange={(e) => setDiscountFilter(e.target.value)} style={{ accentColor: 'var(--primary)' }} /> On Sale Only
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="radio" name="discount" value="regular" checked={discountFilter === 'regular'} onChange={(e) => setDiscountFilter(e.target.value)} style={{ accentColor: 'var(--primary)' }} /> Full Price Only
                </label>
              </div>
            </div>

            {/* Clear Filters Button */}
            {(priceFilter !== 'all' || discountFilter !== 'all' || activeCategory !== 'All') && (
              <button 
                onClick={() => { setPriceFilter('all'); setDiscountFilter('all'); setActiveCategory('All'); }}
                style={{ width: '100%', padding: '12px', marginTop: '24px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Clear All Filters
              </button>
            )}

          </aside>

          {/* RIGHT SIDE: PRODUCTS GRID */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <div className="products-grid">
                {[...Array(10)].map((_, i) => <div key={i} className="skeleton-card" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search term.</p>
                <button onClick={() => { setPriceFilter('all'); setDiscountFilter('all'); setActiveCategory('All'); setSearchQuery(''); }} className="btn-primary" style={{ marginTop: '16px', padding: '10px 24px', borderRadius: '100px' }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filtered.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            )}
          </div>

        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .mobile-filter-btn { display: block !important; }
          .product-filters { 
            display: ${showMobileFilters ? 'block' : 'none'}; 
            width: 100% !important; 
            position: static !important;
            margin-bottom: 24px;
          }
          .product-filters > div { margin-bottom: 16px !important; padding: 16px !important; }
        }
      `}</style>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <main style={{ paddingTop: 'calc(var(--nav-height) + 80px)', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '16px' }}></i>
            <p>Loading products...</p>
          </div>
        </main>
      }>
        <ProductsContent />
      </Suspense>
      <Footer />
    </>
  );
}