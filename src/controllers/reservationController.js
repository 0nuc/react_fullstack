const db = require('../config/database');

// Fonction utilitaire pour vérifier la disponibilité des tables
const checkTableAvailability = async (date, time, numberOfPeople) => {
    try {
        // 1. Récupérer toutes les tables
        const [tables] = await db.query('SELECT * FROM tables ORDER BY seats ASC');
        
        // 2. Récupérer les tables déjà réservées pour ce créneau
        const [reservedTables] = await db.query(
            'SELECT rt.table_id FROM reservations r ' +
            'JOIN reservation_tables rt ON r.id = rt.reservation_id ' +
            'WHERE r.date = ? AND r.time = ? AND r.status != "cancelled"',
            [date, time]
        );

        // Créer un ensemble des IDs des tables réservées
        const reservedTableIds = new Set(reservedTables.map(rt => rt.table_id));

        // 3. Filtrer les tables disponibles
        const availableTables = tables.filter(table => !reservedTableIds.has(table.id));

        // 4. Trouver la meilleure combinaison de tables
        let remainingPeople = numberOfPeople;
        const selectedTables = [];
        
        // Première passe : chercher les tables parfaites
        for (const table of availableTables) {
            if (table.seats === remainingPeople) {
                selectedTables.push(table);
                remainingPeople = 0;
                break;
            }
        }

        // Deuxième passe : si pas de table parfaite, combiner les tables
        if (remainingPeople > 0) {
            for (const table of availableTables) {
                if (!selectedTables.includes(table) && table.seats <= remainingPeople + 2) {
                    selectedTables.push(table);
                    remainingPeople -= table.seats;
                    if (remainingPeople <= 0) break;
                }
            }
        }

        // Vérifier si on a trouvé une solution
        return remainingPeople <= 0 ? selectedTables : null;
    } catch (error) {
        console.error('Erreur lors de la vérification des tables:', error);
        return null;
    }
};

// Obtenir toutes les réservations (admin)
const getAllReservations = async (req, res) => {
    try {
        const [reservations] = await db.query(
            `SELECT r.*, u.firstName, u.lastName, u.phone, t.number as table_number, t.seats 
            FROM reservations r 
            JOIN users u ON r.user_id = u.id 
            JOIN reservation_tables rt ON r.id = rt.reservation_id 
            JOIN tables t ON rt.table_id = t.id 
            ORDER BY r.reservation_date ASC, r.reservation_time ASC`
        );

        res.json({
            success: true,
            reservations
        });
    } catch (error) {
        console.error('Erreur récupération réservations:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des réservations'
        });
    }
};

// Obtenir les réservations d'un utilisateur
const getUserReservations = async (req, res) => {
    try {
        const [reservations] = await db.query(
            `SELECT r.*, t.number as table_number, t.seats 
            FROM reservations r 
            JOIN reservation_tables rt ON r.id = rt.reservation_id 
            JOIN tables t ON rt.table_id = t.id 
            WHERE r.user_id = ? 
            ORDER BY r.reservation_date ASC, r.reservation_time ASC`,
            [req.user.id]
        );

        res.json({
            success: true,
            reservations
        });
    } catch (error) {
        console.error('Erreur récupération réservations utilisateur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des réservations'
        });
    }
};

// Créer une nouvelle réservation
const createReservation = async (req, res) => {
    try {
        const { number_of_people, reservation_date, reservation_time, note } = req.body;
        const user_id = req.user.id; // Récupéré du middleware auth

        // Vérifier si la date est dans le futur
        const reservationDateTime = new Date(reservation_date + ' ' + reservation_time);
        if (reservationDateTime < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'La date de réservation doit être dans le futur'
            });
        }

        // Vérifier la disponibilité des tables
        const [availableTables] = await db.query(
            `SELECT t.* FROM tables t 
            WHERE t.seats >= ? 
            AND t.id NOT IN (
                SELECT rt.table_id 
                FROM reservations r 
                JOIN reservation_tables rt ON r.id = rt.reservation_id 
                WHERE r.reservation_date = ? 
                AND r.reservation_time = ? 
                AND r.status != 'cancelled'
            )
            ORDER BY t.seats ASC
            LIMIT 1`,
            [number_of_people, reservation_date, reservation_time]
        );

        if (availableTables.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Aucune table disponible pour ce créneau'
            });
        }

        // Créer la réservation
        const [result] = await db.query(
            'INSERT INTO reservations (user_id, number_of_people, reservation_date, reservation_time, note, status) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, number_of_people, reservation_date, reservation_time, note, 'pending']
        );

        // Associer la table à la réservation
        await db.query(
            'INSERT INTO reservation_tables (reservation_id, table_id) VALUES (?, ?)',
            [result.insertId, availableTables[0].id]
        );

        res.status(201).json({
            success: true,
            message: 'Réservation créée avec succès',
            reservation: {
                id: result.insertId,
                number_of_people,
                reservation_date,
                reservation_time,
                note,
                status: 'pending',
                table: availableTables[0]
            }
        });
    } catch (error) {
        console.error('Erreur création réservation:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de la réservation'
        });
    }
};

// Mettre à jour le statut d'une réservation (admin)
const updateReservationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Statut invalide'
            });
        }

        const [result] = await db.query(
            'UPDATE reservations SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Réservation non trouvée'
            });
        }

        res.json({
            success: true,
            message: 'Statut de la réservation mis à jour'
        });
    } catch (error) {
        console.error('Erreur mise à jour statut:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du statut'
        });
    }
};

// Annuler une réservation (utilisateur)
const cancelReservation = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier que la réservation appartient à l'utilisateur
        const [reservation] = await db.query(
            'SELECT * FROM reservations WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );

        if (reservation.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Réservation non trouvée'
            });
        }

        // Vérifier que la réservation n'est pas déjà passée
        const reservationDateTime = new Date(reservation[0].reservation_date + ' ' + reservation[0].reservation_time);
        if (reservationDateTime < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Impossible d\'annuler une réservation passée'
            });
        }

        await db.query(
            'UPDATE reservations SET status = ? WHERE id = ?',
            ['cancelled', id]
        );

        res.json({
            success: true,
            message: 'Réservation annulée avec succès'
        });
    } catch (error) {
        console.error('Erreur annulation réservation:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'annulation de la réservation'
        });
    }
};

module.exports = {
    getAllReservations,
    getUserReservations,
    createReservation,
    updateReservationStatus,
    cancelReservation
}; 