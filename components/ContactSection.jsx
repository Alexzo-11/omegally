'use client';

import { useState } from 'react';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production you can POST to /api/contact or open WhatsApp
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section className="contact-section" id="contact">
      <div className="section-container">
        <div className="contact-grid">
          {/* Left — info */}
          <div className="contact-info">
            <span className="section-eyebrow">CONTACT US</span>
            <h2 className="section-title">Talk to a Real Human</h2>
            <p className="section-subtitle">
              Questions about an order, a payment, or a delivery? We reply fast.
            </p>

            <div className="contact-items">
              <a href="https://wa.me/2348012345678" target="_blank" rel="noopener noreferrer" className="contact-item">
                <div className="contact-item-icon"><i className="fab fa-whatsapp"></i></div>
                <div>
                  <strong>WhatsApp</strong>
                  <span>+234 801 234 5678</span>
                </div>
              </a>

              <a href="mailto:support@ecomflex.com" className="contact-item">
                <div className="contact-item-icon"><i className="fas fa-envelope"></i></div>
                <div>
                  <strong>Email</strong>
                  <span>support@ecomflex.com</span>
                </div>
              </a>

              <div className="contact-item">
                <div className="contact-item-icon"><i className="fas fa-map-marker-alt"></i></div>
                <div>
                  <strong>Location</strong>
                  <span>Maiduguri, Borno State, Nigeria</span>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon"><i className="fas fa-clock"></i></div>
                <div>
                  <strong>Support Hours</strong>
                  <span>Mon – Sat, 9am – 7pm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <form onSubmit={handleSubmit} className="contact-form">
            <h3>Send a Message</h3>

            <div className="contact-field">
              <label>Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Your name"
              />
            </div>

            <div className="contact-field">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="you@example.com"
              />
            </div>

            <div className="contact-field">
              <label>Message</label>
              <textarea
                rows="4"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                placeholder="How can we help?"
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              <i className="fas fa-paper-plane"></i> Send Message
            </button>

            {sent && (
              <div className="contact-success">
                <i className="fas fa-check-circle"></i> Message sent! We'll reply shortly.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}