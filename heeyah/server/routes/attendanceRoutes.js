
import express from 'express';
import { protect, checkRole } from '../middleware/authMiddleware.js';
import { markAttendance, getAttendance } from '../controllers/attendanceController.js';

const router = express.Router();

// Route for caretakers/wardens to mark attendance
router.post('/', protect, checkRole(['caretaker', 'warden', 'admin']), markAttendance);

// Route for wardens/students to view attendance
router.get('/', protect, checkRole(['student', 'warden', 'admin']), getAttendance);

export default router;