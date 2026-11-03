'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user && pathname !== '/admin/login') router.push('/admin/login');
    if (user && user.role !== 'admin' && pathname !== '/admin/login') router.push('/dashboard');
  }, [user, loading, router, pathname]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (loading || !user || user.role !== 'admin') return null;

   const links = [
    { href: '/admin', label: 'Overview', icon: 'fa-chart-pie' },
    { href: '/admin/products', label: 'Products', icon: 'fa-box' },
    { href: '/admin/orders', label: 'Orders', icon: 'fa-shopping-bag' },
    { href: '/admin/customers', label: 'Customers', icon: 'fa-users' }, // <-- ADDED
    { href: '/admin/ads', label: 'Manage Ads', icon: 'fa-bullhorn' },
    { href: '/admin/products/new', label: 'Upload Product', icon: 'fa-cloud-upload-alt' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      
      {/* Sidebar Desktop */}
      <aside style={{ width: '260px', background: 'var(--bg-elevated)', borderRight: '1px solid var(--border)', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 100, display: 'flex', flexDirection: 'column' }} className="admin-sidebar">
        
        <div style={{ padding: '32px 24px', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Link href="/" style={{ display: 'inline-block', marginBottom: '12px' }}>
            <img src="/logo.png" alt="Omegally" className="logo-img" style={{ height: '48px', objectFit: 'contain' }} />
          </Link>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Admin Dashboard
          </div>
        </div>
        
        <nav style={{ padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
                borderRadius: '8px', fontWeight: 500, 
                color: pathname === link.href ? '#fff' : 'var(--text-secondary)', 
                background: pathname === link.href ? 'var(--primary)' : 'transparent', 
                textDecoration: 'none', transition: 'all 0.2s' 
              }}
            >
              <i className={`fas ${link.icon}`} style={{ width: '20px' }}></i> {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid var(--border)' }}>
          <Link href="/" className="btn btn-secondary w-full" style={{ justifyContent: 'center' }}>
            Exit to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '260px', paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '40px', paddingLeft: '32px', paddingRight: '32px' }} className="admin-main">
        
        {/* ADDED: Mobile Admin Header with Logo */}
        <div className="mobile-admin-header" style={{ display: 'none', marginBottom: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/admin">
            <img src="/logo.png" alt="Omegally Admin" className="logo-img" style={{ height: '32px', objectFit: 'contain' }} />
          </Link>
          <Link href="/" className="btn btn-sm btn-secondary" style={{ padding: '8px 16px', borderRadius: '100px' }}>
            Exit
          </Link>
        </div>

        {/* Mobile Dropdown Nav */}
        <div style={{ display: 'none', marginBottom: '24px' }} className="mobile-admin-nav">
           <select 
             onChange={(e) => router.push(e.target.value)} 
             value={pathname} 
             style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text)', fontWeight: 600, outline: 'none' }}
           >
             {links.map(l => <option key={l.href} value={l.href}>{l.label}</option>)}
           </select>
        </div>
        
        {children}
      </main>

      <style jsx global>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .admin-main { 
            margin-left: 0 !important; 
            padding: 16px !important; 
            padding-top: 20px !important; 
          }
          .mobile-admin-nav { display: block !important; }
          .mobile-admin-header { display: flex !important; } /* Shows the logo header */
        }
        /* Dark mode logo fix */
        [data-theme="dark"] .logo-img {
          filter: brightness(0) invert(1); 
        }
      `}</style>
    </div>
  );
}