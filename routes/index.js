const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const reservationRoutes = require('./reservationRoutes');
const menuRoutes = require('./menuRoutes');
const tableRoutes = require('./tableRoutes');

// Routes publiques
router.use('/auth', authRoutes);
router.use('/menu', menuRoutes);

// Routes protégées
router.use('/reservations', reservationRoutes);
router.use('/tables', tableRoutes);

module.exports = router; 