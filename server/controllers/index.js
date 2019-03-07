/*
  CONTROLADOR DE RUTAS 
*/

const express = require('express');
const app = express() ;

app.use(require('../controllers/login.js'));
app.use(require('../controllers/usuario.js'));
app.use(require('../controllers/categoria.js'));
app.use(require('../controllers/producto.js'));
app.use(require('./uploads'));
app.use(require('../controllers/imagenes.js'));



module.exports = app;