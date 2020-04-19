const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoute');
const filmRoutes = require('./routes/filmRoute');
const app = express();

app.use(bodyParser.json());

app.use('/api', filmRoutes); //Rutas relacionadas con la música

module.exports = app;