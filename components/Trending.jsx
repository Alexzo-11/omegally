import Link from 'next/link';
import ProductCard from './ProductCard';

export default async function Trending() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products?limit=40`, { next: { revalidate: 60 } });
  const data = await res.json();
  const products = data.products || [];

  // Extract unique categories
  const categories = [...new Set(products.map(p => p.category))].filter(Boolean);

  return (
    <section className="featured-section" style={{ padding: '80px 0', background: 'var(--bg)' }}>
      {/* Changed 'container' to the inline centering style */}
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
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px' }}>
          <Link href="/products" style={{ padding: '8px 16px', borderRadius: '100px', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text)', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>All</Link>
          {categories.map(cat => (
            <Link key={cat} href={`/products?category=${cat}`} style={{ padding: '8px 16px', borderRadius: '100px', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{cat}</Link>
          ))}
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </section>
  );
}