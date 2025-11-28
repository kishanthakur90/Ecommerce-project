const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: String,
  state: String,
  city: String,
  pincode: String,
  profilePic: String,
  role: { type: String, default: 'customer' }
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);
