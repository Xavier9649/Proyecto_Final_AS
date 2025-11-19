// src/pages/QuoteRequest.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaDollarSign, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import quotationService from '../services/quotationService';
import auditoriaService from '../services/auditoriaService';
import notificationUtils from '../utils/notificationUtils'; // Importación para el trigger de email
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Componente principal para la solicitud de cotización
const QuoteRequest = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    proyectoId: '', 
    clienteId: user?.id || '', 
    descripcion: '',
    presupuestoEstimado: '', 
    fechaDeseada: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // Para mostrar éxito o error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated || !user?.id) {
        setMessage({ type: 'error', text: 'Debes iniciar sesión para solicitar una cotización.' });
        // Opcional: Redirigir al login
        // setTimeout(() => navigate('/login'), 2000); 
        return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // 1. LLAMADA A LA CAPA DE SERVICIO DE COTIZACIONES
      const quotationResponse = await quotationService.requestQuotation({
        ...formData,
        clienteId: user.id, 
        presupuestoEstimado: formData.presupuestoEstimado ? parseFloat(formData.presupuestoEstimado) : null 
      });

      const nuevaCotizacionId = quotationResponse.id || 'N/A';

      // 2. REGISTRO CRÍTICO EN LA AUDITORÍA
      await auditoriaService.logActivity(
        user.id, 
        'CREAR_COTIZACION', 
        'Cotizacion', 
        nuevaCotizacionId, 
        { 
            presupuesto: formData.presupuestoEstimado,
            fechaDeseada: formData.fechaDeseada,
            proyectoId: formData.proyectoId 
        }
      );
      
      // 3. INTEGRACIÓN DE EMAIL (Trigger del Backend)
      // Confirma al usuario que el proceso de email ha iniciado en el Backend
      await notificationUtils.triggerQuotationConfirmationEmail({
          email: user.email,
          nombre: user.name || 'Cliente', 
          cotizacionId: nuevaCotizacionId
      });

      setMessage({ type: 'success', text: '¡Solicitud enviada con éxito! Revisa tu email de confirmación.' });
      
      // Limpiar formulario después del éxito
      setFormData({
        ...formData,
        descripcion: '',
        presupuestoEstimado: '',
        fechaDeseada: '',
      });
      
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'Error desconocido al procesar la solicitud.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto py-10"
    >
      <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-2">Solicitar Cotización</h1>
      <p className="text-center text-gray-500 mb-8">Cuéntanos sobre tu proyecto y te asignaremos un arquitecto.</p>

      {/* Mensajes de feedback */}
      {message && (
        <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700 border-l-4 border-green-500' : 'bg-red-100 text-red-700 border-l-4 border-red-500'}`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-2xl">
        
        <div className="mb-6">
            <label htmlFor="descripcion" className="block text-gray-700 font-medium mb-2 flex items-center">
                <FaInfoCircle className="mr-2 text-indigo-500" />
                Descripción del Proyecto
            </label>
            <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                placeholder="Detalla qué tipo de remodelación deseas..."
                required
            />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Presupuesto Estimado */}
            <div>
                <label htmlFor="presupuestoEstimado" className="block text-gray-700 font-medium mb-2 flex items-center">
                    <FaDollarSign className="mr-2 text-green-500" />
                    Presupuesto Estimado (USD)
                </label>
                <input
                    type="number"
                    id="presupuestoEstimado"
                    name="presupuestoEstimado"
                    value={formData.presupuestoEstimado}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                    placeholder="Ej: 15000"
                    required
                />
            </div>
            
            {/* Fecha Deseada */}
            <div>
                <label htmlFor="fechaDeseada" className="block text-gray-700 font-medium mb-2 flex items-center">
                    <FaCalendarAlt className="mr-2 text-red-500" />
                    Fecha Deseada de Inicio
                </label>
                <input
                    type="date"
                    id="fechaDeseada"
                    name="fechaDeseada"
                    value={formData.fechaDeseada}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                    required
                />
            </div>
        </div>

        <motion.button 
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
            disabled={loading}
        >
            <FaPaperPlane className="mr-2" />
            {loading ? 'Enviando Solicitud...' : 'Solicitar Cotización Ahora'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default QuoteRequest;