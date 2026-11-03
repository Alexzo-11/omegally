import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)', paddingTop: '80px', paddingBottom: '40px', marginTop: 'auto' }}>
      
      {/* Container with max-width to prevent edge-to-edge layout */}
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Main Footer Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '48px', marginBottom: '64px' }}>
          
          {/* Brand Section */}
          <div>
            <Link href="/" style={{ display: 'inline-block', marginBottom: '24px' }}>
              <img 
                src="/logo.png" 
                alt="Omegally Logo" 
                style={{ 
                  height: '45px', 
                  width: 'auto', 
                  objectFit: 'contain' 
                }} 
                className="footer-logo"
              />
            </Link>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '320px', marginBottom: '24px' }}>
              Shop Smarter, Live Better. The smartest way to buy premium products online with flexible installment plans and fast delivery.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--border)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--border)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--border)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                <i className="fab fa-facebook"></i>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '24px', color: 'var(--text)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Shop</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <li><Link href="/products" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.2s' }}>All Products</Link></li>
              <li><Link href="/about" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.2s' }}>About Us</Link></li>
              <li><Link href="/contact" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.2s' }}>Contact</Link></li>
            </ul>
          </div>

          {/* Policies */}
<div>
  <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '24px', color: 'var(--text)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Policies</h4>
  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
    {/* Change these hrefs to point to /policies#... */}
    <li><Link href="/policies#terms" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.2s' }}>Terms of Service</Link></li>
    <li><Link href="/policies#privacy" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.2s' }}>Privacy Policy</Link></li>
    <li><Link href="/policies#refund" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.2s' }}>Refund Policy</Link></li>
  </ul>
</div>

          {/* Contact Info */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '24px', color: 'var(--text)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Get in Touch</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <i className="fas fa-map-marker-alt" style={{ color: 'var(--primary)', marginTop: '4px' }}></i>
                <span>Maiduguri, Borno State, Nigeria</span>
              </li>
              <li style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <i className="fab fa-whatsapp" style={{ color: 'var(--primary)', marginTop: '4px' }}></i>
                <span>+234 810 650 9069</span>
              </li>
              <li style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <i className="fas fa-envelope" style={{ color: 'var(--primary)', marginTop: '4px' }}></i>
                <span>support@omegally.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', margin: 0 }}>
            © {new Date().getFullYear()} Omegally. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '24px', color: 'var(--text-tertiary)', fontSize: '0.9rem', alignItems: 'center' }}>
             <span><i className="fas fa-lock" style={{ marginRight: '6px' }}></i> Secure Payments via Paystack</span>
          </div>
        </div>

      </div>
    </footer>
  );
}