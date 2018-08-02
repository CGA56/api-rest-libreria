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


let productoSchema = new SChema({
    nombre: {
        type: String,
        unique: [true, "El nombre del producto debe ser unico."],
        required: [true, 'El nombre de la categoria es obligatorio']
    },
    precioUni: {
        type: Number,
        required: [true, 'El precio unitario es obligatorio'],
    },
    descripcion: {
        type: String,
        required: false
    },
    disponible: {
        type: Boolean,
        required: true,
        default: true
    },
    categoria: {
        type: SChema.Types.ObjectId,
        ref: 'Categoria'
    },
    usuario: {
        type: SChema.Types.ObjectId,
        ref: 'Usuario'
    },
    img: {
        type: String,
        required: false
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
module.exports = mongoose.model('Producto', productoSchema);