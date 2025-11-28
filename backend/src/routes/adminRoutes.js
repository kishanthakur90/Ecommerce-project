const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

router.get('/customers', auth, role('admin'), adminController.getCustomers);
router.get('/vendors', auth, role('admin'), adminController.getVendors);
router.delete('/vendors/:id', auth, role('admin'), adminController.deleteVendor);

module.exports = router;
