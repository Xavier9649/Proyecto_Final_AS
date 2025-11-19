import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600 flex items-center">
          RemodelPro
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link to="/portfolio" className="text-gray-600 hover:text-indigo-600 font-medium">Portafolio</Link>
          <Link to="/quote" className="text-gray-600 hover:text-indigo-600 font-medium">Cotizar</Link>
          
          {isAuthenticated && (
            <>
               {user?.role === 'cliente' && <Link to="/mis-cotizaciones" className="text-gray-600 hover:text-indigo-600 font-medium">Mis Solicitudes</Link>}
               {user?.role === 'architect' && <Link to="/architect-dashboard" className="text-gray-600 hover:text-indigo-600 font-medium">Panel Arquitecto</Link>}
               {user?.role === 'admin' && <Link to="/admin" className="text-gray-600 hover:text-indigo-600 font-medium">Panel Admin</Link>}
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 hidden sm:block">Hola, {user?.name || 'Usuario'}</span>
              <button 
                onClick={logout} 
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
              >
                Salir
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition font-medium">Login</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium">Registro</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;