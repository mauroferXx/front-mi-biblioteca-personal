import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} Biblioteca Digital. Todos los derechos reservados.
    </footer>
  );
};

export default Footer;

