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
        .then(cart => {
            return cart.getProducts()
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
        })
        .catch(err => {
            console.log(err)
        });
};

exports.postCart = (req, res, next) => {
   const prodId = req.body.productId
   let fetchCart;
   let newQuantiti = 1;
   req.user.getCart()
        .then(cart => {
            fetchCart = cart
            return cart.getProducts({ where: {id: prodId}})
        })
        .then(products => {
            let product
            if (products.length > 0) {
                product = products[0]
            }
            if (product) {
                const oldQut = product.cartItem.quantity;
                newQuantiti = oldQut + 1;
                return product;
            }
            return Product.findByPk(prodId)
        })
        .then(product => {
            return fetchCart.addProduct(product, {
                through:  {quantity: newQuantiti}
            });
        })
        .then(() => {
            res.redirect('/cart')
        })
        .catch(err => {
            console.log(err)
        });
};

exports.postCartDeleteItem = (req, res, next) => {
   const prodId = req.body.productId;
   req.user.getCart()
    .then(cart => {
        return cart.getProducts({where: {id: prodId}})
    })
    .then(products => {
        const product = products[0]
        return product.cartItem.destroy();
    })
    .then(result => {
        res.redirect('/')
    })
    .catch(err => {
        console.log(err)
    });
};

exports.postOrder = (req, res, next) => {
    let fetchCart;
    req.user.getCart()
        .then(cart => {
            fetchCart = cart;
            return cart.getProducts()
                .then(products => {
                    return req.user.createOrder()
                        .then(order =>{
                            return order.addProduct(
                                products.map(product => {
                                    product.orderItem = {quantity: product.cartItem.quantity}
                                })
                            );
                        })
                        .catch(err => {
                            console.log(err)
                        });
                })
                .then(result => {
                    return fetchCart.setProducts(null)
                })
                .then(result => {
                    res.redirect('/orders')
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err)
        })
};

exports.getOrders = (req, res, next) => {
    req.user.getOrders({include: ['products']})
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

