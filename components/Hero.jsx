'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: 'Shop Smart. Pay Your Way.',
      subtitle: 'Browse our curated catalog and pay instantly or in weekly installments — up to 2 weeks, zero interest.',
    },
    {
      title: 'Premium Products, Zero Hassle.',
      subtitle: 'No more scrolling through WhatsApp groups. Everything you need, all in one place.',
    },
    {
      title: 'Secure Payments Every Time.',
      subtitle: 'Pay safely with cards, bank transfer, or split into flexible installments.',
    },
  ];

  const images = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
  ];

  useEffect(() => {
    const t = setInterval(() => setSlide((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  const s = slides[slide];

  return (
    <section className="hero">
      <div className="hero-bg-blur"></div>
      <div className="hero-container">
        {/* LEFT */}
        <div className="hero-left">
          <div className="hero-badge">
            <i className="fas fa-rocket"></i> Trusted by shoppers
          </div>
          <h1>
            <span className="gradient-text">{s.title}</span>
          </h1>
          <p>{s.subtitle}</p>
          <div className="hero-actions">
            <Link href="/products" className="btn-primary">
              Shop Now <i className="fas fa-arrow-right"></i>
            </Link>
            <Link href="#about" className="btn-outline">Learn More</Link>
          </div>
          <div className="hero-stats">
            <div><strong>100+</strong><span>Customers</span></div>
            <div className="divider"></div>
            <div><strong>500+</strong><span>Products</span></div>
            <div className="divider"></div>
            <div><strong>4.9★</strong><span>Rating</span></div>
          </div>
          <div className="hero-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`hero-dot ${slide === i ? 'active' : ''}`}
                onClick={() => setSlide(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT — 6 product images + floating tags */}
        <div className="hero-right">
          <div className="hero-image-grid">
            {images.map((src, i) => (
              <div key={i} className={`hero-img hero-img-${i + 1}`}>
                <img src={src} alt={`Product ${i + 1}`} loading="lazy" />
              </div>
            ))}

            <div className="hero-tag tag-secure">
              <i className="fas fa-shield-alt"></i> Secure Payment
            </div>
            <div className="hero-tag tag-installment">
              <i className="fas fa-calendar-alt"></i> Installments
            </div>
            <div className="hero-tag tag-delivery">
              <i className="fas fa-truck"></i> Free Delivery
            </div>
            <div className="hero-tag tag-paystack">
              <i className="fas fa-credit-card"></i> Paystack
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}