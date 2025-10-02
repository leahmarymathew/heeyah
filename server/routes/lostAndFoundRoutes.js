import express from 'express';
import { reportLostItem } from '../controllers/lostAndFoundController.js';
import { protect, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// This route allows a logged-in student to report a lost item.
router.post('/report', protect, checkRole(['student']), reportLostItem);

export default router;
