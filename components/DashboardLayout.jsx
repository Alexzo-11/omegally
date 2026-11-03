'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from './Navbar';

const tabs = [
  { id: 'overview', label: 'Overview', icon: 'fa-home' },
  { id: 'saved', label: 'Saved Products', icon: 'fa-bookmark' },
  { id: 'installments', label: 'Installments', icon: 'fa-calendar-alt' },
  { id: 'orders', label: 'Orders', icon: 'fa-truck' },
  { id: 'wishlist', label: 'Wishlist', icon: 'fa-heart' },
  { id: 'notifications', label: 'Notifications', icon: 'fa-bell' },
];

export default function DashboardLayout({ children, activeTab = 'overview', onTabChange }) {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="dashboard-layout" style={{ display: 'flex', paddingTop: 'var(--nav-height)', minHeight: '100vh' }}>
        {/* Sidebar */}
        <aside className="dashboard-sidebar" style={{
          width: '260px',
          flexShrink: 0,
          borderRight: '1px solid var(--border)',
          padding: '24px 16px',
          height: 'calc(100vh - var(--nav-height))',
          position: 'sticky',
          top: 'var(--nav-height)',
          overflowY: 'auto',
          background: 'var(--bg)',
        }}>
          <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Welcome back,
            </div>
            <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>
              {user?.name || 'Guest'}
            </div>
          </div>
          <nav>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: '500',
                  color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
                  background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                  transition: 'all var(--transition)',
                  width: '100%',
                  textAlign: 'left',
                  marginBottom: '4px',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                <i className={`fas ${tab.icon}`} style={{ width: '20px', fontSize: '1.1rem' }}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="dashboard-main" style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </>
  );
}