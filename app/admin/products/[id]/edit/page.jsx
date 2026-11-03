'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const CATEGORIES = [
  'Fashion', 'Electronics', 'Phones & Tablets', 'Computers & Laptops', 
  'Home & Kitchen', 'Health & Beauty', 'Sports & Outdoors', 'Toys & Games', 
  'Baby & Kids', 'Books & Stationery', 'Automotive', 'Groceries', 
  'Jewelry', 'Shoes & Bags', 'Other'
];

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '', 
    description: '', 
    price: '', 
    discountPrice: '', 
    deliveryFee: '', 
    stock: '', 
    category: 'Fashion', 
    brand: '', 
    sizes: '', 
    colors: '',
    isFeatured: false
  });
  const [images, setImages] = useState([]); 
  const [videoUrl, setVideoUrl] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Fetch existing product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();

        setForm({
          title: data.title || '',
          description: data.description || '',
          price: data.price || '',
          discountPrice: data.discountPrice || '',
          deliveryFee: data.deliveryFee || '',
          stock: data.stock || '',
          category: data.category || 'Fashion',
          brand: data.brand || '',
          sizes: data.sizes ? data.sizes.join(', ') : '',
          colors: data.colors ? data.colors.join(', ') : '',
          isFeatured: data.isFeatured || false
        });
        setImages(data.images || []);
        setVideoUrl(data.videoUrl || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) return alert('Maximum 5 images allowed');
    
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const newImages = [...images];

      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        const data = await res.json();
        if (res.ok) newImages.push(data.url);
      }
      setImages(newImages);
    } catch (err) {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : 0,
          deliveryFee: form.deliveryFee ? parseFloat(form.deliveryFee) : 0,
          stock: parseInt(form.stock) || 0,
          images: images,
          videoUrl: videoUrl,
          sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
          colors: form.colors.split(',').map(c => c.trim()).filter(Boolean),
        }),
      });

      if (!res.ok) throw new Error('Failed to update product');
      router.push('/admin/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '100px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '16px' }}></i>
        <p>Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '80px', maxWidth: '1000px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Link href="/admin/products" className="btn btn-sm btn-ghost" style={{ paddingLeft: 0, marginBottom: '16px', color: 'var(--text-secondary)' }}>
          <i className="fas fa-arrow-left"></i> Back to Catalog
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
          Edit Product
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Update the details below to modify this item in your storefront.
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '32px', alignItems: 'start' }} className="edit-product-form">
        
        {/* LEFT COLUMN: Media */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Product Images</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {images.map((img, i) => (
                <div key={i} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(239,68,68,0.9)', color: '#fff', border: 'none', width: '22px', height: '22px', cursor: 'pointer', borderRadius: '0 0 0 8px' }}>
                    <i className="fas fa-times" style={{ fontSize: '0.7rem' }}></i>
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button type="button" onClick={() => fileInputRef.current?.click()} style={{ width: '70px', height: '70px', borderRadius: '10px', border: '2px dashed var(--border)', background: 'var(--bg)', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <i className="fas fa-plus" style={{ fontSize: '1.2rem' }}></i>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            {uploading && <p style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Uploading...</p>}
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Upload up to 5 images.</p>
          </div>

          {/* Video URL (Optional) */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Video / GIF</h3>
            <input name="videoUrl" className="input" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Paste video or GIF URL..." />
          </div>
        </div>

        {/* RIGHT COLUMN: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Basic Details */}
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '24px' }}>Basic Details</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>Product Title *</label>
              <input name="title" className="input" value={form.title} onChange={handleChange} required />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>Description</label>
              <textarea name="description" className="input" rows="4" value={form.description} onChange={handleChange} style={{ resize: 'vertical', fontFamily: 'inherit' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>Brand</label>
                <input name="brand" className="input" value={form.brand} onChange={handleChange} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>Category *</label>
                <select name="category" className="input" value={form.category} onChange={handleChange} style={{ appearance: 'auto', cursor: 'pointer' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Variants, Pricing & Stock */}
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '24px' }}>Pricing & Inventory</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>Main Price (₦) *</label>
                <input name="price" type="number" className="input" value={form.price} onChange={handleChange} required />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>Discount Price (₦)</label>
                <input name="discountPrice" type="number" className="input" value={form.discountPrice} onChange={handleChange} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>Delivery Fee (₦)</label>
                <input name="deliveryFee" type="number" className="input" value={form.deliveryFee} onChange={handleChange} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>Stock Quantity *</label>
                <input name="stock" type="number" className="input" value={form.stock} onChange={handleChange} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>Sizes (Optional)</label>
                <input name="sizes" className="input" value={form.sizes} onChange={handleChange} placeholder="e.g. S, M, L" />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>Colors (Optional)</label>
                <input name="colors" className="input" value={form.colors} onChange={handleChange} placeholder="e.g. Red, Blue" />
              </div>
            </div>

            {/* Feature Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', marginBottom: '24px' }}>
              <input 
                type="checkbox" 
                id="isFeatured"
                checked={form.isFeatured} 
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} 
                style={{ width: '22px', height: '22px', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <div>
                <label htmlFor="isFeatured" style={{ fontWeight: 700, cursor: 'pointer', display: 'block', margin: 0 }}>Feature this product</label>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Show this item on the homepage.</span>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={saving} style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem' }}>
              {saving ? <><i className="fas fa-spinner fa-spin"></i> Saving Changes...</> : <><i className="fas fa-check"></i> Update Product</>}
            </button>
          </div>
        </div>
      </form>

      {/* Responsive layout for mobile */}
      <style jsx global>{`
        @media (max-width: 900px) {
          .edit-product-form {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}