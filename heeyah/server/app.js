import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// --- Import Route Files ---
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import wardenRoutes from './routes/wardenRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import roomAllocRoutes from './routes/roomAllocRoutes.js';
import caretakerRoutes from './routes/caretakerRoutes.js';
import hostelRoutes from './routes/hostelRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';

const app = express();

// --- Core Middleware ---
app.use(cors());
app.use(express.json());

// --- Health / Root Route ---
app.get('/', (req, res) => {
  res.status(200).send('API is running');
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/wardens', wardenRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/allocate', roomAllocRoutes);
app.use('/api/caretakers', caretakerRoutes);
app.use('/api/hostels', hostelRoutes);
app.use('/api/reports', reportsRoutes);

export default app;