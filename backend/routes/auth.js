const express = require('express');
const router = express.Router();
const { emailLogin, getMe } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/login', emailLogin);
router.get('/me', authMiddleware, getMe);

module.exports = router;
