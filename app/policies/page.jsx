'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PoliciesPage() {
  const policies = [
    { id: 'terms', label: 'Terms of Service' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'refund', label: 'Refund & Return Policy' },
    { id: 'installments', label: 'Installment Terms' },
    { id: 'delivery', label: 'Delivery & Shipping' },
  ];

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '80px', minHeight: '80vh', background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '16px' }}>
              Legal & Policies
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
              Please read our policies carefully. By using Omegally, you agree to these terms.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '40px', alignItems: 'start' }}>
            
            {/* Sidebar Navigation */}
            <aside style={{ position: 'sticky', top: '100px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '24px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: '16px' }}>
                Jump to Section
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {policies.map((policy) => (
                  <li key={policy.id}>
                    <a href={`#${policy.id}`} style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textDecoration: 'none', display: 'block', padding: '8px 12px', borderRadius: '8px', transition: 'all 0.2s' }} onMouseEnter={(e) => e.target.style.background = 'var(--border)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                      {policy.label}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Policy Content */}
            <div className="policy-content" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Section 1: Terms */}
              <section id="terms" style={{ background: 'var(--bg-elevated)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px', color: 'var(--primary)' }}>1. Terms of Service</h2>
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                  <p style={{ marginBottom: '16px' }}>Welcome to Omegally. By accessing or using our website, you agree to be bound by these Terms of Service.</p>
                  <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                    <li style={{ marginBottom: '8px' }}><strong>Eligibility:</strong> You must be at least 16 years old to use our services.</li>
                    <li style={{ marginBottom: '8px' }}><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials.</li>
                    <li style={{ marginBottom: '8px' }}><strong>Accuracy:</strong> You agree to provide accurate, current, and complete information during registration and checkout.</li>
                  </ul>
                  <p>We reserve the right to suspend or terminate your account if any information provided proves to be inaccurate or violates our policies.</p>
                </div>
              </section>

              {/* Section 2: Privacy */}
              <section id="privacy" style={{ background: 'var(--bg-elevated)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px', color: 'var(--primary)' }}>2. Privacy Policy</h2>
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                  <p style={{ marginBottom: '16px' }}>Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.</p>
                  <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                    <li style={{ marginBottom: '8px' }}><strong>What We Collect:</strong> We collect your name, email, phone number, and delivery address when you create an account or place an order.</li>
                    <li style={{ marginBottom: '8px' }}><strong>How We Use It:</strong> Your data is used to process orders, deliver products, and communicate updates regarding your purchases.</li>
                    <li style={{ marginBottom: '8px' }}><strong>Payment Data:</strong> We do not store your card or bank details. All payments are processed securely via Paystack or direct bank transfer.</li>
                  </ul>
                  <p>We never sell your personal information to third parties.</p>
                </div>
              </section>

              {/* Section 3: Refunds */}
              <section id="refund" style={{ background: 'var(--bg-elevated)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px', color: 'var(--primary)' }}>3. Refund & Return Policy</h2>
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                  <p style={{ marginBottom: '16px' }}>We want you to be completely satisfied with your purchase. If you are not happy, here is how we handle returns.</p>
                  <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                    <li style={{ marginBottom: '8px' }}><strong>Return Window:</strong> You have 3 days from the date of delivery to request a return.</li>
                    <li style={{ marginBottom: '8px' }}><strong>Condition:</strong> Items must be unused, in their original packaging, and with all tags attached.</li>
                    <li style={{ marginBottom: '8px' }}><strong>Refund Process:</strong> Once your return is received and inspected, we will notify you. Approved refunds will be processed to your original payment method or store wallet within 5–7 business days.</li>
                  </ul>
                  <p><em>Note: Certain items (e.g., personal care, underwear, and clearance items) are final sale and cannot be returned.</em></p>
                </div>
              </section>

              {/* Section 4: Installments */}
<section id="installments" style={{ background: 'var(--bg-elevated)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px', color: 'var(--primary)' }}>4. Installment Terms</h2>
  <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
    <p style={{ marginBottom: '16px' }}>Omegally offers a "Pay 50% Now, 50% Later" installment plan for your convenience.</p>
    <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
      <li style={{ marginBottom: '8px' }}><strong>Payment Structure:</strong> You pay 50% of the total order value (including delivery fees) at checkout to initiate the order.</li>
      <li style={{ marginBottom: '8px' }}><strong>Commission:</strong> A <strong>4% commission fee</strong> is applied to the total order price for all installment purchases. This fee is included in the total balance.</li>
      <li style={{ marginBottom: '8px' }}><strong>Balance Due:</strong> The remaining 50% must be paid within 14 days (2 weeks) of the initial payment.</li>
      <li style={{ marginBottom: '8px' }}><strong>Late Payments & Refunds:</strong> If the customer is unable to pay the remaining balance within 3 weeks, the order will be cancelled. <strong>A 4% deduction will be taken from the initial 50% payment</strong>, and the remaining balance will be refunded to the customer.</li>
    </ul>
  </div>
</section>

              {/* Section 5: Delivery */}
              <section id="delivery" style={{ background: 'var(--bg-elevated)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px', color: 'var(--primary)' }}>5. Delivery & Shipping</h2>
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                  <p style={{ marginBottom: '16px' }}>We currently deliver across specific regions in Nigeria with varying delivery timelines.</p>
                  <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                    <li style={{ marginBottom: '8px' }}><strong>Maiduguri:</strong> Delivery of goods available within Maiduguri is free and typically arrives within 48 hours of confirmed payment. Except if goods is coming outside the sate delivery fee applies</li>
                    <li style={{ marginBottom: '8px' }}><strong>Abuja & Damaturu:</strong> Delivery takes up to 1 month and attracts a flat delivery fee ad indicated.</li>
                  </ul>
                  <p>Delivery timelines may be affected by public holidays or unforeseen logistical challenges.</p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}