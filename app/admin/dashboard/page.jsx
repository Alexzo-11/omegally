'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== 'admin') return null;

  return (
    <>
      <Navbar />
      <div className="dashboard-layout" style={{ paddingTop: '80px' }}>
        <div className="container" style={{ paddingTop: '40px' }}>
          <h1 className="section-title">Admin Dashboard</h1>
          <div className="stats-grid" style={{ marginTop: '32px' }}>
            <div className="stat-card"><div className="num">1,240</div><div className="label">Orders</div></div>
            <div className="stat-card"><div className="num">$12,430</div><div className="label">Revenue</div></div>
            <div className="stat-card"><div className="num">58</div><div className="label">Products</div></div>
            <div className="stat-card"><div className="num">23</div><div className="label">Active Installments</div></div>
          </div>
          {/* Add more admin-specific content here */}
        </div>
      </div>
      <Footer />
    </>
  );
}