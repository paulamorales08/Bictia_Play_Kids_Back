const express = require('express')
const user = require('../controllers/userController')
const app = express();

//Crear una nuevaCanción)
app.post('/create', user.create);

module.exports = app;