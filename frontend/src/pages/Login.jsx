import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth(); // Usamos la función del contexto
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      // Si no hubo error, redirigimos
      const saved = JSON.parse(localStorage.getItem("userData"));

      if (saved.role === "ADMIN") navigate("/admin");
      else if (saved.role === "ARCHITECT") navigate("/architect-dashboard");
      else navigate("/portfolio");

 
    } catch (err) {
      console.error(err);
      setError('Credenciales incorrectas o error en el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex min-h-screen items-center justify-center bg-gray-100"
    >
      <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">RemodelPro</h2>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mt-1 focus:ring-2 ring-indigo-500 outline-none" required />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mt-1 focus:ring-2 ring-indigo-500 outline-none" required />
          </div>
          
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition disabled:opacity-50">
             {loading ? 'Cargando...' : 'Ingresar'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600 text-sm">
            ¿No tienes cuenta? <Link to="/register" className="text-indigo-600 hover:underline">Regístrate aquí</Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;