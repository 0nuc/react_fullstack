const { Reservation, Table, User } = require('../models');
const { Op } = require('sequelize');

// Fonction utilitaire pour vérifier la disponibilité des tables
const findAvailableTables = async (numberOfPeople, date, time) => {
    const tables = await Table.findAll({
        where: { isAvailable: true },
        order: [['seats', 'ASC']]
    });

    const reservedTables = await Reservation.findAll({
        where: {
            date,
            time,
            status: {
                [Op.ne]: 'cancelled'
            }
        },
        include: [{
            model: Table,
            as: 'tables'
        }]
    });

    const reservedTableIds = new Set(
        reservedTables.flatMap(res => res.tables.map(table => table.id))
    );

    const availableTables = tables.filter(table => !reservedTableIds.has(table.id));

    // Algorithme simple pour trouver la meilleure combinaison de tables
    let remainingPeople = numberOfPeople;
    const selectedTables = [];

    for (const table of availableTables) {
        if (remainingPeople <= 0) break;
        if (table.seats <= remainingPeople + 2) { // +2 pour éviter de trop petites tables
            selectedTables.push(table);
            remainingPeople -= table.seats;
        }
    }

    return remainingPeople <= 0 ? selectedTables : null;
};

const getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['firstName', 'lastName', 'email', 'phone']
                },
                {
                    model: Table,
                    as: 'tables',
                    through: { attributes: [] }
                }
            ]
        });

        res.json({
            success: true,
            data: reservations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des réservations',
            error: error.message
        });
    }
};

const getMyReservations = async (req, res) => {
    try {
        const reservations = await Reservation.findAll({
            where: { userId: req.user.id },
            include: [{
                model: Table,
                as: 'tables',
                through: { attributes: [] }
            }]
        });

        res.json({
            success: true,
            data: reservations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de vos réservations',
            error: error.message
        });
    }
};

const createReservation = async (req, res) => {
    try {
        const { numberOfPeople, date, time, note } = req.body;

        // Vérifier la disponibilité des tables
        const availableTables = await findAvailableTables(numberOfPeople, date, time);

        if (!availableTables) {
            return res.status(400).json({
                success: false,
                message: 'Pas de tables disponibles pour ce nombre de personnes à cette date et heure'
            });
        }

        const reservation = await Reservation.create({
            userId: req.user.id,
            numberOfPeople,
            date,
            time,
            note,
            status: 'pending'
        });

        // Associer les tables à la réservation
        await reservation.setTables(availableTables);

        res.status(201).json({
            success: true,
            data: {
                ...reservation.toJSON(),
                tables: availableTables
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la création de la réservation',
            error: error.message
        });
    }
};

const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { numberOfPeople, date, time, note } = req.body;

        const reservation = await Reservation.findByPk(id, {
            include: [{
                model: Table,
                as: 'tables'
            }]
        });

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Réservation non trouvée'
            });
        }

        if (reservation.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Non autorisé à modifier cette réservation'
            });
        }

        if (reservation.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Impossible de modifier une réservation confirmée ou annulée'
            });
        }

        // Vérifier la disponibilité des tables si changement de date/heure/nombre de personnes
        if (numberOfPeople !== reservation.numberOfPeople ||
            date !== reservation.date ||
            time !== reservation.time) {
            const availableTables = await findAvailableTables(numberOfPeople, date, time);

            if (!availableTables) {
                return res.status(400).json({
                    success: false,
                    message: 'Pas de tables disponibles pour ce nombre de personnes à cette date et heure'
                });
            }

            await reservation.setTables(availableTables);
        }

        await reservation.update({
            numberOfPeople,
            date,
            time,
            note
        });

        res.json({
            success: true,
            data: reservation
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la modification de la réservation',
            error: error.message
        });
    }
};

const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findByPk(id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Réservation non trouvée'
            });
        }

        if (reservation.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Non autorisé à annuler cette réservation'
            });
        }

        await reservation.update({ status: 'cancelled' });

        res.json({
            success: true,
            message: 'Réservation annulée avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'annulation de la réservation',
            error: error.message
        });
    }
};

const validateReservation = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findByPk(id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Réservation non trouvée'
            });
        }

        if (reservation.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Cette réservation ne peut pas être validée'
            });
        }

        await reservation.update({ status: 'confirmed' });

        res.json({
            success: true,
            message: 'Réservation confirmée avec succès',
            data: reservation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la validation de la réservation',
            error: error.message
        });
    }
};

module.exports = {
    getAllReservations,
    getMyReservations,
    createReservation,
    updateReservation,
    deleteReservation,
    validateReservation
}; 