const express = require('express');

const { verificarToken } = require('../middleware/autentificacion');

const app = express();
const Producto = require('../models/producto');



/**
 *  OBTENER TODOS LOS PRODUCTOS
 */

app.get('/productos', (req, res) => {
    // trae todos los productos
    //  cargar usuarios
    // cargar categoria
    //  paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre correo')
        .populate('categoria')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productosDB) {
                return res.status(500)({
                    ok: false,
                    error: {
                        message: 'No existen registros'
                    }
                })
            }

            res.status(200).json({
                ok: true,
                productosDB
            });
        });
});
/**
 *  BUSCAR PRODUCTOS
 */

app.get('/productos/buscar/:termino', verificarToken, (req, res) => {

    let termino = req.params.termino;
    //    expresion regular para realizar busquedas i = insencible a mayusculas y minusculas
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre_producto')
        .exec((err, productosDB) => {
            if (err) {
                return res.json({
                    ok: true,
                    err
                });
            }

            res.status(200).json({
                ok: true,
                productos: productosDB
            });
        });
});


/**
 *  OBTENER POR ID
 */
app.get('/productos/:id', (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productosDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productosDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No existen productos registrados con esta id'
                }
            })
        }

        res.status(200).json({
            ok: true,
            productosDB
        });
    });

    // traer usuario y categoria
    //   paginado
});

/**
 *  CREAR NUEVO PRODUCTO
 */
app.post('/productos/:id_categoria', verificarToken, (req, res) => {

    let body = req.body;
    let usuario = req.usuario;
    let id_categoria = req.params.id_categoria;


    let obj_producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: id_categoria,
        usuario: usuario._id


    });

    // console.log(obj_producto);

    obj_producto.save((err, productosDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productosDB
        });
    });
    //    GRABR AL USUARIO
    // GRABAR LA CATEGORIA DEL LISTADO

});

/**
 *  ACTUALIZAR PRODUCTO
 */
app.put('/productos/:id', verificarToken, (req, res) => {

    let id_producto = req.params.id;
    let body = req.body;
    let id_usuario = req.usuario._id;
    let obj_producto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria_id,
        usuario: id_usuario
    };
    // console.log(obj_producto);
    Producto.findByIdAndUpdate(id_producto, obj_producto, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'El producto con especificado , no existe.'
                }
            })
        }

        res.status(200).json({
            ok: true,
            producto: productoDB
        })


    });
    //    GRABR AL USUARIO
    // GRABAR LA CATEGORIA DEL LISTADO

});

/**
 *  ELIMINAR UN PRODUCTO (solo cambia el estado)
 */
app.delete('/productos/:id', (req, res) => {

    let id_producto = req.params.id;

    let obj = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id_producto, obj, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No se encuentran registros con la id'
                }
            });
        }

        res.status(200).json({
            ok: true,
            productoDB
        })
    });
    //  producto disponible a false

});


module.exports = app;