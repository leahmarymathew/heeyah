import express from 'express';
// Removed the import for loginUser as it's no longer exported from the controller

const router = express.Router();

// Route for traditional email/password login is removed as login is handled on the frontend.
// router.post('/login', loginUser); 

// You can add other auth-related routes here later if needed (e.g., get user profile)

export default router;

