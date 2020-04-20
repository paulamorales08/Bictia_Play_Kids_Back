const express = require('express')
const film = require('../controllers/filmController')
const app = express();

//Crear una nuevaCanción)
app.post('/create', film.create);

module.exports = app;