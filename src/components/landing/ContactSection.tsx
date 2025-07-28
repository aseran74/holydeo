const ContactSection = () => {
  return (
    <section id="contact" className="py-20 px-4 md:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          ¿Tienes Preguntas? Contáctanos
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Estamos aquí para ayudarte a planificar tu próxima estancia fuera de temporada.
        </p>
        <form
          className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="mb-4">
            <input
              type="text"
              placeholder="Tu Nombre"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Tu Correo Electrónico"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <textarea
              placeholder="Tu Mensaje"
              rows={5}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Enviar Mensaje
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection; 