const mongoose = require('mongoose');
const Movie = require('../models/movieSchema');

exports.getAllMovies = async (req, res) => {
    try {
        const movieDocs = await Movie.find();
        return res.status(200).json({
            result: movieDocs
        });
    } catch (error) {
        return res.status(400).json({
            message: "Failed to get movies"
        });
    }
};

exports.addMovie = async (req, res) => {
    const { poster, title, year, watched } = req.body;
    try {

          const existingMovie = await Movie.findOne({ title, year });
        if (existingMovie) {
            return res.status(409).json({
                message: "Movie with the same title and year already exists"
            });
        }

        const newMovie = new Movie({
            poster,
            title,
            year,
            watched
        });
        await newMovie.save();
        return res.status(200).json({
            message: "Movie added successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Failed to add movie"
        });
    }
};


exports.toggleWatched = async (req, res) => {
    const { id } = req.params;
    try {
        const movie = await Movie.findById(id);
        movie.watched = !movie.watched;
        await movie.save();
        return res.status(200).json({ message: 'Watched status toggled' });
    } catch (error) {
        return res.status(400).json({ message: 'Failed to toggle watched status' });
    }
};

exports.deleteMovie = async (req, res) => {
    const { id } = req.params;
    try {
        await Movie.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Movie deleted' });
    } catch (error) {
        return res.status(400).json({ message: 'Failed to delete movie' });
    }
};
