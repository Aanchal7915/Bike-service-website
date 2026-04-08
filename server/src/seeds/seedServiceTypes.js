require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const ServiceType = require('../models/ServiceType');

const SERVICE_TYPES = [
  { value: 'regular_service', label: 'Regular Service', price: 'From ₹499', desc: 'Oil change, filter, complete check', order: 1 },
  { value: 'engine_repair', label: 'Engine Repair', price: 'From ₹999', desc: 'Engine diagnostics & repair', order: 2 },
  { value: 'puncture', label: 'Puncture Fix', price: 'From ₹149', desc: 'Quick tube & tubeless fix', order: 3 },
  { value: 'battery', label: 'Battery Service', price: 'From ₹299', desc: 'Battery check & replacement', order: 4 },
  { value: 'brake', label: 'Brake Service', price: 'From ₹349', desc: 'Brake pads, disc & fluid', order: 5 },
  { value: 'washing', label: 'Bike Washing', price: 'From ₹199', desc: 'Premium foam wash & wax', order: 6 },
];

const seed = async () => {
  await connectDB();
  for (const st of SERVICE_TYPES) {
    await ServiceType.findOneAndUpdate({ value: st.value }, st, { upsert: true, new: true });
  }
  console.log('Service types seeded successfully!');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
