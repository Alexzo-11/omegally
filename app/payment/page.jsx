'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const BANK_DETAILS = {
  bankName: 'GTBank',
  accountName: 'Omegally Ltd',
  accountNumber: '0123456789',
};

export default function PaymentPage() {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [method, setMethod] = useState('instant');
  const [receipt, setReceipt] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (cart.length === 0 && step < 3) router.push('/products');
    if (user?.role === 'admin') router.push('/admin/orders');
  }, [cart, step, router, user]);

  if (cart.length === 0 && step < 3) return null;

  // Base Calculations
  const cartSubtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = cart.reduce((s, i) => s + (i.deliveryFee || 0) * i.qty, 0);
  const baseTotal = cartSubtotal + deliveryFee;

  // Installment Logic: 4% commission added to the base total
  const installmentCommission = method === 'installment' ? baseTotal * 0.04 : 0;
  const finalTotal = baseTotal + installmentCommission;
  
  // 50% Upfront for installments, 100% for instant
  const amountToPay = method === 'installment' ? finalTotal / 2 : finalTotal;
  const remainingBalance = finalTotal - amountToPay;

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

  const handleSubmitOrder = async () => {
    if (!receipt) return alert('Please upload your payment receipt.');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: cart.map((i) => ({ 
            productId: i.id, 
            title: i.title, 
            price: i.price, 
            qty: i.qty, 
            image: i.image,
            size: i.size,
            color: i.color 
          })),
          totalAmount: finalTotal,
          amountPaid: amountToPay,
          paymentMethod: method,
          weeks: method === 'installment' ? 2 : 1,
          receiptDataUrl: receiptPreview,
          bankDetails: BANK_DETAILS,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit order');

      setOrderData(data.order);
      setStep(3);
      clearCart();
    } catch (err) {
      alert('Failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '100px', minHeight: '80vh', background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '40px' }}>
            {[1, 2, 3].map((n) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: step >= n ? 'var(--primary)' : 'var(--border)',
                  color: step >= n ? '#fff' : 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.85rem',
                }}>{n}</div>
                <span style={{ fontSize: '0.85rem', fontWeight: step >= n ? '600' : '400', color: step >= n ? 'var(--text)' : 'var(--text-secondary)' }}>
                  {n === 1 ? 'Choose Plan' : n === 2 ? 'Pay & Upload' : 'Confirmed'}
                </span>
              </div>
            ))}
          </div>

          {step === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px', alignItems: 'start' }} className="payment-grid">
              
              <div>
                <div className="card" style={{ marginBottom: '24px', padding: '32px' }}>
                  <h3 style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: '20px' }}>Select Payment Method</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div 
                      onClick={() => setMethod('instant')}
                      style={{ padding: '20px', borderRadius: '12px', border: method === 'instant' ? '2px solid var(--primary)' : '2px solid var(--border)', cursor: 'pointer', background: method === 'instant' ? 'rgba(37,99,235,0.05)' : 'transparent', transition: 'all 0.2s' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid', borderColor: method === 'instant' ? 'var(--primary)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {method === 'instant' && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }}></div>}
                        </div>
                        <strong style={{ fontSize: '1.1rem' }}>Pay Full Amount</strong>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginLeft: '36px' }}>Pay 100% today to complete your order instantly.</p>
                    </div>

                    <div 
                      onClick={() => setMethod('installment')}
                      style={{ padding: '20px', borderRadius: '12px', border: method === 'installment' ? '2px solid var(--primary)' : '2px solid var(--border)', cursor: 'pointer', background: method === 'installment' ? 'rgba(37,99,235,0.05)' : 'transparent', transition: 'all 0.2s' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid', borderColor: method === 'installment' ? 'var(--primary)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {method === 'installment' && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }}></div>}
                        </div>
                        <strong style={{ fontSize: '1.1rem' }}>Pay 50% Now, 50% Later</strong>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginLeft: '36px' }}>Pay half today, and the remaining balance within 2 weeks. <br/><strong style={{color: 'var(--warning)'}}>*A 4% commission applies.</strong></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: '32px', position: 'sticky', top: '100px' }}>
                <h3 style={{ fontWeight: '700', marginBottom: '20px' }}>Order Summary</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                  <span>₦{cartSubtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Delivery</span>
                  <span>₦{deliveryFee.toLocaleString()}</span>
                </div>
                {method === 'installment' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '16px', color: 'var(--warning)', fontWeight: 600 }}>
                    <span>Installment Fee (4%)</span>
                    <span>+₦{installmentCommission.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                )}
                
                <div style={{ height: '1px', background: 'var(--border)', margin: '16px 0' }}></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', marginBottom: '8px' }}>
                  <span>Total</span>
                  <span>₦{finalTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '24px' }}>
                  <span>Due Today</span>
                  <span>₦{amountToPay.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>

                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }} onClick={() => setStep(2)}>
                  Continue to Payment <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px', alignItems: 'start' }} className="payment-grid">
              
              <div>
                <div className="card" style={{ marginBottom: '24px', padding: '32px' }}>
                  <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>1. Bank Transfer</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                    Please transfer <strong>₦{amountToPay.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong> to the account below.
                  </p>
                  
                  <div style={{ background: 'var(--border-light)', borderRadius: '12px', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Bank Name</span>
                      <strong>{BANK_DETAILS.bankName}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Account Name</span>
                      <strong>{BANK_DETAILS.accountName}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Account No.</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <strong style={{ fontSize: '1.2rem', letterSpacing: '2px' }}>{BANK_DETAILS.accountNumber}</strong>
                        <button onClick={copyAccount} className="btn btn-sm btn-secondary">
                          <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i> {copied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ padding: '32px' }}>
                  <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>2. Upload Receipt</h3>
                  {!receiptPreview ? (
                    <label htmlFor="receipt-input" style={{ display: 'block', border: '2px dashed var(--border)', borderRadius: '12px', padding: '40px 20px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg)' }}>
                      <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '12px' }}></i>
                      <p style={{ fontWeight: '600', marginBottom: '4px' }}>Click to upload receipt</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>JPG, PNG · Max 5MB</p>
                      <input id="receipt-input" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    </label>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <img src={receiptPreview} alt="Receipt" style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--border)' }} />
                      <button className="btn btn-sm btn-secondary" onClick={() => { setReceipt(null); setReceiptPreview(null); }}>
                        <i className="fas fa-redo"></i> Change Image
                      </button>
                    </div>
                  )}
                  {/* Terms Checkbox */}
