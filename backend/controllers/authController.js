const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper: generate avatar URL from email using Gravatar-style initials
const getAvatarUrl = (name) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=3b82f6&color=fff&size=80`;
};

// Email sign-in — finds or creates user by email
exports.emailLogin = async (req, res) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }

  try {
    let user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      const displayName = name || email.split('@')[0];
      user = await User.create({
        name: displayName,
        email: email.toLowerCase().trim(),
        avatar: getAvatarUrl(displayName),
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        subscriptionStatus: user.subscriptionStatus,
      },
    });
  } catch (err) {
    console.error('Email login error:', err.message);
    res.status(500).json({ message: 'Sign-in failed. Please try again.' });
  }
};

exports.getMe = async (req, res) => {
  const u = req.user;
  res.json({
    id: u._id,
    name: u.name,
    email: u.email,
    avatar: u.avatar,
    subscriptionStatus: u.subscriptionStatus,
  });
};

exports.getMe = async (req, res) => {
  const u = req.user;
  res.json({
    id: u._id,
    name: u.name,
    email: u.email,
    avatar: u.avatar,
    subscriptionStatus: u.subscriptionStatus,
  });
};
