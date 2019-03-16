/***
 * Run mongo to docker container
 * docker run -d -p 127.0.0.1:27017:27017 mongo
 * 
 * Port in use : sudo lsof -i -P -n
 */
const cors = require('cors');
require('./config/config');
const express = require('express');
// Mongoose Db
const mongoose = require('mongoose');


const app = express();

const bodyParser = require('body-parser');

// libreria que ya contiene node js para habilitar rutas . En este caso la carpeta public.
const path = require('path');

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Importamos y usamos las rutas del usuario
// app.use(require('./controllers/usuario.js'));
// app.use(require('./controllers/login.js'));

// HABILITAR LA CARPETA PUBLIC
app.use(express.static(path.resolve(__dirname, '../public')));




// CONFIGURACIÓN GLOBAL DE RUTAS
app.use(require('./controllers/index.js'));

 

mongoose.connect(process.env.URLDB,{ useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log("Base de datos online");
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto", process.env.PORT);
});