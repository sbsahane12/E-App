const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', (req, res) => res.render('auth/login'));
router.post('/', authController.login);

router.get('/register', (req, res) => res.render('auth/register'));
router.post('/register', authController.register);

router.get('/logout', authController.logout);

module.exports = router;
