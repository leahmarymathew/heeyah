
import express from 'express';
import { protect, checkRole } from '../middleware/authMiddleware.js';
import { 
    createRequest, 
    getMyRequests, 
    getAllRequests, 
    updateRequestStatus 
} from '../controllers/requestController.js';

const router = express.Router();

// Student routes
router.post('/', protect, checkRole(['student']), createRequest);
router.get('/my', protect, checkRole(['student']), getMyRequests);

// Warden/Admin routes
router.get('/', protect, checkRole(['warden', 'admin']), getAllRequests);
router.put('/:id', protect, checkRole(['warden', 'admin']), updateRequestStatus);

export default router;
