const ExperiencesSection = () => {
  return (
    <section id="experiences" className="py-20 px-4 md:px-8 bg-gray-50">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
        Experiencias Únicas Fuera de Temporada
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Experience Card 1 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
          <img
            src="https://placehold.co/600x400/ADE8F4/0077B6?text=Clase+de+Cocina"
            alt="Clase de Cocina Local"
            className="w-full h-48 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://placehold.co/600x400/DDDDDD/333333?text=Imagen+No+Disponible";
            }}
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Clases de Cocina Tradicional
            </h3>
            <p className="text-gray-700 text-sm mb-4">
              Sumérgete en la cultura local aprendiendo a cocinar platos auténticos con chefs
              nativos.
            </p>
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
              Ver Detalles
            </button>
          </div>
        </div>

        {/* Experience Card 2 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
          <img
            src="https://placehold.co/600x400/AED6F1/1F618D?text=Rutas+de+Senderismo"
            alt="Rutas de Senderismo Guiadas"
            className="w-full h-48 object-cover"
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "https://placehold.co/600x400/DDDDDD/333333?text=Imagen+No+Disponible";
            }}
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Rutas de Senderismo Guiadas
            </h3>
            <p className="text-gray-700 text-sm mb-4">
              Explora paisajes impresionantes sin las multitudes, perfectos para el senderismo
              tranquilo.
            </p>
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
              Ver Detalles
            </button>
          </div>
        </div>

        {/* Experience Card 3 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
          <img
            src="https://placehold.co/600x400/D4E6F1/2874A6?text=Talleres+de+Arte"
            alt="Talleres de Arte Local"
            className="w-full h-48 object-cover"
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "https://placehold.co/600x400/DDDDDD/333333?text=Imagen+No+Disponible";
            }}
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Talleres de Arte y Artesanía
            </h3>
            <p className="text-gray-700 text-sm mb-4">
              Desarrolla tu creatividad en talleres impartidos por artistas locales.
            </p>
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
              Ver Detalles
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperiencesSection; 