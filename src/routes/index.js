const express = require('express');
const router = express.Router();

// Importer les routes
const authRoutes = require('./authRoutes');
const menuRoutes = require('./menuRoutes');
const reservationRoutes = require('./reservationRoutes');

// Routes d'authentification
router.use('/auth', authRoutes);

// Routes du menu
router.use('/menu', menuRoutes);

// Routes de réservation
router.use('/reservations', reservationRoutes);

module.exports = router; 