// server/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';

// Validate JWT from Authorization header
export const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { userId, role }
        next();
    } catch (error) {
        res.status(401).json({ error: 'Not authorized, token failed.' });
    }
};

// Require one of the allowed roles
export const checkRole = (allowedRoles) => (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden: You do not have the required permissions.' });
    }
    next();
};
