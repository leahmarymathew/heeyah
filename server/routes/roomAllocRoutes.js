
import express from 'express';
import { protectAndFetchProfile, checkRole } from '../middleware/authMiddleware.js';
import { allocateRoom } from '../controllers/roomAllocController.js';

const router = express.Router();

// Route for wardens to allocate a room
router.post('/', protectAndFetchProfile, checkRole(['warden', 'admin']), allocateRoom);

// Note: The route to GET a student's allocation is placed in studentRoutes.js
// for better RESTful API design (e.g., /api/students/:id/allocation)

export default router;
