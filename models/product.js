const fs = require('fs');
const path = require('path');

const Cart = require('./cart')


const p = 
        path.join(path.dirname(process.mainModule.filename),
        'data', 
        'products.json'
    );


const getProductsFile = cb => {
        fs.readFile(p, (err, fileContent) => {
            if(err) {
                cb([]);
            } else {
                cb(JSON.parse(fileContent))
            }
        });
    };



module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFile(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updateProducts = [...products];
                updateProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updateProducts), (err) => {
                    console.log(err)
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err)
                });
            }
        });
    };

    static deleteById(id) {
        getProductsFile(products => {
            const product = products.find(prod => prod.id === id)
            const updateProducts = products.filter(prod => prod.id !== id)
            fs.writeFile(p, JSON.stringify(updateProducts), err => {
                if (!err) {
                    Cart.deletProduct(id, product.price);
                }
            });
        });
    }

    static fetchAll(cb) {
        getProductsFile(cb)
    }

    static findById(id, cb) {
        getProductsFile(products => {
            const product = products.find(p => p.id === id)
            cb(product);
        });
    }
};