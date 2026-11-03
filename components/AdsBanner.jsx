'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdsBanner() {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch('/api/ads').then(res => res.json()).then(data => setBanners(data.ads || []));
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => setCurrent(prev => (prev + 1) % banners.length), 5000);
    return () => clearInterval(interval);
  }, [banners]);

  if (banners.length === 0) return null;
  const ad = banners[current];

  return (
    <section style={{ padding: '40px 0' }}>
      {/* Container keeps it restricted to 1280px max-width */}
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <Link href={ad.linkUrl || '/products'} style={{ display: 'block', position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
          <img src={ad.imageUrl} alt={ad.title} style={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.8), transparent 60%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px' }}>
            <h2 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px', maxWidth: '500px' }}>{ad.title}</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', maxWidth: '400px' }}>{ad.description}</p>
          </div>
        </Link>
      </div>
    </section>
  );
}