const Product = require('../models/product')

exports.getProduct = (req, res, next) => {
    Product.fetchAll((product) => {
        res.render('shop/product-list', {
            prod: product,
            pageTitle: 'All Products',
            path: '/products',
            hasProduct: product.length > 0,
            activeShop: true,
            productCSS: true,
        });
    });
    
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll((product) => {
        res.render('shop/index', {
            prod: product,
            pageTitle: 'Shop',
            path: '/',
        });
    });
};

exports.getCart = (req, res, next) => {
   res.render('shop/cart', {
       path: '/cart',
       pageTitle: 'Yore Cart'
   })
};

exports.getCheckout = (req, res, next) => {
   res.render('shop/chekout', {
       path: '/checkout',
       pageTitle: 'Checkout'
   })
};

