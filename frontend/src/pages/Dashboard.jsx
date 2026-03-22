import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from 'recharts';
import { getCustomerStats, getLeadStats, getCustomers, getLeads } from '../services/api';

const COLORS = {
  Active: '#22c55e',
  Inactive: '#ef4444',
  Prospect: '#f59e0b',
  New: '#3b82f6',
  Contacted: '#f59e0b',
  Qualified: '#8b5cf6',
  Lost: '#ef4444',
  Converted: '#10b981',
  Website: '#6366f1',
  Referral: '#ec4899',
  'Social Media': '#14b8a6',
  'Cold Call': '#f97316',
  Email: '#0ea5e9',
  Other: '#94a3b8',
};

const PIE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981', '#f97316'];

function StatCard({ title, value, color, icon }) {
  return (
    <div className={`bg-white rounded-xl shadow p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <span className="text-4xl opacity-80">{icon}</span>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h4 className="text-base font-semibold text-gray-700 mb-4">{title}</h4>
      {children}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-2 text-sm">
        {label && <p className="font-medium text-gray-700 mb-1">{label}</p>}
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || p.fill }}>
            {p.name}: <span className="font-semibold">{p.name === 'Value (₹)' ? `₹${p.value.toLocaleString()}` : p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [customerStats, setCustomerStats] = useState(null);
  const [leadStats, setLeadStats] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCustomerStats(), getLeadStats(), getCustomers(), getLeads()])
      .then(([cRes, lRes, custAll, leadsAll]) => {
        setCustomerStats(cRes.data);
        setLeadStats(lRes.data);
        setCustomers(custAll.data);
        setLeads(leadsAll.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  // Chart data derivations
  const customerStatusData = [
    { name: 'Active', value: customerStats?.active ?? 0 },
    { name: 'Inactive', value: customerStats?.inactive ?? 0 },
    { name: 'Prospect', value: customerStats?.prospect ?? 0 },
  ].filter((d) => d.value > 0);

  const leadStatusData = [
    { name: 'New', value: leadStats?.newLeads ?? 0 },
    { name: 'Contacted', value: leads.filter((l) => l.status === 'Contacted').length },
    { name: 'Qualified', value: leadStats?.qualified ?? 0 },
    { name: 'Converted', value: leadStats?.converted ?? 0 },
    { name: 'Lost', value: leadStats?.lost ?? 0 },
  ].filter((d) => d.value > 0);

  const sourceCount = leads.reduce((acc, l) => {
    acc[l.source] = (acc[l.source] || 0) + 1;
    return acc;
  }, {});
  const leadSourceData = Object.entries(sourceCount).map(([name, value]) => ({ name, value }));

  const leadValueByStatus = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'].map((status) => ({
    name: status,
    'Value (₹)': leads.filter((l) => l.status === status).reduce((sum, l) => sum + (l.value || 0), 0),
  })).filter((d) => d['Value (₹)'] > 0);

  const companyCounts = customers.reduce((acc, c) => {
    if (c.company) acc[c.company] = (acc[c.company] || 0) + 1;
    return acc;
  }, {});
  const topCompanies = Object.entries(companyCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count).slice(0, 6);

  // Monthly leads trend (last 6 months from data)
  const monthlyLeads = leads.reduce((acc, l) => {
    const month = new Date(l.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  const leadsOverTime = Object.entries(monthlyLeads).map(([month, count]) => ({ month, count }));

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500 mt-1">Welcome back! Here's your CRM overview.</p>
      </div>

      {/* Stat Cards - Customers */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Customers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Customers" value={customerStats?.total ?? 0} color="border-blue-500" icon="👥" />
          <StatCard title="Active" value={customerStats?.active ?? 0} color="border-green-500" icon="✅" />
          <StatCard title="Inactive" value={customerStats?.inactive ?? 0} color="border-red-500" icon="⛔" />
          <StatCard title="Prospects" value={customerStats?.prospect ?? 0} color="border-yellow-500" icon="🔍" />
        </div>
      </div>

      {/* Stat Cards - Leads */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Leads</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Leads" value={leadStats?.total ?? 0} color="border-purple-500" icon="🎯" />
          <StatCard title="New" value={leadStats?.newLeads ?? 0} color="border-blue-400" icon="🆕" />
          <StatCard title="Qualified" value={leadStats?.qualified ?? 0} color="border-green-400" icon="⭐" />
          <StatCard title="Converted" value={leadStats?.converted ?? 0} color="border-teal-500" icon="🏆" />
        </div>
        <div className="mt-4 bg-white rounded-xl shadow p-6 border-l-4 border-indigo-500 max-w-xs">
          <p className="text-sm text-gray-500 font-medium">Total Pipeline Value</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">₹{(leadStats?.totalValue ?? 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Analytics</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Customer Status Pie */}
        <ChartCard title="Customer Status Distribution">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={customerStatusData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {customerStatusData.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name] || PIE_COLORS[0]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Lead Status Bar */}
        <ChartCard title="Lead Status Breakdown">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={leadStatusData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Leads" radius={[4, 4, 0, 0]}>
                {leadStatusData.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name] || '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Lead Source Pie */}
        <ChartCard title="Lead Source Distribution">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={leadSourceData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={3}>
                {leadSourceData.map((entry, i) => (
                  <Cell key={entry.name} fill={COLORS[entry.name] || PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Pipeline Value by Status */}
        <ChartCard title="Pipeline Value by Lead Status (₹)">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={leadValueByStatus} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Value (₹)" name="Value (₹)" radius={[4, 4, 0, 0]}>
                {leadValueByStatus.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name] || '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Leads Over Time Line Chart */}
        {leadsOverTime.length > 0 && (
          <ChartCard title="Leads Created Over Time">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={leadsOverTime} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="count" name="Leads" stroke="#6366f1" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Top Companies Bar */}
        {topCompanies.length > 0 && (
          <ChartCard title="Customers by Company">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topCompanies} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Customers" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

      </div>
    </div>
  );
}
