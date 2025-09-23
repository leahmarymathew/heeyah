// This is the corrected and merged version of your App.jsx file.

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import LostAndFound from './pages/LostAndFound';
// Import your friend's new page
import StudentAttendance from './pages/StudentAttendance';

function App() {
  return (
    <Routes>
      {/* Public route that anyone can access */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes wrapped by the layout component (which includes the Navbar) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lost-and-found" element={<LostAndFound />} />
        {/* Add the new route for the attendance page */}
        <Route path="/attendance" element={<StudentAttendance />} />
        {/* You can add routes for /complaint and /room-allocation here later */}
      </Route>
      
      {/* Add a default route to redirect to login */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;