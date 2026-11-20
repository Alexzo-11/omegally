'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '80px', minHeight: '80vh', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Contact Us</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>We're here to help. Reach out via any of the channels below.</p>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <a href="https://wa.me/2348106509069" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', background: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text)' }}>
              <i className="fab fa-whatsapp" style={{ fontSize: '1.5rem', color: '#25D366' }}></i>
              <div>
                <div style={{ fontWeight: 700 }}>WhatsApp</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>+234 810 650 9069</div>
              </div>
            </a>
            <a href="mailto:support@omegally.store" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', background: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text)' }}>
              <i className="fas fa-envelope" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}></i>
              <div>
                <div style={{ fontWeight: 700 }}>Email</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>omegallyofficial@gmail.com</div>
              </div>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}