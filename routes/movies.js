const express = require('express');
const router = express.Router();
const verifyRoles = require('../middlewares/verifyRoles');
const { getAllMovies, createNewMovie } = require('../controllers/moviesController');

router.route('/').get(getAllMovies).post(verifyRoles(2020, 2040), createNewMovie);

module.exports = router;