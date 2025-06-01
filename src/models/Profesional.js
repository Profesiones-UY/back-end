const mongoose = require('mongoose');

const profesionalSchema = new mongoose.Schema({
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
        type: String,
        required: true
    },
    profesion: {
        type: String,
        required: true
    },
    especialidad: {
        type: String
    },
    descripcion: {
        type: String
    },
    experiencia: {
        type: Number, // años de experiencia
        default: 0
    },
    tarifaBase: {
        type: Number,
        required: true
    },
    horarioDisponible: [{
        dia: {
            type: String,
            enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
        },
        horaInicio: String,
        horaFin: String
    }],
    calificaciones: [{
        cliente: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cliente'
        },
        puntuacion: {
            type: Number,
            min: 1,
            max: 5
        },
        comentario: String,
        fecha: {
            type: Date,
            default: Date.now
        }
    }],
    promedioCalificacion: {
        type: Number,
        default: 0
    },
    servicios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Servicio'
    }],
    estado: {
        type: String,
        enum: ['Disponible', 'No Disponible', 'Ocupado'],
        default: 'Disponible'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Profesional', profesionalSchema); 