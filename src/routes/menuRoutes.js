const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const { getAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');

// Route publique pour obtenir le menu
router.get('/', getAllMenuItems);

// Routes protégées - Admin uniquement
router.use(auth, isAdmin);

// Créer un nouvel item
router.post('/', createMenuItem);

// Modifier un item
router.put('/:id', updateMenuItem);

// Supprimer un item
router.delete('/:id', deleteMenuItem);

module.exports = router; 