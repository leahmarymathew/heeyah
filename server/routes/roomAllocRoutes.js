import express from 'express';
import { 
    requestRoomAllocation,
    getMyAllocationStatus,
    removeStudentFromRoom
} from '../controllers/roomAllocController.js';
// We use the middleware that fetches the full profile
import { protectAndFetchProfile, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Student Routes ---
router.post('/request', protectAndFetchProfile, checkRole(['student']), requestRoomAllocation);
router.get('/my-status', protectAndFetchProfile, checkRole(['student']), getMyAllocationStatus);

// --- Warden Routes ---
router.delete('/remove', protectAndFetchProfile, checkRole(['warden']), removeStudentFromRoom);

export default router;

