
import express from 'express';
import { protectAndFetchProfile, checkRole } from '../middleware/authMiddleware.js';
import { createHostel, getAllHostels } from '../controllers/hostelController.js';

const router = express.Router();

router.post('/', protectAndFetchProfile, checkRole(['admin']), createHostel);
router.get('/', protectAndFetchProfile, checkRole(['admin']), getAllHostels);

export default router;
