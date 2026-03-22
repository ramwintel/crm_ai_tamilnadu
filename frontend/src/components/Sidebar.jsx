import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/customers', label: 'Customers', icon: '👥' },
  { to: '/leads', label: 'Leads', icon: '🎯' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-blue-800 text-white flex flex-col min-h-screen shadow-xl">
      <div className="px-6 py-5 border-b border-blue-700">
        <h1 className="text-2xl font-bold tracking-wide">CRM App</h1>
        <p className="text-blue-300 text-sm mt-1">Customer Management</p>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-blue-100 hover:bg-blue-700'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User profile + logout */}
      {user && (
        <div className="px-4 py-4 border-t border-blue-700">
          <div className="flex items-center gap-3 mb-3">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border-2 border-blue-500" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                {user.name?.[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user.name}</p>
              <p className="text-blue-300 text-xs truncate">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-medium">
              ✓ Active
            </span>
            <button
              onClick={handleLogout}
              className="text-blue-300 hover:text-white text-xs underline transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      )}

      <div className="px-6 py-3 border-t border-blue-700 text-xs text-blue-400">
        © 2026 CRM Application
      </div>
    </aside>
  );
}
