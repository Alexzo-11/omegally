'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const BANK_DETAILS = {
  bankName: 'GTBank',
  accountName: 'Omegally Ltd',
  accountNumber: '0123456789',
};

export default function CompleteInstallmentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`/api/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setOrder(data))
      .catch(() => router.push('/dashboard'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const copyAccount = () => {
    navigator.clipboard.writeText(BANK_DETAILS.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert('File too large. Max 5MB.');
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setReceipt(file);
      setReceiptPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!receipt) return alert('Please upload your receipt');
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          paymentStatus: 'pending_review', 
          amountPaid: order.totalAmount,
          receiptImage: receiptPreview 
        }),
      });
      
      alert('Payment submitted! We will verify it shortly.');
      router.push('/dashboard');
    } catch (err) {
      alert('Error submitting payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: 'calc(var(--nav-height) + 80px)', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '16px' }}></i>
            <p>Loading order details...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  if (!order) return null;

  const balanceDue = order.totalAmount - (order.amountPaid || 0);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '80px', minHeight: '80vh', background: 'var(--bg)' }}>
        
        {/* Centered Wrapper */}
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Back Link */}
          <div style={{ marginBottom: '24px' }}>
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none' }}>
              <i className="fas fa-arrow-left"></i> Back to Dashboard
            </Link>
          </div>

          <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '40px 32px', boxShadow: 'var(--shadow-md)' }}>
            
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(245,158,11,0.1)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 16px' }}>
                <i className="fas fa-file-invoice-dollar"></i>
              </div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>Complete Installment</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Order #{order._id.slice(-6).toUpperCase()}</p>
            </div>

            {/* Balance Due Box */}
            <div style={{ background: 'var(--bg)', padding: '24px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Remaining Balance Due</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.02em' }}>₦{balanceDue.toLocaleString()}</div>
            </div>

            {/* Bank Details */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '12px' }}>Bank Transfer Details</h3>
              <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '20px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Bank</span>
                  <strong>{BANK_DETAILS.bankName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Account Name</span>
                  <strong>{BANK_DETAILS.accountName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Account No.</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <strong style={{ letterSpacing: '1px' }}>{BANK_DETAILS.accountNumber}</strong>
                    <button onClick={copyAccount} style={{ padding: '4px 10px', background: 'var(--border)', border: 'none', borderRadius: '6px', color: 'var(--text)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                      <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i> {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Receipt */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '12px' }}>Upload Payment Proof</h3>
              
              {!receiptPreview ? (
                <label htmlFor="receipt" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border)', borderRadius: 'var(--radius-sm)', padding: '40px 20px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg)', transition: 'all 0.2s' }}>
                  <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '12px' }}></i>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>Click to upload receipt</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>JPG, PNG · Max 5MB</p>
                  <input id="receipt" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>
              ) : (
                <div style={{ textAlign: 'center', background: 'var(--bg)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <img src={receiptPreview} alt="Receipt Preview" style={{ maxWidth: '100%', maxHeight: '220px', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--border)' }} />
                  <button onClick={() => { setReceipt(null); setReceiptPreview(null); }} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', cursor: 'pointer', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-redo"></i> Change Image
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button onClick={handleSubmit} disabled={submitting || !receipt} className="btn-primary" style={{ width: '100%', padding: '16px', justifyContent: 'center', fontSize: '1rem', opacity: (submitting || !receipt) ? 0.6 : 1, cursor: (submitting || !receipt) ? 'not-allowed' : 'pointer' }}>
              {submitting ? (
                <><i className="fas fa-spinner fa-spin"></i> Submitting Payment...</>
              ) : (
                <><i className="fas fa-check-circle"></i> Submit Payment</>
              )}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '16px' }}>
              Your order will be processed once our team verifies the payment.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}