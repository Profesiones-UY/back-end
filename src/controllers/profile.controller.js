const Cliente = require('../models/Cliente');
const Profesional = require('../models/Profesional');

// Obtener perfil de cliente
exports.getClientProfile = async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id)
            .select('-password') // Excluimos la contraseña de la respuesta
            .populate('historialCitas');

        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        res.json(cliente);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el perfil del cliente', error: error.message });
    }
};

// Obtener perfil de profesional
exports.getProfessionalProfile = async (req, res) => {
    try {
        const profesional = await Profesional.findById(req.params.id)
            .select('-password') // Excluimos la contraseña de la respuesta
            .populate('servicios')
            .populate('calificaciones.cliente', 'nombre apellido');

        if (!profesional) {
            return res.status(404).json({ mensaje: 'Profesional no encontrado' });
        }

        res.json(profesional);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el perfil del profesional', error: error.message });
    }
};

// Actualizar perfil de cliente
exports.updateClientProfile = async (req, res) => {
    try {
        const clienteActualizado = await Cliente.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    nombre: req.body.nombre,
                    apellido: req.body.apellido,
                    telefono: req.body.telefono,
                    direccion: req.body.direccion
                }
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!clienteActualizado) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        res.json(clienteActualizado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el perfil del cliente', error: error.message });
    }
};

// Actualizar perfil de profesional
exports.updateProfessionalProfile = async (req, res) => {
    try {
        const profesionalActualizado = await Profesional.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    nombre: req.body.nombre,
                    apellido: req.body.apellido,
                    telefono: req.body.telefono,
                    profesion: req.body.profesion,
                    especialidad: req.body.especialidad,
                    descripcion: req.body.descripcion,
                    experiencia: req.body.experiencia,
                    tarifaBase: req.body.tarifaBase,
                    estado: req.body.estado
                }
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!profesionalActualizado) {
            return res.status(404).json({ mensaje: 'Profesional no encontrado' });
        }

        res.json(profesionalActualizado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el perfil del profesional', error: error.message });
    }
};

// Obtener horario del profesional
exports.getProfessionalSchedule = async (req, res) => {
    try {
        const profesional = await Profesional.findById(req.params.id)
            .select('horarioDisponible');

        if (!profesional) {
            return res.status(404).json({ mensaje: 'Profesional no encontrado' });
        }

        res.json(profesional.horarioDisponible);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el horario del profesional', error: error.message });
    }
};

// Establecer horario del profesional
exports.setProfessionalSchedule = async (req, res) => {
    try {
        const profesional = await Profesional.findByIdAndUpdate(
            req.params.id,
            { $set: { horarioDisponible: req.body.horario } },
            { new: true, runValidators: true }
        ).select('horarioDisponible');

        if (!profesional) {
            return res.status(404).json({ mensaje: 'Profesional no encontrado' });
        }

        res.json(profesional.horarioDisponible);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el horario del profesional', error: error.message });
    }
};

// Calificar a un profesional
exports.rateProfessional = async (req, res) => {
    try {
        const profesional = await Profesional.findById(req.params.id);

        if (!profesional) {
            return res.status(404).json({ mensaje: 'Profesional no encontrado' });
        }

        const nuevaCalificacion = {
            cliente: req.body.clienteId,
            puntuacion: req.body.puntuacion,
            comentario: req.body.comentario
        };

        profesional.calificaciones.push(nuevaCalificacion);

        // Calcular nuevo promedio
        const totalPuntuaciones = profesional.calificaciones.reduce((sum, cal) => sum + cal.puntuacion, 0);
        profesional.promedioCalificacion = totalPuntuaciones / profesional.calificaciones.length;

        await profesional.save();

        res.json({ mensaje: 'Calificación agregada exitosamente', promedioCalificacion: profesional.promedioCalificacion });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al calificar al profesional', error: error.message });
    }
};

// Obtener calificaciones de un profesional
exports.getProfessionalRatings = async (req, res) => {
    try {
        const profesional = await Profesional.findById(req.params.id)
            .select('calificaciones promedioCalificacion')
            .populate('calificaciones.cliente', 'nombre apellido');

        if (!profesional) {
            return res.status(404).json({ mensaje: 'Profesional no encontrado' });
        }

        res.json({
            calificaciones: profesional.calificaciones,
            promedioCalificacion: profesional.promedioCalificacion
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las calificaciones', error: error.message });
    }
}; 