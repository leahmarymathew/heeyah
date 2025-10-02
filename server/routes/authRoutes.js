import express from 'express';
// Corrected the controller path from 'controller' to 'controllers'
import { loginUser } from '../controllers/authController.js';

const router = express.Router();

// @desc    Authenticate a user and get a token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginUser);

export default router;
