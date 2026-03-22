import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyPayment } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState('verifying'); // verifying | success | failed

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    if (!orderId) {
      setStatus('failed');
      return;
    }

    verifyPayment(orderId)
      .then(async (res) => {
        if (res.data.success) {
          await refreshUser();
          setStatus('success');
          toast.success('🎉 Payment successful! Welcome to CRM App.');
          setTimeout(() => navigate('/'), 2500);
        } else {
          setStatus('failed');
          toast.error('Payment was not completed.');
        }
      })
      .catch(() => {
        setStatus('failed');
        toast.error('Could not verify payment. Please contact support.');
      });
  }, []); // eslint-disable-line

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10 text-center">
        {status === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <h2 className="text-xl font-bold text-gray-800">Verifying Payment...</h2>
            <p className="text-gray-500 mt-2 text-sm">Please wait while we confirm your payment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🎉</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Your CRM subscription is now active. Redirecting to dashboard...
            </p>
            <div className="mt-6 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-1 bg-green-500 rounded-full animate-pulse w-full"></div>
            </div>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Payment Failed</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Your payment could not be completed or was cancelled.
            </p>
            <button
              onClick={() => navigate('/subscribe')}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium w-full"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
