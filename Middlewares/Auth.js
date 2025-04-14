const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, 'your_secret_key');  // Secret key ko aapko apne JWT se match karna hoga
        req.user = decoded.user;  // User ki info ko request mein attach karen
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
module.exports = { authMiddleware}