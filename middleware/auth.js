const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentification requise'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            throw new Error();
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token invalide ou expiré'
        });
    }
};

// const isAdmin = (req, res, next) => {
//     if (req.user.role !== 'admin') {
//         return res.status(403).json({
//             success: false,
//             message: 'Accès refusé. Droits administrateur requis.'
//         });
//     }
//     next();
// };

module.exports = {
    auth,
    isAdmin
}; 