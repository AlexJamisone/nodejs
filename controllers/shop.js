const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getProduct = (req, res, next) => {
    Product.findAll()
        .then(product => {
            res.render('shop/product-list', {
                prod: product,
                pageTitle: 'All Products',
                path: '/products',
                hasProduct: product.length > 0,
                activeShop: true,
                productCSS: true,
            });
        })
        .catch(err => {
            console.log(err)
        });
    
}

exports.getProducts = (req, res, next) => {
    const prodId = req.params.productId
    Product.findByPk(prodId)
        .then(product => {
            res.render('shop/product-details', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            })
        })
        .catch(err => console.log(err))
   
};

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/index', {
                prod: products,
                pageTitle: 'Shop',
                path: '/',
            });
        })
        .catch(err => {
            console.log(err)
        })
};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProduct = [];
            for (product of products) {
                const cartProductData = cart.product.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProduct.push({productData: product, qty: cartProductData.qty})
                }
            }
            res.render('shop/cart', {
               path: '/cart',
               pageTitle: 'Yore Cart',
               products: cartProduct
           });                    
        });
    });
};

exports.postCart = (req, res, next) => {
   const prodId = req.body.productId
   Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price)
   });
   res.redirect('/cart')
};

exports.postCartDeleteItem = (req, res, next) => {
   const prodId = req.body.productId;
   Product.findById(prodId, product => {
       Cart.deletProduct(prodId, product.price);
       res.redirect('/cart')
   });
};

exports.getOrders = (req, res, next) => {
   res.render('shop/orders', {
       path: '/orders',
       pageTitle: 'Your Orders'
   })
};

exports.getCheckout = (req, res, next) => {
   res.render('shop/chekout', {
       path: '/checkout',
       pageTitle: 'Checkout'
   })
};

