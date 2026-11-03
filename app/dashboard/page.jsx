'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (user?.role === 'admin') router.push('/admin');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const orderRes = await fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } });
        if (orderRes.ok) {
          const data = await orderRes.json();
          setOrders(data.orders || []);
        }
        
        const wishlistIds = JSON.parse(localStorage.getItem('wishlist') || '[]');
        if (wishlistIds.length > 0) {
          const prodRes = await fetch('/api/products?limit=100');
          const prodData = await prodRes.json();
          setWishlist((prodData.products || []).filter(p => wishlistIds.includes(p._id)));
        }

        const saved = JSON.parse(localStorage.getItem('savedForLater') || '[]');
        setSavedItems(saved);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (authLoading || !user) return null;

  const totalSpent = orders.reduce((sum, o) => sum + (o.amountPaid || 0), 0);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'fa-home' },
    { id: 'orders', label: 'My Orders', icon: 'fa-shopping-bag' },
    { id: 'wishlist', label: 'Wishlist', icon: 'fa-heart' },
    { id: 'saved', label: 'Saved Items', icon: 'fa-bookmark' }, // New Tab
  ];

  const moveToCart = (item) => {
    addToCart({ 
      id: item.id, 
      title: item.title, 
      price: item.price, 
      image: item.image, 
      qty: item.qty, 
      deliveryFee: item.deliveryFee || 0,
      size: item.size,
      color: item.color
    });
    const updated = savedItems.filter(i => i.id !== item.id);
    setSavedItems(updated);
    localStorage.setItem('savedForLater', JSON.stringify(updated));
    alert('Moved to Cart!');
  };

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', paddingTop: 'calc(var(--nav-height) + 20px)' }}>
        
        <aside style={{ width: '260px', background: 'var(--bg-elevated)', borderRight: '1px solid var(--border)', position: 'sticky', top: 'calc(var(--nav-height) + 20px)', height: 'calc(100vh - var(--nav-height) - 20px)', flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '24px 16px' }} className="user-sidebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '24px', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, flexShrink: 0 }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
            </div>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', fontWeight: 500, background: activeTab === tab.id ? 'var(--primary)' : 'transparent', color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                <i className={`fas ${tab.icon}`} style={{ width: '20px' }}></i> {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <main style={{ flex: 1, padding: '32px', minWidth: 0 }} className="user-main">
          {loading ? <p>Loading...</p> : (
            <>
              {activeTab === 'overview' && (
                 <div>
                   <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Welcome back, {user.name.split(' ')[0]} 👋</h1>
                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '24px' }}>
                     <div className="card" style={{ padding: '24px' }}><div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{orders.length}</div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Orders</div></div>
                     <div className="card" style={{ padding: '24px' }}><div style={{ fontSize: '1.4rem', fontWeight: 800 }}>₦{totalSpent.toLocaleString()}</div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Spent</div></div>
                     <div className="card" style={{ padding: '24px' }}><div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{wishlist.length}</div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Wishlist</div></div>
                   </div>
                 </div>
              )}
              
              {activeTab === 'orders' && (
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px' }}>My Orders</h1>
                  <div style={{ display: 'grid', gap: '20px' }}>
                    {orders.map(order => (
                      <div key={order._id} className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Order #{order._id.slice(-6).toUpperCase()}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                          </div>
                          <div style={{ fontWeight: 800, color: 'var(--primary)' }}>₦{order.totalAmount.toLocaleString()}</div>
                        </div>
                        {order.paymentMethod === 'installment' && order.paymentStatus !== 'paid' && order.paymentStatus !== 'delivered' && (
                          <div style={{ marginTop: '16px', background: 'rgba(245,158,11,0.1)', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <strong style={{ color: 'var(--warning)', display: 'block', fontSize: '0.9rem' }}>Pending Balance</strong>
                              <span style={{ fontSize: '0.85rem' }}>₦{(order.totalAmount - order.amountPaid).toLocaleString()} remaining</span>
                            </div>
                            <Link href={`/payment/complete/${order._id}`} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Pay Balance</Link>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px' }}>My Wishlist</h1>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                    {wishlist.map(p => (
                      <Link key={p._id} href={`/products/${p._id}`} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <img src={p.images?.[0]} alt={p.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                        <div style={{ padding: '16px' }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px' }}>{p.title}</h4>
                          <div style={{ fontWeight: 800, color: 'var(--primary)' }}>₦{p.price.toLocaleString()}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'saved' && (
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px' }}>Saved for Later</h1>
                  {savedItems.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No saved items yet.</p>
                  ) : (
                    <div style={{ display: 'grid', gap: '16px' }}>
                      {savedItems.map(item => (
                        <div key={item.id} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <img src={item.image} alt={item.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontWeight: 700 }}>{item.title}</h4>
                            <div style={{ fontWeight: 800, color: 'var(--primary)' }}>₦{item.price.toLocaleString()}</div>
                          </div>
                          <button onClick={() => moveToCart(item)} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                            Move to Cart
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}