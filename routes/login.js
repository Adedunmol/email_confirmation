const express = require('express');
const router = express.Router();
const handleLogin = require('../controllers/loginController');


router.route('/').post(handleLogin);


module.exports = router;