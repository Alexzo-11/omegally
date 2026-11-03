'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?page=1&limit=100');
      if (!res.ok) throw new Error('Failed to load products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    
    // Optimistic UI update (removes instantly, then confirms)
    const originalProducts = [...products];
    setProducts((prev) => prev.filter((p) => p._id !== id));

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('Failed to delete');
      }
    } catch (err) {
      alert('Error deleting product');
      setProducts(originalProducts); // Revert if failed
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '80px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
            Products Catalog
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Manage your inventory. You currently have <strong>{products.length}</strong> product{products.length !== 1 ? 's' : ''} listed.
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary" style={{ padding: '12px 24px', borderRadius: '100px' }}>
          <i className="fas fa-plus"></i> Add New Product
        </Link>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)',
          color: 'var(--danger)', padding: '16px', borderRadius: 'var(--radius-sm)',
          marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}

      {/* Loading / Empty / Grid State */}
      {loading ? (
        <div className="admin-products-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-card" style={{ height: '320px', borderRadius: '16px' }} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '80px 20px', border: '1px dashed var(--border)' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(37,99,235,0.1)',
            color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', margin: '0 auto 20px'
          }}>
            <i className="fas fa-box-open"></i>
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>No products yet</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
            Get started by adding your first product to the catalog so customers can start shopping.
          </p>
          <Link href="/admin/products/new" className="btn-primary">
            <i className="fas fa-plus"></i> Upload First Product
          </Link>
        </div>
      ) : (
        <div className="admin-products-grid">
          {products.map((p) => (
            <div key={p._id} className="admin-product-card">
              {/* Image Area */}
              <div style={{ position: 'relative', aspectRatio: '4/3', background: 'var(--border-light)', overflow: 'hidden' }}>
                {p.images?.[0] ? (
                  <img 
                    src={p.images[0]} 
                    alt={p.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} 
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                    <i className="fas fa-image" style={{ fontSize: '2rem' }}></i>
                  </div>
                )}
                
                {/* Stock Badge overlay */}
                <div style={{
                  position: 'absolute', top: '12px', right: '12px',
                  background: p.stock > 0 ? 'var(--success)' : 'var(--danger)',
                  color: '#fff', padding: '4px 10px', borderRadius: '100px',
                  fontSize: '0.75rem', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                </div>
              </div>

              {/* Details Area */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                  {p.category || 'Uncategorized'}
                </div>
                <h3 style={{ 
                  fontSize: '1rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.4,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1
                }}>
                  {p.title}
                </h3>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)' }}>
                  ₦{Number(p.price).toLocaleString()}
                </div>
              </div>

              {/* Actions Area */}
              <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px' }}>
  <Link href={`/admin/products/${p._id}/edit`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
    <i className="fas fa-edit"></i> Edit
  </Link>
  <Link href={`/products/${p._id}`} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
    View
  </Link>
  <button onClick={() => deleteProduct(p._id)} className="btn btn-sm" style={{ flex: 1, justifyContent: 'center', color: 'var(--danger)', background: 'rgba(239,68,68,0.1)', border: '1px solid transparent' }}>
    <i className="fas fa-trash"></i>
  </button>
</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}