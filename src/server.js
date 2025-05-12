const express = require('express');
const cors = require('cors');
const db = require('./db');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test de connexion à la base de données
(async () => {
    try {
        const connection = await db.getConnection();
        console.log('Connexion à MySQL établie avec succès sur le port 7006');
        connection.release();
    } catch (err) {
        console.error('Erreur de connexion à la base MySQL :', err.message);
        process.exit(1);
    }
})();

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Une erreur est survenue sur le serveur'
    });
});

const port = 3000; // On garde 3000 pour Node.js car il n'y a pas de conflit avec MAMP
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
}); 