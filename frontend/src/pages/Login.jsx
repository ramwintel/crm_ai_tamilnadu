import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const { loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { toast.error('Please enter your email address.'); return; }
    setLoading(true);
    try {
      const user = await loginWithEmail(email.trim(), name.trim());
      if (user.subscriptionStatus === 'active') {
        navigate('/');
      } else {
        navigate('/subscribe');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">💼</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">CRM App</h1>
          <p className="text-gray-400 mt-2 text-sm">Customer Relationship Management</p>
        </div>

        <div className="border-t border-gray-100 pt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-1 text-center">Welcome</h2>
          <p className="text-gray-500 text-sm mb-6 text-center">
            Sign in with your email address to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-gray-400 font-normal">(for new accounts)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold text-sm transition-colors mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> Signing in...</>
              ) : (
                <> <span>✉️</span> Sign In with Email</>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Existing users are signed in automatically by email.
            <br />New users will be prompted to subscribe.
          </p>
        </div>
      </div>
    </div>
  );
}
