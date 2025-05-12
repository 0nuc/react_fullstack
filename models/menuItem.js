const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MenuItem extends Model {
        static associate(models) {
            // Pas d'associations pour le moment
        }
    }

    MenuItem.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        category: {
            type: DataTypes.ENUM('entrées', 'plats', 'desserts', 'boissons'),
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isAvailable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: 'MenuItem'
    });

    return MenuItem;
}; 