const express = require('express');
const router = express.Router();
const movieController = require('../Controllers/movie.controller');


router.get('/', movieController.getAllMovies)
router.post('/add', movieController.addMovie);
router.post('/toggle/:id', movieController.toggleWatched);
router.post('/delete/:id', movieController.deleteMovie);

module.exports = router;