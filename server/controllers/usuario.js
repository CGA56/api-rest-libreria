const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
// Para que ciertos campos no se puedan actualizar+
const _ = require('underscore');
const Usuario = require('../models/usuario');


//listar

// skip ultimos 5 mostrar max 5
app.get('/usuarios', function(req, res) {

    // Si existe la variable desde si no toma el segundo argumento
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;

    desde = Number(desde);
    limite = Number(limite);
    // filtros
    // find({google:true},campos a retornar)
    Usuario.find({ estado: true }, 'nombre correo role estado google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuariosDB) => {
            // Si tiene errores
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            //    Paso!
            // find({google:true})
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios: usuariosDB,
                    cuantos: conteo
                });
            });

        });
});
// Crear
app.post('/usuarios', function(req, res) {
    // Toda la info del post
    let body = req.body;

    let objUsuario = new Usuario({
        nombre: body.nombre,
        correo: body.correo,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    // Guardar moongose
    objUsuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        // usuarioDB.password = null;
        res.json({
            ok: true,
            mensaje: usuarioDB
        });

    });


});
// Actualizar
app.put('/usuarios/:id', function(req, res) {


    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    /// err y usuario db callback
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            usuarioDB
        });

    });

});

app.delete('/usuarios/:id/:estado', function(req, res) {
    // get if for url
    let id = req.params.id;
    let estado = (req.params.estado === 'true');

    let cambiaEstado = {
        estado
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'El usuario no existe'
                }
            });
        }



        res.json({
            ok: true,
            usuarioDB


        })

    });
    // Usuario.findByIdAndRemove(id, (err, usuarioELminar) => {

    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!usuarioELminar) {
    //         return res.status(400).json({
    //             ok: false,
    //             error: {
    //                 mensaje: 'Usuario no encontrado.'
    //             }
    //         })
    //     }

    //     res.json({
    //         ok: true,
    //         Usuario: usuarioELminar
    //     });
    // });




});


module.exports = app;