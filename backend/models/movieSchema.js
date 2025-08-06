const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String },
    year: { type: String },
    watched: { type: Boolean },
    poster: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Movie', movieSchema);

