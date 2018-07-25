const jwt = require('jsonwebtoken');
/*
  AUTENTIFICACIÓN MIDDLEWARE

  VERIFICACIÓN DEL TOKEN.
*/
//next continua con la ejecucion del programa

let verificarToken = (req, res, next) => {

    // LO TOMA DESDE EL HEADER DE LA PETICION
    let token = req.get('token');
    //  process esta en config
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    name: "error_token_validation",
                    message: "El Token es invalido"
                }
            });
        }
        // se rescata al objeto usuario del payload desde el JWT
        req.usuario = decoded.usuario;
        next();
    });



};

/*
  VALIDACION ADMIN
*/

let verificaAdmin_role = (req, res, next) => {
    let role = req.usuario.role;
    if (role === 'ADMIN_ROLE') {
        next();

    } else {
        return res.json({
            ok: false,
            message: 'El usuario no  es administrador'
        })

    }

}

module.exports = {
    verificarToken,
    verificaAdmin_role
};