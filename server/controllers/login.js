const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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

// CONFIGURACIONES DE CLIENTE DE GOOLE

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        correo: payload.email,
        img: payload.picture,
        google: true

    };
}


// para poder recibir el objeto de una duncion asyncs
app.post('/google', async(req, res) => {
    // get token google
    let token = req.body.idtoken;
    console.log(token);

    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            });
        });

    Usuario.findOne({ correo: googleUser.correo }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (usuarioDB) {
            // si esta logeado pero no por google
            if (usuarioDB.google == false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe utilizar su autentificacion normal'
                    }
                });
            } else {
                // payload para el web token
                // Se crea una nuevo token para el usuario
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            }
        } else {
            // Si el usuario no existe en nuestra base de datos

            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.correo = googleUser.correo;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            });
        }
    });
    // res.json({
    //     usuario: googleUser
    // });
});

module.exports = app;