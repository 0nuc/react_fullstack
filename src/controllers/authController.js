const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const jwtConfig = require('../config/jwt');

const ADMIN_SECRET = 'adminAPI'; // Code secret pour créer un compte admin

const signup = async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone, adminSecret } = req.body;
        
        // console.log('AdminSecret reçu:', adminSecret);
        // console.log('AdminSecret attendu:', ADMIN_SECRET);
        // console.log('Type AdminSecret reçu:', typeof adminSecret);
        // console.log('Type AdminSecret attendu:', typeof ADMIN_SECRET);
        // console.log('Comparaison stricte ===:', adminSecret === ADMIN_SECRET);

        // Vérifier si l'utilisateur existe déjà
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Un utilisateur avec cet email existe déjà'
            });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Déterminer le rôle
        let role = 'client';
        if (adminSecret && adminSecret === ADMIN_SECRET) {
            console.log('Attribution du rôle admin');
            role = 'admin';
        } else {
            console.log('Attribution du rôle client car:', 
                !adminSecret ? 'adminSecret manquant' : 'adminSecret incorrect');
        }

        console.log('Rôle final attribué:', role);

        // Créer l'utilisateur
        const [result] = await db.query(
            'INSERT INTO users (email, password, firstName, lastName, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
            [email, hashedPassword, firstName, lastName, phone, role]
        );

        // Générer le token
        const token = jwt.sign(
            { 
                id: result.insertId,
                role: role
            },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        res.status(201).json({
            success: true,
            message: 'Compte créé avec succès',
            token,
            user: {
                id: result.insertId,
                email,
                firstName,
                lastName,
                role
            }
        });
    } catch (error) {
        console.error('Erreur signup:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du compte'
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Rechercher l'utilisateur
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        const user = users[0];

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Générer le token
        const token = jwt.sign(
            { 
                id: user.id,
                role: user.role
            },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la connexion'
        });
    }
};

module.exports = {
    signup,
    login
}; 