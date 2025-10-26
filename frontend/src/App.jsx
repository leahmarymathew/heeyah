import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import LostAndFound from './pages/LostAndFound';
import Complaint from './pages/Complaint';
import StudentAttendance from './pages/StudentAttendance';
import WardenDashboard from './pages/wardenDashboard'; // 👈 Import the new dashboard
import AppLayout from './components/AppLayout.jsx';
import RoomAllocationPage from './pages/roomAllocation.jsx';

function App() {
  return (
    <Routes>
      {/* --- Public Route --- */}
      <Route path="/login" element={<Login />} />
      
      {/* --- Protected Routes (Pages that require login) --- */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        {/* Student Default */}
        <Route path="/dashboard" element={<Dashboard />} /> 

        {/* Role Specific Routes */}
        <Route path="/attendance" element={<StudentAttendance />} /> 
        <Route path="/warden-dashboard" element={<WardenDashboard />} /> {/* 👈 Warden Route */}
        <Route path="/admin-dashboard" element={<Dashboard />} />     {/* Admin Route (Placeholder) */}

        {/* General Protected Routes */}
        <Route path="/complaint" element={<Complaint />} />
        <Route path="/lost-and-found" element={<LostAndFound />} />
        <Route path="/room-allocation" element={<RoomAllocationPage />} />
        
      </Route>
      
      {/* Default route */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
