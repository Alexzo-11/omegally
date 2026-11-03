'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ReceiptPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(res => res.json())
      .then(data => setOrder(data))
      .catch(console.error);
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '16px' }}></i>
          <p>Loading Receipt...</p>
        </div>
      </div>
    );
  }

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px' }}>
      
      {/* Print-specific styling to hide background elements when printing */}
      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          main { padding: 0 !important; background: white !important; }
          .receipt-card { box-shadow: none !important; border: 1px solid #ddd !important; }
        }
      `}</style>

      {/* Back Button (Hidden on print) */}
      <div className="no-print" style={{ width: '100%', maxWidth: '420px', marginBottom: '20px' }}>
        <button onClick={() => router.back()} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
      </div>

      {/* Receipt Card */}
      <div className="receipt-card" style={{ background: 'var(--bg-elevated)', width: '100%', maxWidth: '420px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', overflow: 'hidden', border: '1px solid var(--border)' }}>
        
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', padding: '40px 24px', textAlign: 'center', color: '#fff', position: 'relative' }}>
          {/* Decorative Circle */}
          <div style={{ position: 'absolute', top: '-30px', left: '-30px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
          
          <img src="/logo.png" alt="Omegally" style={{ height: '48px', objectFit: 'contain', marginBottom: '20px', filter: 'brightness(0) invert(1)' }} />
          
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', marginBottom: '12px' }}>
            <i className="fas fa-check" style={{ fontSize: '1.5rem' }}></i>
          </div>
          
          <h1 style={{ fontSize: '1rem', fontWeight: 600, opacity: 0.9, marginBottom: '4px' }}>Payment Successful</h1>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>₦{(order.amountPaid || 0).toLocaleString()}</h2>
        </div>

        {/* Details */}
        <div style={{ padding: '32px 28px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="far fa-calendar-alt"></i> Date</span>
              <strong style={{ fontSize: '0.9rem' }}>{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fas fa-hashtag"></i> Reference</span>
              <strong style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>#{order._id.slice(-8).toUpperCase()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fas fa-info-circle"></i> Status</span>
              <span style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                {order.paymentStatus === 'paid' ? 'Confirmed' : 'Pending Review'}
              </span>
            </div>
          </div>
          
          {/* Dashed Separator */}
          <div style={{ borderTop: '2px dashed var(--border)', margin: '0 -28px 24px', position: 'relative' }}>
            {/* Cutouts to make it look like a ticket */}
            <div style={{ position: 'absolute', top: '-12px', left: '-12px', width: '24px', height: '24px', background: 'var(--bg)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', top: '-12px', right: '-12px', width: '24px', height: '24px', background: 'var(--bg)', borderRadius: '50%' }} />
          </div>

          <h4 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Items Purchased</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem' }}>
                <div style={{ paddingRight: '16px' }}>
                  <div style={{ fontWeight: 600 }}>{item.title || item.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Qty: {item.qty || item.quantity} × ₦{item.price.toLocaleString()}</div>
                </div>
                <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>₦{(item.price * (item.qty || item.quantity)).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <span>Subtotal</span>
            <span>₦{(order.totalAmount - (order.deliveryFee || 0)).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <span>Delivery Fee</span>
            <span>₦{(order.deliveryFee || 0).toLocaleString()}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '20px', borderTop: '2px solid var(--border)', fontWeight: 900, fontSize: '1.2rem' }}>
            <span>Total Paid</span>
            <span>₦{(order.amountPaid || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: 'var(--bg)', padding: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border)' }}>
          Thank you for shopping with Omegally. <br/> For support, contact <strong style={{ color: 'var(--text)' }}>support@omegally.com</strong>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="no-print" style={{ width: '100%', maxWidth: '420px', display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button onClick={handlePrint} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '14px', borderRadius: '100px' }}>
          <i className="fas fa-download"></i> Save PDF
        </button>
        <Link href="/products" style={{ flex: 1, padding: '14px', borderRadius: '100px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}