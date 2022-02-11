const fs = require('fs');
const path = require('path')

const PDFDocument = require('pdfkit')

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
                    email: req.user.email,
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

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('No order Found'))
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Not authorized User'))
            }
            const invoicesName = 'invoices-' + orderId + '.pdf';
            const invoicesPath = path.join('data', 'invoices', invoicesName);

            const pdfDoc = new PDFDocument()
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader('Content-Disposition', 'inline; filename="' + invoicesName + "");
            pdfDoc.pipe(fs.createWriteStream(invoicesPath))
            pdfDoc.pipe(res)

            //PDF DOCUM

            pdfDoc.fontSize(26).text('Invoice', {
                underline: true
            });
            pdfDoc.fontSize(17).text('____________________')
            let totalPrice = 0;
            order.products.forEach(prod => {
                totalPrice += prod.quantity * prod.product.price
                pdfDoc.text(
                    prod.product.title + 
                    ' - ' + 
                    prod.quantity + 
                    ' x ' + 
                    '$' + 
                    prod.product.price)
            });
            pdfDoc.text('_______________________')
            pdfDoc.text('Total Price: $' + totalPrice)

            pdfDoc.end()
            // fs.readFile(invoicesPath, (err, data) => {
            //     if (err) {
            //         return next(err);
            //     }
            //     res.setHeader("Content-Type", "application/pdf");
            //     res.setHeader('Content-Disposition', 'inline; filename="' + invoicesName + "");
            //     res.send(data) 
            // });
            // const file = fs.createReadStream(invoicesPath);

            // file.pipe(res)            
        })
        .catch(err => next(err));
    
};