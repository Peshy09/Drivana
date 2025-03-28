import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
    // Skip auth check for login and register routes
    if (req.path === '/login' || req.path === '/register') {
        return next();
    }

    let token;

    console.log("Authorization Header:", req.headers.authorization);

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            console.log("Extracted Token:", token);

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded Token:", decoded); // Debugging the token
            req.user = await User.findById(decoded.userId).select('-password');
            if (!req.user) {
                return res.status(401).json({ error: 'User not found' });
            }
            next();
        } catch (error) {
            console.error("Token verification error:", error);
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Admin middleware
export const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as admin');
    }
};