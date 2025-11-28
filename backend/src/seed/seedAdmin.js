require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const connectDB = require('../config/db');

const seed = async () => {
  try {
    await connectDB();
    const email = process.env.ADMIN_EMAIL;
    const pwd = process.env.ADMIN_PASSWORD;
    if (!email || !pwd) {
      console.log('Please set ADMIN_EMAIL and ADMIN_PASSWORD in .env');
      process.exit(1);
    }
    const exists = await Admin.findOne({ email });
    if (exists) {
      console.log('Admin already exists:', email);
      process.exit(0);
    }
    const hashed = await bcrypt.hash(pwd, 10);
    const admin = await Admin.create({ name: 'Main Admin', email, password: hashed });
    console.log('Admin created:', admin.email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
