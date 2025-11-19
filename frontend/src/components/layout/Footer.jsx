import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-4">© {new Date().getFullYear()} RemodelPro. Todos los derechos reservados.</p>
        <div className="flex justify-center space-x-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white">Política de Privacidad</a>
          <a href="#" className="hover:text-white">Términos de Servicio</a>
          <a href="#" className="hover:text-white">Contacto</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;