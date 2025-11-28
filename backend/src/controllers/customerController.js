const Product = require('../models/Product');

// ✅ Get all active products (with search + category)
exports.getProducts = async (req, res, next) => {
  try {
    const { q, category } = req.query;
    const query = { status: 'active' }; // only active products show to customers

    if (q) {
      query.name = { $regex: q, $options: 'i' }; // case-insensitive search
    }

    if (category && category !== '') {
      query.category = category;
    }

    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (err) {
    next(err); // error handler middleware ko pass karo
  }
};
