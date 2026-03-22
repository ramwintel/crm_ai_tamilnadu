import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createPaymentOrder } from '../services/api';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  'Unlimited Customer Management',
  'Lead Tracking & Pipeline',
  'Analytics Dashboard with Charts',
  'Search & Filter across all modules',
  'MongoDB Atlas Cloud Storage',
  'Export & Reporting Tools',
  '1 Year Full Access',
  'Priority Support',
];

export default function Subscription() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await createPaymentOrder();
      const { paymentSessionId, orderId } = res.data;

      // Load Cashfree JS SDK
      if (!window.Cashfree) {
        toast.error('Payment gateway not loaded. Please refresh and try again.');
        setLoading(false);
        return;
      }

      const cashfree = window.Cashfree({ mode: 'sandbox' });
      cashfree.checkout({
        paymentSessionId,
        redirectTarget: '_self',
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Could not initiate payment. Try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💼</span>
          </div>
          <h1 className="text-3xl font-bold text-white">CRM App</h1>
          <p className="text-blue-200 mt-1 text-sm">Activate your subscription to get started</p>
        </div>

        {/* User info */}
        <div className="bg-white bg-opacity-10 rounded-xl px-5 py-3 flex items-center gap-3 mb-6 border border-white border-opacity-20">
          {user?.avatar && <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full" />}
          <div>
            <p className="text-white text-sm font-medium">{user?.name}</p>
            <p className="text-blue-200 text-xs">{user?.email}</p>
          </div>
          <button onClick={logout} className="ml-auto text-blue-200 hover:text-white text-xs underline">
            Sign out
          </button>
        </div>

        {/* Pricing Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
              Annual Plan
            </span>
            <div className="mt-4">
              <span className="text-5xl font-bold text-gray-800">₹27,000</span>
              <span className="text-gray-400 text-sm ml-2">/ year</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">One-time payment for 1 year full access</p>
          </div>

          {/* Features */}
          <ul className="space-y-3 mb-8">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">✓</span>
                {f}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                Initiating Payment...
              </span>
            ) : (
              '🔒 Pay ₹27,000 Securely'
            )}
          </button>

          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="text-xs text-gray-400">Powered by</span>
            <span className="text-xs font-semibold text-gray-600">Cashfree Payments</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400">256-bit SSL encrypted</span>
          </div>
        </div>

        <p className="text-center text-blue-200 text-xs mt-4">
          Having trouble? Contact{' '}
          <a href="mailto:support@crmapp.in" className="underline">support@crmapp.in</a>
        </p>
      </div>
    </div>
  );
}
