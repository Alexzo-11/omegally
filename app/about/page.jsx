import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '100px', paddingBottom: '60px' }}>
        <div className="container">
          {/* Hero Section */}
          <div className="text-center" style={{ marginBottom: '60px' }}>
            <h1 className="section-title">About EcomFlex</h1>
            <p className="section-subtitle" style={{ margin: '12px auto 0', maxWidth: '720px' }}>
              We're on a mission to make shopping flexible, accessible, and delightful for everyone.
            </p>
          </div>

          {/* Mission & Values */}
          <div className="card" style={{ marginBottom: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '16px' }}>
                  <i className="fas fa-bullseye" style={{ color: 'var(--primary)', marginRight: '12px' }}></i>
                  Our Mission
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  To empower shoppers worldwide by breaking down payment barriers. We believe that
                  everyone should be able to afford what they need – without hidden fees, complex
                  processes, or unfair terms. Whether you want to pay instantly or spread the cost
                  over weeks, EcomFlex gives you the freedom to choose.
                </p>
              </div>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '16px' }}>
                  <i className="fas fa-heart" style={{ color: 'var(--danger)', marginRight: '12px' }}></i>
                  Our Values
                </h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <i className="fas fa-check-circle" style={{ color: 'var(--success)', marginRight: '12px' }}></i>
                    <strong>Transparency</strong> – No hidden fees, clear payment schedules.
                  </li>
                  <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <i className="fas fa-check-circle" style={{ color: 'var(--success)', marginRight: '12px' }}></i>
                    <strong>Flexibility</strong> – Choose between instant or weekly installments.
                  </li>
                  <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <i className="fas fa-check-circle" style={{ color: 'var(--success)', marginRight: '12px' }}></i>
                    <strong>Security</strong> – Your data and payments are protected with enterprise-grade encryption.
                  </li>
                  <li style={{ padding: '8px 0' }}>
                    <i className="fas fa-check-circle" style={{ color: 'var(--success)', marginRight: '12px' }}></i>
                    <strong>Inclusivity</strong> – Open to everyone, no matter where you shop.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Features */}
          <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '32px' }}>
            What Makes EcomFlex Special
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '60px' }}>
            <div className="card text-center">
              <div style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '12px' }}>
                <i className="fas fa-link"></i>
              </div>
              <h3 style={{ fontWeight: '700' }}>Universal Product Import</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Paste any product link from Amazon, AliExpress, Temu, Shein, eBay, Walmart, and 100+ other stores.
              </p>
            </div>
            <div className="card text-center">
              <div style={{ fontSize: '3rem', color: 'var(--success)', marginBottom: '12px' }}>
                <i className="fas fa-calendar-alt"></i>
              </div>
              <h3 style={{ fontWeight: '700' }}>Flexible Installments</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Choose 1–6 weekly payments with 0% interest – pay at your own pace.
              </p>
            </div>
            <div className="card text-center">
              <div style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '12px' }}>
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3 style={{ fontWeight: '700' }}>Premium Dashboard</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Track your orders, installments, wishlist, and wallet – all in one beautiful interface.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div style={{ marginBottom: '60px' }}>
            <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '32px', textAlign: 'center' }}>
              Meet the Team
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {[
                { name: 'Alex Johnson', role: 'Founder & CEO', icon: 'fa-user-tie' },
                { name: 'Maria Chen', role: 'CTO', icon: 'fa-user-graduate' },
                { name: 'James Okonkwo', role: 'Head of Design', icon: 'fa-paint-brush' },
                { name: 'Sarah Williams', role: 'Product Manager', icon: 'fa-user-circle' },
              ].map((member, i) => (
                <div key={i} className="card text-center" style={{ padding: '24px 16px' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    fontSize: '2rem',
                  }}>
                    <i className={`fas ${member.icon}`}></i>
                  </div>
                  <h4 style={{ fontWeight: '700', marginBottom: '4px' }}>{member.name}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="card" style={{ background: 'var(--primary)', color: '#fff', textAlign: 'center', padding: '48px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '12px' }}>
              Ready to Shop Your Way?
            </h2>
            <p style={{ opacity: 0.9, maxWidth: '560px', margin: '0 auto 24px' }}>
              Join thousands of shoppers who trust EcomFlex for flexible, secure, and modern shopping.
            </p>
            <a href="/" className="btn" style={{ background: '#fff', color: 'var(--primary)' }}>
              Start Exploring <i className="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}