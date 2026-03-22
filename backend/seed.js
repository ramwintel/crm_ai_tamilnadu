const mongoose = require('mongoose');
require('dotenv').config();

const Customer = require('./models/Customer');
const Lead = require('./models/Lead');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/crm_db';

const customers = [
  { name: 'Arjun Sharma', email: 'arjun.sharma@techcorp.in', phone: '+91 9876543210', company: 'TechCorp India', address: '12, Anna Salai, Chennai - 600002', status: 'Active', notes: 'Key enterprise client. Renews contract annually.' },
  { name: 'Priya Rajan', email: 'priya.rajan@infosolutions.com', phone: '+91 9845012345', company: 'Info Solutions Pvt Ltd', address: '45, MG Road, Bengaluru - 560001', status: 'Active', notes: 'Interested in upgrading to premium plan.' },
  { name: 'Karthik Murugan', email: 'karthik.m@startup.io', phone: '+91 9901234567', company: 'StartupIO', address: '7, Nungambakkam High Rd, Chennai - 600034', status: 'Prospect', notes: 'Met at TechSummit 2025. Follow up next month.' },
  { name: 'Divya Nair', email: 'divya.nair@globalsoft.com', phone: '+91 9812345678', company: 'GlobalSoft Technologies', address: '88, Bandra West, Mumbai - 400050', status: 'Active', notes: 'Long-term client since 2022.' },
  { name: 'Ramesh Venkataraman', email: 'ramesh.v@dataworks.co', phone: '+91 9823456789', company: 'DataWorks Co.', address: '23, Jubilee Hills, Hyderabad - 500033', status: 'Inactive', notes: 'Contract expired in Dec 2025. Re-engage with new offer.' },
  { name: 'Sneha Pillai', email: 'sneha.pillai@cloudnine.io', phone: '+91 9934567890', company: 'CloudNine Solutions', address: '56, Salt Lake, Kolkata - 700091', status: 'Active', notes: 'Uses our analytics and reporting modules.' },
  { name: 'Vijay Krishnan', email: 'vijay.k@nexgen.in', phone: '+91 9756789012', company: 'NexGen Systems', address: '34, Connaught Place, New Delhi - 110001', status: 'Prospect', notes: 'Requested a product demo for Q2.' },
  { name: 'Ananya Bose', email: 'ananya.bose@mediaplusnews.com', phone: '+91 9867890123', company: 'MediaPlus News', address: '9, Sector 21, Pune - 411045', status: 'Inactive', notes: 'Budget constraints. May revisit in FY2027.' },
];

const leads = [
  { name: 'Suresh Babu', email: 'suresh.babu@newventures.in', phone: '+91 9700112233', company: 'New Ventures Ltd', source: 'Referral', status: 'New', value: 120000, notes: 'Referred by Arjun Sharma. Looking for ERP integration.' },
  { name: 'Meena Sundaram', email: 'meena.s@brightideas.co', phone: '+91 9700223344', company: 'Bright Ideas Co.', source: 'Website', status: 'Contacted', value: 75000, notes: 'Downloaded brochure. Scheduled a call for next week.' },
  { name: 'Arun Prakash', email: 'arun.prakash@inovate.tech', phone: '+91 9700334455', company: 'iNovate Tech', source: 'Social Media', status: 'Qualified', value: 250000, notes: 'Strong interest in the enterprise package. Sending proposal.' },
  { name: 'Lakshmi Devi', email: 'lakshmi.d@smartretail.in', phone: '+91 9700445566', company: 'Smart Retail India', source: 'Cold Call', status: 'New', value: 40000, notes: 'Cold outreach. Initial interest shown in the SME plan.' },
  { name: 'Mohan Raj', email: 'mohan.raj@alphaconsult.com', phone: '+91 9700556677', company: 'Alpha Consulting', source: 'Email', status: 'Converted', value: 180000, notes: 'Successfully converted after 3 follow-ups. Contract signed.' },
  { name: 'Deepa Menon', email: 'deepa.menon@finbridge.io', phone: '+91 9700667788', company: 'FinBridge Solutions', source: 'Referral', status: 'Qualified', value: 300000, notes: 'High-value opportunity. CFO meeting scheduled.' },
  { name: 'Ravi Chandran', email: 'ravi.c@logistics360.in', phone: '+91 9700778899', company: 'Logistics 360', source: 'Website', status: 'Lost', value: 60000, notes: 'Went with a competitor. Follow up again in 6 months.' },
  { name: 'Kavitha Subramanian', email: 'kavitha.s@edutech.learn', phone: '+91 9700889900', company: 'EduTech Learning', source: 'Social Media', status: 'Contacted', value: 95000, notes: 'Interested in LMS integration module. Need pricing deck.' },
  { name: 'Naresh Kumar', email: 'naresh.k@urbanrealty.in', phone: '+91 9700990011', company: 'Urban Realty India', source: 'Other', status: 'New', value: 150000, notes: 'Walk-in inquiry. Looking for CRM for property management.' },
  { name: 'Pooja Iyer', email: 'pooja.iyer@healthfirst.com', phone: '+91 9701001122', company: 'HealthFirst Clinics', source: 'Cold Call', status: 'Qualified', value: 220000, notes: 'Multi-branch clinic chain. Needs multi-user access and reporting.' },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Customer.deleteMany({});
    await Lead.deleteMany({});
    console.log('Cleared existing data');

    // Insert dummy data
    const insertedCustomers = await Customer.insertMany(customers);
    const insertedLeads = await Lead.insertMany(leads);

    console.log(`✅ Inserted ${insertedCustomers.length} customers`);
    console.log(`✅ Inserted ${insertedLeads.length} leads`);
    console.log('\nSeed completed successfully!');
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