<div style={{ 
  display: 'flex', alignItems: 'flex-start', gap: '12px', 
  padding: '16px', background: 'var(--bg)', border: '1px solid var(--border)',
  borderRadius: '12px', marginTop: '24px' 
}}>
  <input 
    type="checkbox" 
    id="agreeTerms"
    checked={agreedToTerms}
    onChange={(e) => setAgreedToTerms(e.target.checked)}
    style={{ 
      width: '20px', height: '20px', marginTop: '2px', 
      cursor: 'pointer', accentColor: 'var(--primary)', flexShrink: 0 
    }}
  />
  <label htmlFor="agreeTerms" style={{ fontSize: '0.88rem', cursor: 'pointer', lineHeight: 1.6 }}>
    I agree to the{' '}
    <a href="/policies#terms" target="_blank" style={{ color: 'var(--primary)', fontWeight: 600 }}>Terms of Service</a>,{' '}
    <a href="/policies#refund" target="_blank" style={{ color: 'var(--primary)', fontWeight: 600 }}>Refund Policy</a>, and{' '}
    <a href="/policies#installments" target="_blank" style={{ color: 'var(--primary)', fontWeight: 600 }}>Installment Terms</a>{' '}
    (including the 4% installment commission and 3-week payment deadline).
  </label>
</div>

{/* Update the Complete Order button to require the checkbox */}
<button 
  className="btn-primary" 
  style={{ width: '100%', marginTop: '16px', padding: '16px' }} 
  onClick={handleSubmitOrder} 
  disabled={loading || !receipt || !agreedToTerms}
>
  {loading ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</> : <><i className="fas fa-check"></i> Complete Order</>}
</button>
                  
                  <button className="btn-primary" style={{ width: '100%', marginTop: '24px', padding: '16px' }} onClick={handleSubmitOrder} disabled={loading || !receipt}>
                    {loading ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</> : <><i className="fas fa-check"></i> Complete Order</>}
                  </button>
                </div>
              </div>

              <div className="card" style={{ padding: '32px', position: 'sticky', top: '100px' }}>
                <h3 style={{ fontWeight: '700', marginBottom: '20px' }}>Summary</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', marginBottom: '12px' }}>
                  <span>Total</span>
                  <span>₦{finalTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)', fontWeight: 700, marginBottom: '24px' }}>
                  <span>Paying Now</span>
                  <span>₦{amountToPay.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                {method === 'installment' && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px', background: 'rgba(245,158,11,0.1)', padding: '12px', borderRadius: '8px' }}>
                    <strong>Note:</strong> You will pay ₦{remainingBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })} later to complete this order.
                  </div>
                )}
                <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setStep(1)}>
                  <i className="fas fa-arrow-left"></i> Back
                </button>
              </div>
            </div>
          )}

          {step === 3 && orderData && (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '48px 32px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--success)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 24px' }}>
                <i className="fas fa-check"></i>
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>Order Submitted!</h1>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                Your order <strong>#{orderData._id.slice(-8).toUpperCase()}</strong> has been received. We will verify your receipt and process it within 24 hours.
              </p>
              <Link href="/dashboard" className="btn-primary" style={{ padding: '14px 32px', borderRadius: '100px' }}>
                Go to Dashboard
              </Link>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}