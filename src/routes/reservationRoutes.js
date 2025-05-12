const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const {
    createReservation,
    getAllReservations,
    getUserReservations,
    updateReservationStatus,
    cancelReservation
} = require('../controllers/reservationController');

// Routes publiques
// Aucune pour les réservations - tout nécessite une authentification

// Routes protégées (utilisateurs connectés)
router.post('/', auth, createReservation);
router.get('/my-reservations', auth, getUserReservations);
router.put('/:id/cancel', auth, cancelReservation);

// Routes admin
router.get('/all', auth, isAdmin, getAllReservations);
router.put('/:id/status', auth, isAdmin, updateReservationStatus);

module.exports = router; 