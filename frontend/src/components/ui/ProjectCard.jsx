// src/components/ui/ProjectCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

// Animación para la tarjeta
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const ProjectCard = ({ project }) => {

  console.log("IMAGEN ORIGINAL:", project?.imagenes?.[0]?.url || "NO HAY IMAGEN");

  const mainImage =
    project.imagenes?.length > 0
      ? project.imagenes[0].url
      : "https://via.placeholder.com/600x400?text=RemodelPro";

  console.log("IMAGEN CARGADA:", mainImage);

  // Fecha formateada
  const formattedDate = project.fechaFinEstimada
    ? new Date(project.fechaFinEstimada).toLocaleDateString()
    : "Fecha Desconocida";

  return (
    <Link to={`/portfolio/${project.id}`} className="block">
      <motion.div
        variants={itemVariants}
        whileHover={{
          scale: 1.03,
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
        className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col relative"
      >
        {/* Imagen */}
        <div className="relative h-64 bg-gray-100">
          <img
            src={`${mainImage}?v=${Date.now()}`}
            alt={`Proyecto ${project.nombre}`}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            onError={(e) => {
              console.log("ERROR EN <img>", e);
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/600x400?text=No+Disponible";
            }}
          />
          {/* Categoría / Estado */}
          <span className="absolute top-4 right-4 bg-indigo-600 text-white text-xs font-bold py-1 px-3 rounded-full shadow-md z-20">
            {project.estado || "SIN ESTADO"}
          </span>
        </div>

        {/* Contenido */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate">
            {project.nombre}
          </h3>

          {/* Metadatos */}
          <div className="flex items-center text-gray-500 text-sm mb-4 space-x-4">
            <span className="flex items-center">
              <FaMapMarkerAlt className="mr-1 text-indigo-500" />
              {project.ubicacion || "Sin Ubicación"}
            </span>
            <span className="flex items-center">
              <FaCalendarAlt className="mr-1 text-indigo-500" />
              {formattedDate}
            </span>
          </div>

          {/* Descripción */}
          <p className="text-gray-600 line-clamp-3 mb-4 flex-grow">
            {project.descripcion || "Sin descripción."}
          </p>

          <span className="mt-auto text-indigo-600 font-semibold flex items-center hover:text-indigo-800 transition">
            Ver Detalles
            <motion.span whileHover={{ x: 5 }} className="ml-1">
              →
            </motion.span>
          </span>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProjectCard;


