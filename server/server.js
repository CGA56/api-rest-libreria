require('./config/config');
const express = require('express');
// Mongoose Db
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// Importamos y usamos las rutas del usuario
app.use(require('./controllers/usuario.js'));




mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log("Base de datos online");
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto", process.env.PORT);
});