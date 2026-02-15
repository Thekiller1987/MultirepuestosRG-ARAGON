// client/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div style={{ padding: '2rem' }}>Cargando...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};



export default ProtectedRoute;
