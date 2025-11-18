// src/router/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    // Si no está autenticado, lo enviamos al login
    return <Navigate to="/login" replace />; 
  }

  // Lógica de roles, crucial para /admin/* o /architect/*
  if (requiredRole && user.role !== requiredRole) {
    // Si el rol no coincide, lo enviamos a una página de error o al home
    return <Navigate to="/" replace />; 
  }

  // Si está autenticado y tiene el rol correcto, muestra el contenido
  return children;
};

export default PrivateRoute;