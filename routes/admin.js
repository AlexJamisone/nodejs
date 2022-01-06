const path = require('path');
const express = require('express');


const adminControlls = require('../controllers/admin')

const router = express.Router();



// /admin/add-product => GET
router.get('/add-product', adminControlls.getAddProduct);

router.get('/products', adminControlls.getProducts);


// // /admin/add-product => POST

router.post('/add-product', adminControlls.postAddProduct);

router.get('/edit-product/:productId', adminControlls.getEditProduct);

router.post('/edit-product', adminControlls.postEditProduct)

router.post('/delet-product', adminControlls.postDeletProduct)

module.exports = router;