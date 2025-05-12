const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Table extends Model {
        static associate(models) {
            Table.belongsToMany(models.Reservation, {
                through: 'ReservationTables',
                as: 'reservations',
                foreignKey: 'tableId'
            });
        }
    }

    Table.init({
        seats: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 2,
                max: 12
            }
        },
        number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        isAvailable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: 'Table'
    });

    return Table;
}; 