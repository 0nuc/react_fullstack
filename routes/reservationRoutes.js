const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { auth, isAdmin } = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(auth);

// GET /api/reservations - Admin uniquement
router.get('/', isAdmin, reservationController.getAllReservations);

// GET /api/reservations/my - Réservations de l'utilisateur connecté
router.get('/my', reservationController.getMyReservations);

// POST /api/reservations - Créer une réservation
router.post('/', reservationController.createReservation);

// PUT /api/reservations/:id - Modifier une réservation
router.put('/:id', reservationController.updateReservation);

// DELETE /api/reservations/:id - Annuler une réservation
router.delete('/:id', reservationController.deleteReservation);

// PATCH /api/reservations/:id/validate - Admin uniquement
router.patch('/:id/validate', isAdmin, reservationController.validateReservation);

module.exports = router; 