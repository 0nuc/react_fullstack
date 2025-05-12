const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const db = require('../config/database');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Authentification requise' 
            });
        }

        const decoded = jwt.verify(token, jwtConfig.secret);
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
        
        if (!users.length) {
            throw new Error('Utilisateur non trouvé');
        }

        req.user = users[0];
        next();
    } catch (error) {
        res.status(401).json({ 
            success: false,
            message: 'Token invalide ou expiré' 
        });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: false,
                message: 'Accès refusé. Droits administrateur requis.' 
            });
        }
        next();
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Erreur lors de la vérification des droits administrateur' 
        });
    }
};

module.exports = {
    auth,
    isAdmin
}; 