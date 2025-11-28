const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

router.get('/', auth, role('customer'), cartController.getCart);
router.post('/', auth, role('customer'), cartController.addToCart);
router.put('/', auth, role('customer'), cartController.updateCartItem);
router.delete('/:productId', auth, role('customer'), cartController.removeCartItem);
router.delete('/', auth, role('customer'), cartController.clearCart);

module.exports = router;
