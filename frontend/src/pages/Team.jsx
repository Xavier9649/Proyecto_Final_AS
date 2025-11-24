import React from 'react';
import { motion } from 'framer-motion';

// Datos del equipo con rutas de imágenes
const teamMembers = [
  {
    id: 1,
    name: 'Bob',
    role: 'Jefe de Obra (El Constructor)',
    description: 'Con más de 20 años construyendo sueños. Si se puede construir, Bob lo hará.',
    // La ruta es relativa a la carpeta 'public'
    image: '/team/bob.jpg', 
    color: 'border-yellow-400 bg-yellow-50'
  },
  {
    id: 2,
    name: 'Manny',
    role: 'Mano Derecha (Experto en Herramientas)',
    description: 'Especialista en reparaciones imposibles. Ningún tornillo se le resiste.',
    image: '/team/manny.jpg',
    color: 'border-gray-400 bg-gray-50'
  },
  {
    id: 3,
    name: 'Mapa',
    role: 'Jefe de Logística y Planificación',
    description: 'El cerebro de la operación. Conoce cada ruta, atajo y plano de la ciudad.',
    image: '/team/mapa.jpg',
    color: 'border-purple-400 bg-purple-50'
  },
  {
    id: 4,
    name: 'Botas',
    role: 'Supervisor de Campo (y Mascota)',
    description: 'Encargado de la moral del equipo y de probar la resistencia de los pisos.',
    image: '/team/botas.jpg',
    color: 'border-red-400 bg-red-50'
  }
];

const Team = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-indigo-900 mb-4">Conoce a Nuestros Expertos</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Un equipo multidisciplinario listo para transformar tu espacio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className={`rounded-2xl overflow-hidden shadow-lg border-t-8 ${member.color} bg-white text-center transform transition-all`}
            >
              {/* Contenedor de la Imagen (Círculo o Cuadrado) */}
              <div className="relative h-48 w-48 mx-auto mt-8 mb-4 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                  // Fallback si la imagen no existe (muestra un placeholder)
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Foto+Pendiente'; }}
                />
              </div>

              <div className="p-6 pt-0">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-indigo-600 font-semibold mb-4 uppercase text-xs tracking-wider">{member.role}</p>
                <p className="text-gray-600 text-sm italic leading-relaxed">"{member.description}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;