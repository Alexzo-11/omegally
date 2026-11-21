'use client';

import { useEffect, useState } from 'react';

export default function AdminInstallmentsPage() {
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const loadInstallments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      
      // Fetch ALL unpaid installments (including pending_balance_review)
      const active = (data.orders || []).filter(
        o => o.paymentMethod === 'installment' && o.paymentStatus !== 'paid'
      );
      setInstallments(active);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstallments();
  }, []);

  const sendReminder = (phone, name, balance) => {
    if (!phone) return alert('No phone number on file');
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = clean.substring(1);
    if (!clean.startsWith('234')) clean = '234' + clean;
    
    const msg = encodeURIComponent(`Hello ${name}, this is a friendly reminder from Omegally. You have an outstanding balance of ₦${balance.toLocaleString()} for your installment plan. Please click here to pay: https://omegally.store/dashboard`);
    window.open(`https://wa.me/${clean}?text=${msg}`, '_blank');
  };

  const confirmBalancePaid = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paymentStatus: 'paid', amountPaid: selected.totalAmount }), 
      });
      loadInstallments();
      setSelected(null);
      alert('Balance confirmed! Final receipt sent to the customer via email.');
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const sendReceiptWhatsApp = (phone, orderId) => {
    if (!phone) return alert('No phone number on file');
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = clean.substring(1);
    if (!clean.startsWith('234')) clean = '234' + clean;
    
    const receiptLink = `${window.location.origin}/receipt/${orderId}`;
    const msg = encodeURIComponent(`Hello! Your balance payment for Order #${orderId.slice(-6).toUpperCase()} has been confirmed. \n\nHere is your final receipt: ${receiptLink}\n\nThank you for shopping with Omegally!`);
    window.open(`https://wa.me/${clean}?text=${msg}`, '_blank');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Installment Tracker</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Monitor outstanding balances, send reminders, and confirm final payments.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>Loading...</div>
      ) : installments.length === 0 ? (
        <div style={{ background: 'var(--bg-elevated)', padding: '40px', borderRadius: '16px', textAlign: 'center', border: '1px dashed var(--border)' }}>
          <i className="fas fa-check-circle" style={{ fontSize: '2.5rem', color: 'var(--success)', marginBottom: '16px' }}></i>
          <h3 style={{ fontWeight: 700 }}>All caught up!</h3>
          <p style={{ color: 'var(--text-secondary)' }}>No pending installment balances.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {installments.map(order => {
            const balance = order.totalAmount - order.amountPaid;
            const isPendingBalance = order.paymentStatus === 'pending_balance_review';
            
            return (
              <div 
                key={order._id} 
                style={{ 
                  background: 'var(--bg-elevated)', padding: '20px', borderRadius: '12px', 
                  border: isPendingBalance ? '2px solid var(--warning)' : '1px solid var(--border)', 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' 
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{order.user?.name || 'Guest'}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Order #{order._id.slice(-6).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString()}</div>
                  {isPendingBalance && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 700, marginTop: '6px', background: 'rgba(245,158,11,0.1)', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                      ⚠️ Balance Payment Submitted — Needs Review
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total</div>
                    <div style={{ fontWeight: 600 }}>₦{order.totalAmount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--success)', textTransform: 'uppercase' }}>Paid</div>
                    <div style={{ fontWeight: 600 }}>₦{order.amountPaid.toLocaleString()}</div>
                  </div>
                  <div style={{ background: 'rgba(245,158,11,0.1)', padding: '8px 16px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--warning)', textTransform: 'uppercase', fontWeight: 700 }}>Balance Due</div>
                    <div style={{ fontWeight: 800, color: 'var(--warning)', fontSize: '1.1rem' }}>₦{balance.toLocaleString()}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {isPendingBalance && (
                    <button 
                      onClick={() => setSelected(order)}
                      style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      View & Confirm
                    </button>
                  )}
                  <button 
                    onClick={() => sendReminder(order.user?.phone, order.user?.name, balance)}
                    style={{ background: '#25D366', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <i className="fab fa-whatsapp"></i> Send Reminder
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }} onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
          <div style={{ background: 'var(--bg-elevated)', borderRadius: '16px', maxWidth: '500px', width: '100%', padding: '24px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontWeight: 800, margin: 0 }}>Confirm Balance Payment</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', color: 'var(--text)' }}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--border)' }}>
              <p style={{ margin: '4px 0' }}><strong>Customer:</strong> {selected.user?.name}</p>
              <p style={{ margin: '4px 0' }}><strong>Total Amount:</strong> ₦{selected.totalAmount.toLocaleString()}</p>
              <p style={{ margin: '4px 0', color: 'var(--warning)' }}><strong>Balance Due:</strong> ₦{(selected.totalAmount - selected.amountPaid).toLocaleString()}</p>
            </div>

            {selected.receiptImage && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>Uploaded Receipt:</p>
                <a href={selected.receiptImage} target="_blank" rel="noreferrer">
                  <img src={selected.receiptImage} alt="Receipt" style={{ width: '100%', maxHeight: '250px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)' }} />
                </a>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={() => confirmBalancePaid(selected._id)} style={{ flex: '1 1 140px', background: 'var(--success)', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <i className="fas fa-check-circle"></i> Confirm Paid
              </button>
              <button onClick={() => sendReceiptWhatsApp(selected.user?.phone, selected._id)} style={{ flex: '1 1 140px', background: '#25D366', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <i className="fab fa-whatsapp"></i> Send Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}