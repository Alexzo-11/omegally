'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  
  try {
    // 1. Call login and get the returned user
    const loggedInUser = await login(email, password);
    
    // 2. Add a safety check here
    if (!loggedInUser) {
      throw new Error('Login failed. Please try again.');
    }

    // 3. Check role
    if (loggedInUser.role === 'admin') {
      router.push('/admin');
    } else {
      setError('Access denied. You do not have admin privileges.');
    }
  } catch (err) {
    setError(err.message || 'Invalid email or password');
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)', // Uses your global background
      padding: '24px',
    }}>
      <div 
        className="card" 
        style={{ 
          maxWidth: '420px', 
          width: '100%', 
          padding: '40px 32px',
          background: 'var(--bg-elevated)', // Ensures the card is lighter than the background
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            fontSize: '1.4rem',
          }}>
            <i className="fas fa-shield-alt"></i>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)' }}>Admin Login</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Restricted access — admins only
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid var(--danger)',
            color: 'var(--danger)',
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '16px',
            fontSize: '0.9rem',
          }}>
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: 'var(--text)', fontWeight: 600, marginBottom: '6px', fontSize: '0.85rem' }}>
              Email
            </label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@ecomflex.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--border)',
                background: 'var(--bg)', // Fix: Makes input background distinct
                color: 'var(--text)',      // Fix: Makes typed text visible
                outline: 'none',
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: 'var(--text)', fontWeight: 600, marginBottom: '6px', fontSize: '0.85rem' }}>
              Password
            </label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--border)',
                background: 'var(--bg)', // Fix
                color: 'var(--text)',      // Fix
                outline: 'none',
              }}
            />
          </div>
          <button 
            className="btn-primary" 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            {loading ? (
              <><i className="fas fa-spinner fa-spin"></i> Signing in...</>
            ) : (
              <><i className="fas fa-sign-in-alt"></i> Sign In</>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Not an admin? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Customer login</Link>
        </p>
      </div>
    </div>
  );
}