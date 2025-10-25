
import express from 'express';
import { protectAndFetchProfile, checkRole } from '../middleware/authMiddleware.js';
import { 
    getMyLeaveRecords, 
    getAllLeaveRecords, 
} from '../controllers/leaveController.js';

const router = express.Router();

// Student routes
router.get('/my', protectAndFetchProfile, checkRole(['student']), getMyLeaveRecords);

// Warden/Admin routes
router.get('/', protectAndFetchProfile, checkRole(['warden', 'admin']), getAllLeaveRecords);

export default router;