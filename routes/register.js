const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');


router.route('/').post(registrationController);


module.exports = router;