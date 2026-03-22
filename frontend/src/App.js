import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerForm from './pages/CustomerForm';
import Leads from './pages/Leads';
import LeadForm from './pages/LeadForm';
import Login from './pages/Login';
import Subscription from './pages/Subscription';
import PaymentCallback from './pages/PaymentCallback';

function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-blue-600"></div>
    </div>
  );
}

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireSubscription({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.subscriptionStatus !== 'active') return <Navigate to="/subscribe" replace />;
  return children;
}

function CRMLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to={user.subscriptionStatus === 'active' ? '/' : '/subscribe'} replace /> : <Login />}
      />
      <Route path="/subscribe" element={<RequireAuth><Subscription /></RequireAuth>} />
      <Route path="/payment/callback" element={<RequireAuth><PaymentCallback /></RequireAuth>} />

      <Route path="/" element={<RequireSubscription><CRMLayout><Dashboard /></CRMLayout></RequireSubscription>} />
      <Route path="/customers" element={<RequireSubscription><CRMLayout><Customers /></CRMLayout></RequireSubscription>} />
      <Route path="/customers/new" element={<RequireSubscription><CRMLayout><CustomerForm /></CRMLayout></RequireSubscription>} />
      <Route path="/customers/edit/:id" element={<RequireSubscription><CRMLayout><CustomerForm /></CRMLayout></RequireSubscription>} />
      <Route path="/leads" element={<RequireSubscription><CRMLayout><Leads /></CRMLayout></RequireSubscription>} />
      <Route path="/leads/new" element={<RequireSubscription><CRMLayout><LeadForm /></CRMLayout></RequireSubscription>} />
      <Route path="/leads/edit/:id" element={<RequireSubscription><CRMLayout><LeadForm /></CRMLayout></RequireSubscription>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
