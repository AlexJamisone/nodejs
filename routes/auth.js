const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user')

const router = express.Router();


router.get('/login', authController.getLogin);

router.get('/singup', authController.getSingup);

router.post('/login', 
    [
        body('email', 'Please enter a valid email address')
            .isEmail()
            .normalizeEmail(),
        body('password', 'Please enter a valid password')
            .isLength({min: 5})
            .isAlphanumeric()
            .trim()
    ],
    authController.postLogin);

router.post('/singup',
    [
        check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, {req}) => {
            // if (value === 'test@test.com') {
            //     throw new Error('This email address if forbidden.')
            // }
            // return true;
            return User.findOne({email: value}).then(userDoc =>{
                if(userDoc) {
                    return Promise.reject(
                        'Email exists already, please pick a different one.'
                    );
                }
            });
        })
        .normalizeEmail(),
        body('password', 'You password need text or numbers with minimum 5 charesters')
            .isLength({min: 5})
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .trim()
            .custom((value, {req}) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords have to match')
                }
                return true;
            })
    ],
    authController.postSingup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/reset/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPasswod)

module.exports = router;