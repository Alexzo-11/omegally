'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || 'Check your email for the reset link.');
    } catch (err) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '40px', maxWidth: '440px', margin: '120px auto' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, textAlign: 'center', marginBottom: '8px' }}>Reset Your Password</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>Enter your email and we'll send you a reset link.</p>
      {message ? (
        <div style={{ padding: '16px', background: 'rgba(16,185,129,0.1)', color: 'var(--success)', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem' }}>{message}</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)' }} />
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '14px', justifyContent: 'center' }}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}
      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
        <Link href="/login" style={{ color: 'var(--primary)' }}>Back to Login</Link>
      </p>
    </div>
  );
}