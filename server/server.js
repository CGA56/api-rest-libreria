require('./config/config');
const express = require('express');
// Mongoose Db
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

// libreria que ya contiene node js para habilitar rutas . En este caso la carpeta public.
const path = require('path');



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




mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log("Base de datos online");
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto", process.env.PORT);
});