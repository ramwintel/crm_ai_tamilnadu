const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, webhook } = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/create-order', authMiddleware, createOrder);
router.get('/verify', authMiddleware, verifyPayment);
router.post('/webhook', webhook);

module.exports = router;
