'use client';

import { useEffect, useState } from 'react';

export default function AdminCustomersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px' }}>Registered Customers</h1>
      
      {loading ? <p>Loading customers...</p> : users.length === 0 ? (
        <p>No registered customers yet.</p>
      ) : (
        <div style={{ overflowX: 'auto', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: 'var(--border-light)', textAlign: 'left' }}>
                <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Name</th>
                <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Email</th>
                <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Phone</th>
                <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Role</th>
                <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px', fontWeight: 600 }}>{user.name}</td>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{user.email}</td>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{user.phone || 'N/A'}</td>
                  <td style={{ padding: '16px' }}>
                    <span className={`badge ${user.role === 'admin' ? 'badge-danger' : 'badge-success'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}