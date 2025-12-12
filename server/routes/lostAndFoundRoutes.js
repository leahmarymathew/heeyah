import express from 'express';
import multer from 'multer';
import { reportLostItem, reportLostItemSimple, uploadLostItemImage } from '../controllers/lostAndFoundController.js';
import { protectAndFetchProfile, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for file uploads (memory storage)
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// This route allows a logged-in student to report a lost item.
router.post('/report', protectAndFetchProfile, checkRole(['student']), reportLostItem);

// Simple lost item reporting - no heavy authentication
router.post('/simple', reportLostItemSimple);

// Image upload endpoint - no authentication required
router.post('/upload-image', upload.single('image'), uploadLostItemImage);

export default router;
