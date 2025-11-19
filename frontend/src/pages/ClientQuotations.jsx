// src/pages/ClientQuotations.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaInbox, FaSpinner, FaDollarSign, FaCalendarCheck } from 'react-icons/fa';
import quotationService from '../services/quotationService';
import { useAuth } from '../context/AuthContext';

const ClientQuotations = () => {
  const { user } = useAuth();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        setLoading(true);
        // LLAMADA A LA CAPA DE SERVICIO. El Backend filtra por el ID del usuario
        // contenido en el token, asegurando que el cliente solo vea las suyas.
        const data = await quotationService.getQuotations();
        setQuotations(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar tus cotizaciones. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, []);

  // Función Helper para mapear el estado a estilos
  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-500';
      case 'ASIGNADA':
        return 'bg-blue-100 text-blue-800 border-blue-500';
      case 'EN_PROCESO':
        return 'bg-indigo-100 text-indigo-800 border-indigo-500';
      case 'FINALIZADA':
        return 'bg-green-100 text-green-800 border-green-500';
      case 'CANCELADA':
        return 'bg-red-100 text-red-800 border-red-500';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-500';
    }
  };
  
  // Animaciones de entrada para la lista
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <FaSpinner className="animate-spin text-indigo-600 text-4xl mr-3" />
        <p className="text-xl text-indigo-600">Cargando tus solicitudes...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center py-10 border border-red-300 bg-red-50 rounded-lg">Error: {error}</div>;
  }

  return (
    <div className="py-10">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-4xl font-extrabold text-center text-gray-800 mb-2 flex items-center justify-center"
      >
        <FaInbox className="mr-3 text-indigo-600" />
        Mis Cotizaciones
      </motion.h1>
      <p className="text-center text-gray-500 mb-12">Historial de solicitudes realizadas por ti, {user?.name || 'Cliente'}.</p>

      {quotations.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-700">No has enviado ninguna solicitud aún.</h3>
          <p className="text-gray-500 mt-2">¡Comienza tu proyecto solicitando una cotización!</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/quote')} 
            className="mt-6 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Solicitar Cotización
          </motion.button>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {quotations.map((q) => (
            <motion.div 
              key={q.id} 
              variants={itemVariants}
              className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-400 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-bold text-gray-900 truncate mr-4">
                  Solicitud #{q.id} - {q.descripcion.substring(0, 50)}...
                </h2>
                <span 
                  className={`py-1 px-3 text-sm font-semibold rounded-full border ${getStatusStyle(q.estado)}`}
                >
                  {q.estado}
                </span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">{q.descripcion}</p>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 border-t pt-3">
                <span className="flex items-center">
                  <FaDollarSign className="mr-2 text-green-500" />
                  Presupuesto Estimado: ${q.presupuestoEstimado?.toLocaleString() || 'N/A'}
                </span>
                <span className="flex items-center">
                  <FaCalendarCheck className="mr-2 text-red-500" />
                  Fecha Deseada: {new Date(q.fechaDeseada).toLocaleDateString()}
                </span>
                {q.arquitectoAsignado && (
                    <span className="font-medium text-blue-600">
                        Arquitecto Asignado: {q.arquitectoAsignado.nombre || 'Desconocido'}
                    </span>
                )}
                <span className="ml-auto text-xs text-gray-400">
                    Enviada el: {new Date(q.createdAt).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ClientQuotations;