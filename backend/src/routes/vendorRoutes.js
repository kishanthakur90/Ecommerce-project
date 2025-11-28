const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');

// vendor profile
router.get('/me', auth, role('vendor'), vendorController.getMyProfile);
router.put('/me', auth, role('vendor'), upload.single('profilePic'), vendorController.updateMyProfile);

// vendor products (private)
router.get('/me/products', auth, role('vendor'), vendorController.getMyProducts);

// vendor public products (by vendor id)
router.get('/:id/products', vendorController.getVendorProductsPublic);

// vendor orders (only vendor's own items)
router.get('/me/orders', auth, role('vendor'), vendorController.getMyOrders);

module.exports = router;
