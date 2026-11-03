'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Component that uses useSearchParams (must be wrapped in Suspense)
function PaymentSuccessContent() {
  const params = useSearchParams();
  const reference = params.get('reference') || params.get('trxref');

  useEffect(() => {
    if (reference) {
      fetch('/api/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference }),
      }).catch(console.error);
    }
  }, [reference]);

  return (
    <main style={{ paddingTop: 'calc(var(--nav-height) + 80px)', paddingBottom: '100px', minHeight: '80vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
        
        <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '56px 32px', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
          
          {/* Animated Success Icon */}
          <div style={{ position: 'relative', display: 'inline-flex', marginBottom: '32px' }}>
            <div style={{ 
              position: 'absolute', inset: 0, 
              background: 'rgba(16,185,129,0.2)', 
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}></div>
            <div style={{
              width: '96px', height: '96px', borderRadius: '50%',
              background: 'var(--success)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.8rem', position: 'relative', zIndex: 1,
              boxShadow: '0 8px 24px rgba(16,185,129,0.4)'
            }}>
              <i className="fas fa-check"></i>
            </div>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '12px' }}>
            Payment Successful!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '32px', lineHeight: 1.6 }}>
            Your order has been placed successfully. We've received your payment and will process your order shortly.
          </p>

          {reference && (
            <div style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', marginBottom: '32px', fontSize: '0.85rem', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
              <strong style={{ color: 'var(--text)' }}>Reference:</strong> {reference}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link href="/dashboard" className="btn-primary" style={{ justifyContent: 'center', padding: '16px', borderRadius: '100px', textDecoration: 'none' }}>
              <i className="fas fa-tachometer-alt"></i> View My Orders
            </Link>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href="/products" style={{ flex: 1, padding: '14px', borderRadius: '100px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: '0.9rem' }}>
                Continue Shopping
              </Link>
              <Link href="/" style={{ flex: 1, padding: '14px', borderRadius: '100px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: '0.9rem' }}>
                Back Home
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Pulse Animation */}
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          70% { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </main>
  );
}

// Main export wrapped in Suspense (required for useSearchParams)
export default function PaymentSuccessPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <main style={{ paddingTop: 'calc(var(--nav-height) + 80px)', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '16px' }}></i>
            <p>Verifying payment...</p>
          </div>
        </main>
      }>
        <PaymentSuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}