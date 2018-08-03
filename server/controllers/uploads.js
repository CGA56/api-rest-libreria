const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// filesistem
const fs = require('fs');
// Para crear un path de rutas
const path = require('path');
// default options tiene configuraciones adicionales
app.use(fileUpload());



app.put('/upload/:tipo/:id', (req, res) => {

    let id = req.params.id;
    let tipo = req.params.tipo;


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se a seleccionado ningun archivo'
            }
        });
    }

    // validar tiponodem
    let tipos_validos = ['productos', 'usuarios'];
    if (tipos_validos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `El tipo : [${tipo}] no es valido.`,
                options_validas: tipos_validos
            }
        });
    }

    // Archivo es el nombre que se le agregara cuando contemos con un input body
    let archivo = req.files.archivo;

    // extenciones permitidas

    let extenciones_validas = ['png', 'jpg', 'gif', 'jpeg'];
    let nombre_archivo_cortado = archivo.name.split('.');
    let extencion = nombre_archivo_cortado[1];

    if (extenciones_validas.indexOf(extencion) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `La extencion : [${extencion}] del archivo ${nombre_archivo_cortado[0]}. No es valida`,
                options_validas: extenciones_validas
            }

        })
    }

    // cambiar nombre al archivo (unico y prevenir el cache en el navegador)

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencion}`;
    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Aqui imaguen cargada
        if (tipo === 'usuarios') {
            imaguenUsuario(id, res, nombreArchivo);
        } else {
            imaguenProducto(id, res, nombreArchivo);
        }

    });

});

// Javascript manda objetos por referencia
function imaguenUsuario(idUsuario, res, nombreArchivo) {
    Usuario.findById(idUsuario, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return err.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            })
        }
        borraArchivo(usuarioDB.img, 'usuarios');
        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                message: 'La imaguen de  usuario fue guardado',
                img: nombreArchivo

            });


        });
    });
}

function imaguenProducto(idUsuario, res, nombreArchivo) {
    Producto.findOne({ usuario: idUsuario }, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No se encontro un producto con la id especificada'
                }
            });
        }
        borraArchivo(productoDB.img, 'productos');
        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });

    });
}

function borraArchivo(nombreImaguen, tipo) {
    // evaluar si en el filesistem existe la imaguen (los argumentos del resolve es la url que quiero construir)
    let pathImaguen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImaguen}`);
    //  si existe el path
    if (fs.existsSync(pathImaguen)) {
        //  si existe borrar el archivo
        fs.unlinkSync(pathImaguen);
    }
}

module.exports = app;