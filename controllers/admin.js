const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product',
        {pageTitle: 'Add product',
        path: '/admin/add-product',
        activeAddProduct: true,
        formsCSS: true,
        productCSS: true,
        editing: false
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(title, price, imageUrl, description);
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

// exports.getEditProduct = (req, res, next) => {
//     const editMode = req.query.edit;
//     if (!editMode) {
//         res.redirect('/')
//     }
//     const prodId = req.params.productId;
//     req.user.getProducts({where: {id: prodId}})
//     //Product.findByPk(prodId)
//         .then(products => {
//             const product = products[0];
//             if (!product) {
//                 return res.redirect('/')
//             }
//             res.render('admin/edit-product', {
//                 pageTitle: "Edit Product",
//                 path: '/admin/edit-product',
//                 editing: editMode,
//                 product: product
//             })
//         })
//         .catch(err => {
//             console.log(err)
//         });
// };

// exports.postEditProduct = (req, res, next) => {
//    const prodId = req.body.productId;
//    const updateTitle = req.body.title;
//    const updateImg = req.body.imageUrl;
//    const updatePrice = req.body.price;
//    const updateDescription = req.body.description;
//    Product.findByPk(prodId)
//         .then((product) => {
//             product.title = updateTitle,
//             product.imageUrl = updateImg,
//             product.price = updatePrice,
//             product.description = updateDescription,
//             product.save()
//         })
//         .then(result => {
//             console.log('Update Product')
//         })
//         .catch(err => {
//             console.log(err)
//         })
//     res.redirect('/admin/products')
// };

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(product => {
        res.render('admin/products', {
            prod: product,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
    })
    .catch(err => {
        console.log(err)
    });
};

// exports.postDeletProduct = (req, res, next) => {
//    const prodId = req.body.productId;
//    Product.findByPk(prodId)
//         .then(product => {
//             product.destroy();
//         })
//         .then(result => {
//             console.log('Destroy Product')
//         })
//         .catch(err => {
//             console.log(err)
//         });
//    res.redirect('/admin/products')
// }; 