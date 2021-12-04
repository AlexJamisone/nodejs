const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render('add-product',
        {pageTitle: 'Add product',
        path: '/admin/add-product',
        activeAddProduct: true,
        formsCSS: true,
        productCSS: true
    })
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title)
    product.save()
    res.redirect('/');
}

exports.getProduct = (req, res, next) => {
    Product.fetchAll((product) => {
        res.render('shop', {
            prod: product,
            pageTitle: 'Shop',
            path: '/',
            hasProduct: product.length > 0,
            activeShop: true,
            productCSS: true,
        });
    });
    
}
