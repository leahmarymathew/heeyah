// This is the corrected and merged version of your App.jsx file.

import React from 'react';
import { Routes, Route, BrowserRouter} from 'react-router-dom';
// Import your friend's new page
import StudentAttendance from './pages/student/StudentAttendance';
import './App.css';
import WardenLeave from './pages/warden/WardenLeave';
import WardenAttendance from './pages/warden/WardenAttendance';
import WardenComplaint from './pages/warden/WardenComplaint';


function App() {
  return (    
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<WardenAttendance />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;