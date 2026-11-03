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
  
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { id: 'saved', label: 'Saved Items', icon: 'fa-bookmark' },
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

  // Order Tracking Timeline Component
  const statusSteps = ['pending_review', 'paid', 'delivered'];
  const renderTimeline = (currentStatus) => {
    let currentIndex = statusSteps.indexOf(currentStatus);
    if (currentIndex === -1) currentIndex = 0; // fallback for failed/cancelled

    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', position: 'relative', padding: '0 10px' }}>
        {/* Background Line */}
        <div style={{ position: 'absolute', top: '14px', left: '10%', right: '10%', height: '2px', background: 'var(--border)', zIndex: 0 }} />
        {/* Progress Line */}
        <div style={{ position: 'absolute', top: '14px', left: '10%', width: `${(currentIndex / (statusSteps.length - 1)) * 80}%`, height: '2px', background: 'var(--primary)', zIndex: 1, transition: 'width 0.4s' }} />
        
        {statusSteps.map((step, idx) => {
          const isActive = idx <= currentIndex;
          return (
            <div key={step} style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
              <div style={{ 
                width: '28px', height: '28px', borderRadius: '50%', 
                background: isActive ? 'var(--primary)' : 'var(--bg)', 
                border: isActive ? '2px solid var(--primary)' : '2px solid var(--border)',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s'
              }}>
                <i className={`fas ${
                  step === 'pending_review' ? 'fa-clock' : 
                  step === 'paid' ? 'fa-check' : 'fa-box-open'
                }`} style={{ fontSize: '0.65rem' }}></i>
              </div>
              <span style={{ fontSize: '0.65rem', fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--text)' : 'var(--text-tertiary)', textAlign: 'center', textTransform: 'capitalize' }}>
                {step.replace('_', ' ')}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', paddingTop: 'calc(var(--nav-height) + 20px)' }}>
        
        {/* Desktop Sidebar */}
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

        {/* Main Content */}
        <main style={{ flex: 1, padding: '32px', minWidth: 0 }} className="user-main">
          
          {/* Mobile Menu Dropdown */}
          <div className="mobile-dash-nav" style={{ display: 'none', marginBottom: '20px' }}>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', color: 'var(--text)' }}
            >
              <span><i className={`fas ${tabs.find(t => t.id === activeTab)?.icon}`} style={{ marginRight: '10px', color: 'var(--primary)' }}></i> {tabs.find(t => t.id === activeTab)?.label}</span>
              <i className={`fas fa-chevron-${mobileMenuOpen ? 'up' : 'down'}`} style={{ fontSize: '0.8rem' }}></i>
            </button>
            {mobileMenuOpen && (
              <div style={{ marginTop: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                {tabs.map(tab => (
                  <button 
                    key={tab.id} 
                    onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }} 
                    style={{ width: '100%', padding: '14px 16px', background: activeTab === tab.id ? 'var(--primary)' : 'transparent', color: activeTab === tab.id ? '#fff' : 'var(--text)', border: 'none', borderBottom: '1px solid var(--border)', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}
                  >
                    <i className={`fas ${tab.icon}`} style={{ marginRight: '10px', width: '16px' }}></i> {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading ? <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading...</p> : (
            <>
              {activeTab === 'overview' && (
                 <div>
                   <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Welcome back, {user.name.split(' ')[0]} 👋</h1>
                   <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Here is a summary of your account.</p>
                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
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
                    {orders.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No orders yet.</p> : orders.map(order => (
                      <div key={order._id} className="card" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Order #{order._id.slice(-6).toUpperCase()}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                          </div>
                          <div style={{ fontWeight: 800, color: 'var(--primary)' }}>₦{order.totalAmount.toLocaleString()}</div>
                        </div>
                        
                        {renderTimeline(order.paymentStatus === 'failed' ? 'pending_review' : order.paymentStatus)}

                        {order.paymentMethod === 'installment' && order.paymentStatus !== 'paid' && order.paymentStatus !== 'delivered' && (
                          <div style={{ marginTop: '20px', background: 'rgba(245,158,11,0.08)', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
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
                  {wishlist.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>Wishlist is empty.</p> : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
                      {wishlist.map(p => (
                        <Link key={p._id} href={`/products/${p._id}`} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                          <img src={p.images?.[0]} alt={p.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                          <div style={{ padding: '12px' }}>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>{p.title}</h4>
                            <div style={{ fontWeight: 800, color: 'var(--primary)' }}>₦{p.price.toLocaleString()}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'saved' && (
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px' }}>Saved for Later</h1>
                  {savedItems.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No saved items.</p> : (
                    <div style={{ display: 'grid', gap: '16px' }}>
                      {savedItems.map(item => (
                        <div key={item.id} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <img src={item.image} alt={item.title} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                          <div style={{ flex: 1, minWidth: '150px' }}>
                            <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.title}</h4>
                            <div style={{ fontWeight: 800, color: 'var(--primary)' }}>₦{item.price.toLocaleString()}</div>
                          </div>
                          <button onClick={() => moveToCart(item)} className="btn-primary" style={{ padding: '10px 16px', fontSize: '0.85rem' }}>
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
      <Footer />

      <style jsx global>{`
        @media (max-width: 768px) {
          .user-sidebar { display: none !important; }
          .user-main { padding: 16px !important; }
          .mobile-dash-nav { display: block !important; }
          .user-main > div:first-child { margin-top: 0; }
        }
      `}</style>
    </>
  );
}