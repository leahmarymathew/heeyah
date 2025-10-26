import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import LostAndFound from './pages/LostAndFound';
import Complaint from './pages/Complaint';

import StudentAttendance from './pages/student/StudentAttendance';
import AppLayout from './components/AppLayout.jsx';
import WardenLeave from './pages/warden/WardenLeave';
import WardenAttendance from './pages/warden/WardenAttendance';
import WardenComplaint from './pages/warden/WardenComplaint'
import StudentLeave from './pages/student/StudentLeave.jsx';

import WardenDashboard from './pages/wardenDashboard';
import WardenRoomManagement from './pages/WardenRoomManagement';

import RoomAllocationPage from './pages/roomAllocation.jsx';
import RoleBasedRedirect from './components/RoleBasedRedirect.jsx';
import StudentLostFoundMessages from './pages/student/StudentLostFoundMessages.jsx';


function App() {
  return (
    <Routes>
      {/* --- Public Route --- */}
      <Route path="/login" element={<Login />} />
      
      {/* --- Warden Routes (separate layout) --- */}
      <Route path="/warden-dashboard" element={<ProtectedRoute><WardenDashboard /></ProtectedRoute>} />
      <Route path="/warden-room-management" element={<ProtectedRoute><WardenRoomManagement /></ProtectedRoute>} />
      
      {/* --- Protected Routes with Student/Admin Layout --- */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        {/* Role-based redirect for /dashboard */}
        <Route path="/dashboard" element={<RoleBasedRedirect />} /> 

        {/* Student/Admin Routes */}
       
        <Route path="/admin-dashboard" element={<Dashboard />} />

        {/* General Protected Routes */}
        <Route path="/complaint" element={<Complaint />} />
        <Route path="/lost-and-found" element={<LostAndFound />} />

        <Route path="/attendance" element={<StudentAttendance />} /> 
        <Route path="/student/leave-form" element={<StudentLeave />} />
        <Route path="/student-lost-found" element={<StudentLostFoundMessages />} /> 
        <Route path="/warden-attendence" element={<WardenAttendance />} /> 
        <Route path="/warden-complaint" element={<WardenComplaint/>} /> 
        <Route path="/warden-leave" element={<WardenLeave/>} /> 
        <Route path="/room-allocation" element={<RoomAllocationPage />} />
        

      </Route>

       

      
      {/* Default route */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
