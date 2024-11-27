import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
  const id = localStorage.getItem('id');
  const role = localStorage.getItem('role');

  // Redirect to login if user is not authenticated
  if (!id || !role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoutes;
