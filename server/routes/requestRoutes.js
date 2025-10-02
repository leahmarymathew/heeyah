// No changes are needed here, but this is the routes file for context.

import express from 'express';
import { protect, checkRole } from '../middleware/authMiddleware.js';
import { 
    createRequest,
    getMyRequests,
    getAllRequests,
    updateRequestStatus
} from '../controllers/requestController.js';

const router = express.Router();

// A student creates a new request
router.post('/', protect, checkRole(['student']), createRequest);

// A student gets their own list of requests
router.get('/my', protect, checkRole(['student']), getMyRequests);

// A warden or admin gets all requests from all students
router.get('/', protect, checkRole(['warden', 'admin']), getAllRequests);

// A warden or admin updates the status of a request
router.put('/:id/status', protect, checkRole(['warden', 'admin']), updateRequestStatus);

export default router;
