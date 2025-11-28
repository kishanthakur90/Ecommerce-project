const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// place order (customer) - can send items or use cart
router.post('/', auth, role('customer'), orderController.placeOrder);

// customer orders
router.get('/me', auth, role('customer'), orderController.getUserOrders);

// admin
router.get('/', auth, role('admin'), orderController.getAllOrders);
router.get('/:id', auth, role('admin'), orderController.getOrder);
router.put('/:id/status', auth, role('admin'), orderController.updateOrderStatus);

module.exports = router;
