'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// We need to wrap the component in Suspense because it uses useSearchParams
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError('Passwords do not match');
    if (password.length < 6) return setError('Password must be at least 6 characters');

    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');
      
      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--danger)', marginBottom: '16px' }}>Invalid Link</h2>
        <p style={{ color: 'var(--text-secondary)' }}>This password reset link is missing or invalid.</p>
        <Link href="/forgot-password" className="btn-primary" style={{ marginTop: '20px', display: 'inline-flex' }}>Request a new link</Link>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '40px 32px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', textAlign: 'center' }}>Set New Password</h1>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '28px', fontSize: '0.95rem' }}>
        Please enter your new password below.
      </p>

      {error && <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
      {message && <div style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: '6px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 6 characters"
            required
            style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.95rem', outline: 'none' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: '6px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            required
            style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.95rem', outline: 'none' }}
          />
        </div>

        <button type="submit" className="btn w-full" disabled={loading} style={{ padding: '14px', fontSize: '1rem' }}>
          {loading ? <><i className="fas fa-spinner fa-spin"></i> Updating...</> : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

// Next.js requires Suspense boundary when using useSearchParams
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}