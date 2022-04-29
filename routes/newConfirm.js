const express = require('express');
const router = express.Router();
const sendNewConfirmationMail = require('../controllers/newConfirmationMailController');


router.route('/').get(sendNewConfirmationMail);


module.exports = router;