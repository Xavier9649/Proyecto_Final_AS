import React from 'react';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
  const contactInfo = [
    {
      icon: <FaPhoneAlt className="text-4xl text-indigo-600 mb-4" />,
      title: "Llámanos",
      text: "+593 99 123 4567",
      subtext: "Lunes a Viernes, 9am - 6pm"
    },
    {
      icon: <FaEnvelope className="text-4xl text-indigo-600 mb-4" />,
      title: "Escríbenos",
      text: "contacto@remodelpro.com",
      subtext: "Respondemos en menos de 24h"
    },
    {
      icon: <FaMapMarkerAlt className="text-4xl text-indigo-600 mb-4" />,
      title: "Visítanos",
      text: "Av. República y Eloy Alfaro",
      subtext: "Quito, Ecuador"
    }
  ];

  return (
    <div className="py-16 bg-gray-50 min-h-screen flex flex-col items-center">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Encabezado */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-extrabold text-indigo-900 mb-4">Contáctanos</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            ¿Tienes un proyecto en mente? Estamos listos para escucharte y convertir tus ideas en realidad.
          </p>
        </motion.div>

        {/* Tarjetas de Información */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contactInfo.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-lg text-center flex flex-col items-center hover:shadow-xl transition-all"
            >
              {item.icon}
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-lg text-indigo-600 font-medium mb-1">{item.text}</p>
              <p className="text-sm text-gray-500">{item.subtext}</p>
            </motion.div>
          ))}
        </div>

        {/* Sección de Mapa y Horario */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Información Adicional */}
          <div className="md:w-1/3 bg-indigo-900 p-10 text-white flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <FaClock className="mr-3" /> Horario de Atención
            </h3>
            <ul className="space-y-4 text-indigo-100">
              <li className="flex justify-between">
                <span>Lunes - Viernes:</span>
                <span className="font-semibold">09:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sábado:</span>
                <span className="font-semibold">10:00 - 14:00</span>
              </li>
              <li className="flex justify-between">
                <span>Domingo:</span>
                <span className="font-semibold">Cerrado</span>
              </li>
            </ul>
            
            <button className="mt-10 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-bold flex items-center justify-center transition shadow-lg w-full">
              <FaWhatsapp className="text-2xl mr-2" /> Chat en WhatsApp
            </button>
          </div>

          {/* Mapa (Imagen Estática o Embed) */}
          <div className="md:w-2/3 bg-gray-200 min-h-[300px] relative">
             {/* Placeholder de Mapa - En producción usarías Google Maps Embed */}
             <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                <div className="text-center">
                    <FaMapMarkerAlt className="text-6xl text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-600 font-semibold">Mapa de Ubicación</p>
                    <p className="text-sm text-gray-500">(Av. República y Eloy Alfaro)</p>
                </div>
             </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Contact;