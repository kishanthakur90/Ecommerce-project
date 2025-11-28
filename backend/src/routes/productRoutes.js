const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');

// public
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

// protected create/update/delete
router.post('/', auth, role('admin', 'vendor'), upload.array('images', 5), productController.createProduct);
router.put('/:id', auth, role('admin', 'vendor'), upload.array('images', 5), productController.updateProduct);
router.delete('/:id', auth, role('admin', 'vendor'), productController.deleteProduct);

module.exports = router;
