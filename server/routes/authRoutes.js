// This file is updated. Since login is handled by the Supabase client
// on the frontend, the POST /login route is no longer needed here.

import express from 'express';
// We remove the 'loginUser' import because it doesn't exist anymore.
// We *do* need the middleware and a new controller function for fetching user data.
import { protectAndFetchProfile } from '../middleware/authMiddleware.js';
import { findUserProfile, simpleLogin } from '../controllers/authController.js';

const router = express.Router();

// @desc    Simple login - no complex authentication
// @route   POST /api/auth/simple-login
// @access  Public
router.post('/simple-login', simpleLogin);

// @desc    Test endpoint to check if server is working
// @route   GET /api/auth/test
// @access  Public
router.get('/test', (req, res) => {
    res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// @desc    Get the profile of the currently logged-in user
// @route   GET /api/auth/me
// @access  Private (any authenticated user)
// This route is useful for the frontend to get user data after a page reload.
router.get('/me', protectAndFetchProfile, (req, res) => {
    // The protectAndFetchProfile middleware has already run,
    // so the full user profile is attached to req.user.
    res.status(200).json(req.user);
});

export default router;

