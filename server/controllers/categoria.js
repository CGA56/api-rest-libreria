const express = require('express');

//  Para validar el token
const { verificarToken, verificaAdmin_role } = require('../middleware/autentificacion');

const app = express();
const _ = require('underscore');

const Categoria = require('../models/categoria');


/**
 *  MOSTRAR TODAS LAS CATEGORIAS
 */
app.get('/categoria', verificarToken, (req, res) => {
    //   Populate revisa que id o objd ids existen en la categoria que estoy buscando


    Categoria.find({})
        .sort('nombre_categoria') // ordena por nombre de categoria
        .populate('usuario', 'nombre correo ')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.status(200).json({
                ok: true,
                categoriaDB
            });
            // Categoria.count({}, (err, conteo) => {
            //     if (conteo) {
            //         return res.status(200).json({
            //             ok: true,
            //             categoriaDB
            //         });
            //     } else {
            //         return res.status(200).json({
            //             ok: true,
            //             error: {
            //                 message: 'No se encontraron resultados'
            //             }
            //         })
            //     }
            // });


        });
});

/**
 * BUSCAR CATEGORIA POR ID
 */
app.get('/categoria/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                erro: {
                    message: 'No se encuentran categorias con esta id'
                }
            });
        }

        if (!categoriaDB) {
            res.json({
                ok: true,
                err: {
                    message: 'No existe categoria con este id'
                }
            });
        }
        res.status(200).json({
            ok: true,
            categoriaDB
        })
    });
    ///categoria fin by id;
});

/**
 * CREAR NUEVA CATEGORIA
 */
app.post('/categoria', verificarToken, (req, res) => {
    // regresa la nueva categoria

    //req.usuario._id;
    let body = req.body;

    let obj_categoria = new Categoria({
        nombre_categoria: body.nombre_categoria,
        usuario: req.usuario._id

    });

    // guardar mongoose

    obj_categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            res.json({
                ok: true,
                err
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });

    });


});

/**
 *  ACTUALIZAR CATEGORIA
 */
app.put('/categoria/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let objCategoria = {
        nombre_categoria: body.nombre_categoria
    }

    Categoria.findByIdAndUpdate(id, objCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            res.json({
                ok: true,
                err
            });
        }

        categoriaDB.nombre_categoria = objCategoria.nombre_categoria;
        res.status(200).json({
            ok: true,
            categoriaDB
        })
    })



    // aCTUALIZAR NOMBRE CATEGORIA
});
/**
 * ELIMINAR CATEGORIA
 */
app.delete('/categoria/:id', [verificarToken, verificaAdmin_role], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            res.json({
                ok: true,
                error: {
                    message: 'La categoria no existe.'
                }
            });
        }

        res.status(200).json({
            ok: true,
            categoriaDB
        });
    });
    // solo administrador puede borrar categoria (fisicamente)
});






module.exports = app;