const express = require('express')
const user = require('../controllers/userController')
const app = express();


app.post('/create', user.create);
app.post('/addProfile/:id', user.addProfile);
app.pos('/editProfile/:id', user.editProfile);
app.get('/getProfiles/:id', user.getProfiles);
app.post('/login', user.login);
app.get('/getProfile/:id', user.getOneProfile);
app.put('/addFavorite/:id', user.addFavorite);
app.put('/delFavorite/:id', user.removeFavorite);
app.get('/favoriteFilms/:id', user.listFavoriteFilms);

module.exports = app;