const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    telefono: {
        type: String
    },
    direccion: {
        calle: String,
        numero: String,
        ciudad: String,
        codigoPostal: String
    },
    historialCitas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cita'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Cliente', clienteSchema); 