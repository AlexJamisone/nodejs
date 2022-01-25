const bcrypt = require('bcryptjs');
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
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({
        email: email
    })
        .then(user => {
            if(!user) {
                res.redirect('/login')
            }
            bcrypt.compare(password, user.password)
                .then(doMatch =>{
                    if(doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save((err) => {
                            console.log(err)
                            res.redirect('/')
                        });
                    }
                    res.redirect('/login')
                })
                .catch(err => {
                    console.log(err)
                    res.redirect('/login')
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
    User.findOne({email: email}).then(userDoc =>{
        if(userDoc) {
            return res.redirect('/singup')
        }
        return bcrypt
            .hash(password, 12)
            .then(hashedPassword => {
                const user = new User({
                    email: email,
                    password: hashedPassword,
                    cart: {items: []}
                });
                return user.save()
            })
            .then(result => {
                res.redirect('/login')
            })
    })
    .catch(err => {
        console.log(err)
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err)
        res.redirect('/');
    });
};