import express from 'express';
import { protect, checkRole } from '../middleware/authMiddleware.js';
import { markAttendance, getAttendance } from '../controllers/attendanceController.js';

const router = express.Router();

// @desc    Get attendance records for a specific date
// @route   GET /api/attendance?date=YYYY-MM-DD
// @access  Private (Student, Warden, Admin)
router.get('/', protect, checkRole(['student', 'warden', 'admin']), getAttendance);

// @desc    Mark attendance (in or out) for a student
// @route   POST /api/attendance
// @access  Private (Caretaker, Warden, Admin)
router.post('/', protect, checkRole(['caretaker', 'warden', 'admin']), markAttendance);

export default router;
