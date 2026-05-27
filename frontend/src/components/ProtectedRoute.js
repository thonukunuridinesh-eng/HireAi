import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Checks for an active access token in the browser storage memory
  const isAuthenticated = !!localStorage.getItem('access_token');

  // If unauthenticated, bounce guest visitors back to the login lock screen automatically
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
