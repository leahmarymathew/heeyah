// This is the corrected App.jsx file. It acts as the central router for your application,
// using AppLayout to provide a consistent Navbar for all protected pages.

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import LostAndFound from './pages/LostAndFound';
import Complaint from './pages/Complaint';
import StudentAttendance from './pages/StudentAttendance';
import AppLayout from './components/AppLayout.jsx';
import WardenLeave from './pages/warden/WardenLeave';
import WardenAttendance from './pages/warden/WardenAttendance';
import WardenComplaint from './pages/warden/WardenComplaint'

function App() {
  return (
    <Routes>
      {/* --- Public Route --- */}
      <Route path="/login" element={<Login />} />
      
      {/* --- Protected Routes (Pages that require login) --- */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/complaint" element={<Complaint />} />
        <Route path="/lost-and-found" element={<LostAndFound />} />
        <Route path="/attendance" element={<StudentAttendance />} /> 
        <Route path="/warden-attendence" element={<WardenAttendance />} /> 
        <Route path="/warden-complaint" element={<WardenComplaint/>} /> 
        <Route path="/warden-leave" element={<WardenLeave/>} /> 
      </Route>

       

      
      {/* Default route */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;

