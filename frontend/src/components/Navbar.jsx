import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user } = useContext(AuthContext);

  // This function generates the correct Tailwind CSS classes for navigation links.
  // It adds a blue underline to the currently active page link.
  const navLinkClasses = ({ isActive }) =>
    `text-gray-500 hover:text-primary-blue transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-full after:scale-x-0 after:bg-primary-blue after:transition-transform after:origin-left ${
      isActive ? 'font-medium text-primary-blue after:scale-x-100' : 'font-normal'
    }`;

  return (
    <header className="bg-white sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 border-b border-gray-200">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="text-2xl font-bold text-primary-blue">
              Heeyah
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-10">
            <NavLink to="/attendance" className={navLinkClasses}>Attendance</NavLink>
            <NavLink to="/complaint" className={navLinkClasses}>Complaint</NavLink>
            <NavLink to="/room-allocation" className={navLinkClasses}>Room Allocation</NavLink>
          </nav>

          {/* User Profile Section */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-800 font-medium">{user?.name || 'User'}</span>
            <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

