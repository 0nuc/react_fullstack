const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Reservation extends Model {
        static associate(models) {
            Reservation.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user'
            });
            Reservation.belongsToMany(models.Table, {
                through: 'ReservationTables',
                as: 'tables',
                foreignKey: 'reservationId'
            });
        }
    }

    Reservation.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        numberOfPeople: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
            defaultValue: 'pending'
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Reservation'
    });

    return Reservation;
}; 