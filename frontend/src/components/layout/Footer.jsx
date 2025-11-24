import React from 'react';
import { Link } from 'react-router-dom'; // ✅ Importante para la navegación SPA

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10 mt-auto">
      <div className="container mx-auto px-4 text-center">
        
        <h3 className="text-xl font-bold text-indigo-400 mb-4">RemodelPro</h3>
        <p className="mb-6 text-gray-300 max-w-md mx-auto">
          Transformando espacios, construyendo sueños. Tu aliado experto en remodelación y diseño arquitectónico.
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mb-8">
          {/* ✅ Enlaces corregidos: Usan 'to' en lugar de 'href' para evitar recargas */}
          <Link to="/privacy" className="hover:text-white transition duration-300 border-b border-transparent hover:border-white pb-1">
            Política de Privacidad
          </Link>
          <Link to="/terms" className="hover:text-white transition duration-300 border-b border-transparent hover:border-white pb-1">
            Términos de Servicio
          </Link>
          <Link to="/contact" className="hover:text-white transition duration-300 border-b border-transparent hover:border-white pb-1">
            Contacto
          </Link>
          <Link to="/equipo" className="hover:text-white transition duration-300 border-b border-transparent hover:border-white pb-1">
            Nuestro Equipo
          </Link>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} RemodelPro. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;