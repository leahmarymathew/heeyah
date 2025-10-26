import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

// --- Core Middleware ---
app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true,                
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json());

// ✅ Add this CSP Header Middleware BEFORE your routes:
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; connect-src 'self' http://localhost:3001"
  );
  next();
});

// --- API Routes ---
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
import lostAndFoundRoutes from './routes/lostAndFoundRoutes.js';

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
app.use('/api/lost-and-found', lostAndFoundRoutes);

export default app;
