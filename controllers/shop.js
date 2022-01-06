const Product = require('../models/product')

exports.getProduct = (req, res, next) => {
    Product.fetchAll()
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
    Product.findById(prodId)
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
    Product.fetchAll()
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
    req.user.getCart()
        .then(products => {    
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Yore Cart',
                products: products
            });    
        })
        .catch(err => {
            console.log(err)
        });
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId)
		.then(product =>{
			return req.user.addToCart(product)
		})
		.then(result => {
            console.log(result)
            res.redirect('/cart');
		})
		.catch(err => {
			console.log(err)
		});
};

exports.postCartDeleteItem = (req, res, next) => {
   const prodId = req.body.productId;
   req.user
    .deletItemFromCart(prodId)
    .then(result => {
        res.redirect('/')
    })
    .catch(err => {
        console.log(err)
    });
};

exports.postOrder = (req, res, next) => {
    req.user
        .addOrder()
        .then(result => {
            res.redirect('/orders')
        })
        .catch(err => {
            console.log(err)
        })
};

exports.getOrders = (req, res, next) => {
    req.user
        .getOrder()
        .then(orders =>{
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders,
                ordProd: orders.products
            })
        })
        .catch(err => {
            console.log(err)
        });
};

exports.getCheckout = (req, res, next) => {
   res.render('shop/chekout', {
       path: '/checkout',
       pageTitle: 'Checkout'
   })
};

