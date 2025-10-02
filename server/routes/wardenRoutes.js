
import express from 'express';
import { registerWarden } from '../controllers/wardenController.js';
import { protect, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to register a new warden, protected for admins
router.post('/register', protect, checkRole(['admin']), registerWarden);

export default router;