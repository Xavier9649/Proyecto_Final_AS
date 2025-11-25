// src/pages/ProjectDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaChevronLeft } from 'react-icons/fa';
import projectService from '../services/projectService';

const API_BASE_URL = 'https://proyecto-final-as.onrender.com:4000'; 

const ProjectDetail = () => {
  // Captura el ID de la URL (ruta: /portfolio/:id)
  const { id } = useParams(); 
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        // LLAMADA A LA CAPA DE SERVICIO
        const data = await projectService.getProjectDetails(id);
        setProject(data);
        if (data.imagenes && data.imagenes.length > 0) {
            // Establece la primera imagen como la principal
            setMainImage(`${API_BASE_URL}/uploads/proyectos/${data.imagenes[0].nombreArchivo}`);
        }
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar el detalle del proyecto.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]); // El efecto se ejecuta cada vez que el ID cambia

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
        <div className="text-center py-20 bg-white rounded-xl shadow-lg">
            <h2 className="text-3xl text-red-600 font-bold mb-4">¡Oops! Error</h2>
            <p className="text-gray-600">{error || 'El proyecto solicitado no existe.'}</p>
            <Link to="/portfolio" className="mt-6 inline-flex items-center text-indigo-600 hover:text-indigo-800 transition">
                <FaChevronLeft className="mr-2" /> Volver al Portafolio
            </Link>
        </div>
    );
  }

  // Función para obtener la URL de las imágenes
  const getImageUrl = (filename) => `${API_BASE_URL}/uploads/proyectos/${filename}`;

  // Variante para la animación del título
  const titleVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { delay: 0.2 } }
  };

  return (
    <motion.div initial="hidden" animate="visible" className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl">
      
      {/* Botón de Regreso */}
      <Link to="/portfolio" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition">
          <FaChevronLeft className="mr-2" /> Volver al Portafolio
      </Link>

      {/* Título Principal */}
      <motion.h1 
        variants={titleVariants}
        className="text-5xl font-extrabold text-gray-800 mb-2 border-b pb-4"
      >
        {project.titulo}
      </motion.h1>
      
      {/* Metadatos */}
      <div className="flex flex-wrap items-center text-gray-500 text-lg mb-8 space-x-6">
        <span className="flex items-center">
          <FaMapMarkerAlt className="mr-2 text-indigo-500" />
          {project.ubicacion}
        </span>
        <span className="flex items-center">
          <FaCalendarAlt className="mr-2 text-indigo-500" />
          Terminado: {new Date(project.fechaTermino).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* Galería / Imagen Principal */}
      <motion.div 
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-10 rounded-xl overflow-hidden shadow-xl"
      >
        {mainImage && (
          <img 
            src={mainImage} 
            alt={`Imagen principal de ${project.titulo}`} 
            className="w-full object-cover h-[500px]" 
          />
        )}
      </motion.div>
      
      {/* Descripción Detallada */}
      <section className="prose max-w-none mb-10">
        <h2 className="text-3xl font-bold text-gray-700 mb-4 border-b pb-2">Detalles del Proyecto</h2>
        <p className="text-lg leading-relaxed text-gray-600 whitespace-pre-line">{project.descripcionLarga || project.descripcionCorta || 'Descripción no disponible.'}</p>
        
        {/* Aquí se podría renderizar el listado de Arquitectos/Cotizaciones si fuera relevante */}
      </section>

      {/* Carrete de Miniaturas (Mini Gallery) */}
      {project.imagenes && project.imagenes.length > 1 && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Galería de Imágenes</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {project.imagenes.map((img, index) => (
              <motion.img
                key={index}
                src={getImageUrl(img.nombreArchivo)}
                alt={`Imagen ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.05 }}
                onClick={() => setMainImage(getImageUrl(img.nombreArchivo))} // Cambia la imagen principal al hacer clic
              />
            ))}
          </div>
        </div>
      )}

    </motion.div>
  );
};

export default ProjectDetail;