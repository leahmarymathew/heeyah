
import express from 'express';
import { protect, checkRole } from '../middleware/authMiddleware.js';
import { getComplaintsReport, getAttendanceReport } from '../controllers/reportsController.js';

const router = express.Router();

router.get('/complaints', protect, checkRole(['warden', 'admin']), getComplaintsReport);
router.get('/attendance', protect, checkRole(['warden', 'admin']), getAttendanceReport);

export default router;