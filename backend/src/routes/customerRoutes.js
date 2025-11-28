const express = require('express');
const { getProducts } = require('../controllers/customerController');

const router = express.Router();

// 👇 API endpoint (frontend yahi call karega)
router.get('/products', getProducts);

module.exports = router;
