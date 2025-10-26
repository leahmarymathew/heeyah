// src/components/header.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import Emergency from "../assets/emergencyIcon.png"
import Logo from "../shared/logo";
import EmergencyOverlay from './EmergencyOverlay'; // Import the new component

// Accept navLinks array as a prop
export default function Header({ navLinks = [] }) {
  // NEW STATE: To manage the visibility of the emergency overlay
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header-left">
          <Logo />
        </div>

        <div className="header-center">
          <nav className="nav">
            {/* Map over the passed links to render NavLinks */}
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path}>
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="header-right">
          {/* UPDATED: Add onClick handler to open the overlay */}
          <div className="emergency" onClick={() => setIsOverlayOpen(true)}>
            <img src={Emergency}/>
          </div>
          <div className="username">Swalih</div>
          <div className="avatar" />
        </div>
      </header>
      
      {/* NEW: Render the Emergency Overlay */}
      <EmergencyOverlay 
        isOpen={isOverlayOpen} 
        onClose={() => setIsOverlayOpen(false)} 
      />
    </>
  );
}