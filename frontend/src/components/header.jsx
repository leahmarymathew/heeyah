// Header.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import Logo from "../shared/logo";

// Accept navLinks array as a prop
export default function Header({ navLinks = [] }) {
  return (
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
        <div className="username">Swalih</div>
        <div className="avatar" />
      </div>
    </header>
  );
}