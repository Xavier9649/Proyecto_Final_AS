// src/router/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();

  // 1. Si no está autenticado → enviar a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Validación de rol (usa roles EXACTOS del backend: ADMIN, ARCHITECT, CLIENT)
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // 3. Si todo está bien → permitir acceso
  return children;
};

export default PrivateRoute;
