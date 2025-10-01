import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/header'
import Login from "./pages/login";
import WardenDashboard from "./pages/wardenDashboard";
import './App.css'

// Define Navigation Link Sets based on user roles
const STUDENT_NAV_LINKS = [
    { path: "/student/attendance", name: "Attendance" },
    { path: "/student/complaint", name: "Complaint" },
    { path: "/student/rooms", name: "Room Allocation" },
];

const WARDEN_NAV_LINKS = [
    { path: "/warden-dashboard", name: "Student" }, // Home link for Warden Dashboard content (Student Reports)
    { path: "/warden/wardens", name: "Wardens" },
    { path: "/warden/room-management", name: "Room Management" },
];

// --- Placeholder Components for a complete app structure ---
// (These were created to support the new routes)
const StudentDashboard = () => (
  <div style={{ padding: '20px' }}>
    <h2>Student Dashboard</h2>
    <p>Welcome, Student! Use the navigation bar above.</p>
  </div>
);
const AttendancePage = () => <div style={{ padding: '20px' }}><h2>Student Attendance</h2></div>;
const ComplaintPage = () => <div style={{ padding: '20px' }}><h2>Student Complaint</h2></div>;
const StudentRoomsPage = () => <div style={{ padding: '20px' }}><h2>Student Room Allocation</h2></div>;
const WardensPage = () => <div style={{ padding: '20px' }}><h2>Warden Management</h2></div>;
const RoomManagementPage = () => <div style={{ padding: '20px' }}><h2>Warden Room Management</h2></div>;
// -----------------------------------------------------------


// Layout Wrappers: render the Header with role-specific links and then the child route content
const StudentLayout = () => (
    <>
        <Header navLinks={STUDENT_NAV_LINKS} />
        <Outlet /> {/* Renders the nested student routes here */}
    </>
);

const WardenLayout = () => (
    <>
        <Header navLinks={WARDEN_NAV_LINKS} />
        <Outlet /> {/* Renders the nested warden routes here */}
    </>
);


function App() {
  return (
    <Routes>
      {/* 1. Login Route - No Header */}
      <Route path="/" element={<Login />} />
      
      {/* 2. Student Section Routes - Use StudentLayout with student links */}
      <Route element={<StudentLayout />}>
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student/attendance" element={<AttendancePage />} />
        <Route path="/student/complaint" element={<ComplaintPage />} />
        <Route path="/student/rooms" element={<StudentRoomsPage />} />
      </Route>

      {/* 3. Warden Section Routes - Use WardenLayout with warden links */}
      <Route element={<WardenLayout />}>
        {/* WardenDashboard is the primary page showing student reports */}
        <Route path="/warden-dashboard" element={<WardenDashboard />} />
        <Route path="/warden/wardens" element={<WardensPage />} />
        <Route path="/warden/room-management" element={<RoomManagementPage />} />
      </Route>
    </Routes>
  )
}

export default App