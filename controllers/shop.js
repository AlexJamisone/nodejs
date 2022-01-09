const Product = require('../models/product')
const Order = require('../models/order')

exports.getProduct = (req, res, next) => {
    Product.find()
        .then(product => {
            console.log(product)
            res.render('shop/product-list', {
                prod: product,
                pageTitle: 'All Products',
                path: '/products',
                hasProduct: product.length > 0,
                activeShop: true,
                productCSS: true,
                isAutenticated: req.isLoggin
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
                path: '/products',
                isAutenticated: req.isLoggin
            })
        })
        .catch(err => console.log(err))
   
};

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(product => {
            res.render('shop/index', {
                prod: product,
                pageTitle: 'Shop',
                path: '/',
                isAutenticated: req.isLoggin
            });
        })
        .catch(err => {
            console.log(err)
        })
};

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {  
            const products = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Yore Cart',
                products: products,
                isAutenticated: req.isLoggin
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
    .removeFromCart(prodId)
    .then(result => {
        res.redirect('/')
    })
    .catch(err => {
        console.log(err)
    });
};

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            console.log(user.cart.items)  
            const products = user.cart.items.map(i => {
                return {quantity: i.quantity, product: {...i.productId._doc}}
            })
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user
                },
                products: products
            });
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders')
        })
        .catch(err => {
            console.log(err)
        })
        
    
};

exports.getOrders = (req, res, next) => {
    Order.find({"user.userId": req.user._id})
        .then(orders =>{
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders,
                ordProd: orders.products,
                isAutenticated: req.isLoggin
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

