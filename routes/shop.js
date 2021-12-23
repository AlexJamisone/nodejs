const path = require('path');
const express = require('express');

const shopControllers = require('../controllers/shop')


const router = express.Router();

router.get('/', shopControllers.getIndex);

router.get('/products', shopControllers.getProduct)

router.get('/products/:productId', shopControllers.getProducts)

// router.get('/cart', shopControllers.getCart)

// router.post('/cart', shopControllers.postCart)

// router.post('/cart-delet-item', shopControllers.postCartDeleteItem)

// router.post('/create-order', shopControllers.postOrder)

// router.get('/orders', shopControllers.getOrders)




module.exports = router;