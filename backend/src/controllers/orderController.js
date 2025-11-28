const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.placeOrder = async (req, res) => {
  try {
    // Accept either items array in body OR use cart
    // items: [{ product: productId, quantity }]
    let items = req.body.items;
    if (!items || !items.length) {
      // take from cart
      const cart = await Cart.findOne({ customer: req.user.id }).populate('items.product');
      if (!cart || !cart.items.length) return res.status(400).json({ message: 'Cart is empty' });
      items = cart.items.map(i => ({ product: i.product._id, quantity: i.quantity, price: i.price }));
    } else {
      // normalize prices from DB
      items = await Promise.all(items.map(async it => {
        const prod = await Product.findById(it.product);
        if (!prod) throw new Error('Product not found: ' + it.product);
        return { product: prod._id, quantity: Number(it.quantity || 1), price: prod.price, vendor: prod.addedBy };
      }));
    }

    // total
    const totalAmount = items.reduce((s, it) => s + (it.price * it.quantity), 0);
    const { paymentMethod } = req.body;
    if (!paymentMethod) return res.status(400).json({ message: 'paymentMethod required' });

    const paymentStatus = (paymentMethod === 'COD') ? 'Pending' : 'Paid';

  const status = (paymentMethod === 'COD') ? 'Pending' : 'Confirmed';

const order = await Order.create({
  customer: req.user.id,
  items,
  totalAmount,
  paymentMethod,
  paymentStatus,
  status
});


    // clear cart if order placed from cart
    await Cart.findOneAndDelete({ customer: req.user.id });

    return res.status(201).json(order);
  } catch (err) {
    console.error(err); res.status(500).json({ message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email mobile')
      .populate('items.product', 'name price images addedBy');
    return res.json(orders);
  } catch (err) {
    console.error(err); res.status(500).json({ message: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email mobile')
      .populate('items.product', 'name price images addedBy');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json(order);
  } catch (err) {
    console.error(err); res.status(500).json({ message: err.message });
  }
};

// For customer: get their orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate('items.product', 'name price images addedBy')
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    console.error(err); res.status(500).json({ message: err.message });
  }
};

// Update order status (admin or vendor can update? admin only here)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status || order.status;
    await order.save();
    return res.json(order);
  } catch (err) {
    console.error(err); res.status(500).json({ message: err.message });
  }
};
