
import express from 'express';
import { loginUser } from '../controllers/authController.js';

const router = express.Router();

// Route for traditional email/password login
router.post('/login', loginUser);

export default router;
