const express = require('express');
const router = express.Router();
const reservationRoutes = require('./reservationRoutes');

// Routes
router.use('/reservations', reservationRoutes);

module.exports = router; 