
import express from 'express';
import { protectAndFetchProfile, checkRole } from '../middleware/authMiddleware.js';
import { 
    getMyLeaveRecords, 
    getAllLeaveRecords, 
    createLeaveRecord,
    updateLeaveStatus,
    getLatestLeaveRecord
} from '../controllers/leaveController.js';

const router = express.Router();

// Student routes
router.get('/my', protectAndFetchProfile, checkRole(['student']), getMyLeaveRecords);
// Student submits a leave request
router.post('/create', protectAndFetchProfile, checkRole(['student']), createLeaveRecord);


// Warden/Admin routes
router.get('/', protectAndFetchProfile, checkRole(['student', 'warden', 'admin']), getAllLeaveRecords);

// routes/leaveRoutes.js
router.patch('/:leaveId/status', protectAndFetchProfile, checkRole(['student', 'warden', 'admin']), updateLeaveStatus);

// GET /api/leaves/latest
router.get('/latest', protectAndFetchProfile, getLatestLeaveRecord);

export default router;