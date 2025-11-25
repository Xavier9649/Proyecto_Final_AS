// src/pages/ProjectDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaChevronLeft } from 'react-icons/fa';
import projectService from '../services/projectService';

const API_BASE_URL = 'https://proyecto-final-as.onrender.com:4000';

const ProjectDetail = () => {
  const { id } = useParams(); 
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);

        const data = await projectService.getProjectDetails(id);
        setProject(data);

        // Imagen principal corregida (backend usa "url")
        if (data.imagenes && data.imagenes.length > 0) {
          const imgUrl = data.imagenes[0].url;

          // Si ya viene con "/", construir la ruta completa
          setMainImage(`${API_BASE_URL}${imgUrl}`);
        }

      } catch (err) {
        console.error(err);
        setError('No se pudo cargar el detalle del proyecto.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

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

  const getImageUrl = (url) => `${API_BASE_URL}${url}`;

  return (
    <motion.div initial="hidden" animate="visible" className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl">

      <Link to="/portfolio" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition">
        <FaChevronLeft className="mr-2" /> Volver al Portafolio
      </Link>

      {/* Título corregido (backend usa "nombre") */}
      <motion.h1 
        className="text-5xl font-extrabold text-gray-800 mb-2 border-b pb-4"
      >
        {project.nombre}
      </motion.h1>

      <div className="flex flex-wrap items-center text-gray-500 text-lg mb-8 space-x-6">
        <span className="flex items-center">
          <FaMapMarkerAlt className="mr-2 text-indigo-500" />
          {project.ubicacion}
        </span>

        {/* Fecha corregida: usar fechaFinEstimada */}
        <span className="flex items-center">
          <FaCalendarAlt className="mr-2 text-indigo-500" />
          Fecha estimada de fin: {new Date(project.fechaFinEstimada).toLocaleDateString('es-ES')}
        </span>
      </div>

      {/* Botón de Solicitud de Cotización */}
      <Link 
        to={`/cotizar/${project.id}`}
        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md font-semibold transition mb-10"
      >
        Solicitar Cotización
      </Link>


      {/* Imagen principal */}
      <motion.div 
        className="mb-10 rounded-xl overflow-hidden shadow-xl"
      >
        {mainImage && (
          <img 
            src={mainImage}
            alt={`Imagen de ${project.nombre}`} 
            className="w-full object-cover h-[500px]" 
          />
        )}
      </motion.div>

      {/* Descripción */}
      <section className="prose max-w-none mb-10">
        <h2 className="text-3xl font-bold text-gray-700 mb-4 border-b pb-2">Descripción del Proyecto</h2>
        <p className="text-lg leading-relaxed text-gray-600 whitespace-pre-line">
          {project.descripcion}
        </p>
      </section>

      {/* Miniaturas */}
      {project.imagenes && project.imagenes.length > 1 && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Galería de Imágenes</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {project.imagenes.map((img, index) => (
              <motion.img
                key={index}
                src={getImageUrl(img.url)}
                className="w-full h-32 object-cover rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.05 }}
                onClick={() => setMainImage(getImageUrl(img.url))}
              />
            ))}
          </div>
        </div>
      )}

    </motion.div>
  );
};

export default ProjectDetail;

