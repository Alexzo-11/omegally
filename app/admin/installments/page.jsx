'use client';

import { useEffect, useState } from 'react';

export default function AdminInstallmentsPage() {
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstallments = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      
      // Filter only unpaid installments
      const active = (data.orders || []).filter(
        o => o.paymentMethod === 'installment' && o.paymentStatus !== 'paid'
      );
      setInstallments(active);
      setLoading(false);
    };
    fetchInstallments();
  }, []);

  const sendReminder = (phone, name, balance) => {
    if (!phone) return alert('No phone number on file');
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = clean.substring(1);
    if (!clean.startsWith('234')) clean = '234' + clean;
    
    const msg = encodeURIComponent(`Hello ${name}, this is a friendly reminder from Omegally. You have an outstanding balance of ₦${balance.toLocaleString()} for your installment plan. Please click here to pay: https://omegally.store/dashboard`);
    window.open(`https://wa.me/${clean}?text=${msg}`, '_blank');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Installment Tracker</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Monitor outstanding balances and send payment reminders.</p>
      </div>

      {loading ? <p>Loading...</p> : installments.length === 0 ? (
        <div style={{ background: 'var(--bg-elevated)', padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
          <i className="fas fa-check-circle" style={{ fontSize: '2rem', color: 'var(--success)', marginBottom: '16px' }}></i>
          <h3 style={{ fontWeight: 700 }}>All caught up!</h3>
          <p style={{ color: 'var(--text-secondary)' }}>No pending installment balances.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {installments.map(order => {
            const balance = order.totalAmount - order.amountPaid;
            return (
              <div key={order._id} style={{ background: 'var(--bg-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{order.user?.name || 'Guest'}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Order #{order._id.slice(-6).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString()}</div>
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

                <button 
                  onClick={() => sendReminder(order.user?.phone, order.user?.name, balance)}
                  style={{ background: '#25D366', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <i className="fab fa-whatsapp"></i> Send Reminder
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}