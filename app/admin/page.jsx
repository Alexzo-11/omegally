'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#2563EB', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const statCardStyle = {
  background: 'var(--bg-elevated)', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px',
  borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)'
};

const chartCardStyle = {
  background: 'var(--bg-elevated)', padding: '24px', borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)'
};

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- STATISTICS CALCULATIONS ---
  
  // 1. General Stats (Accurate Math)
  const totalRevenue = orders.reduce((sum, o) => sum + (o.amountPaid || 0), 0);
  
  // Outstanding balance for installment orders
  const totalOutstanding = orders.reduce((sum, o) => {
    if (o.paymentMethod === 'installment' && o.paymentStatus !== 'paid') {
      return sum + (o.totalAmount - (o.amountPaid || 0));
    }
    return sum;
  }, 0);

  const totalItemsSold = orders.reduce((sum, o) => sum + o.items.reduce((iSum, i) => iSum + (i.qty || i.quantity || 1), 0), 0);

  // 2. Payment Method Breakdown
  const paymentData = [
    { name: 'Full Payment', value: orders.filter(o => o.paymentMethod === 'instant' || o.paymentMethod === 'bank').length },
    { name: 'Installments', value: orders.filter(o => o.paymentMethod === 'installment').length },
  ].filter(d => d.value > 0);

  // 3. Revenue by Category (Now accurate because API populates product)
  const revenueByCategory = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      // Check if product was populated successfully
      const category = item.product?.category || 'Other';
      const itemRevenue = item.price * (item.qty || 1);
      
      if (!revenueByCategory[category]) revenueByCategory[category] = 0;
      revenueByCategory[category] += itemRevenue;
    });
  });
  
  const categoryRevenueData = Object.keys(revenueByCategory).map(key => ({
    name: key,
    revenue: revenueByCategory[key]
  })).sort((a, b) => b.revenue - a.revenue);

  if (loading) {
    return (
      <main style={{ paddingTop: 'calc(var(--nav-height) + 80px)', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '16px' }}></i>
          <p>Loading Analytics...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '80px', background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>Store Analytics</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Real-time insights into your sales and inventory.</p>
        </div>

        {/* Top Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          
          {/* Revenue */}
          <div style={statCardStyle}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
              <i className="fas fa-naira-sign"></i>
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>₦{totalRevenue.toLocaleString()}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Revenue (Paid)</div>
            </div>
          </div>

          {/* Outstanding */}
          <div style={statCardStyle}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245,158,11,0.1)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
              <i className="fas fa-clock"></i>
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>₦{totalOutstanding.toLocaleString()}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Outstanding Balance</div>
            </div>
          </div>

          {/* Orders */}
          <div style={statCardStyle}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(37,99,235,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
              <i className="fas fa-shopping-bag"></i>
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{orders.length}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Orders</div>
            </div>
          </div>

          {/* Items Sold */}
          <div style={statCardStyle}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
              <i className="fas fa-box"></i>
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{totalItemsSold}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Items Sold</div>
            </div>
          </div>

        </div>

        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          
          {/* Payment Methods Chart */}
          <div style={chartCardStyle}>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-credit-card" style={{ color: 'var(--primary)' }}></i> Payment Methods
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              {paymentData.length > 0 ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={paymentData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                      {paymentData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                      itemStyle={{ color: 'var(--text)' }}
                    />
                    <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '0.85rem' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>No payment data yet</div>
              )}
            </div>
          </div>

          {/* Revenue by Category Chart */}
          <div style={chartCardStyle}>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-chart-bar" style={{ color: 'var(--primary)' }}></i> Revenue by Category
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              {categoryRevenueData.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={categoryRevenueData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      formatter={(value) => `₦${value.toLocaleString()}`} 
                      contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                      itemStyle={{ color: 'var(--text)' }}
                    />
                    <Bar dataKey="revenue" fill="var(--primary)" radius={[0, 8, 8, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>No category data yet</div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Responsiveness */}
      <style jsx global>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}