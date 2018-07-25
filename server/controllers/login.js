const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();


app.post('/login', (req, res) => {
    // rescato los patametros
    let body = req.body;

    Usuario.findOne({ correo: body.correo }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                errr: {
                    message: '(Usuario) o contraseña incorrecto'
                }
            });
        }
        //  validar contraseñas inscriptadas
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                errr: {
                    message: 'Usuario o (contraseña) incorrecto'
                }
            });
        }
        // payload para el web token
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });


        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });


});

module.exports = app;