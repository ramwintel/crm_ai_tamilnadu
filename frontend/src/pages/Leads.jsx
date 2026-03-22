import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getLeads, deleteLead } from '../services/api';

const STATUS_COLORS = {
  New: 'bg-blue-100 text-blue-800',
  Contacted: 'bg-yellow-100 text-yellow-800',
  Qualified: 'bg-purple-100 text-purple-800',
  Lost: 'bg-red-100 text-red-800',
  Converted: 'bg-green-100 text-green-800',
};

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchLeads = () => {
    setLoading(true);
    getLeads({ search, status: statusFilter })
      .then((res) => setLeads(res.data))
      .catch(() => toast.error('Failed to load leads'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLeads(); }, [search, statusFilter]); // eslint-disable-line

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete lead "${name}"?`)) return;
    try {
      await deleteLead(id);
      toast.success('Lead deleted');
      fetchLeads();
    } catch {
      toast.error('Failed to delete lead');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Leads</h2>
        <Link to="/leads/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Add Lead
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name, email or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option>New</option>
          <option>Contacted</option>
          <option>Qualified</option>
          <option>Lost</option>
          <option>Converted</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-40"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
        ) : leads.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No leads found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase tracking-wide text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Company</th>
                  <th className="px-6 py-3 text-left">Source</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Value</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((l) => (
                  <tr key={l._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{l.name}</td>
                    <td className="px-6 py-4 text-gray-600">{l.email || '—'}</td>
                    <td className="px-6 py-4 text-gray-600">{l.company || '—'}</td>
                    <td className="px-6 py-4 text-gray-600">{l.source}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[l.status]}`}>{l.status}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">₹{l.value?.toLocaleString()}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <Link to={`/leads/edit/${l._id}`} className="text-blue-600 hover:underline text-xs font-medium">Edit</Link>
                      <button onClick={() => handleDelete(l._id, l.name)} className="text-red-500 hover:underline text-xs font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
