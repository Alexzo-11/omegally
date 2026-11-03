'use client';

import { useEffect, useState } from 'react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const exportToCSV = () => {
    if (orders.length === 0) return alert('No orders to export');
    const headers = ['Order ID', 'Date', 'Customer', 'Phone', 'Total (₦)', 'Paid (₦)', 'Status', 'Payment Method'];
    const rows = orders.map(o => [
      `#${o._id.slice(-6).toUpperCase()}`,
      new Date(o.createdAt).toLocaleDateString(),
      o.user?.name || 'Guest',
      o.user?.phone || 'N/A',
      o.totalAmount,
      o.amountPaid || 0,
      o.paymentStatus,
      o.paymentMethod
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `omegally-orders-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ paymentStatus: status }),
    });
    loadOrders();
    setSelected(null);
  };

  const notifyCustomer = (phone, orderId) => {
    // Fallback if no phone number exists
    let targetPhone = phone;
    if (!targetPhone) {
      targetPhone = prompt("No phone number on file. Enter customer's WhatsApp number (e.g., 2348012345678):");
      if (!targetPhone) return;
    }
    
    const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(`Hello! Your order #${orderId.slice(-6).toUpperCase()} has been confirmed. Thank you for shopping with Omegally!`);
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.paymentStatus === filter);

  const filterOptions = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending_review', label: 'Pending' },
    { id: 'paid', label: 'Confirmed' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
    { id: 'failed', label: 'Refunded' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Manage Orders</h1>
        <button onClick={exportToCSV} className="btn btn-secondary btn-sm">
          <i className="fas fa-download"></i> Export CSV
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px' }}>
        {filterOptions.map(opt => (
          <button 
            key={opt.id}
            onClick={() => setFilter(opt.id)}
            className={`btn btn-sm ${filter === opt.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ whiteSpace: 'nowrap' }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? <p>Loading...</p> : filteredOrders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <i className="fas fa-inbox" style={{ fontSize: '2rem', color: 'var(--text-tertiary)', marginBottom: '12px' }}></i>
          <p>No orders found with this status.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {filteredOrders.map(order => (
            <div key={order._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>#{order._id.slice(-6).toUpperCase()} - {order.user?.name || 'Guest'}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{new Date(order.createdAt).toLocaleDateString()} · ₦{order.totalAmount.toLocaleString()}</div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : order.paymentStatus === 'delivered' ? 'badge-success' : order.paymentStatus === 'pending_review' ? 'badge-warning' : 'badge-ghost'}`}>
                  {order.paymentStatus.replace('_', ' ')}
                </span>
                <button onClick={() => setSelected(order)} className="btn btn-sm btn-primary">View</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }} onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
          <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Order Details</h2>
              <button onClick={() => setSelected(null)}><i className="fas fa-times"></i></button>
            </div>

            <div style={{ background: 'var(--border-light)', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Customer Info</h4>
              <p><strong>Name:</strong> {selected.user?.name || 'Guest'}</p>
              <p><strong>Phone:</strong> {selected.user?.phone || 'N/A'}</p>
              
              <button onClick={() => notifyCustomer(selected.user?.phone, selected._id)} className="btn btn-sm" style={{ background: '#25D366', color: '#fff', marginTop: '10px', width: '100%', justifyContent: 'center' }}>
                <i className="fab fa-whatsapp"></i> Notify Customer
              </button>
            </div>

            <h4 style={{ fontWeight: 700, marginBottom: '12px' }}>Items Ordered</h4>
            {selected.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                <div>
                  <div>{item.title} × {item.qty}</div>
                  {(item.size || item.color) && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {item.size && `Size: ${item.size} `} 
                      {item.color && `Color: ${item.color}`}
                    </div>
                  )}
                </div>
                <span>₦{(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}

            {selected.receiptImage && (
              <div style={{ marginTop: '24px' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '12px' }}>Payment Receipt</h4>
                <img src={selected.receiptImage} alt="Receipt" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '12px', border: '1px solid var(--border)' }} />
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
              <button onClick={() => updateStatus(selected._id, 'paid')} className="btn btn-success" style={{ flex: 1 }}>Confirm Paid</button>
              
              {/* Mark as Delivered Button */}
              <button onClick={() => updateStatus(selected._id, 'delivered')} className="btn btn-primary" style={{ flex: 1 }}>
                <i className="fas fa-truck"></i> Mark Delivered
              </button>
              
              <button onClick={() => updateStatus(selected._id, 'failed')} className="btn btn-danger" style={{ flex: 1 }}>Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}