import jwt from 'jsonwebtoken';

// Validate JWT
export const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token.' });
    }

    try {
        // decoded = { userId, role, roll_no }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Not authorized, token failed.' });
    }
};

// Require specific roles
export const checkRole = (allowedRoles) => (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden: insufficient permissions.' });
    }
    next();
};
