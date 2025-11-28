const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: { type: [String], default: [] }, // filenames saved in uploads/
  category: String,
  stock: { type: Number, default: 0 },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }, // vendor id or admin id
  addedByRole: { type: String, enum: ['admin', 'vendor'], default: 'admin' }
}, { timestamps: true });

module.exports = require('mongoose').model('Product', ProductSchema);
