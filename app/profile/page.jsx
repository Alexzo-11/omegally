'use client';

import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: 'calc(var(--nav-height) + 80px)', paddingBottom: '100px', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
          <div style={{ maxWidth: '500px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
            <div style={{ width: '96px', height: '96px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '2.5rem', color: 'var(--text-tertiary)' }}>
              <i className="fas fa-user-lock"></i>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.02em' }}>Please Login</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1rem' }}>You need to be logged in to view your profile.</p>
            <Link href="/login" className="btn-primary" style={{ display: 'inline-flex', padding: '14px 32px', borderRadius: '100px' }}>
              Sign In to Continue <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '80px', minHeight: '80vh', background: 'var(--bg)' }}>
        
        {/* Centered Wrapper */}
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px' }}>
          
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '24px' }}>My Profile</h1>
          
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            
            {/* Header Banner */}
            <div style={{ height: '120px', background: 'linear-gradient(135deg, #2563EB, #06B6D4)', position: 'relative' }} />

            {/* Avatar & Name */}
            <div style={{ padding: '0 32px 32px', position: 'relative' }}>
              <div style={{ 
                width: '90px', height: '90px', borderRadius: '50%', 
                background: 'var(--bg-elevated)', 
                color: 'var(--primary)', border: '4px solid var(--bg-elevated)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '2.2rem', fontWeight: 800,
                marginTop: '-45px', marginBottom: '16px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              <h2 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '4px' }}>{user.name || 'User'}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fas fa-check-circle" style={{ color: 'var(--success)' }}></i> 
                Verified Customer · Member since {new Date().getFullYear()}
              </p>
            </div>

            {/* Contact Info Rows */}
            <div style={{ padding: '0 32px 32px' }}>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(37,99,235,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className="fas fa-user"></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Full Name</div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user.name || 'Not set'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(37,99,235,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Email Address</div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', wordBreak: 'break-all' }}>{user.email || 'Not set'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(37,99,235,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className="fab fa-whatsapp"></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Phone / WhatsApp</div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user.phone || 'Not set'}</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ padding: '24px 32px', background: 'var(--bg)', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/dashboard" className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '12px', borderRadius: '8px', textDecoration: 'none' }}>
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </Link>
              <button onClick={handleLogout} style={{ flex: 1, padding: '12px', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
            
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}