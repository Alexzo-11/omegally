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
    let targetPhone = phone;
    if (!targetPhone) {
      targetPhone = prompt("No phone number on file. Enter customer's WhatsApp number (e.g., 2348012345678):");
      if (!targetPhone) return;
    }
    const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(`Hello! Your order #${orderId.slice(-6).toUpperCase()} has been confirmed. Thank you for shopping with Omegally!`);
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  const sendReceiptWhatsApp = (phone, orderId) => {
    let targetPhone = phone;
    if (!targetPhone) {
      targetPhone = prompt("No phone number on file. Enter customer's WhatsApp number:");
      if (!targetPhone) return;
    }
    const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
    const receiptLink = `${window.location.origin}/receipt/${orderId}`;
    const msg = encodeURIComponent(`Hello! Your payment for Order #${orderId.slice(-6).toUpperCase()} has been confirmed. \n\nHere is your receipt: ${receiptLink}\n\nThank you for shopping with Omegally!`);
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

  const getStatusStyle = (status) => {
    const base = { padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'inline-block' };
    if (status === 'paid') return { ...base, background: 'rgba(16,185,129,0.1)', color: 'var(--success)' };
    if (status === 'delivered') return { ...base, background: 'rgba(37,99,235,0.1)', color: 'var(--primary)' };
    if (status === 'pending_review') return { ...base, background: 'rgba(245,158,11,0.1)', color: 'var(--warning)' };
    if (status === 'failed' || status === 'cancelled') return { ...base, background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' };
    return { ...base, background: 'var(--border-light)', color: 'var(--text-secondary)' };
  };

  return (
    <main style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '80px', background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>Manage Orders</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.95rem' }}>
              {orders.length} total orders · {orders.filter(o => o.paymentStatus === 'pending_review').length} awaiting review
            </p>
          </div>
          <button onClick={exportToCSV} style={{ padding: '10px 20px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '100px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fas fa-download"></i> Export CSV
          </button>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px' }}>
          {filterOptions.map(opt => {
            const count = opt.id === 'all' ? orders.length : orders.filter(o => o.paymentStatus === opt.id).length;
            const isActive = filter === opt.id;
            return (
              <button 
                key={opt.id}
                onClick={() => setFilter(opt.id)}
                style={{ 
                  whiteSpace: 'nowrap', padding: '8px 16px', borderRadius: '100px', 
                  border: isActive ? '1px solid var(--primary)' : '1px solid var(--border)',
                  background: isActive ? 'var(--primary)' : 'var(--bg-elevated)',
                  color: isActive ? '#fff' : 'var(--text)',
                  fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
                }}
              >
                {opt.label}
                <span style={{ 
                  background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--border)', 
                  color: isActive ? '#fff' : 'var(--text-secondary)', 
                  padding: '1px 8px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '16px' }}></i>
            <p>Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ background: 'var(--bg-elevated)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', textAlign: 'center', padding: '60px 20px' }}>
            <i className="fas fa-inbox" style={{ fontSize: '2.5rem', color: 'var(--text-tertiary)', marginBottom: '16px' }}></i>
            <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>No orders found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>There are no orders with this status.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredOrders.map(order => (
              <div key={order._id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '20px', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>
                    #{order._id.slice(-6).toUpperCase()} <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>· {order.user?.name || 'Guest'}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · ₦{order.totalAmount.toLocaleString()} · {order.items?.length || 0} item{order.items?.length > 1 ? 's' : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={getStatusStyle(order.paymentStatus)}>
                    {order.paymentStatus.replace('_', ' ')}
                  </span>
                  <button onClick={() => setSelected(order)} style={{ padding: '8px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '100px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selected && (
          <div 
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000 }} 
            onClick={(e) => e.target === e.currentTarget && setSelected(null)}
          >
            <div style={{ background: 'var(--bg-elevated)', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)' }}>
              
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--bg-elevated)', zIndex: 10 }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>Order #{selected._id.slice(-6).toUpperCase()}</h2>
                <button onClick={() => setSelected(null)} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text)' }}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div style={{ padding: '24px' }}>
                
                {/* Customer Info */}
                <div style={{ background: 'var(--bg)', padding: '20px', borderRadius: 'var(--radius-sm)', marginBottom: '24px', border: '1px solid var(--border)' }}>
                  <h4 style={{ fontWeight: 700, marginBottom: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Customer Info</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                    <div><strong>Name:</strong> {selected.user?.name || 'Guest'}</div>
                    <div><strong>Phone:</strong> {selected.user?.phone || 'N/A'}</div>
                    {selected.altPhone && <div><strong>Alt Phone:</strong> {selected.altPhone}</div>}
                    {selected.landmark && <div><strong>Landmark:</strong> {selected.landmark}</div>}
                    {selected.user?.address && <div><strong>Address:</strong> {selected.user.address}</div>}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    <button 
                      onClick={() => notifyCustomer(selected.user?.phone, selected._id)} 
                      style={{ flex: 1, background: '#25D366', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem' }}
                    >
                      <i className="fab fa-whatsapp"></i> Notify
                    </button>
                    <button 
                      onClick={() => sendReceiptWhatsApp(selected.user?.phone, selected._id)} 
                      style={{ flex: 1, background: '#25D366', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem' }}
                    >
                      <i className="fas fa-receipt"></i> Send Receipt
                    </button>
                  </div>
                </div>

                {/* Order Items */}
                <h4 style={{ fontWeight: 700, marginBottom: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Items Ordered</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {selected.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                        {item.image && <img src={item.image} alt={item.title} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />}
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Qty: {item.qty} · ₦{item.price.toLocaleString()}
                            {item.size && ` · Size: ${item.size}`}
                            {item.color && ` · Color: ${item.color}`}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>₦{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Total Amount</span>
                    <strong>₦{selected.totalAmount.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Amount Paid</span>
                    <strong style={{ color: 'var(--success)' }}>₦{selected.amountPaid?.toLocaleString() || '0'}</strong>
                  </div>
                  {selected.paymentMethod === 'installment' && selected.totalAmount > selected.amountPaid && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px dashed var(--border)', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--warning)', fontWeight: 600 }}>Balance Due</span>
                      <strong style={{ color: 'var(--warning)' }}>₦{(selected.totalAmount - selected.amountPaid).toLocaleString()}</strong>
                    </div>
                  )}
                </div>

                {/* Receipt */}
                {selected.receiptImage && (
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontWeight: 700, marginBottom: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Payment Receipt</h4>
                    <a href={selected.receiptImage} target="_blank" rel="noreferrer">
                      <img src={selected.receiptImage} alt="Receipt" style={{ width: '100%', maxHeight: '280px', objectFit: 'contain', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', cursor: 'zoom-in', background: 'var(--bg)' }} />
                    </a>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '8px' }}>Click image to open full size</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <button onClick={() => updateStatus(selected._id, 'paid')} style={{ flex: '1 1 140px', padding: '14px', background: 'var(--success)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <i className="fas fa-check-circle"></i> Confirm Paid
                  </button>
                  <button onClick={() => updateStatus(selected._id, 'delivered')} style={{ flex: '1 1 140px', padding: '14px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <i className="fas fa-truck"></i> Delivered
                  </button>
                  <button onClick={() => updateStatus(selected._id, 'failed')} style={{ flex: '1 1 140px', padding: '14px', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <i className="fas fa-times-circle"></i> Reject
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}