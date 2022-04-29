const express = require('express');
const router = express.Router();
const getNewTokens = require('../controllers/refreshTokenController');


router.route('/').get(getNewTokens);


module.exports = router;