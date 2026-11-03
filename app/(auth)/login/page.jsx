'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
// import ThemeToggle from '@/components/ThemeToggle';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email.trim()) return setError('Please enter your email');
    if (!form.password) return setError('Please enter your password');

    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '40px 32px' }}>
      {/* Logo - Added nav-logo class to fix dark mode visibility */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <Link href="/">
          <img 
            src="/logo.png" 
            alt="Omegally" 
            className="nav-logo" 
            style={{ height: '50px', objectFit: 'contain' }} 
          />
        </Link>
      </div>

      <h1 style={{
        fontSize: '1.8rem',
        fontWeight: '800',
        letterSpacing: '-0.03em',
        marginBottom: '8px',
        textAlign: 'center',
      }}>Welcome Back</h1>
      <p style={{
        color: 'var(--text-secondary)',
        textAlign: 'center',
        marginBottom: '28px',
        fontSize: '0.95rem',
      }}>
        Sign in to your EcomFlex account.
      </p>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid var(--danger)',
          color: 'var(--danger)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '20px',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontWeight: '500',
            marginBottom: '6px',
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
          }}>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--text)',
              fontSize: '0.95rem',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{
            display: 'block',
            fontWeight: '500',
            marginBottom: '6px',
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
          }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 44px 12px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>

        {/* Remember me + Forgot password */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          fontSize: '0.85rem',
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ accentColor: 'var(--primary)' }}
            />
            Remember me
          </label>
          <Link href="/forgot-password" style={{ color: 'var(--primary)', fontWeight: '500' }}>
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="btn w-full"
          disabled={loading}
          style={{ padding: '14px', fontSize: '1rem' }}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Signing in...
            </>
          ) : (
            <>
              <i className="fas fa-sign-in-alt"></i> Sign In
            </>
          )}
        </button>
      </form>

      <p style={{
        textAlign: 'center',
        marginTop: '24px',
        fontSize: '0.9rem',
        color: 'var(--text-secondary)',
      }}>
        Don't have an account?{' '}
        <Link href="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>
          Sign up
        </Link>
      </p>
    </div>
  );
}