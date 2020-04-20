const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoute');
const filmRoutes = require('./routes/filmRoute');
const app = express();

app.use(bodyParser.json());

app.use('/api/film', filmRoutes); //Rutas relacionadas con la música
app.use('/api/user', userRoutes); //Rutas relacionadas con usuario

module.exports = app;