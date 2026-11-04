'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) return setError('Please enter your full name');
    if (!form.email.trim()) return setError('Please enter your email');
    if (!/\S+@\S+\.\S+/.test(form.email)) return setError('Please enter a valid email');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');

    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone, form.address);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)',
    border: '1.5px solid var(--border)', background: 'var(--bg)',
    color: 'var(--text)', fontSize: '0.95rem', outline: 'none'
  };
  const labelStyle = { display: 'block', fontWeight: 500, marginBottom: '6px', fontSize: '0.88rem', color: 'var(--text-secondary)' };

  return (
    <div className="card" style={{ padding: '40px 32px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <Link href="/"><img src="/logo.png" alt="Omegally" className="nav-logo" style={{ height: '50px', objectFit: 'contain' }} /></Link>
      </div>

      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px', textAlign: 'center' }}>Create Account</h1>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '28px', fontSize: '0.95rem' }}>Join Omegally and start shopping your way.</p>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Full Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required disabled={loading} style={inputStyle} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required disabled={loading} style={inputStyle} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Phone / WhatsApp (optional)</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+234 800 000 0000" disabled={loading} style={inputStyle} />
        </div>

        {/* NEW: Delivery Address */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Delivery Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="e.g. 12 Shehu Bukar Street, Maiduguri"
            rows="2"
            required
            disabled={loading}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Password</label>
          <div style={{ position: 'relative' }}>
            <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" required disabled={loading} style={{ ...inputStyle, paddingRight: '44px' }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Confirm Password</label>
          <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" required disabled={loading} style={inputStyle} />
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}>
          {loading ? <><i className="fas fa-spinner fa-spin"></i> Creating account...</> : <><i className="fas fa-user-plus"></i> Create Account</>}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Already have an account? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign in</Link>
      </p>
    </div>
  );
}