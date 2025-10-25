// Corrected to use Supabase for token verification and fetch full profile

import supabase from '../config/supabaseClient.js';
// Make sure this helper function exists and is correctly exported from your authController
import { findUserProfile } from '../controllers/authController.js'; 

// Middleware to check for a valid Supabase JWT and attach the user profile
// Renamed for clarity, as it does more than just 'protect'
export const protectAndFetchProfile = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token' });
    }

    try {
        // 1. Verify token with Supabase - This is the correct method
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);
        
        if (authError || !authUser) {
             console.error("Supabase token verification failed:", authError?.message);
            return res.status(401).json({ error: 'Not authorized, token failed or invalid' });
        }

        // 2. Fetch the detailed profile from your custom tables using the Supabase user ID
        const userProfile = await findUserProfile(authUser.id);
        if (!userProfile) {
             console.error(`User profile not found for Supabase auth ID: ${authUser.id}`);
            return res.status(404).json({ error: 'User profile not found in custom tables.' });
        }

        // 3. Attach the full profile (e.g., { roll_no, name, role, ... }) to the request object
        req.profile = userProfile; 
        next(); // Proceed to the next middleware (checkRole) or the controller

    } catch (error) {
        console.error("Error in protectAndFetchProfile middleware:", error);
        res.status(500).json({ error: 'Internal server error during authentication.' }); // Use 500 for unexpected errors
    }
};

// Middleware to check if the user (whose profile is now attached) has an allowed role
export const checkRole = (allowedRoles) => (req, res, next) => {
    // Now checks req.profile which is attached by protectAndFetchProfile
    if (!req.profile || !req.profile.role || !allowedRoles.includes(req.profile.role)) {
        return res.status(403).json({ error: 'Forbidden: You do not have the required permissions.' });
    }
    // If role is allowed, proceed
    next();
};