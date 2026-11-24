'use client';

import { useEffect, useState } from 'react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setCustomers(data.users || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // ✅ NEW: Send Email to All Customers
  const sendEmailToAll = async () => {
    if (!confirm(`Are you sure you want to send a promotional email to all ${customers.length} customers?`)) return;
    
    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/send-broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          subject: 'Exclusive Offer from Omegally!',
          message: 'Hello! We have new arrivals and exclusive deals just for you. Shop now at omegally.store!'
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send emails');
      alert(`✅ Broadcast email sent to ${data.sentCount || 'all'} customers!`);
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <main style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '80px', background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Customers</h1>
            <p style={{ color: 'var(--text-secondary)' }}>View and manage all registered users.</p>
          </div>
          <button onClick={sendEmailToAll} disabled={sending} style={{ background: '#4F46E5', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '100px', fontWeight: 600, cursor: sending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: sending ? 0.7 : 1 }}>
            {sending ? <><i className="fas fa-spinner fa-spin"></i> Sending...</> : <><i className="fas fa-envelope"></i> Email All Customers</>}
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={{ background: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--bg)' }}>
                <tr>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Name</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Email</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Phone</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c._id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px', fontWeight: 600 }}>{c.name}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{c.email}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{c.phone || 'N/A'}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}