'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import html2canvas from 'html2canvas';

export default function ReceiptPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const receiptRef = useRef(null);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(res => res.json())
      .then(data => setOrder(data))
      .catch(console.error);
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = async () => {
    if (!receiptRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      });
      
      const link = document.createElement('a');
      link.download = `Omegally-Receipt-${order._id.slice(-6).toUpperCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      alert('Failed to download image. Please try again.');
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  if (!order || !order._id) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '16px' }}></i>
          <p>Loading Receipt...</p>
        </div>
      </div>
    );
  }

  const subtotal = order.items.reduce((sum, item) => sum + (item.price * (item.qty || item.quantity)), 0);
  const deliveryFee = order.deliveryFee || 0;
  const totalPaid = order.amountPaid || 0;
  const balanceDue = order.totalAmount - totalPaid;
  const isInstallment = order.paymentMethod === 'installment';

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px' }}>
      
      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          main { padding: 0 !important; background: white !important; }
          .receipt-card { box-shadow: none !important; border: 1px solid #ddd !important; }
        }
      `}</style>

      <div className="no-print" style={{ width: '100%', maxWidth: '460px', marginBottom: '20px' }}>
        <button onClick={() => router.back()} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
      </div>

      <div 
        ref={receiptRef}
        className="receipt-card" 
        style={{ background: '#ffffff', width: '100%', maxWidth: '460px', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15), 0 12px 24px -8px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #e5e7eb', color: '#0f172a' }}
      >
        
        {/* Header with subtle gradient top accent */}
        <div style={{ background: '#0F172A', padding: '44px 24px', textAlign: 'center', color: '#fff', position: 'relative' }}>
          
          {/* Brand accent line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #2563EB, #06B6D4)' }} />

          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: '-30px', left: '-30px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-50px', right: '-30px', width: '140px', height: '140px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
          
          <img src="/logo.png" alt="Omegally" style={{ height: '48px', objectFit: 'contain', marginBottom: '20px', filter: 'brightness(0) invert(1)' }} />
          
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: '50%', marginBottom: '16px' }}>
            <i className="fas fa-check" style={{ fontSize: '1.5rem', color: '#60A5FA' }}></i>
          </div>
          
          <h1 style={{ fontSize: '0.95rem', fontWeight: 600, opacity: 0.85, marginBottom: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>Payment Receipt</h1>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1 }}>₦{totalPaid.toLocaleString()}</h2>
          {isInstallment && balanceDue > 0 && (
            <div style={{ marginTop: '16px', fontSize: '0.85rem', opacity: 0.85, background: 'rgba(255,255,255,0.1)', display: 'inline-block', padding: '6px 16px', borderRadius: '100px' }}>
              Partial Payment ({order.installmentWeeks || 2} week plan)
            </div>
          )}
        </div>

        <div style={{ padding: '32px 28px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}><i className="far fa-calendar-alt"></i> Date</span>
              <strong style={{ fontSize: '0.9rem', fontWeight: 600 }}>{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}><i className="fas fa-hashtag"></i> Reference</span>
              <strong style={{ fontSize: '0.9rem', letterSpacing: '1px', fontWeight: 600 }}>#{order._id.slice(-8).toUpperCase()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}><i className="fas fa-info-circle"></i> Status</span>
              <span style={{ 
                background: order.paymentStatus === 'paid' ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)', 
                color: order.paymentStatus === 'paid' ? '#059669' : '#D97706', 
                padding: '6px 14px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px',
                border: `1px solid ${order.paymentStatus === 'paid' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`
              }}>
                {order.paymentStatus === 'paid' ? 'Successful' : 'Pending Review'}
              </span>
            </div>
            {order.user?.name && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}><i className="fas fa-user"></i> Customer</span>
                <strong style={{ fontSize: '0.9rem', fontWeight: 600 }}>{order.user.name}</strong>
              </div>
            )}
          </div>
          
          <div style={{ borderTop: '2px dashed #e5e7eb', margin: '0 -28px 24px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '-12px', width: '24px', height: '24px', background: '#ffffff', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', top: '-12px', right: '-12px', width: '24px', height: '24px', background: '#ffffff', borderRadius: '50%' }} />
          </div>

          <h4 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.2px' }}>Items Purchased</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '0.95rem' }}>
                <div style={{ paddingRight: '16px' }}>
                  <div style={{ fontWeight: 600, marginBottom: '2px' }}>{item.title || item.name}</div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.4 }}>
                    Qty: {item.qty || item.quantity} × ₦{item.price.toLocaleString()}
                    {item.size && ` · Size: ${item.size}`}
                    {item.color && ` · Color: ${item.color}`}
                  </div>
                </div>
                <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>₦{(item.price * (item.qty || item.quantity)).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 500, color: '#0f172a' }}>₦{subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b' }}>
              <span>Delivery Fee</span>
              <span style={{ fontWeight: 500, color: '#0f172a' }}>₦{deliveryFee.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b' }}>
              <span>Total</span>
              <span style={{ fontWeight: 500, color: '#0f172a' }}>₦{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '24px', borderTop: '2px solid #e5e7eb', fontWeight: 900, fontSize: '1.2rem' }}>
            <span>Total Paid</span>
            <span style={{ color: '#2563EB' }}>₦{totalPaid.toLocaleString()}</span>
          </div>

          {isInstallment && balanceDue > 0 && (
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginTop: '16px', padding: '16px',
              background: 'rgba(245,158,11,0.05)',
              border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: '12px',
              color: '#D97706', fontWeight: 700, fontSize: '0.95rem',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fas fa-exclamation-triangle"></i> Balance Due</span>
              <span style={{ fontSize: '1.1rem' }}>₦{balanceDue.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div style={{ background: '#f8fafc', padding: '24px', textAlign: 'center', fontSize: '0.85rem', color: '#64748b', borderTop: '1px solid #e5e7eb', lineHeight: 1.6 }}>
          Thank you for shopping with Omegally. <br/> For support, contact <strong style={{ color: '#0f172a' }}>omegallyofficial@gmail.com</strong>
        </div>
      </div>

      <div className="no-print" style={{ width: '100%', maxWidth: '460px', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleDownloadImage} disabled={downloading} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '14px', borderRadius: '100px', opacity: downloading ? 0.7 : 1, transition: 'transform 0.2s' }} onMouseOver={(e) => !downloading && (e.currentTarget.style.transform = 'translateY(-2px)')} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            {downloading ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-image"></i> Save Image</>}
          </button>
          <button onClick={handlePrint} style={{ flex: 1, background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text)', padding: '14px', borderRadius: '100px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; }}>
            <i className="fas fa-file-pdf"></i> Save PDF
          </button>
        </div>
        <Link href="/products" style={{ padding: '14px', borderRadius: '100px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; }}>
          <i className="fas fa-arrow-left"></i> Continue Shopping
        </Link>
      </div>
    </main>
  );
}