import React from "react";
import './Navbar.css';
import logo from '../assets/heeyah.png';

function Navbar() {
    return (
        <nav className="nav">
            <div className="nav-logo">
                <img src={logo} alt="Logo" className="logo-image" />
            </div>
            <ul className="nav-links">
                <li><a href="/" className="current">Attendance</a></li>
                <li><a href="/complaint">Complaint</a></li>
                <li><a href="/room-allocation">Room Allocation</a></li>
            </ul>  
            <div className="nav-user">
                <span className="user-name">John Doe</span>
            </div>  
        </nav>
    );
}
export default Navbar;