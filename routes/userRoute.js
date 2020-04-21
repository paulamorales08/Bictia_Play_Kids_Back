const express = require('express')
const user = require('../controllers/userController')
const app = express();

//Crear una nuevaCanción)
app.post('/create', user.create);
app.post('/addProfile/:id', user.addProfile);
app.get('/getProfiles/:id', user.getProfiles);

module.exports = app;