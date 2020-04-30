const express = require('express')
const film = require('../controllers/filmController')
const app = express();

//Crear nuevo film)
app.post('/create', film.create);
//eliminar video
//app.delete('/:id', film.deleteFilm);
//Trae los videos de la BD
app.get('/', film.getFilms);
//Trae el resultado de la busqueda de videos
app.get('/typehead', film.typeHead);

module.exports = app;