const express = require('express');
const router = express.Router();
const db = require('../db');

// GET toutes les réservations
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM reservations');
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des réservations',
            error: error.message
        });
    }
});

// POST nouvelle réservation
router.post('/', async (req, res) => {
    try {
        const { userId, numberOfPeople, date, time, note } = req.body;
        const [result] = await db.query(
            'INSERT INTO reservations (userId, numberOfPeople, date, time, note, status) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, numberOfPeople, date, time, note, 'pending']
        );
        
        res.status(201).json({
            success: true,
            message: 'Réservation créée avec succès',
            data: { id: result.insertId }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la création de la réservation',
            error: error.message
        });
    }
});

module.exports = router; 