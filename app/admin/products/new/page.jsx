'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CATEGORIES = [
  'Fashion', 'Electronics', 'Phones & Tablets', 'Computers & Laptops', 
  'Home & Kitchen', 'Health & Beauty', 'Sports & Outdoors', 'Toys & Games', 
  'Baby & Kids', 'Books & Stationery', 'Automotive', 'Groceries', 
  'Jewelry', 'Shoes & Bags', 'Other'
];

export default function NewProductPage() {
  const router = useRouter();
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
    isFeatured: false // ✅ Added default state
  });
  
  const [images, setImages] = useState([]); 
  const [videoUrl, setVideoUrl] = useState(''); 
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
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
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setVideoUrl(data.url);
    } catch (err) {
      setError('Video upload failed. Max size 10MB.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return setError('Please upload at least 1 image');
    
    const mainPrice = parseFloat(form.price);
    const discount = parseFloat(form.discountPrice);

    if (form.discountPrice && discount >= mainPrice) {
      return setError('Discount price must be lower than the main price');
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: mainPrice,
          discountPrice: form.discountPrice ? discount : 0,
          deliveryFee: form.deliveryFee ? parseFloat(form.deliveryFee) : 0,
          stock: parseInt(form.stock) || 0,
          images: images,
          videoUrl: videoUrl,
          sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
          colors: form.colors.split(',').map(c => c.trim()).filter(Boolean),
          isFeatured: form.isFeatured,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create product');
      router.push('/admin/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '80px', maxWidth: '900px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/admin/products" className="btn btn-sm btn-ghost" style={{ paddingLeft: 0 }}>
          <i className="fas fa-arrow-left"></i> Back to Products
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '16px' }}>Upload New Product</h1>
      </div>

      {error && <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>{error}</div>}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '32px' }}>
        
        {/* Images */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Product Images (Max 5) *</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {images.map((img, i) => (
              <div key={i} style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: 0, right: 0, background: 'var(--danger)', color: '#fff', border: 'none', width: '20px', height: '20px', cursor: 'pointer' }}>×</button>
              </div>
            ))}
            {images.length < 5 && (
              <button type="button" onClick={() => fileInputRef.current?.click()} style={{ width: '60px', height: '60px', borderRadius: '8px', border: '2px dashed var(--border)', background: 'var(--bg)', cursor: 'pointer' }}>
                <i className="fas fa-plus"></i>
              </button>
            )}
          </div>
          <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
          {uploading && <p style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Uploading...</p>}
        </div>

        {/* Title & Brand */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Product Title *</label>
            <input name="title" className="input" value={form.title} onChange={handleChange} required />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Brand</label>
            <input name="brand" className="input" value={form.brand} onChange={handleChange} />
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Description</label>
          <textarea name="description" className="input" rows="3" value={form.description} onChange={handleChange} />
        </div>

        {/* Sizes & Colors */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Sizes (Optional)</label>
            <input name="sizes" className="input" value={form.sizes} onChange={handleChange} placeholder="e.g., S, M, L" />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Colors (Optional)</label>
            <input name="colors" className="input" value={form.colors} onChange={handleChange} placeholder="e.g., Red, Blue" />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px', marginBottom: '32px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Main Price (₦) *</label>
            <input name="price" type="number" className="input" value={form.price} onChange={handleChange} required />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Discount (₦)</label>
            <input name="discountPrice" type="number" className="input" value={form.discountPrice} onChange={handleChange} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Delivery Fee (₦)</label>
            <input name="deliveryFee" type="number" className="input" value={form.deliveryFee} onChange={handleChange} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Stock *</label>
            <input name="stock" type="number" className="input" value={form.stock} onChange={handleChange} required />
          </div>
        </div>

        {/* Category */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Category *</label>
          <select name="category" className="input" value={form.category} onChange={handleChange}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
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

        <button type="submit" className="btn-primary" disabled={loading || uploading} style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>
          {loading ? 'Publishing...' : 'Publish Product'}
        </button>
      </form>
    </div>
  );
}