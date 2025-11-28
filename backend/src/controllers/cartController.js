const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.user.id }).populate('items.product');
    return res.json(cart || { items: [] });
  } catch (err) {z
    console.error(err); res.status(500).json({ message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId required' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) {
      cart = new Cart({ customer: req.user.id, items: [] });
    }

    const idx = cart.items.findIndex(i => String(i.product) === String(productId));
    if (idx > -1) {
      cart.items[idx].quantity += Number(quantity);
      cart.items[idx].price = product.price;
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity), price: product.price });
    }

    await cart.save();
    const populated = await cart.populate('items.product');
    return res.json(populated);
  } catch (err) {
    console.error(err); res.status(500).json({ message: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId required' });

    const cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const idx = cart.items.findIndex(i => String(i.product) === String(productId));
    if (idx === -1) return res.status(404).json({ message: 'Item not in cart' });

    if (quantity <= 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantity = Number(quantity);
    }
    await cart.save();
    return res.json(await cart.populate('items.product'));
  } catch (err) {
    console.error(err); res.status(500).json({ message: err.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const productId = req.params.productId;
    const cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(i => String(i.product) !== String(productId));
    await cart.save();
    return res.json(await cart.populate('items.product'));
  } catch (err) {
    console.error(err); res.status(500).json({ message: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ customer: req.user.id });
    return res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error(err); res.status(500).json({ message: err.message });
  }
};
