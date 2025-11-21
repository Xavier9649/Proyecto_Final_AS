import React from 'react';
import { motion } from 'framer-motion';
import { FaFileContract, FaHandshake, FaExclamationTriangle } from 'react-icons/fa';

const Terms = () => {
  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <FaFileContract className="text-6xl text-indigo-600 mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Términos y Condiciones</h1>
          <p className="text-xl text-gray-600">Reglas claras para una excelente relación.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 md:p-12 rounded-2xl shadow-xl text-gray-700 leading-relaxed"
        >
          <section className="mb-10">
            <div className="flex items-center mb-4">
              <FaHandshake className="text-2xl text-indigo-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">1. Aceptación del Servicio</h2>
            </div>
            <p className="mb-4">
              Al acceder y utilizar la plataforma RemodelPro, aceptas cumplir con estos términos. Estos términos aplican a todos los visitantes, usuarios y otras personas que accedan o utilicen el servicio.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Cotizaciones y Presupuestos</h2>
            <p className="mb-4">
              Las cotizaciones generadas a través de la plataforma son estimaciones iniciales basadas en la información proporcionada. El precio final puede variar tras una inspección física del sitio por parte de nuestros arquitectos.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <li>La validez de las cotizaciones es de 30 días.</li>
              <li>Se requiere un anticipo del 50% para iniciar cualquier obra.</li>
              <li>Los cambios en el alcance del proyecto ajustarán el presupuesto final.</li>
            </ul>
          </section>

          <section className="mb-10">
            <div className="flex items-center mb-4">
              <FaExclamationTriangle className="text-2xl text-yellow-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">3. Limitación de Responsabilidad</h2>
            </div>
            <p>
              RemodelPro actúa como intermediario y gestor de proyectos. No nos hacemos responsables por daños indirectos, incidentales o consecuentes que surjan del uso de nuestros servicios, salvo en casos de negligencia comprobada en la ejecución de la obra.
            </p>
          </section>

          <div className="text-center border-t pt-6 mt-6">
            <p className="text-sm text-gray-400">
              Versión 1.0 - Proyecto Académico de Demostración
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;