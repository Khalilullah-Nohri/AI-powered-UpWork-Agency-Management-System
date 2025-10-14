import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getRole } from '../utils/auth';

const ProtectedRoute = ({ element, role }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }

  if (role && getRole() !== role) {
    return <Navigate to={`/${getRole().toLowerCase()}`} replace />;
  }

  return element;
};

export default ProtectedRoute;
