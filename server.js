const express = require('express');
const routes = require('./src/routes');

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Routes de l'API
app.use('/api', routes);

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Erreur serveur interne'
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
}); 