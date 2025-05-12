const db = require('../config/database');

const getAllMenuItems = async (req, res) => {
    try {
        const [items] = await db.query('SELECT * FROM menu_items WHERE is_available = true ORDER BY category, name');
        
        // Grouper les items par catégorie
        const menuByCategory = items.reduce((acc, item) => {
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
        console.error('Erreur getAllMenuItems:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du menu'
        });
    }
};

const createMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, image_url } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO menu_items (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, category, image_url]
        );

        res.status(201).json({
            success: true,
            message: 'Item ajouté au menu avec succès',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Erreur createMenuItem:', error);
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la création de l\'item'
        });
    }
};

const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, image_url, is_available } = req.body;
        
        const [result] = await db.query(
            'UPDATE menu_items SET name = ?, description = ?, price = ?, category = ?, image_url = ?, is_available = ? WHERE id = ?',
            [name, description, price, category, image_url, is_available, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Item non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Item mis à jour avec succès'
        });
    } catch (error) {
        console.error('Erreur updateMenuItem:', error);
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la mise à jour de l\'item'
        });
    }
};

const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await db.query('DELETE FROM menu_items WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Item non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Item supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur deleteMenuItem:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de l\'item'
        });
    }
};

module.exports = {
    getAllMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem
}; 