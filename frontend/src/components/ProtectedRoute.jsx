// This is the corrected ProtectedRoute component.
// It now correctly renders its children (like the AppLayout) when the user is authenticated.

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  // While checking for authentication, show a loading message
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  // If the user is authenticated, render the child components (e.g., AppLayout).
  // If not, redirect them to the login page.
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
