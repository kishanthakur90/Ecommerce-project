const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Vendor = require('../models/Vendor');
const Customer = require('../models/Customer');
const generateToken = require('../utils/generateToken');

const registerCustomer = async (req, res) => {
  try {
    const { name, email, password, mobile, state, city, pincode } = req.body;
    // check existing across collections
    const already = await Promise.any([
      Admin.findOne({ email }).then(d => d || null),
      Vendor.findOne({ email }).then(d => d || null),
      Customer.findOne({ email }).then(d => d || null),
    ]).catch(()=> null);

    if (already) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const customer = await Customer.create({
      name, email, password: hashed, mobile, state, city, pincode
    });
    return res.status(201).json({ message: 'Customer registered', customerId: customer._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const registerVendor = async (req, res) => {
  try {
    const { name, shopName, email, password, mobile, state, city, pincode } = req.body;
    const already = await Promise.any([
      Admin.findOne({ email }).then(d => d || null),
      Vendor.findOne({ email }).then(d => d || null),
      Customer.findOne({ email }).then(d => d || null),
    ]).catch(()=> null);

    if (already) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const vendor = await Vendor.create({
      name, shopName, email, password: hashed, mobile, state, city, pincode
    });
    return res.status(201).json({ message: 'Vendor registered', vendorId: vendor._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check admin first
    const admin = await Admin.findOne({ email });
    if (admin) {
      const match = await bcrypt.compare(password, admin.password);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });
      const token = generateToken({ id: admin._id, role: 'admin', email: admin.email });
      return res.json({ token, user: { id: admin._id, email: admin.email, role: 'admin', name: admin.name } });
    }

    const vendor = await Vendor.findOne({ email });
    if (vendor) {
      const match = await bcrypt.compare(password, vendor.password);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });
      const token = generateToken({ id: vendor._id, role: 'vendor', email: vendor.email });
      return res.json({ token, user: { id: vendor._id, email: vendor.email, role: 'vendor', name: vendor.name } });
    }

    const customer = await Customer.findOne({ email });
    if (customer) {
      const match = await bcrypt.compare(password, customer.password);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });
      const token = generateToken({ id: customer._id, role: 'customer', email: customer.email });
      return res.json({ token, user: { id: customer._id, email: customer.email, role: 'customer', name: customer.name } });
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerCustomer, registerVendor, login };
