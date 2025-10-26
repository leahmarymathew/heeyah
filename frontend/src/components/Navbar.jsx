// import React, { useContext } from 'react';
// import { NavLink, Link } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';

// function Navbar() {
//   const { user, logout } = useContext(AuthContext);

//   // This function generates the correct Tailwind CSS classes for navigation links.
//   // It adds a blue underline to the currently active page link.
//   const navLinkClasses = ({ isActive }) =>
//     `text-gray-500 hover:text-primary-blue transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-full after:scale-x-0 after:bg-primary-blue after:transition-transform after:origin-left ${isActive ? 'font-medium text-primary-blue after:scale-x-100' : 'font-normal'
//     }`;

//   // Get navigation items based on user role
//   const getNavigationItems = () => {
//     if (!user?.role) return [];

//     switch (user.role) {
//       case 'student':
//         return [
//           { to: '/attendance', label: 'Attendance' },
//           { to: '/complaint', label: 'Complaint' },
//           { to: '/room-allocation', label: 'Room Allocation' },
//           { to: '/lost-and-found', label: 'Lost & Found' }
//         ];
//       case 'warden':
//         return [
//           { to: '/warden-dashboard', label: 'Dashboard' },
//           { to: '/complaint', label: 'Complaints' },
//           { to: '/room-allocation', label: 'Room Management' }
//         ];
//       case 'admin':
//         return [
//           { to: '/admin-dashboard', label: 'Dashboard' },
//           { to: '/complaint', label: 'Complaints' },
//           { to: '/room-allocation', label: 'Room Management' }
//         ];
//       default:
//         return [
//           { to: '/dashboard', label: 'Dashboard' }
//         ];
//     }
//   };

//   const navigationItems = getNavigationItems();

//   const handleLogout = async () => {
//     try {
//       await logout();
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   return (
//     <header className="bg-white sticky top-0 z-10">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-20 border-b border-gray-200">
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <Link to="/dashboard" className="text-2xl font-bold text-primary-blue">
//               Heeyah
//             </Link>
//           </div>

//           {/* Navigation Links */}
//           <nav className="hidden md:flex items-center space-x-10">
//             {navigationItems.map((item) => (
//               <NavLink key={item.to} to={item.to} className={navLinkClasses}>
//                 {item.label}
//               </NavLink>
//             ))}
//           </nav>

//           {/* User Profile Section */}
//           <div className="flex items-center space-x-4">
//             <span className="text-gray-800 font-medium">{user?.name || 'User'}</span>
//             <div className="relative group">
//               <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg cursor-pointer">
//                 {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
//               </div>
//               {/* Dropdown menu */}
//               <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
//                 <div className="py-1">
//                   <div className="px-4 py-2 text-sm text-gray-700 border-b">
//                     <div className="font-medium">{user?.name}</div>
//                     <div className="text-gray-500 capitalize">{user?.role}</div>
//                   </div>
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Navbar;

import React, { useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const navLinkClasses = ({ isActive }) =>
    `text-gray-500 hover:text-primary-blue transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-full after:scale-x-0 after:bg-primary-blue after:transition-transform after:origin-left ${isActive ? 'font-medium text-primary-blue after:scale-x-100' : 'font-normal'
    }`;

  const getNavigationItems = () => {
    if (!user?.role) return [];
    switch (user.role) {
      case 'student':
        return [
          { to: '/attendance', label: 'Attendance' },
          { to: '/complaint', label: 'Complaint' },
          { to: '/room-allocation', label: 'Room Allocation' },
          { to: '/lost-and-found', label: 'Lost & Found' }, // Text link
        ];
      case 'warden':
        return [
          { to: '/warden-dashboard', label: 'Student' },
          { to: '/warden-room-management', label: 'Room Allocation' }
        ];
      case 'admin':
        return [
          { to: '/admin-dashboard', label: 'Dashboard' },
          { to: '/complaint', label: 'Complaints' },
          { to: '/room-allocation', label: 'Room Management' }
        ];
      default:
        return [{ to: '/dashboard', label: 'Dashboard' }];
    }
  };

  const navigationItems = getNavigationItems();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to login page after successful logout
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 border-b border-gray-200">

          {/* Logo + Icon Button */}
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-2xl font-bold text-primary-blue">
              Heeyah
            </Link>

            {/* Icon Button for Student Lost & Found */}
            {user?.role === 'student' && (
              <button
                onClick={() => navigate('/student-lost-found')}
                className="text-gray-500 hover:text-primary-blue transition-colors p-2 rounded-full hover:bg-gray-100"
                title="Lost & Found Messages"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-10">
            {navigationItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClasses}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-800 font-medium">{user?.name || 'User'}</span>
            <div className="relative group">
              <div className="w-11 h-11 rounded-full bg-primary-blue flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:bg-blue-700 transition-colors">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999]">
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
  );
}

export default Navbar;
