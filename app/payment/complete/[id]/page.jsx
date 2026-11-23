'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { usePaystackPayment } from 'react-paystack';

export default function CompleteInstallmentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`/api/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setOrder(data))
      .catch(() => router.push('/dashboard'))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return <div style={{ paddingTop: '150px', textAlign: 'center' }}>Loading...</div>;
  if (!order) return null;

  const balanceDue = order.totalAmount - (order.amountPaid || 0);

  // --- PAYSTACK SETUP FOR BALANCE ---
  const config = {
    reference: (new Date()).getTime().toString(),
    email: order.user?.email || 'omegallyofficial@gmail.com',
    amount: balanceDue * 100, // Paystack uses kobo
    publicKey: process.env.PAYSTACK_PUBLIC_KEY,
  };

  const initializePayment = usePaystackPayment(config);

  const handlePaymentSuccess = async (reference) => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      
      // 1. Update order to paid
      await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          paymentStatus: 'paid', 
          amountPaid: order.totalAmount,
          paystackReference: reference.reference
        }),
      });

      // 2. Verify with Paystack
      await fetch('/api/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: reference.reference, orderId: id }),
      });

      alert('Payment successful! Your order is now fully paid.');
      router.push('/dashboard');
    } catch (err) {
      alert('Payment succeeded, but there was an error updating your order. Please contact support.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '80px', minHeight: '80vh', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '40px 32px', boxShadow: 'var(--shadow-md)' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(245,158,11,0.1)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 16px' }}>
                <i className="fas fa-file-invoice-dollar"></i>
              </div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>Complete Installment</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Order #{order._id.slice(-6).toUpperCase()}</p>
            </div>

            <div style={{ background: 'var(--bg)', padding: '24px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Remaining Balance Due</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.02em' }}>₦{balanceDue.toLocaleString()}</div>
            </div>

            <button 
              onClick={() => initializePayment({ onSuccess: handlePaymentSuccess, onClose: () => console.log('closed') })}
              disabled={processing}
              className="btn-primary" 
              style={{ width: '100%', padding: '16px', justifyContent: 'center', fontSize: '1rem', background: '#00C3F7', color: '#000', fontWeight: 700 }}
            >
              {processing ? 'Verifying...' : `Pay ₦${balanceDue.toLocaleString()} with Paystack`}
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <i className="fas fa-lock"></i> Secured by Paystack
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}