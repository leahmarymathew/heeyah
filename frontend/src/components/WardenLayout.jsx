import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function WardenLayout({ children }) {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Navigation link styling
  const navLinkClasses = ({ isActive }) =>
    `text-gray-500 hover:text-primary-blue transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-full after:scale-x-0 after:bg-primary-blue after:transition-transform after:origin-left ${isActive ? 'font-medium text-primary-blue after:scale-x-100' : 'font-normal'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple header for warden */}
      <header className="bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 border-b border-gray-200">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/warden-dashboard" className="text-2xl font-bold text-primary-blue">
                Heeyah - Warden Portal
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-10">
              <NavLink to="/warden-dashboard" className={navLinkClasses}>
                Student
              </NavLink>
              <NavLink to="/warden-room-management" className={navLinkClasses}>
                Room Allocation
              </NavLink>
            </nav>

            {/* User Profile Section */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-800 font-medium">{user?.name || 'Warden'}</span>
              <div className="relative group">
                <div className="w-11 h-11 rounded-full bg-primary-blue flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:bg-blue-700 transition-colors">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'W'}
                </div>
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="font-semibold text-gray-900">{user?.name}</div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                      <div className="text-xs text-primary-blue capitalize font-medium mt-1">{user?.role}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content without the standard layout padding */}
      <main>
        {children}
      </main>
    </div>
  );
}

export default WardenLayout;