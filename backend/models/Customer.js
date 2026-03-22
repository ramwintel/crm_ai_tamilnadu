const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    address: { type: String, trim: true },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Prospect'],
      default: 'Active',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
