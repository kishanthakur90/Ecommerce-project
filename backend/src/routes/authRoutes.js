const express = require('express');
const router = express.Router();
const { registerCustomer, registerVendor, login } = require('../controllers/authController');

router.post('/register/customer', registerCustomer);
router.post('/register/vendor', registerVendor);
router.post('/login', login);

module.exports = router;
