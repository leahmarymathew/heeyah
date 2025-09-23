
import express from 'express';
import { registerStudent } from '../controllers/studentController.js';
import { getStudentAllocation } from '../controllers/roomAllocController.js'; // <-- IMPORT
import { protect, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();



// Route to get a specific student's room allocation details
router.get('/:roll_no/allocation', protect, checkRole(['student', 'warden', 'admin']), getStudentAllocation);

export default router;