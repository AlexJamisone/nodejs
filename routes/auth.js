const express = require('express')
 
const authController = require('../controllers/auth')

const router = express.Router();


router.get('/login', authController.getLogin);

router.get('/singup', authController.getSingup);

router.post('/login', authController.postLogin);

router.post('/singup', authController.postSingup);

router.post('/logout', authController.postLogout);

module.exports = router;