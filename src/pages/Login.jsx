// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import authService from '../services/authService'; // Importamos el servicio

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // LLAMADA A LA CAPA DE SERVICIO
      await authService.login(email, password);
      
      // Si el login es exitoso, navegar a la página principal (Home)
      navigate('/'); 
    } catch (err) {
      setError(err); // Muestra el mensaje de error de la API
    } finally {
      setLoading(false);
    }
  };

  return (
    // Animación de entrada de la tarjeta (Motion.div)
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen items-center justify-center bg-gray-100"
    >
      <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-2xl transition-all duration-300 hover:shadow-3xl">
        <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-2">RemodelPro</h2>
        <p className="text-center text-gray-500 mb-8">Inicia sesión en tu cuenta</p>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
              required
            />
          </div>
          
          <motion.button 
            type="submit"
            whileHover={{ scale: 1.05 }} // Animación al pasar el ratón
            whileTap={{ scale: 0.95 }}   // Animación al hacer clic
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default Login;
