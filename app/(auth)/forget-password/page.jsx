'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setMessage(data.message);
      setEmail(''); // Clear input on success
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '40px 32px', maxWidth: '440px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <Link href="/">
          <img src="/logo.png" alt="Omegally" className="nav-logo" style={{ height: '50px', objectFit: 'contain' }} />
        </Link>
      </div>

      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px', textAlign: 'center' }}>Forgot Password</h1>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '28px', fontSize: '0.95rem' }}>
        Enter your email and we'll send you a link to reset your password.
      </p>

      {error && <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
      {message && <div style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: '6px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.95rem', outline: 'none' }}
          />
        </div>

        <button type="submit" className="btn w-full" disabled={loading} style={{ padding: '14px', fontSize: '1rem' }}>
          {loading ? <><i className="fas fa-spinner fa-spin"></i> Sending...</> : 'Send Reset Link'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Remembered it? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Back to Login</Link>
      </p>
    </div>
  );
}