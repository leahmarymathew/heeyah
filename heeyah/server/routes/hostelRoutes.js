
import express from 'express';
import { protect, checkRole } from '../middleware/authMiddleware.js';
import { createHostel, getAllHostels } from '../controllers/hostelController.js';

const router = express.Router();

router.post('/', protect, checkRole(['admin']), createHostel);
router.get('/', protect, checkRole(['admin']), getAllHostels);

export default router;
