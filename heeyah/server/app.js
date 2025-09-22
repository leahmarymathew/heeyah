import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import route files
import attendanceRoutes from './routes/attendanceRoutes.js';
import authRoutes from './routes/authRoutes.js'; // 👈 1. Make sure this import is here

// Load environment variables
dotenv.config();

// Initialize the express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// Mount the routers
app.use('/api/attendance', attendanceRoutes);
app.use('/api/auth', authRoutes); // 👈 2. Make sure this line is here

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});