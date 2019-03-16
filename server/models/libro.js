const mongoose = require('mongoose');

let SChema = mongoose.Schema;

let libroSchema = new SChema({
    titulo: {
        type: String,
        required: [true, 'El titulo del libro es obligatorio']
    },
    autor: {
        type: String,
        required: [true, 'El autor es obligatorio']
    },
    isbn: {
        type: String,
        required: [true, 'El ISBN es obligatorio']
    },
    editorial: {
        type: String,
        required: [true, 'La editorial es obligatoria']
    },
    usuario: {
        type: SChema.Types.ObjectId,
        ref: 'Usuario',
        required:[true]
    }
});

module.exports = mongoose.model('Libro', libroSchema);


