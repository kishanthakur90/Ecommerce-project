const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/authMiddleware');

router.post('/process', auth, paymentController.processPayment);

module.exports = router;
