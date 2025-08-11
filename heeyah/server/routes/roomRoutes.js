
import express from 'express';
import { getAllRooms, createRoom } from '../controllers/roomController.js';
import { protect, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Anyone who is logged in can view rooms
router.get('/', protect, getAllRooms);

// Only wardens or admins can create new rooms
router.post('/', protect, checkRole(['warden', 'admin']), createRoom);

export default router;