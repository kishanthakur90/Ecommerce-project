const Order = require('../models/Order');

exports.processPayment = async (req, res) => {
  try {
    // payload: { orderId } OR { items, paymentMethod } -> we'll create order when payment succeeds
    const { orderId, items, paymentMethod, totalAmount } = req.body;

    // Simulate async payment processing delay
    await new Promise(r => setTimeout(r, 1000));

    // If orderId provided -> mark order paid
    if (orderId) {
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      order.paymentStatus = 'Paid';
      await order.save();
      return res.json({ success: true, order });
    }

    // Or if items + paymentMethod + totalAmount provided -> create order and mark Paid
    if (!items || !paymentMethod) return res.status(400).json({ message: 'Invalid payment payload' });

    // here we expect client to call /orders (placeOrder) directly, so we keep this simple:
    return res.json({ success: true, message: 'Payment simulated (client should create order via /orders)' });
  } catch (err) {
    console.error(err); res.status(500).json({ message: err.message });
  }
};


exports.getAllProducts = async (req, res) => {
  try {
    const { q, category } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (category) filter.category = category;
    const products = await Product.find(filter).sort({ createdAt: -1 });
    return res.json(products);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const Product = require('../models/Product');