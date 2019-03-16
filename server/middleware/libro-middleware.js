/**
 *  LIBROS MIDDLEWARE
 */


/**
 * VALIDACION ID USUARIO
 */
let middleware_usuario = (req, res, next) => {
    let id_usuario = req.body.usuario_id;
    if (id_usuario) {
        next();
    } else {
        return res.json({
            ok: false,
            message: 'El id del usuario es obligatorio'
        })
    }
}

/**
 * VALIDACION ISBN
 */
 

module.exports = {
    middleware_usuario
};