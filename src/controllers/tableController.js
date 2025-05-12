const { Table, Reservation } = require('../models');
const { Op } = require('sequelize');

const getAllTables = async (req, res) => {
    try {
        const tables = await Table.findAll({
            order: [['number', 'ASC']]
        });

        res.json({
            success: true,
            data: tables
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des tables',
            error: error.message
        });
    }
};

const createTable = async (req, res) => {
    try {
        const { number, seats } = req.body;

        const existingTable = await Table.findOne({ where: { number } });
        if (existingTable) {
            return res.status(400).json({
                success: false,
                message: 'Une table avec ce numéro existe déjà'
            });
        }

        const table = await Table.create({
            number,
            seats,
            isAvailable: true
        });

        res.status(201).json({
            success: true,
            data: table
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la création de la table',
            error: error.message
        });
    }
};

const updateTable = async (req, res) => {
    try {
        const { id } = req.params;
        const { number, seats, isAvailable } = req.body;

        const table = await Table.findByPk(id);

        if (!table) {
            return res.status(404).json({
                success: false,
                message: 'Table non trouvée'
            });
        }

        // Vérifier si le nouveau numéro n'est pas déjà utilisé
        if (number !== table.number) {
            const existingTable = await Table.findOne({ where: { number } });
            if (existingTable) {
                return res.status(400).json({
                    success: false,
                    message: 'Une table avec ce numéro existe déjà'
                });
            }
        }

        await table.update({
            number,
            seats,
            isAvailable
        });

        res.json({
            success: true,
            data: table
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la modification de la table',
            error: error.message
        });
    }
};

const deleteTable = async (req, res) => {
    try {
        const { id } = req.params;

        const table = await Table.findByPk(id);

        if (!table) {
            return res.status(404).json({
                success: false,
                message: 'Table non trouvée'
            });
        }

        // Vérifier si la table a des réservations futures
        const futureReservations = await Reservation.findOne({
            include: [{
                model: Table,
                as: 'tables',
                where: { id: table.id }
            }],
            where: {
                date: {
                    [Op.gte]: new Date()
                },
                status: {
                    [Op.ne]: 'cancelled'
                }
            }
        });

        if (futureReservations) {
            return res.status(400).json({
                success: false,
                message: 'Impossible de supprimer une table avec des réservations futures'
            });
        }

        await table.destroy();

        res.json({
            success: true,
            message: 'Table supprimée avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de la table',
            error: error.message
        });
    }
};

const getTableAvailability = async (req, res) => {
    try {
        const { date, time } = req.query;

        if (!date || !time) {
            return res.status(400).json({
                success: false,
                message: 'La date et l\'heure sont requises'
            });
        }

        const tables = await Table.findAll({
            where: { isAvailable: true },
            include: [{
                model: Reservation,
                as: 'reservations',
                where: {
                    date,
                    time,
                    status: {
                        [Op.ne]: 'cancelled'
                    }
                },
                required: false
            }]
        });

        const availability = tables.map(table => ({
            id: table.id,
            number: table.number,
            seats: table.seats,
            isAvailable: !table.reservations.length
        }));

        res.json({
            success: true,
            data: availability
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la vérification de la disponibilité des tables',
            error: error.message
        });
    }
};

module.exports = {
    getAllTables,
    createTable,
    updateTable,
    deleteTable,
    getTableAvailability
};