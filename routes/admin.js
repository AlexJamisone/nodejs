const path = require('path');
const express = require('express');


const adminControlls = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')

const router = express.Router();



// /admin/add-product => GET
router.get('/add-product', isAuth, adminControlls.getAddProduct);

router.get('/products', isAuth, adminControlls.getProducts);


// // /admin/add-product => POST

router.post('/add-product', isAuth, adminControlls.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminControlls.getEditProduct);

router.post('/edit-product', isAuth, adminControlls.postEditProduct)

router.post('/delet-product', isAuth, adminControlls.postDeletProduct)

module.exports = router;