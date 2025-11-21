import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaUserSecret, FaLock } from 'react-icons/fa';

const Privacy = () => {
  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <FaShieldAlt className="text-6xl text-indigo-600 mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Política de Privacidad</h1>
          <p className="text-xl text-gray-600">Tu confianza es lo más importante para RemodelPro.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 md:p-12 rounded-2xl shadow-xl prose prose-indigo max-w-none"
        >
          <div className="flex items-center mb-6">
            <FaUserSecret className="text-2xl text-indigo-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800 m-0">1. Recopilación de Información</h2>
          </div>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Recopilamos información personal que nos proporcionas voluntariamente al registrarte, solicitar una cotización o contactarnos. Esto incluye tu nombre, dirección de correo electrónico, número de teléfono y detalles sobre tu proyecto de remodelación.
          </p>

          <div className="flex items-center mb-6">
            <FaLock className="text-2xl text-indigo-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800 m-0">2. Uso de la Información</h2>
          </div>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Utilizamos tus datos exclusivamente para:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2 pl-4">
            <li>Procesar y gestionar tus solicitudes de cotización.</li>
            <li>Comunicarnos contigo sobre el estado de tu proyecto.</li>
            <li>Mejorar nuestros servicios y la experiencia en la plataforma.</li>
            <li>Enviar notificaciones importantes relacionadas con tu cuenta.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Protección de Datos</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos contra el acceso no autorizado, la alteración o la divulgación. No vendemos ni compartimos tu información con terceros con fines comerciales.
          </p>

          <div className="border-t pt-8 mt-8 text-center">
            <p className="text-sm text-gray-400 italic">
              Última actualización: Noviembre 2025. Si tienes dudas, contáctanos.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;