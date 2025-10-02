
import express from 'express';
import { protect, checkRole } from '../middleware/authMiddleware.js';
import { registerCaretaker } from '../controllers/caretakerController.js';

const router = express.Router();

// Route for wardens/admins to register a new caretaker
router.post('/register', protect, checkRole(['warden', 'admin']), registerCaretaker);

// You could add other routes here, e.g., to get all caretakers
// router.get('/', protect, checkRole(['warden', 'admin']), getAllCaretakers);

export default router;