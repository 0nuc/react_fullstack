const { MenuItem } = require('../models');
const { Op } = require('sequelize');

const getAllMenuItems = async (req, res) => {
    try {
        const { category, maxPrice } = req.query;

        const where = {};

        if (category) {
            where.category = category;
        }

        if (maxPrice) {
            where.price = {
                [Op.lte]: parseFloat(maxPrice)
            };
        }

        const menuItems = await MenuItem.findAll({
            where,
            order: [
                ['category', 'ASC'],
                ['name', 'ASC']
            ]
        });

        // Grouper les items par catégorie
        const menuByCategory = menuItems.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {});

        res.json({
            success: true,
            data: menuByCategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du menu',
            error: error.message
        });
    }
};

const createMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, imageUrl } = req.body;

        const menuItem = await MenuItem.create({
            name,
            description,
            price,
            category,
            imageUrl
        });

        res.status(201).json({
            success: true,
            data: menuItem
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la création de l\'item du menu',
            error: error.message
        });
    }
};

const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, imageUrl, isAvailable } = req.body;

        const menuItem = await MenuItem.findByPk(id);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Item du menu non trouvé'
            });
        }

        await menuItem.update({
            name,
            description,
            price,
            category,
            imageUrl,
            isAvailable
        });

        res.json({
            success: true,
            data: menuItem
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la modification de l\'item du menu',
            error: error.message
        });
    }
};

const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        const menuItem = await MenuItem.findByPk(id);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Item du menu non trouvé'
            });
        }

        await menuItem.destroy();

        res.json({
            success: true,
            message: 'Item du menu supprimé avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de l\'item du menu',
            error: error.message
        });
    }
};

module.exports = {
    getAllMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem
}; 