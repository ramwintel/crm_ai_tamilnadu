const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    avatar: { type: String },
    subscriptionStatus: {
      type: String,
      enum: ['inactive', 'pending', 'active'],
      default: 'inactive',
    },
    subscriptionPaidAt: { type: Date },
    cashfreeOrderId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
