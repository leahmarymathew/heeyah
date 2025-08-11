
import express from 'express';
import { protect, checkRole } from '../middleware/authMiddleware.js';
import { 
    getMyLeaveRecords, 
    getAllLeaveRecords, 
} from '../controllers/leaveController.js';

const router = express.Router();

// Student routes
router.get('/my', protect, checkRole(['student']), getMyLeaveRecords);

// Warden/Admin routes
router.get('/', protect, checkRole(['warden', 'admin']), getAllLeaveRecords);

export default router;