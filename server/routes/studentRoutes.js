import express from 'express';
import { protectAndFetchProfile, checkRole } from '../middleware/authMiddleware.js';
import { 
    registerStudent,
    getAllStudents 
} from '../controllers/studentController.js';
// We removed the incorrect import of 'getStudentAllocation' from this file.

const router = express.Router();

// Route for an admin to register a new student
router.post('/register', protectAndFetchProfile, checkRole(['warden', 'admin']), registerStudent);

// Route for an admin to get a list of all students
router.get('/', protectAndFetchProfile, checkRole(['warden', 'admin']), getAllStudents);

// The route for a student to get their own allocation
// is now correctly located in 'roomAllocRoutes.js'

export default router;
