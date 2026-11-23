'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { usePaystackPayment } from 'react-paystack';

export default function PaymentPage() {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [method, setMethod] = useState('instant'); // 'instant' | 'installment_2' | 'installment_4'
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [landmark, setLandmark] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (cart.length === 0 && step < 3) router.push('/products');
    if (user?.role === 'admin') router.push('/admin/orders');
  }, [cart, step, router, user]);

  if (cart.length === 0 && step < 3) return null;

  // --- CALCULATIONS ---
  const cartSubtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = cart.reduce((s, i) => s + (i.deliveryFee || 0) * i.qty, 0);
  const baseTotal = cartSubtotal + deliveryFee;

  let installmentCommission = 0;
  let finalTotal = baseTotal;
  let amountToPay = finalTotal;
  let remainingBalance = 0;

  if (method === 'installment_2') {
    installmentCommission = baseTotal * 0.04;
    finalTotal = baseTotal + installmentCommission;
    amountToPay = finalTotal / 2;
    remainingBalance = finalTotal - amountToPay;
  } else if (method === 'installment_4') {
    installmentCommission = baseTotal * 0.08;
    finalTotal = baseTotal + installmentCommission;
    amountToPay = finalTotal * 0.50;
    remainingBalance = finalTotal * 0.50;
  }

  // --- PAYSTACK SETUP ---
  const config = {
    reference: (new Date()).getTime().toString(),
    email: user?.email || 'customer@omegally.store',
    amount: amountToPay * 100, // Paystack uses kobo (multiply by 100)
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    metadata: {
      custom_fields: [
        { display_name: "Customer Name", variable_name: "customer_name", value: user?.name || 'Guest' },
        { display_name: "Landmark", variable_name: "landmark", value: landmark },
        { display_name: "Alt Phone", variable_name: "alt_phone", value: altPhone },
      ]
    }
  };

  const initializePayment = usePaystackPayment(config);

  const handlePaymentSuccess = async (reference) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // 1. Save the order to the database
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: cart.map((i) => ({ 
            productId: i.id, title: i.title, price: i.price, qty: i.qty, 
            image: i.image, size: i.size, color: i.color 
          })),
          totalAmount: finalTotal,
          amountPaid: amountToPay,
          paymentMethod: method === 'instant' ? 'instant' : 'installment',
          weeks: method === 'installment_2' ? 2 : method === 'installment_4' ? 4 : 1,
          paystackReference: reference.reference,
          landmark,
          altPhone,
          note,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save order');

      // 2. Verify payment with Paystack (via your backend)
      await fetch('/api/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: reference.reference, orderId: data.order._id }),
      });

      // 3. Redirect to success page
      router.push(`/payment-success?reference=${reference.reference}`);
      clearCart();
      
    } catch (err) {
      alert('Payment succeeded but order save failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentClose = () => {
    console.log('Payment closed by user');
  };

  const fmt = (num) => `₦${num.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '100px', minHeight: '80vh', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 16px' }}>
          
          {/* Step Indicator */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
            {[1, 2].map((n) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: step >= n ? 'var(--primary)' : 'var(--border)', color: step >= n ? '#fff' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.8rem' }}>{n}</div>
                <span style={{ fontSize: '0.8rem', fontWeight: step >= n ? '600' : '400', color: step >= n ? 'var(--text)' : 'var(--text-secondary)' }}>
                  {n === 1 ? 'Choose Plan' : 'Pay with Paystack'}
                </span>
              </div>
            ))}
          </div>

          {/* STEP 1: Choose Plan */}
          {step === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', alignItems: 'start' }} className="payment-grid">
              
              <div>
                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '24px' }}>
                  <h3 style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: '20px' }}>Select Payment Method</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {/* Instant */}
                    <div onClick={() => setMethod('instant')} style={{ padding: '16px', borderRadius: '12px', border: method === 'instant' ? '2px solid var(--primary)' : '2px solid var(--border)', cursor: 'pointer', background: method === 'instant' ? 'rgba(37,99,235,0.05)' : 'transparent', transition: 'all 0.2s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid', borderColor: method === 'instant' ? 'var(--primary)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {method === 'instant' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></div>}
                        </div>
                        <strong style={{ fontSize: '1.05rem' }}>Pay Full Amount</strong>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '34px' }}>Pay 100% today. No extra fees.</p>
                    </div>

                    {/* 2-Part */}
                    <div onClick={() => setMethod('installment_2')} style={{ padding: '16px', borderRadius: '12px', border: method === 'installment_2' ? '2px solid var(--primary)' : '2px solid var(--border)', cursor: 'pointer', background: method === 'installment_2' ? 'rgba(37,99,235,0.05)' : 'transparent', transition: 'all 0.2s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid', borderColor: method === 'installment_2' ? 'var(--primary)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {method === 'installment_2' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></div>}
                        </div>
                        <strong style={{ fontSize: '1.05rem' }}>Pay 50% Now, 50% Later</strong>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '34px' }}>Pay half today, half within 2 weeks. <br/><strong style={{ color: 'var(--warning)' }}>*A 4% service fee applies.</strong></p>
                    </div>

                    {/* 4-Part */}
                    <div onClick={() => setMethod('installment_4')} style={{ padding: '16px', borderRadius: '12px', border: method === 'installment_4' ? '2px solid var(--primary)' : '2px solid var(--border)', cursor: 'pointer', background: method === 'installment_4' ? 'rgba(37,99,235,0.05)' : 'transparent', transition: 'all 0.2s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid', borderColor: method === 'installment_4' ? 'var(--primary)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {method === 'installment_4' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></div>}
                        </div>
                        <strong style={{ fontSize: '1.05rem' }}>Split into 4 Payments</strong>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '34px' }}>Pay 50% today, then 25%, 15%, 10% over 8 weeks. <br/><strong style={{ color: 'var(--warning)' }}>*An 8% service fee applies.</strong></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }} className="summary-box">
                <h3 style={{ fontWeight: '700', marginBottom: '20px' }}>Order Summary</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                  <span>{fmt(cartSubtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Delivery</span>
                  <span>{fmt(deliveryFee)}</span>
                </div>
                {installmentCommission > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '12px', color: 'var(--warning)', fontWeight: 600 }}>
                    <span>Service Fee ({method === 'installment_2' ? '4%' : '8%'})</span>
                    <span>+{fmt(installmentCommission)}</span>
                  </div>
                )}
                
                <div style={{ height: '1px', background: 'var(--border)', margin: '16px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', marginBottom: '8px' }}>
                  <span>Total</span>
                  <span>{fmt(finalTotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '24px' }}>
                  <span>Due Today</span>
                  <span>{fmt(amountToPay)}</span>
                </div>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }} onClick={() => setStep(2)}>
                  Continue to Payment <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Delivery Details & Paystack Button */}
          {step === 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', alignItems: 'start' }} className="payment-grid">
              
              <div>
                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '24px' }}>
                  <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>1. Delivery Details</h3>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem' }}>Delivery Landmark <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <input type="text" placeholder="e.g. Opposite Shoprite, Maiduguri" value={landmark} onChange={(e) => setLandmark(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem' }}>Alternative Phone (Optional)</label>
                    <input type="tel" placeholder="+234 800 000 0000" value={altPhone} onChange={(e) => setAltPhone(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem' }}>Note (Optional)</label>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Delivery instructions..." rows="2" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', resize: 'vertical' }} />
                  </div>
                </div>

                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                  <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>2. Secure Payment</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                    You are about to pay <strong>{fmt(amountToPay)}</strong> securely via Paystack. We support Cards, Bank Transfer, and USSD.
                  </p>
                  
                  <button 
                    onClick={() => {
                      if (!landmark.trim()) return alert('Please provide a delivery landmark.');
                      initializePayment({ onSuccess: handlePaymentSuccess, onClose: handlePaymentClose });
                    }}
                    disabled={loading}
                    className="btn-primary" 
                    style={{ width: '100%', padding: '16px', justifyContent: 'center', background: '#00C3F7', color: '#000', fontWeight: 700 }}
                  >
                    {loading ? 'Verifying...' : `Pay ${fmt(amountToPay)} with Paystack`}
                  </button>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    <i className="fas fa-lock"></i> Secured by Paystack
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }} className="summary-box">
                <h3 style={{ fontWeight: '700', marginBottom: '20px' }}>Summary</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.05rem', marginBottom: '12px' }}>
                  <span>Total</span>
                  <span>{fmt(finalTotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)', fontWeight: 700, marginBottom: '24px', fontSize: '1.05rem' }}>
                  <span>Paying Now</span>
                  <span>{fmt(amountToPay)}</span>
                </div>
                <button onClick={() => setStep(1)} style={{ width: '100%', padding: '14px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <i className="fas fa-arrow-left"></i> Back
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      <style jsx global>{`
        @media (max-width: 768px) {
          .payment-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .summary-box { position: static !important; }
        }
      `}</style>
    </>
  );
}