'use client';

const TESTIMONIALS = [
  { name: 'Aisha M.', location: 'Maiduguri', quote: 'The installment plan is a lifesaver. Got my new phone in minutes!', stars: 5 },
  { name: 'Ibrahim S.', location: 'Borno', quote: 'Fast delivery and genuine products. Highly recommend Omegally.', stars: 5 },
  { name: 'Fatima A.', location: 'Maiduguri', quote: 'Customer service is top-notch. They responded on WhatsApp instantly.', stars: 5 },
  { name: 'Yusuf K.', location: 'Maiduguri', quote: 'I pay small small and still get my items same day. Amazing.', stars: 5 },
  { name: 'Hauwa B.', location: 'Borno', quote: 'Was skeptical at first but the quality exceeded my expectations.', stars: 5 },
];

export default function Testimonials() {
  return (
    <section className="testimonials-section" style={{ overflow: 'hidden' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div className="testimonials-header" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px' }}>
          <span className="section-eyebrow">Real Customers</span>
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle" style={{ margin: '12px auto 0' }}>
            Thousands of happy shoppers across Maiduguri and beyond.
          </p>
        </div>
      </div>

      <div className="marquee-container">
        <div className="marquee-track">
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <div
              key={i}
              style={{
                minWidth: '360px',
                maxWidth: '360px',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', gap: '3px', color: 'var(--warning)', fontSize: '0.9rem' }}>
                {[...Array(t.stars)].map((_, j) => <i key={j} className="fas fa-star"></i>)}
              </div>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, fontStyle: 'italic', color: 'var(--text)', flex: 1, margin: 0 }}>
                "{t.quote}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #06B6D4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          overflow: hidden;
          width: 100%;
          padding: 20px 0;
          position: relative;
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
        .marquee-track {
          display: flex;
          gap: 24px;
          width: max-content;
          animation: scrollMarquee 40s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes scrollMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (max-width: 768px) {
          .marquee-track > div { min-width: 280px !important; max-width: 280px !important; }
        }
      `}</style>
    </section>
  );
}