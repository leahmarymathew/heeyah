// This is the correct, final version of your middleware.
// It verifies the Supabase token AND fetches the user's full profile.

import supabase from '../config/supabaseClient.js';
// Make sure this helper function is correctly exported from your authController
import { findUserProfile } from '../controllers/authController.js'; 


export const protectAndFetchProfile = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    

    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ error: 'Not authorized, no token' });
    }

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            console.log("Supabase token invalid:", authError);
            return res.status(401).json({ error: 'Token invalid' });
        }

        const profile = await findUserProfile(user.id);
        if (!profile) {
            console.log(`Profile not found for user ID: ${user.id}`);
            return res.status(404).json({ error: 'Profile not found' });
        }

        // Attach user to request
        req.user = { userId: user.id, ...profile };
        console.log("req.user attached:", req.user);

        next();
    } catch (err) {
        console.log("Error in protectAndFetchProfile:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// // Middleware to check if the user (whose profile is now attached) has an allowed role
// export const checkRole = (allowedRoles) => (req, res, next) => {
//     // Now checks req.profile which is attached by protectAndFetchProfile
//     if (!req.profile || !req.profile.role || !allowedRoles.includes(req.profile.role)) {
//         return res.status(403).json({ error: 'Forbidden: You do not have the required permissions.' });
//     }
//     // If role is allowed, proceed
//     next();
// };

export const checkRole = (allowedRoles) => (req, res, next) => {
    
    if (!req.user || !req.user.role) {
        return res.status(403).json({ error: 'Forbidden: No role found.' });
    }

    const role = req.user.role.toLowerCase(); // lowercase
    const allowed = allowedRoles.map(r => r.toLowerCase());

    if (!allowed.includes(role)) {
        console.log("DEBUG - Role not allowed!");
        return res.status(403).json({ error: `Forbidden: You do not have the required permissions. Your role is ${req.user.role}` });
    }

    next();
};

