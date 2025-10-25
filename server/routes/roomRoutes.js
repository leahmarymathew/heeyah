
import express from 'express';
import { getAllRooms, createRoom } from '../controllers/roomController.js';
import { protectAndFetchProfile, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Anyone who is logged in can view rooms
router.get('/', protectAndFetchProfile, getAllRooms);

// Only wardens or admins can create new rooms
router.post('/', protectAndFetchProfile, checkRole(['warden', 'admin']), createRoom);

export default router;