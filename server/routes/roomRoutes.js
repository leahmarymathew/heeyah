import express from 'express';
// Make sure to import all functions
import { 
    getAllRooms, 
    createRoom, 
    getRoomLayout, 
    getRoomDetails,
    getRoomLayoutSimple,
    getRoomDetailsSimple
} from '../controllers/roomController.js';
import { protectAndFetchProfile, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Admin-Only Routes ---
router.get('/', protectAndFetchProfile, checkRole(['warden', 'admin']), getAllRooms);
router.post('/', protectAndFetchProfile, checkRole(['admin']), createRoom);

// --- Routes for Room Allocation Page (Student/Warden/Admin) ---
router.get('/layout', protectAndFetchProfile, checkRole(['student', 'warden', 'admin']), getRoomLayout);
router.get('/layout/simple', getRoomLayoutSimple); // Simple version without heavy auth
router.get('/layout/simple/:id', getRoomDetailsSimple); // Simple room details without heavy auth
router.get('/layout/:id', protectAndFetchProfile, checkRole(['student', 'warden', 'admin']), getRoomDetails);

export default router;

