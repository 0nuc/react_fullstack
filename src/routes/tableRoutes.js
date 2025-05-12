const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const { auth, isAdmin } = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(auth);

// GET /api/tables - Obtenir toutes les tables
router.get('/', tableController.getAllTables);

// GET /api/tables/availability - Vérifier la disponibilité
router.get('/availability', tableController.getTableAvailability);

// Routes admin uniquement
router.use(isAdmin);

// POST /api/tables - Créer une table
router.post('/', tableController.createTable);

// PUT /api/tables/:id - Modifier une table
router.put('/:id', tableController.updateTable);

// DELETE /api/tables/:id - Supprimer une table
router.delete('/:id', tableController.deleteTable);

module.exports = router; 