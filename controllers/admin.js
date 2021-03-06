const mongoose = require('mongoose');
const fileHelper = require('../util/file')
const Product = require('../models/product');
const { validationResult } = require('express-validator/check');

exports.getAddProduct = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login')
    }
    res.render('admin/edit-product',
        {pageTitle: 'Add product',
        path: '/admin/add-product',
        activeAddProduct: true,
        editing: null,
        isAutenticated: req.session.isLoggedIn,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const description = req.body.description;
    const price = req.body.price;
    console.log(image)
    if (!image) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: "Add Product",
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                description: description,
                price: price,
            },
            errorMessage: 'Attached file is not an image',
            validationErrors: []
        })
    }

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: "Add Product",
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                description: description,
                price: price,
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }

    const imageUrl = image.path

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });
    product
    .save()
    .then(result => {
        console.log('Create Product')
        res.redirect('/admin/products')
    })
    .catch(err => {
        // res.redirect('/500')
        // return res.status(500).render('admin/edit-product', {
        //     pageTitle: "Add Product",
        //     path: '/admin/add-product',
        //     editing: false,
        //     hasError: true,
        //     product: {
        //         title: title,
        //         imageUrl: imageUrl,
        //         description: description,
        //         price: price,
        //     },
        //     errorMessage: 'Database operation faild, please try again',
        //     validationErrors: []
        // })
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error)
    });
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        res.redirect('/')
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/')
            }
            res.render('admin/edit-product', {
                pageTitle: "Edit Product",
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors: []
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error)
        });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updateTitle = req.body.title;
    const image = req.file;
    const updatePrice = req.body.price;
    const updateDescription = req.body.description;
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: "Edit Product",
            path: '/admin/edit-product',
            editing: true,
            hasError: true,
            product: {
                title: updateTitle,
                price: updatePrice,
                description: updateDescription,
                _id: prodId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    Product.findById(prodId)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/')
            }
            product.title = updateTitle;
            product.price = updatePrice;
            product.description = updateDescription;
            if (image) {
                fileHelper.deleteFile(product.imageUrl)
                product.imageUrl = image.path;
            }
            return product.save()
            .then(result => {
                console.log('Update Product')
                res.redirect('/admin/products')
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error)
        })
};

exports.getProducts = (req, res, next) => {
    Product.find({
        userId: req.user._id
    })
    .then(product => {
        res.render('admin/products', {
            prod: product,
            pageTitle: 'Admin Products',
            path: '/admin/products',
            isAutenticated: req.session.isLoggedIn
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error)
    });
};

exports.deleteProduct = (req, res, next) => {
   const prodId = req.params.productId;
   Product.findById(prodId)
        .then(product =>{
            if (!product) {
                return next(new Error('Product Not Find!'))
            }
            fileHelper.deleteFile(product.imageUrl)
            return Product.deleteOne({_id: prodId, userId: req.user._id})
        })
        .then(() => {
            console.log('Destroy Product')
            res.status(200).json({message: 'Succsess'});
        })
        .catch(err => {
            res.status(500).json({message: 'Deleting product failed.'});
        });
        
}; 