const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'LogIn',
        isAutenticated: false
    });
};

exports.getSingup = (req, res, next) => {
    res.render('auth/singup', {
        path: '/singup',
        pageTitle: 'Singup',
        isAutenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    User.findById('61d6fb0102222df21402ca82')
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save((err) => {
                console.log(err)
                res.redirect('/')
            });
        })
        .catch(err => {
            console.log(err)
        });
};

exports.postSingup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err)
        res.redirect('/');
    });
};