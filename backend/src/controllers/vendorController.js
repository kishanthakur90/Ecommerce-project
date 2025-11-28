const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Order = require('../models/Order');

/**
 * GET /api/vendors/me
 */
exports.getMyProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.user.id).select('-password');
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    return res.json(vendor);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * PUT /api/vendors/me
 * multipart/form-data -> optional file 'profilePic'
 */
exports.updateMyProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.user.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    const fields = ['name','shopName','mobile','state','city','pincode'];
    fields.forEach(f => {
      if (req.body[f] !== undefined) vendor[f] = req.body[f];
    });

    if (req.file) vendor.profilePic = req.file.filename;

    await vendor.save();
    const out = vendor.toObject();
    delete out.password;
    return res.json(out);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/vendors/me/products
 */
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ addedBy: req.user.id }).sort({ createdAt: -1 });
    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/vendors/:id/products  (public)
 */
exports.getVendorProductsPublic = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const products = await Product.find({ addedBy: vendorId }).sort({ createdAt: -1 });
    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/vendors/me/orders
 * returns orders that include at least one item from this vendor;
 * also filters items array to only include vendor's items (so vendor sees only their items in each order)
 */
exports.getMyOrders = async (req, res) => {
  try {
    const vendorId = String(req.user.id);
    // populate products + customer
    const orders = await Order.find()
      .populate('customer', 'name email mobile')
      .populate('items.product', 'name price images addedBy');

    const vendorOrders = [];

    for (const order of orders) {
      const vendorItems = order.items.filter(it => it.product && String(it.product.addedBy) === vendorId);
      if (vendorItems.length) {
        vendorOrders.push({
          _id: order._id,
          customer: order.customer,
          createdAt: order.createdAt,
          totalAmount: order.totalAmount,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          status: order.status,
          items: vendorItems
        });
      }
    }

    return res.json(vendorOrders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
