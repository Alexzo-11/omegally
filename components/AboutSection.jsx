'use client';

import Link from 'next/link';

export default function AboutSection() {
  const values = [
    {
      icon: 'fa-shield-alt',
      title: 'Secure Payments',
      text: 'Every order is protected with Paystack-grade encryption. Your money and data stay safe.',
    },
    {
      icon: 'fa-calendar-alt',
      title: 'Flexible Installments',
      text: 'Split any purchase into 1–3 weekly payments with zero interest. Pay at your own pace.',
    },
    {
      icon: 'fa-truck',
      title: 'Fast Delivery',
      text: 'Products avaliable on ground within Maiduguri is delivered within 3 hours of confirmed payment, straight to your door-step with delivery charges.',
    },
    {
      icon: 'fa-headset',
      title: 'Real Support',
      text: 'Our team is available on WhatsApp and email. No bots — real humans, real help.',
    },
  ];

  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-header">
          <span className="section-eyebrow">ABOUT OMEGALLY</span>
          <h2 className="section-title">
            Shopping the Way It <span className="gradient-text">Should Be</span>
          </h2>
          <p className="section-subtitle">
            We built Omegally to end the chaos of WhatsApp shopping groups. No endless
            scrolling, no missed deals, no lost orders. Just a clean catalog, secure
            payments, and products delivered to your door.
          </p>
        </div>

        {/* Story block */}
        <div className="about-story">
          <div className="about-story-text">
            <h3>Why We Exist</h3>
            <p>
              Millions of shoppers buy through WhatsApp groups every day — but those
              groups have real limits: capped members, buried product posts, screenshot
              scams, and zero accountability when something goes wrong.
            </p>
            <p>
              EcomFlex replaces that chaos with a real storefront. Every product is
              verified, every payment is traceable, and every order is backed by a
              real company you can reach. Our flexible installment plan means you can
              shop without waiting for payday.
            </p>
            <div className="about-stats">
              <div><strong>50K+</strong><span>Orders Fulfilled</span></div>
              <div><strong>1K+</strong><span>Products Listed</span></div>
              <div><strong>4.9★</strong><span>Customer Rating</span></div>
            </div>
          </div>

          <div className="about-story-visual">
            <div className="story-card">
              <i className="fas fa-store"></i>
              <h4>One Store. Everything.</h4>
              <p>Every product you need, in one clean catalog.</p>
            </div>
            <div className="story-card accent">
              <i className="fas fa-wallet"></i>
              <h4>Pay Your Way</h4>
              <p>Instant or installments — you choose.</p>
            </div>
          </div>
        </div>

        {/* Values grid */}
        <div className="about-values">
          {values.map((v, i) => (
            <div key={i} className="about-value-card">
              <div className="about-icon">
                <i className={`fas ${v.icon}`}></i>
              </div>
              <h4>{v.title}</h4>
              <p>{v.text}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="about-cta">
          <h3>Ready to Shop Smarter?</h3>
          <p>Join thousands of customers who left the group chats behind.</p>
          <div className="about-cta-actions">
            <Link href="/products" className="btn-primary">
              Browse Products <i className="fas fa-arrow-right"></i>
            </Link>
            <Link href="/register" className="btn-outline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}