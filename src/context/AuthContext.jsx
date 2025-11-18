// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import api from '../services/api'; 
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Inicializamos el usuario como null
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Aquí se podría validar el token con una petición al backend, 
    // pero por ahora solo verificaremos si existe para mantener el estado
    const token = localStorage.getItem('authToken');
    if (token) {
        // Podríamos cargar datos del usuario si se guardaron en localStorage
        // o si el token contiene la info (rol, nombre).
        // Por simplicidad, asumimos que estamos autenticados si hay token.
        // **MEJORA PROFESIONAL:** Hacer una llamada GET /api/user/me para verificar el token.
        setUser({ name: 'Usuario Temporal', role: 'admin' }); // Asignar datos reales
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Llama al servicio, guarda el token y actualiza el estado
    const userData = await authService.login(email, password);
    // Asignar el usuario que vino de la respuesta del backend
    setUser(userData); 
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    // Redirigir al login después de cerrar sesión
    navigate('/login'); 
  };

  const contextValue = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  // Si está cargando, podemos mostrar un spinner global
  if (loading) {
    return <div className="flex justify-center items-center h-screen text-indigo-600">Cargando aplicación...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};