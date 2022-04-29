const express = require('express');
const router = express.Router();
const confirmController = require('../controllers/confirmController');


router.route('/:confirmToken').get(confirmController);


module.exports = router;