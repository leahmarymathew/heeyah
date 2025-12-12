
import express from 'express';
import { protectAndFetchProfile, checkRole } from '../middleware/authMiddleware.js';
import { getComplaintsReport, getAttendanceReport } from '../controllers/reportsController.js';

const router = express.Router();

router.get('/complaints', protectAndFetchProfile, checkRole(['warden', 'admin']), getComplaintsReport);
router.get('/attendance', protectAndFetchProfile, checkRole(['warden', 'admin']), getAttendanceReport);

export default router;