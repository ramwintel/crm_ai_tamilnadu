const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const customerRoutes = require('./routes/customers');
const leadRoutes = require('./routes/leads');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const { authMiddleware, subscriptionRequired } = require('./middleware/authMiddleware');

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

// Protected + subscription-gated routes
app.use('/api/customers', authMiddleware, subscriptionRequired, customerRoutes);
app.use('/api/leads', authMiddleware, subscriptionRequired, leadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CRM API is running' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/crm_db';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
