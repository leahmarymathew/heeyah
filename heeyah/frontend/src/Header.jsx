// Header.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">Heeyah</div>
      </div>

      <div className="header-center">
        <nav className="nav">
          <NavLink to="/attendance">Attendance</NavLink>
          <NavLink to="/complaint">Complaint</NavLink>
          <NavLink to="/rooms">Room Allocation</NavLink>
        </nav>
      </div>

      <div className="header-right">
        <div className="username">Swalih</div>
        <div className="avatar" />
      </div>
    </header>
  );
}
