'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

const COLORS = ['#2563EB', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        const orderRes = await fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } });
        const orderData = await orderRes.json();
        setOrders(orderData.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // FEATURE M: Date Filter Logic
  const filteredOrders = useMemo(() => {
    if (dateFilter === 'all') return orders;
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    
    return orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      if (dateFilter === 'today') {
        return orderDate.toDateString() === now.toDateString();
      }
      if (dateFilter === 'week') {
        return (now - orderDate) <= (7 * oneDay);
      }
      if (dateFilter === 'month') {
        return (now - orderDate) <= (30 * oneDay);
      }
      return true;
    });
  }, [orders, dateFilter]);

  const confirmedOrders = filteredOrders.filter(o => o.paymentStatus === 'paid');
  const totalRevenue = confirmedOrders.reduce((sum, o) => sum + (o.amountPaid || 0), 0);
  
  const paymentData = [
    { name: 'Full Payment', value: filteredOrders.filter(o => o.paymentMethod === 'instant' || o.paymentMethod === 'bank').length },
    { name: 'Installments', value: filteredOrders.filter(o => o.paymentMethod === 'installment').length },
  ].filter(d => d.value > 0);

  const salesByDate = {};
  confirmedOrders.forEach(order => {
    const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!salesByDate[date]) salesByDate[date] = 0;
    salesByDate[date] += (order.amountPaid || 0);
  });
  const salesTrend = Object.keys(salesByDate).map(date => ({ date, revenue: salesByDate[date] }));

  if (loading) return <div style={{ padding: '80px', textAlign: 'center' }}>Loading Analytics...</div>;

  return (
    <div className="container" style={{ paddingBottom: '80px', maxWidth: '1200px' }}>
      
      {/* Date Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Store Analytics</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['today', 'week', 'month', 'all'].map(f => (
            <button 
              key={f} 
              onClick={() => setDateFilter(f)} 
              className={`btn btn-sm ${dateFilter === f ? 'btn-primary' : 'btn-secondary'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {f === 'all' ? 'All Time' : `This ${f}`}
            </button>
          ))}
        </div>
      </div>

      {/* Stats (using filteredOrders) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="card" style={{ padding: '24px' }}><div style={{ fontSize: '1.4rem', fontWeight: 800 }}>₦{totalRevenue.toLocaleString()}</div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Confirmed Revenue</div></div>
        <div className="card" style={{ padding: '24px' }}><div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{filteredOrders.length}</div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Orders</div></div>
        <div className="card" style={{ padding: '24px' }}><div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{confirmedOrders.length}</div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Confirmed Orders</div></div>
      </div>

      {/* Charts (using filtered data) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="card" style={{ padding: '24px', gridColumn: '1 / -1' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '24px' }}>Sales Trend</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{fontSize: 12}} />
                <YAxis tickFormatter={(v) => `₦${v/1000}k`} tick={{fontSize: 12}} />
                <Tooltip formatter={(v) => `₦${v.toLocaleString()}`} />
                <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '24px' }}>Payment Methods</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={paymentData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                  {paymentData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}