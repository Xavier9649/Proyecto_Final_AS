// src/pages/ArchitectDashboard.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaHardHat, FaCheckCircle, FaExclamationCircle, FaSpinner, FaDollarSign } from 'react-icons/fa';
import quotationService from '../services/quotationService';
import auditoriaService from '../services/auditoriaService';
import notificationUtils from '../utils/notificationUtils';
import { useAuth } from '../context/AuthContext';

// Estados permitidos para el Arquitecto (excluyendo PENDIENTE)
const ARCHITECT_STATUSES = ['ASIGNADA', 'EN_PROCESO', 'FINALIZADA', 'CANCELADA'];

const ArchitectDashboard = () => {
  const { user } = useAuth();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); 

  const fetchQuotations = async () => {
    try {
      setError(null);
      // El Backend devuelve solo las cotizaciones ASIGNADAS a este arquitecto (filtrado por token)
      const data = await quotationService.getQuotations();
      setQuotations(data); 
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  // Función CRÍTICA: Cambiar Estado
  const handleStatusChange = async (quotationId, nuevoEstado) => {
    setLoading(true);
    setMessage(null);

    try {
      // 1. LLAMADA A LA CAPA DE SERVICIO
      const updatedQuotation = await quotationService.updateQuotationStatus(quotationId, nuevoEstado);
      
      // Actualizar el estado local para reflejar el cambio en la UI
      setQuotations(prev => 
        prev.map(q => q.id === quotationId ? { ...q, estado: nuevoEstado } : q)
      );
      
      // 2. REGISTRO CRÍTICO EN LA AUDITORÍA
      await auditoriaService.logActivity(
        user.id, 
        'ACTUALIZAR_ESTADO_COTIZACION', 
        'Cotizacion', 
        quotationId, 
        { estadoAnterior: updatedQuotation.estado, nuevoEstado: nuevoEstado }
      );

      // 3. INTEGRACIÓN DE EMAIL (TRIGGER 2: Notificación al CLIENTE si es FINALIZADA)
      if (nuevoEstado === 'FINALIZADA') {
        // Notificamos al cliente que el arquitecto finalizó la cotización
        await notificationUtils.triggerQuotationConfirmationEmail({
            // Asegúrate de que los datos del cliente se adjunten en la respuesta del Backend
            email: updatedQuotation.cliente?.email || 'N/A', 
            nombre: updatedQuotation.cliente?.nombre || 'Cliente',
            cotizacionId: quotationId,
            action: 'FINALIZADA'
        });
      }

      setMessage({ type: 'success', text: `Estado de la cotización #${quotationId} actualizado a ${nuevoEstado}.` });

    } catch (err) {
      setMessage({ type: 'error', text: err.toString() });
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusColor = (status) => {
    if (status === 'FINALIZADA') return 'text-green-600 bg-green-100';
    if (status === 'EN_PROCESO') return 'text-indigo-600 bg-indigo-100';
    if (status === 'CANCELADA') return 'text-red-600 bg-red-100';
    return 'text-blue-600 bg-blue-100';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-10"
    >
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-2 flex items-center justify-center">
        <FaHardHat className="mr-3 text-indigo-600" />
        Panel de Arquitecto
      </h1>
      <p className="text-center text-gray-500 mb-10">Gestión de cotizaciones asignadas para {user?.name}.</p>

      {message && (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
          {message.text}
        </motion.div>
      )}

      {error && (
        <div className="text-red-600 text-center py-10 border border-red-300 bg-red-50 rounded-lg">Error: {error}</div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-40">
          <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-6">
          {quotations.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-xl shadow-lg">
              <FaExclamationCircle className="text-yellow-500 text-5xl mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700">No tienes cotizaciones asignadas actualmente.</h3>
            </div>
          ) : (
            quotations.map((q) => (
              <motion.div 
                key={q.id} 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-400"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Cotización #{q.id}</h2>
                    <p className="text-sm text-gray-500">Cliente: {q.cliente?.nombre || 'Desconocido'}</p>
                  </div>
                  <span className={`py-1 px-3 text-sm font-semibold rounded-full ${getStatusColor(q.estado)}`}>
                    {q.estado}
                  </span>
                </div>

                <p className="text-gray-700 mb-4 italic line-clamp-2">
                    "{q.descripcion}"
                </p>

                <div className="flex items-center justify-between border-t pt-4">
                    <span className="text-lg font-semibold text-green-700 flex items-center">
                        <FaDollarSign className="mr-1" /> ${q.presupuestoEstimado?.toLocaleString() || 'N/A'}
                    </span>

                    {/* Selector de Estado */}
                    <div className="flex items-center space-x-2">
                        <label className="text-gray-600 font-medium">Actualizar Estado:</label>
                        <select
                            value={q.estado}
                            onChange={(e) => handleStatusChange(q.id, e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                            disabled={loading}
                        >
                            {ARCHITECT_STATUSES.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ArchitectDashboard;