const Customer = require('../models/Customer');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');

exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().select('-password').sort({ createdAt: -1 });
    return res.json(customers);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().select('-password').sort({ createdAt: -1 });
    return res.json(vendors);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.deleteVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    // delete vendor's products first (optional)
    await Product.deleteMany({ addedBy: vendor._id });
    await vendor.deleteOne();
    return res.json({ message: 'Vendor and their products deleted' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
