const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
require('dotenv').config();
const movieRoute =  require('../backend/routes/movie.Route');
const cors = require('cors');


app.use(bodyParser.json());
app.use(cors());


app.use('/api/movie', movieRoute);

mongoose.connect(process.env.MONGOOSE_URL)
.then(data => {
    console.log("Database is Connected");
}).catch(error => {
    console.log("Not Connected MongoDB ",error);
})


module.exports = app;
