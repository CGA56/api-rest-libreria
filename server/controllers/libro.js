const express = require('express');
const app = express();
const Libro = require('../models/libro');
const {middleware_usuario} = require('../middleware/libro-middleware');
const {verificarToken} = require('../middleware/autentificacion');
app.post('/libros', (req, res) => {
    let body = req.body;

    let objLibro = new Libro({
        titulo: body.titulo,
        autor: body.autor,
        isbn: body.isbn,
        editorial: body.editorial,
        usuario: body.usuario_id
    });

    objLibro.save((err, libroDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            mesaje: libroDB
        });
    })
});

app.get('/libros/usuario',middleware_usuario,verificarToken, (req, res) => {
    let usuario_id = req.body.usuario_id;
    Libro.find({usuario:usuario_id},{usuario:false})
        .exec((err, libroDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (libroDB.length==0) {
                return res.status(500).json({
                    ok: false,
                    error: {
                        message: 'No cuenta con libros registrados'
                    }
                })
            }

            res.status(200).json({
                ok: true,
                coleccion:libroDB
            });
        });
});

module.exports = app;
