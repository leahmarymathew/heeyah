
import supabase from '../config/supabaseClient.js';
import { findUserProfile } from '../controllers/authController.js';

// Middleware to check for a valid JWT from the Authorization header
export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Not authorized, no token' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Not authorized, token failed' });

  req.user = user; // Attach basic auth user to the request
  next();
};

// Middleware to check if the authenticated user has an allowed role
export const checkRole = (allowedRoles) => async (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Not authorized, user not found' });
  
  const userProfile = await findUserProfile(req.user.id);
  if (!userProfile?.role) return res.status(403).json({ error: 'Forbidden: Could not verify user role.' });

  if (!allowedRoles.includes(userProfile.role)) {
    return res.status(403).json({ error: `Forbidden: Access restricted to ${allowedRoles.join(', ')}.` });
  }
  
  req.profile = userProfile; // Attach the full user profile to the request
  next();
};

