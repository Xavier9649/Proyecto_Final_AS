import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay sesión guardada al recargar la página
    const initAuth = () => {
        const token = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('userData');
        
        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Error al leer datos de usuario", e);
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
            }
        }
        setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
        const response = await authService.login(email, password);
        
        console.log("Respuesta del Login:", response); // Para depuración

        // LÓGICA DE EXTRACCIÓN SEGURA
        // Si el backend devuelve { token: '...', user: { name: '...' } }
        const token = response.token;
        // A veces el usuario viene en 'user', 'usuario', o 'data'
        const userData = response.user || response.usuario || response.data || response; 

        if (token) {
            localStorage.setItem('authToken', token);
            // Guardamos también los datos del usuario para no perderlos al refrescar
            localStorage.setItem('userData', JSON.stringify(userData));
            setUser(userData);
            return true; // Login exitoso
        } else {
            throw new Error("No se recibió token del servidor");
        }
    } catch (error) {
        console.error("Error en Login Context:", error);
        throw error;
    }
  };

  const register = async (nombre, email, password) => {
      // El registro suele devolver éxito, pero no siempre loguea automáticamente.
      return await authService.register(nombre, email, password);
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('userData'); // Limpiar datos de usuario
    setUser(null);
    navigate('/login'); 
  };

  const contextValue = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-indigo-600">Cargando aplicación...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};