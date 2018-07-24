// Modelo de datos de usuario

// Importar mongoose
const mongoose = require('mongoose');

//  Libreria para personalizar los mensajes de error del web servide (Unique) 
const uniqueValidator = require('mongoose-unique-validator');


// Objeto que contiene los roles

let roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido.'
};

//  Para crear esquemas con mongoose

let SChema = mongoose.Schema;


let usuarioSchema = new SChema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        unique: [true, "El correo es unico."],
        required: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligaria.']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: roles

    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false

    }
});
//  Para que no se pueda ver la pasword
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObj = user.toObject();
    delete userObj.password;
    return userObj;
}

// Campos que no se pueden actualizar

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico.' });


// Se exporta el modelo y se agrega el schema
module.exports = mongoose.model('Usuario', usuarioSchema);