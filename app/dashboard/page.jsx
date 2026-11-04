'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
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
  ];

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <>
      <Navbar />
      
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', paddingTop: 'calc(var(--nav-height) + 20px)' }}>
        
        {/* Sidebar - Moved display to CSS to fix mobile override */}
        <aside className="user-sidebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '24px', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #06B6D4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, flexShrink: 0 }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tabs.map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`dash-tab ${activeTab === tab.id ? 'active' : ''}`}
              >
                <i className={`fas ${tab.icon}`} style={{ width: '20px' }}></i> {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="user-main">
          
          {/* Mobile Dropdown Menu */}
          <div className="mobile-dash-nav">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', color: 'var(--text)' }}
            >
              <span><i className={`fas ${currentTab?.icon}`} style={{ marginRight: '10px', color: 'var(--primary)' }}></i> {currentTab?.label}</span>
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

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '16px' }}></i>
              <p>Loading dashboard...</p>
            </div>
          ) : (
            <>
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div>
                  <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>Welcome back, {user.name.split(' ')[0]} 👋</h1>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Here is a summary of your account.</p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(37,99,235,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}><i className="fas fa-shopping-bag"></i></div>
                      <div><div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{orders.length}</div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Orders</div></div>
                    </div>
                    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}><i className="fas fa-naira-sign"></i></div>
                      <div><div style={{ fontSize: '1.4rem', fontWeight: 800 }}>₦{totalSpent.toLocaleString()}</div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Spent</div></div>
                    </div>
                    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}><i className="fas fa-heart"></i></div>
                      <div><div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{wishlist.length}</div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Wishlist Items</div></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <Link href="/products" className="btn-primary" style={{ padding: '12px 24px', borderRadius: '100px', textDecoration: 'none' }}>
                      <i className="fas fa-shopping-bag"></i> Continue Shopping
                    </Link>
                    <Link href="/profile" style={{ padding: '12px 24px', borderRadius: '100px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text)', textDecoration: 'none', fontWeight: 600 }}>
                      <i className="fas fa-user"></i> View Profile
                    </Link>
                  </div>
                </div>
              )}

              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '24px' }}>My Orders</h1>
                  
                  {orders.length === 0 ? (
                    <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
                      <i className="fas fa-box-open" style={{ fontSize: '2.5rem', color: 'var(--text-tertiary)', marginBottom: '16px' }}></i>
                      <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>No orders yet</h3>
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Start shopping to see your orders here.</p>
                      <Link href="/products" className="btn-primary" style={{ padding: '12px 24px', borderRadius: '100px', textDecoration: 'none', display: 'inline-flex' }}>Browse Products</Link>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: '16px' }}>
                      {orders.map(order => (
                        <div key={order._id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>Order #{order._id.slice(-6).toUpperCase()}</div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} · {order.items.length} item{order.items.length > 1 ? 's' : ''}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '6px' }}>₦{order.totalAmount.toLocaleString()}</div>
                              <span style={{ 
                                background: order.paymentStatus === 'paid' ? 'rgba(16,185,129,0.1)' : order.paymentStatus === 'failed' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', 
                                color: order.paymentStatus === 'paid' ? 'var(--success)' : order.paymentStatus === 'failed' ? 'var(--danger)' : 'var(--warning)', 
                                padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' 
                              }}>
                                {order.paymentStatus.replace('_', ' ')}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                            {order.items.slice(0, 3).map((item, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <img src={item.image} alt={item.title} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', background: 'var(--border-light)' }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Qty: {item.qty} × ₦{item.price.toLocaleString()}</div>
                                </div>
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                + {order.items.length - 3} more item{order.items.length - 3 > 1 ? 's' : ''}
                              </div>
                            )}
                          </div>

                          {order.paymentMethod === 'installment' && order.paymentStatus !== 'paid' && (
                            <div style={{ background: 'rgba(245,158,11,0.08)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                              <div style={{ fontSize: '0.9rem' }}>
                                <strong style={{ color: 'var(--warning)', display: 'block', marginBottom: '4px' }}>⚠️ Pending Balance</strong>
                                <span style={{ color: 'var(--text-secondary)' }}>Remaining: <strong style={{ color: 'var(--text)' }}>₦{(order.totalAmount - order.amountPaid).toLocaleString()}</strong></span>
                              </div>
                              <Link href={`/payment/complete/${order._id}`} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem', borderRadius: '100px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                                Pay Balance <i className="fas fa-arrow-right"></i>
                              </Link>
                            </div>
                          )}

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* WISHLIST TAB */}
              {activeTab === 'wishlist' && (
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '24px' }}>My Wishlist</h1>
                  
                  {wishlist.length === 0 ? (
                    <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
                      <i className="fas fa-heart-broken" style={{ fontSize: '2.5rem', color: 'var(--text-tertiary)', marginBottom: '16px' }}></i>
                      <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>Your wishlist is empty</h3>
                      <p style={{ color: 'var(--text-secondary)' }}>Tap the heart icon on products you love to save them here.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                      {wishlist.map(p => (
                        <Link key={p._id} href={`/products/${p._id}`} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s' }}>
                          <div style={{ aspectRatio: '1', overflow: 'hidden', background: 'var(--border-light)' }}>
                            <img src={p.images?.[0]} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div style={{ padding: '16px' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.4em', lineHeight: 1.3 }}>{p.title}</h4>
                            <div style={{ fontWeight: 800, color: 'var(--primary)' }}>₦{p.price.toLocaleString()}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <style jsx global>{`
        /* Desktop styles */
        .user-sidebar {
          width: 260px;
          background: var(--bg-elevated);
          border-right: 1px solid var(--border);
          position: sticky;
          top: calc(var(--nav-height) + 20px);
          height: calc(100vh - var(--nav-height) - 20px);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
        }

        .user-main {
          flex: 1;
          padding: 32px;
          min-width: 0;
        }

        .mobile-dash-nav {
          display: none;
        }

        .dash-tab {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          background: transparent;
          color: var(--text-secondary);
        }

        .dash-tab:hover {
          background: var(--border-light);
          color: var(--text);
        }

        .dash-tab.active {
          background: var(--primary);
          color: #fff;
        }

        /* Mobile styles */
        @media (max-width: 768px) {
          .user-sidebar { 
            display: none !important; 
          }
          .user-main { 
            padding: 20px 16px !important; 
          }
          .mobile-dash-nav { 
            display: block !important; 
            margin-bottom: 20px; 
          }
        }
      `}</style>
    </>
  );
}