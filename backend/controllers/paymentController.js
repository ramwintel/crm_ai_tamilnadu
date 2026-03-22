const axios = require('axios');
const User = require('../models/User');

const CASHFREE_BASE = 'https://sandbox.cashfree.com/pg';
const SUBSCRIPTION_AMOUNT = 27000;

const cashfreeHeaders = {
  'x-api-version': '2022-09-01',
  'x-client-id': process.env.CASHFREE_APP_ID,
  'x-client-secret': process.env.CASHFREE_SECRET,
  'Content-Type': 'application/json',
};

// Create Cashfree order
exports.createOrder = async (req, res) => {
  const user = req.user;
  const orderId = `CRM_${user._id}_${Date.now()}`;

  try {
    const response = await axios.post(
      `${CASHFREE_BASE}/orders`,
      {
        order_id: orderId,
        order_amount: SUBSCRIPTION_AMOUNT,
        order_currency: 'INR',
        customer_details: {
          customer_id: user._id.toString(),
          customer_name: user.name,
          customer_email: user.email,
          customer_phone: '9999999999',
        },
        order_meta: {
          return_url: `${process.env.FRONTEND_URL}/payment/callback?order_id={order_id}`,
          notify_url: `${process.env.BACKEND_URL}/api/payment/webhook`,
        },
        order_note: 'CRM Annual Subscription',
      },
      { headers: cashfreeHeaders }
    );

    // Save order id on user
    await User.findByIdAndUpdate(user._id, {
      cashfreeOrderId: orderId,
      subscriptionStatus: 'pending',
    });

    res.json({
      orderId,
      paymentSessionId: response.data.payment_session_id,
      amount: SUBSCRIPTION_AMOUNT,
    });
  } catch (err) {
    console.error('Cashfree create order error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
};

// Verify payment after redirect
exports.verifyPayment = async (req, res) => {
  const { order_id } = req.query;
  if (!order_id) return res.status(400).json({ message: 'order_id required' });

  try {
    const response = await axios.get(`${CASHFREE_BASE}/orders/${order_id}`, {
      headers: cashfreeHeaders,
    });

    const orderData = response.data;
    const orderStatus = orderData.order_status;

    if (orderStatus === 'PAID') {
      const user = await User.findOneAndUpdate(
        { cashfreeOrderId: order_id },
        { subscriptionStatus: 'active', subscriptionPaidAt: new Date() },
        { new: true }
      );
      return res.json({
        success: true,
        subscriptionStatus: 'active',
        message: 'Payment successful! Subscription activated.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          subscriptionStatus: user.subscriptionStatus,
        },
      });
    } else {
      await User.findOneAndUpdate(
        { cashfreeOrderId: order_id },
        { subscriptionStatus: 'inactive' }
      );
      return res.json({
        success: false,
        subscriptionStatus: orderStatus,
        message: `Payment not completed. Status: ${orderStatus}`,
      });
    }
  } catch (err) {
    console.error('Verify payment error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Failed to verify payment' });
  }
};

// Cashfree webhook (server-to-server)
exports.webhook = async (req, res) => {
  const { data } = req.body;
  if (!data) return res.sendStatus(200);

  const { order, payment } = data;
  if (payment?.payment_status === 'SUCCESS') {
    await User.findOneAndUpdate(
      { cashfreeOrderId: order.order_id },
      { subscriptionStatus: 'active', subscriptionPaidAt: new Date() }
    );
  }
  res.sendStatus(200);
};
