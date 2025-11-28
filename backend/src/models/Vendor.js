const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shopName: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: String,
  state: String,
  city: String,
  pincode: String,
  profilePic: String,
  role: { type: String, default: 'vendor' }
}, { timestamps: true });

module.exports = mongoose.model('Vendor', VendorSchema);
