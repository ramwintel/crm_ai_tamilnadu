const Lead = require('../models/Lead');

// GET all leads
exports.getLeads = async (req, res) => {
  try {
    const { search, status, source } = req.query;
    const query = {};
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }, { company: new RegExp(search, 'i') }];
    if (status) query.status = status;
    if (source) query.source = source;
    const leads = await Lead.find(query).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single lead
exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE lead
exports.createLead = async (req, res) => {
  try {
    const lead = new Lead(req.body);
    const saved = await lead.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE lead
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE lead
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET lead stats
exports.getStats = async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const qualified = await Lead.countDocuments({ status: 'Qualified' });
    const converted = await Lead.countDocuments({ status: 'Converted' });
    const lost = await Lead.countDocuments({ status: 'Lost' });
    const totalValue = await Lead.aggregate([{ $group: { _id: null, total: { $sum: '$value' } } }]);
    res.json({ total, newLeads, qualified, converted, lost, totalValue: totalValue[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
