const fs = require('fs');
const path = require('path');

const p = 
        path.join(path.dirname(process.mainModule.filename),
        'data', 
        'cart.json'
    );

module.exports = class Cart {
    static addProduct(id, productPrice) {
        // Fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = {product: [], totalPrice: 0};
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            // Analyzy the cart => Find existing product
            const existingProductIndex = cart.product.findIndex(prod => prod.id === id)
            const existiingProduct = cart.product[existingProductIndex]

            // Add new product/ increase quantity

            let updatedProduct;
            if (existiingProduct) {
                updatedProduct = {...existiingProduct};
                updatedProduct.qty = updatedProduct.qty + 1
                cart.product = [...cart.product];
                cart.product[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1}
                cart.product = [...cart.product, updatedProduct]
            }
            cart.totalPrice = cart.totalPrice + +productPrice
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err)
            });
            
        })
    }

    static deletProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            const updateCart = {...JSON.parse(fileContent)};
            const products = updateCart.product.find(prod => prod.id === id);
            const productQty = products.qty;
            updateCart.product = updateCart.product.filter(
                prod => prod.id !== id
            )
            updateCart.totalPrice = updateCart.totalPrice - productPrice * productQty;
            fs.writeFile(p, JSON.stringify(updateCart), err => {
                console.log(err)
            });
        });
    }

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (err) {
                cb(null)
            } else {
                cb(cart);
            }
        });
    }
};