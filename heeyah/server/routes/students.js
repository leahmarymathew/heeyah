// server/routes/students.js

import express from 'express';
import { getAllStudents, getStudentById, createStudent } from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply the 'protect' middleware to all routes in this file
router.use(protect);

// Define the routes
router.route('/').get(getAllStudents).post(createStudent);
router.route('/:id').get(getStudentById);
// router.route('/:id').put(updateStudent).delete(deleteStudent); // Example for update/delete

export default router;