const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const images = [];
    if (req.files && req.files.length) {
      req.files.forEach(f => images.push(f.filename));
    }
    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      images,
      addedBy: req.user.id,
      addedByRole: req.user.role
    });
    return res.status(201).json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ UPDATED getAllProducts (search + category filter added)
exports.getAllProducts = async (req, res) => {
  try {
    const { q, category } = req.query;

    const filter = {};

    // 🔍 Case-insensitive search by name
    if (q) {
      filter.name = { $regex: q, $options: 'i' };
    }

    // 🏷 Filter by category
    if (category) {
      filter.category = category;
    }

    // 🧩 Apply filters & sort by newest
    const products = await Product.find(filter).sort({ createdAt: -1 });

    return res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });

    // vendor can only change their own products
    if (req.user.role === 'vendor' && String(product.addedBy) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    const { name, description, price, category, stock } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;

    if (req.files && req.files.length) {
      product.images = req.files.map(f => f.filename);
    }

    await product.save();
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });

    if (req.user.role === 'vendor' && String(product.addedBy) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    await product.deleteOne();
    return res.json({ message: 'Product deleted' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
