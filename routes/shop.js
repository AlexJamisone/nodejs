const path = require('path');
const express = require('express');

const shopControllers = require('../controllers/shop')
const isAuth = require('../middleware/is-auth')


const router = express.Router();

router.get('/', shopControllers.getIndex);

router.get('/products', shopControllers.getProduct)

router.get('/products/:productId', shopControllers.getProducts)

router.get('/cart', isAuth, shopControllers.getCart)

router.post('/cart', isAuth, shopControllers.postCart)

router.post('/cart-delet-item', isAuth, shopControllers.postCartDeleteItem)

router.post('/create-order', isAuth, shopControllers.postOrder)

router.get('/orders', isAuth, shopControllers.getOrders)

router.get('/orders/:orderId', isAuth, shopControllers.getInvoice)



module.exports = router;