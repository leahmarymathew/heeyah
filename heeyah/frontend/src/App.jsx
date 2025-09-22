
import "./App.css";

import React from "react";
import Header from "./Header";
import ComplaintBox from "./ComplaintBox";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


export default function App() {
  return (
    <div className="page">
     
      <Router>
         <Header />
      <Routes>
        <Route path="/complaint" element={<ComplaintBox />} /> 
      </Routes>
    </Router>
    </div>
  );
}