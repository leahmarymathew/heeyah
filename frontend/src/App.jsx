import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import LostAndFound from './pages/LostAndFound';
import Complaint from './pages/Complaint';
import StudentAttendance from './pages/StudentAttendance';
import WardenDashboard from './pages/wardenDashboard';
import AppLayout from './components/AppLayout.jsx';
import RoomAllocationPage from './pages/roomAllocation.jsx';
import RoleBasedRedirect from './components/RoleBasedRedirect.jsx';

function App() {
  return (
    <Routes>
      {/* --- Public Route --- */}
      <Route path="/login" element={<Login />} />
      
      {/* --- Warden Routes (separate layout) --- */}
      <Route path="/warden-dashboard" element={<ProtectedRoute><WardenDashboard /></ProtectedRoute>} />
      
      {/* --- Protected Routes with Student/Admin Layout --- */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        {/* Role-based redirect for /dashboard */}
        <Route path="/dashboard" element={<RoleBasedRedirect />} /> 

        {/* Student/Admin Routes */}
        <Route path="/attendance" element={<StudentAttendance />} /> 
        <Route path="/admin-dashboard" element={<Dashboard />} />

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
