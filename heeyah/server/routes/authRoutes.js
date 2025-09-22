import express from 'express';
import { loginUser } from '../controller/authController.js';

const router = express.Router();

// @desc    Authenticate a user and get a token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginUser);

export default router;