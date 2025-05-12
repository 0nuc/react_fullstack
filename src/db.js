const mysql = require('mysql2/promise');

const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'restaurant_db',
    port: 7006,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

console.log('Tentative de connexion MySQL sur le port:', dbConfig.port);

const pool = mysql.createPool(dbConfig);

module.exports = pool; 