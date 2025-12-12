// No changes are needed here, but this is the routes file for context.

import express from 'express';
import { protectAndFetchProfile, checkRole } from '../middleware/authMiddleware.js';
import { 
    createRequest,
    getMyRequests,
    getAllRequests,
    updateRequestStatus,
    createSimpleRequest
} from '../controllers/requestController.js';

const router = express.Router();

// A student creates a new request
router.post('/', protectAndFetchProfile, checkRole(['student']), createRequest);

// Simple complaint filing - no heavy authentication
router.post('/simple', createSimpleRequest);

// A student gets their own list of requests
router.get('/my', protectAndFetchProfile, checkRole(['student']), getMyRequests);

// A warden or admin gets all requests from all students
router.get('/', protectAndFetchProfile, checkRole(['student','warden', 'admin']), getAllRequests);

// A warden or admin updates the status of a request
router.put('/:id/status', protectAndFetchProfile, checkRole(['warden', 'admin']), updateRequestStatus);

export default router;
