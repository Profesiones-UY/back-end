const express = require('express');
const router = express.Router();
const {
    getClientProfile,
    getProfessionalProfile,
    updateClientProfile,
    updateProfessionalProfile,
    setProfessionalSchedule,
    getProfessionalSchedule,
    rateProfessional,
    getProfessionalRatings
} = require('../controllers/profile.controller');

// Rutas para gestión de perfiles
router.get('/cliente/:id', getClientProfile);
router.get('/profesional/:id', getProfessionalProfile);
router.put('/cliente/actualizar/:id', updateClientProfile);
router.put('/profesional/actualizar/:id', updateProfessionalProfile);
router.post('/profesional/horario/:id', setProfessionalSchedule);
router.get('/profesional/horario/:id', getProfessionalSchedule);
router.post('/profesional/calificacion/:id', rateProfessional);
router.get('/profesional/calificaciones/:id', getProfessionalRatings);

module.exports = router; 