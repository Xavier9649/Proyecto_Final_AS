// src/pages/Portfolio.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import projectService from '../services/projectService';
import ProjectCard from '../components/ui/ProjectCard';

const API_BASE_URL = 'https://proyecto-final-as.onrender.com:4000'; // Backend URL

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getProjects();
        setProjects(data);
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // 🔥 FIX: Convertir rutas relativas a absolutas antes de enviarlas a ProjectCard
  const fixedProjects = projects.map((p) => ({
    ...p,
    imagenes: p.imagenes?.map((img) => ({
      ...img,
      url: img.url.startsWith('/uploads')
        ? `${API_BASE_URL}${img.url}`
        : img.url
    }))
  }));

  // Animaciones para el contenedor y los elementos hijos
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="ml-4 text-indigo-600">Cargando proyectos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-10 border border-red-300 bg-red-50 rounded-lg">
        Error al cargar el portafolio: {error}
      </div>
    );
  }

  return (
    <div className="py-10">
      <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-4">
        Nuestro Portafolio
      </h1>
      <p className="text-xl text-center text-gray-500 mb-12">
        Explora los proyectos de remodelación que hemos completado.
      </p>

      {/* Contenedor animado */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {fixedProjects.length > 0 ? (
          fixedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              apiBaseUrl={API_BASE_URL}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-20">
            Aún no hay proyectos en el portafolio.
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Portfolio;
