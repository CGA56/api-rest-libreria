// Modelo de datos de usuario

// Importar mongoose
const mongoose = require('mongoose');

//  Libreria para personalizar los mensajes de error del web servide (Unique) 
const uniqueValidator = require('mongoose-unique-validator');


// Objeto que contiene las categorias

// let categorias = {
//     values: ['HOGAR', 'BAÑO', 'FERRETERIA'],
//     message: '{VALUE} no es un rol válido.'
// };

//  Para crear esquemas con mongoose

let SChema = mongoose.Schema;


let categoriaSchema = new SChema({
    nombre_categoria: {
        type: String,
        unique: [true, "La categoria debe ser unica."],
        required: [true, 'El nombre de la categoria es obligatorio']
    },
    usuario: {
        type: SChema.Types.ObjectId, //crea la referencia a la tabla
        ref: 'Usuario'
    },
    estado: {
        type: Boolean,
        default: true
    }
});
//  Para que no se pueda ver la pasword
// categoriaSchema.methods.toJSON = function() {
//     let user = this;
//     let userObj = user.toObject();
//     delete userObj.password;
//     return userObj;
// }

// // Campos que no se pueden actualizar

// usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico.' });


// Se exporta el modelo y se agrega el schema
module.exports = mongoose.model('Categoria', categoriaSchema);