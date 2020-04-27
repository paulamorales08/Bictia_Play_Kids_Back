const express = require('express')
const film = require('../controllers/filmController')
const app = express();

//Crear una nuevaCanción)
app.post('/create', film.create);
//Trae los videos de la BD
app.get('/', film.getFilms);
//Trae el resultado de la busqueda de videos
app.get('/typehead', film.typeHead);

module.exports = app;