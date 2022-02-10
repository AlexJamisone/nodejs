const path = require('path');
const express = require('express');


const adminControlls = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')
const {body} = require('express-validator/check')

const router = express.Router();



// /admin/add-product => GET
router.get('/add-product', isAuth, adminControlls.getAddProduct);

router.get('/products', isAuth, adminControlls.getProducts);


// // /admin/add-product => POST

router.post('/add-product',
[
    body('title', 'Must be only latter')
        .isAlphanumeric()
        .isLength({min: 3})
        .trim(),
    body('price')
        .isFloat(),
    body('description')
    .isLength({min: 8})
    .trim()

],
    isAuth,
    adminControlls.postAddProduct
);

router.get('/edit-product/:productId', isAuth, adminControlls.getEditProduct);

router.post('/edit-product', [
    body('title')
        .isString()
        .isLength({min: 3})
        .trim(),
    body('price')
        .isFloat(),
    body('description')
        .isLength({min: 8, max: 400})
        .trim()

], isAuth, adminControlls.postEditProduct)

router.post('/delet-product', isAuth, adminControlls.postDeletProduct)

module.exports = router;