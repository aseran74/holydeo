const LandingFooter = () => {
  return (
    <footer className="bg-gray-800 text-white py-10 px-4 md:px-8 text-center">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} FueraDeTemporada.com. Todos los derechos reservados.
      </p>
      <div className="flex justify-center space-x-6 mt-4">
        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
          Política de Privacidad
        </a>
        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
          Términos de Servicio
        </a>
      </div>
    </footer>
  );
};

export default LandingFooter; 