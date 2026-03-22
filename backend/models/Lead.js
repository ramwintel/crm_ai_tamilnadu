const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    source: {
      type: String,
      enum: ['Website', 'Referral', 'Social Media', 'Cold Call', 'Email', 'Other'],
      default: 'Other',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost', 'Converted'],
      default: 'New',
    },
    value: { type: Number, default: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
