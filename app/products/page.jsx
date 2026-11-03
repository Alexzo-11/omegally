'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

// 1. Renamed the main component to ProductsContent
function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    brand: '',
    size: '',
    color: ''
  });

  // Fetch Products
  useEffect(() => {
    fetch('/api/products?page=1&limit=100')
      .then((r) => r.json())
      .then((d) => setAllProducts(d.products || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Update search query if URL changes
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  // Extract unique values for filters
  const uniqueBrands = useMemo(() => [...new Set(allProducts.map(p => p.brand).filter(Boolean))], [allProducts]);
  const uniqueSizes = useMemo(() => [...new Set(allProducts.flatMap(p => p.sizes || []))], [allProducts]);
  const uniqueColors = useMemo(() => [...new Set(allProducts.flatMap(p => p.colors || []))], [allProducts]);

  // Filtering & Sorting Logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...allProducts];

    // 1. Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // 2. Price Filter
    if (filters.minPrice) {
      result = result.filter(p => {
        const price = p.discountPrice > 0 ? p.discountPrice : p.price;
        return price >= Number(filters.minPrice);
      });
    }
    if (filters.maxPrice) {
      result = result.filter(p => {
        const price = p.discountPrice > 0 ? p.discountPrice : p.price;
        return price <= Number(filters.maxPrice);
      });
    }

    // 3. Brand Filter
    if (filters.brand) {
      result = result.filter(p => p.brand === filters.brand);
    }

    // 4. Size Filter
    if (filters.size) {
      result = result.filter(p => p.sizes && p.sizes.includes(filters.size));
    }

    // 5. Color Filter
    if (filters.color) {
      result = result.filter(p => p.colors && p.colors.includes(filters.color));
    }

    // 6. Sorting
    result.sort((a, b) => {
      const priceA = a.discountPrice > 0 ? a.discountPrice : a.price;
      const priceB = b.discountPrice > 0 ? b.discountPrice : b.price;

      switch (sortBy) {
        case 'price_asc': return priceA - priceB;
        case 'price_desc': return priceB - priceA;
        case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
        default: return 0; // Relevance (default order from API)
      }
    });

    return result;
  }, [allProducts, searchQuery, filters, sortBy]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ minPrice: '', maxPrice: '', brand: '', size: '', color: '' });
    setSearchQuery('');
    router.push('/products');
  };

  const hasActiveFilters = Object.values(filters).some(val => val !== '') || searchQuery;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '80px', minHeight: '80vh', background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Header & Mobile Filter Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 className="section-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>
                {searchQuery ? `Search: "${searchQuery}"` : 'Shop All Products'}
              </h1>
              <p className="section-subtitle" style={{ margin: 0 }}>
                {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Sort by:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="input"
                style={{ width: '160px', padding: '10px', cursor: 'pointer' }}
              >
                <option value="relevance">Relevance</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
              
              <button 
                className="btn btn-secondary mobile-filter-btn"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              >
                <i className="fas fa-filter"></i> Filters
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
            
            {/* Sidebar Filters */}
            <aside className={`filter-sidebar ${mobileFiltersOpen ? 'open' : ''}`} style={{ width: '260px', flexShrink: 0 }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Filters</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 600, cursor: 'pointer' }}>
                    Clear All
                  </button>
                )}
              </div>

              <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Price Range */}
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>Price Range (₦)</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="number" 
                      name="minPrice" 
                      placeholder="Min" 
                      value={filters.minPrice} 
                      onChange={handleFilterChange}
                      className="input"
                      style={{ padding: '8px' }}
                    />
                    <input 
                      type="number" 
                      name="maxPrice" 
                      placeholder="Max" 
                      value={filters.maxPrice} 
                      onChange={handleFilterChange}
                      className="input"
                      style={{ padding: '8px' }}
                    />
                  </div>
                </div>

                {/* Brand */}
                {uniqueBrands.length > 0 && (
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>Brand</label>
                    <select name="brand" value={filters.brand} onChange={handleFilterChange} className="input" style={{ cursor: 'pointer' }}>
                      <option value="">All Brands</option>
                      {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                )}

                {/* Size */}
                {uniqueSizes.length > 0 && (
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>Size</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {uniqueSizes.map(s => (
                        <button
                          key={s}
                          onClick={() => setFilters({ ...filters, size: filters.size === s ? '' : s })}
                          style={{
                            padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer',
                            border: filters.size === s ? '2px solid var(--primary)' : '1px solid var(--border)',
                            background: filters.size === s ? 'rgba(37,99,235,0.1)' : 'transparent',
                            color: filters.size === s ? 'var(--primary)' : 'var(--text)',
                            fontWeight: 500
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color */}
                {uniqueColors.length > 0 && (
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>Color</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {uniqueColors.map(c => (
                        <button
                          key={c}
                          onClick={() => setFilters({ ...filters, color: filters.color === c ? '' : c })}
                          style={{
                            padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer',
                            border: filters.color === c ? '2px solid var(--primary)' : '1px solid var(--border)',
                            background: filters.color === c ? 'rgba(37,99,235,0.1)' : 'transparent',
                            color: filters.color === c ? 'var(--primary)' : 'var(--text)',
                            fontWeight: 500
                          }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* Product Grid */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {loading ? (
                <div className="products-grid">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="skeleton-card" style={{ height: '320px', borderRadius: '16px' }} />
                  ))}
                </div>
              ) : filteredAndSortedProducts.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '80px 20px' }}>
                  <i className="fas fa-search" style={{ fontSize: '3rem', color: 'var(--text-tertiary)', marginBottom: '16px' }}></i>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>No products found</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Try adjusting your filters or search term.</p>
                  <button onClick={clearFilters} className="btn-primary">Clear All Filters</button>
                </div>
              ) : (
                <div className="products-grid">
                  {filteredAndSortedProducts.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Mobile Filter Drawer Overlay */}
      {mobileFiltersOpen && (
        <div 
          className="mobile-filter-overlay" 
          onClick={() => setMobileFiltersOpen(false)}
          style={{ display: 'none', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }}
        />
      )}

      <style jsx global>{`
        /* Hide mobile filter button on desktop */
        .mobile-filter-btn { display: none; }

        @media (max-width: 900px) {
          .mobile-filter-btn { display: flex; align-items: center; gap: 8px; }
          
          .filter-sidebar {
            position: fixed;
            top: 0;
            left: -100%;
            bottom: 0;
            width: 300px;
            background: var(--bg);
            z-index: 1001;
            padding: 24px;
            overflow-y: auto;
            transition: left 0.3s ease;
            box-shadow: 20px 0 60px rgba(0,0,0,0.1);
          }

          .filter-sidebar.open { left: 0; }
          .mobile-filter-overlay { display: block !important; }
        }
      `}</style>
    </>
  );
}

// 2. Added the Suspense wrapper as the default export
export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg)' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}