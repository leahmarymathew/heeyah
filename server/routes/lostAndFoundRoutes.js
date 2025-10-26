import express from 'express';
import { reportLostItem, reportLostItemSimple } from '../controllers/lostAndFoundController.js';
import { protectAndFetchProfile, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// This route allows a logged-in student to report a lost item.
router.post('/report', protectAndFetchProfile, checkRole(['student']), reportLostItem);

// Simple lost item reporting - no heavy authentication
router.post('/simple', reportLostItemSimple);

export default router;
