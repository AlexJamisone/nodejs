const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product',
        {pageTitle: 'Add product',
        path: '/admin/add-product',
        activeAddProduct: true,
        formsCSS: true,
        productCSS: true,
        editing: false,
        isAutenticated: req.session.isLoggedIn
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
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
        console.log(err);
    });
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        res.redirect('/', {
            isAutenticated: req.session.isLoggedIn
        })
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
                product: product
            })
        })
        .catch(err => {
            console.log(err)
        });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updateTitle = req.body.title;
    const updateImg = req.body.imageUrl;
    const updatePrice = req.body.price;
    const updateDescription = req.body.description;

    Product.findById(prodId)
        .then(product => {
            product.title = updateTitle,
            product.price = updatePrice,
            product.description = updateDescription,
            product.imageUrl = updateImg
            return product.save()
        })
        .then(result => {
            console.log('Update Product')
            res.redirect('/admin/products')
        })
        .catch(err => {
            console.log(err)
        })
};

exports.getProducts = (req, res, next) => {
    Product.find()
    .then(product => {
        res.render('admin/products', {
            prod: product,
            pageTitle: 'Admin Products',
            path: '/admin/products',
            isAutenticated: req.session.isLoggedIn
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.postDeletProduct = (req, res, next) => {
   const prodId = req.body.productId;
   Product.findByIdAndRemove(prodId)
        .then(() => {
            res.redirect('/admin/products')
        })
        .catch(err => {
            console.log(err)
        });
}; 