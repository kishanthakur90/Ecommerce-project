const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true } // snapshot price
});

const CartSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true },
  items: [CartItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);
