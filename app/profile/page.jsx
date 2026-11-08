'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, updateUserState, logout } = useAuth(); // Assuming updateUserState is exposed
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
      
      // Safely parse JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server error: Invalid response format');
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      
      if (updateUserState) updateUserState(data.user);
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
          
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '32px', boxShadow: 'var(--shadow-md)' }}>
            
            {/* Status Message */}
            {message && (
              <div style={{ padding: '12px 16px', background: message.startsWith('Error') ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: message.startsWith('Error') ? 'var(--danger)' : 'var(--success)', borderRadius: '8px', marginBottom: '24px', fontWeight: 500 }}>
                {message}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSave}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Full Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Phone Number</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                </div>
                <div style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Delivery Address</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} rows="3" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '14px', borderRadius: '8px' }}>
                    {loading ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text)', fontWeight: 600 }}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                {/* Profile Info Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(37,99,235,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fas fa-user"></i></div>
                    <div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>FULL NAME</div><div style={{ fontWeight: 600 }}>{user.name}</div></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(37,99,235,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fas fa-envelope"></i></div>
                    <div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>EMAIL ADDRESS</div><div style={{ fontWeight: 600 }}>{user.email}</div></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(37,99,235,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fas fa-phone"></i></div>
                    <div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>PHONE NUMBER</div><div style={{ fontWeight: 600 }}>{user.phone || 'Not set'}</div></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(37,99,235,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fas fa-map-marker-alt"></i></div>
                    <div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>DELIVERY ADDRESS</div><div style={{ fontWeight: 600 }}>{user.address || 'Not set'}</div></div>
                  </div>
                </div>

                {/* Action Buttons: View and Edit */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button onClick={() => router.push('/dashboard')} style={{ flex: 1, minWidth: '140px', padding: '14px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <i className="fas fa-eye"></i> View Dashboard
                  </button>
                  <button onClick={() => setIsEditing(true)} className="btn-primary" style={{ flex: 1, minWidth: '140px', padding: '14px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <i className="fas fa-edit"></i> Edit Profile
                  </button>
                </div>
                
                {/* Logout Button */}
                <button onClick={() => { logout(); router.push('/'); }} style={{ width: '100%', marginTop: '16px', padding: '14px', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}