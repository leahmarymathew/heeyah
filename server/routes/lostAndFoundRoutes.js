import express from 'express';
import { reportLostItem } from '../controllers/lostAndFoundController.js';
import { protectAndFetchProfile, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// This route allows a logged-in student to report a lost item.
router.post('/report', protectAndFetchProfile, checkRole(['student']), reportLostItem);

export default router;
