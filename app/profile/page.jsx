'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, updateUserState, logout } = useAuth(); // Use updateUserState
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      
      updateUserState(data.user); // Update global state instantly
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '80px', background: 'var(--bg)', minHeight: '80vh' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px' }}>My Profile</h1>
          
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '32px' }}>
            {message && (
              <div style={{ padding: '12px', background: message.startsWith('Error') ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: message.startsWith('Error') ? 'var(--danger)' : 'var(--success)', borderRadius: '8px', marginBottom: '16px' }}>
                {message}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSave}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Full Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)' }} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Phone Number</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)' }} />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Delivery Address</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} rows="3" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)' }} />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '12px' }}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div style={{ marginBottom: '16px' }}><strong>Name:</strong> {user.name}</div>
                <div style={{ marginBottom: '16px' }}><strong>Email:</strong> {user.email}</div>
                <div style={{ marginBottom: '16px' }}><strong>Phone:</strong> {user.phone || 'Not set'}</div>
                <div style={{ marginBottom: '24px' }}><strong>Address:</strong> {user.address || 'Not set'}</div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setIsEditing(true)} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '12px' }}>Edit Profile</button>
                  <button onClick={() => { logout(); router.push('/'); }} style={{ flex: 1, padding: '12px', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Logout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}