const express = require('express')
 
const authController = require('../controllers/auth')

const router = express.Router();


router.get('/login', authController.getLogin);

router.get('/singup', authController.getSingup);

router.post('/login', authController.postLogin);

router.post('/singup', authController.postSingup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/reset/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPasswod)

module.exports = router;