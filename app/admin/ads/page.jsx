'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

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

export default function AdminAdsPage() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '', linkUrl: '/products' });
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  const fetchAds = async () => {
    try {
      const res = await fetch('/api/ads');
      const data = await res.json();
      setAds(data.ads || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleFileUpload = async (file) => {
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
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setImageUrl(data.url);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl) return alert('Please upload an ad image');
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, imageUrl }),
      });

      if (!res.ok) throw new Error('Failed to create ad');
      
      setForm({ title: '', description: '', linkUrl: '/products' });
      setImageUrl('');
      fetchAds(); // refresh list
    } catch (err) {
      alert(err.message);
    }
  };

  // Optional: Add a delete handler if your API supports it
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/ads/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchAds();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '80px', background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>Manage Ads</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Upload promotional banners that appear on the homepage.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }} className="admin-ads-grid">
          
          {/* Upload Form */}
          <form onSubmit={handleSubmit} style={{ background: 'var(--bg-elevated)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-bullhorn" style={{ color: 'var(--primary)' }}></i> Upload New Ad
            </h3>
            
            {/* Image Upload */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Ad Image <span style={{ color: 'var(--danger)' }}>*</span></label>
              {!imageUrl ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-sm)', padding: '40px 20px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg)', transition: 'all 0.2s' }}
                >
                  {uploading ? (
                    <><i className="fas fa-spinner fa-spin" style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '8px' }}></i><p style={{ fontWeight: 600 }}>Uploading...</p></>
                  ) : (
                    <><i className="fas fa-cloud-upload-alt" style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '8px' }}></i><p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Click to upload banner</p></>
                  )}
                </div>
              ) : (
                <div style={{ position: 'relative', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <img src={imageUrl} alt="Ad Preview" style={{ width: '100%', display: 'block', maxHeight: '200px', objectFit: 'cover' }} />
                  <button type="button" onClick={() => setImageUrl('')} style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files?.[0])} style={{ display: 'none' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Ad Title <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Summer Sale" style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border)'} />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Subtitle (Optional)</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. Up to 50% off" style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border)'} />
            </div>

            <button type="submit" className="btn-primary" disabled={uploading} style={{ width: '100%', justifyContent: 'center', padding: '14px', opacity: uploading ? 0.7 : 1 }}>
              <i className="fas fa-paper-plane"></i> Publish Ad
            </button>
          </form>

          {/* Existing Ads List */}
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-list" style={{ color: 'var(--primary)' }}></i> Active Ads ({ads.length})
            </h3>
            
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}><i className="fas fa-spinner fa-spin"></i> Loading...</div>
            ) : ads.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
                <i className="fas fa-image" style={{ fontSize: '2rem', color: 'var(--text-tertiary)', marginBottom: '12px' }}></i>
                <p style={{ color: 'var(--text-secondary)' }}>No active ads. Upload one to get started.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {ads.map(ad => (
                  <div key={ad._id} style={{ display: 'flex', gap: '16px', padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', alignItems: 'center' }}>
                    <img src={ad.imageUrl} alt={ad.title} style={{ width: '120px', height: '70px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>{ad.title}</h4>
                      {ad.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ad.description}</p>}
                      <span style={{ display: 'inline-block', background: 'rgba(16,185,129,0.1)', color: 'var(--success)', padding: '2px 8px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700, marginTop: '6px' }}>Active</span>
                    </div>

                    {/* Optional Delete Button */}
                    <button onClick={() => handleDelete(ad._id)} style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: 'none', width: '40px', height: '40px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }} title="Delete Ad">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Responsiveness */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .admin-ads-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}