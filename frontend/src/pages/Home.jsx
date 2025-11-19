// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Home = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
      <h2 className="text-5xl font-extrabold text-indigo-800 mb-4">Bienvenidos a RemodelPro</h2>
      <p className="text-xl text-gray-600 mb-8">La plataforma para gestionar proyectos de remodelación.</p>

      {!isAuthenticated ? (
        <div className="space-x-4">
          <Link to="/login" className="bg-indigo-600 text-white py-3 px-6 rounded-lg text-lg hover:bg-indigo-700 transition duration-300">
            Iniciar Sesión
          </Link>
          <Link to="/register" className="bg-white text-indigo-600 border border-indigo-600 py-3 px-6 rounded-lg text-lg hover:bg-indigo-50 transition duration-300">
            Registrarse
          </Link>
        </div>
      ) : (
        <div className="p-6 bg-white shadow-xl rounded-lg max-w-md mx-auto">
            <p className="text-2xl font-semibold text-gray-800 mb-4">Hola, {user.name} ({user.role})</p>
            <Link to="/admin" className="text-indigo-600 hover:underline">Ir a Dashboard Admin</Link>
            <button 
                onClick={logout} 
                className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            >
                Cerrar Sesión
            </button>
        </div>
      )}
    </motion.div>
  );
};

export default Home;