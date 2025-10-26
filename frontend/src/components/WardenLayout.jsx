import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
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

            {/* User Profile Section */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-800 font-medium">{user?.name || 'Warden'}</span>
              <div className="relative group">
                <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg cursor-pointer">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'W'}
                </div>
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-gray-500 capitalize">{user?.role}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
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