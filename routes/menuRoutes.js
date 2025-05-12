const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { auth, isAdmin } = require('../middleware/auth');

// GET /api/menu - Public
router.get('/', menuController.getAllMenuItems);

// Routes protégées - Admin uniquement
router.use(auth, isAdmin);

// POST /api/menu - Créer un item
router.post('/', menuController.createMenuItem);

// PUT /api/menu/:id - Modifier un item
router.put('/:id', menuController.updateMenuItem);

// DELETE /api/menu/:id - Supprimer un item
router.delete('/:id', menuController.deleteMenuItem);

module.exports = router; 