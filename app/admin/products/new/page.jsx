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

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 'var(--radius-sm)',
  border: '1.5px solid var(--border)',
  background: 'var(--bg)',
  color: 'var(--text)',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit'
};

const labelStyle = {
  display: 'block',
  fontWeight: 600,
  marginBottom: '8px',
  fontSize: '0.9rem',
  color: 'var(--text)'
};

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
    isFeatured: false 
  });
  
  const [images, setImages] = useState([]); 
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
    <main style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '80px', background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <Link href="/admin/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '16px', textDecoration: 'none' }}>
            <i className="fas fa-arrow-left"></i> Back to Products
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>Upload New Product</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Fill in the details below to add a new item to your store.</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 500 }}>
            <i className="fas fa-exclamation-circle" style={{ fontSize: '1.2rem' }}></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-elevated)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          
          {/* Images */}
          <div style={{ marginBottom: '32px' }}>
            <label style={labelStyle}>Product Images (Max 5) <span style={{ color: 'var(--danger)' }}>*</span></label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {images.map((img, i) => (
                <div key={i} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                  <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                  <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: 0, right: 0, background: 'var(--danger)', color: '#fff', border: 'none', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: '8px' }}>
                    <i className="fas fa-times" style={{ fontSize: '0.8rem' }}></i>
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button type="button" onClick={() => fileInputRef.current?.click()} style={{ width: '80px', height: '80px', borderRadius: '12px', border: '2px dashed var(--border)', background: 'var(--bg)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--text-secondary)', transition: 'all 0.2s' }}>
                  <i className="fas fa-plus" style={{ fontSize: '1.2rem' }}></i>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Add</span>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            {uploading && <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}><i className="fas fa-spinner fa-spin"></i> Uploading images...</p>}
          </div>

          {/* Title & Brand */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={labelStyle}>Product Title <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input name="title" value={form.title} onChange={handleChange} required style={inputStyle} placeholder="e.g. Wireless Headphones" onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div>
              <label style={labelStyle}>Brand</label>
              <input name="brand" value={form.brand} onChange={handleChange} style={inputStyle} placeholder="e.g. Sony" onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border)'} />
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Description</label>
            <textarea name="description" rows="4" value={form.description} onChange={handleChange} style={{...inputStyle, resize: 'vertical'}} placeholder="Describe the product features, dimensions, etc." onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border)'} />
          </div>

          {/* Sizes & Colors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={labelStyle}>Sizes (Optional)</label>
              <input name="sizes" value={form.sizes} onChange={handleChange} style={inputStyle} placeholder="e.g., S, M, L" onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div>
              <label style={labelStyle}>Colors (Optional)</label>
              <input name="colors" value={form.colors} onChange={handleChange} style={inputStyle} placeholder="e.g., Red, Blue" onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border)'} />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '32px', padding: '24px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <div>
              <label style={labelStyle}>Main Price (₦) <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required style={inputStyle} placeholder="0.00" onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div>
              <label style={labelStyle}>Discount (₦)</label>
              <input name="discountPrice" type="number" value={form.discountPrice} onChange={handleChange} style={inputStyle} placeholder="Optional" onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div>
              <label style={labelStyle}>Delivery Fee (₦)</label>
              <input name="deliveryFee" type="number" value={form.deliveryFee} onChange={handleChange} style={inputStyle} placeholder="e.g. 500" onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div>
              <label style={labelStyle}>Stock <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} required style={inputStyle} placeholder="e.g. 50" onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border)'} />
            </div>
          </div>

          {/* Category */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Category <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select name="category" value={form.category} onChange={handleChange} style={{...inputStyle, cursor: 'pointer'}} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border)'}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Feature Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', marginBottom: '32px' }}>
            <input type="checkbox" id="isFeatured" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} style={{ width: '22px', height: '22px', accentColor: 'var(--primary)', cursor: 'pointer' }} />
            <div>
              <label htmlFor="isFeatured" style={{ fontWeight: 700, cursor: 'pointer', display: 'block', margin: 0 }}>Feature this product</label>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Show this item in the "Handpicked For You" section on the homepage.</span>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading || uploading} style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1.05rem', opacity: (loading || uploading) ? 0.7 : 1, cursor: (loading || uploading) ? 'not-allowed' : 'pointer' }}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Publishing...</> : <><i className="fas fa-check-circle"></i> Publish Product</>}
          </button>
        </form>
      </div>

      {/* Mobile Responsiveness */}
      <style jsx global>{`
        @media (max-width: 768px) {
          form > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}