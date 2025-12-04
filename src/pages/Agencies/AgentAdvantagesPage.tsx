import { Link } from 'react-router-dom';
import LandingNavbar from '../../components/landing/LandingNavbar';
import LandingFooter from '../../components/landing/LandingFooter';
import { 
  DollarSign, 
  FileText, 
  TrendingUp, 
  Shield, 
  CheckCircle, 
  Clock, 
  Users, 
  Building2, 
  Zap,
  Globe,
  Search,
  FileCheck,
  CreditCard,
  BarChart3,
  Sparkles
} from 'lucide-react';

const AgentAdvantagesPage = () => {

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                Holydeo · Alquiler de media estancia en propiedades vacacionales
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tu casa vacacional ocupada de septiembre a junio. Sin esfuerzo. Sin morosidad.
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Alquilar una casa en la playa fuera de verano es complicado. Septiembre–junio suele ser temporada "muerta": 
              pocas solicitudes, demasiadas dudas de los propietarios y mucho tiempo perdido en mensajes, visitas y negociaciones.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <p className="text-lg text-blue-100">
                <strong className="text-white">Holydeo cambia este panorama.</strong>
                <br />
                Gestionamos media estancia con un sistema profesional y una cartera activa de clientes españoles y extranjeros 
                (teletrabajadores, empresas, estudiantes internacionales, profesionales desplazados…).
                <br />
                <strong className="text-white">Todos verificados, solventes y buscando exactamente este tipo de alquiler.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Benefits */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Beneficios de unirte a la red de agentes de Holydeo
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8 border border-green-100 dark:border-green-800 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                💰 Incrementa tus ingresos sin complicarte
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Muchos agentes solo trabajan compraventa o alquiler vacacional.
                <br /><br />
                Con Holydeo puedes ofrecer media estancia todo el año y sumar ingresos recurrentes.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 border border-blue-100 dark:border-blue-800 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🧾 Olvídate del trabajo administrativo
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tú captas y cierras.
                <br /><br />
                Holydeo se encarga de todo el back-office para una experiencia sin fricciones.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-8 border border-purple-100 dark:border-purple-800 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🔁 Diversifica tus servicios
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Ofrece un nuevo modelo de alquiler muy demandado:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span>Media estancia (1–9 meses)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span>Gestión integral</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span>Renta garantizada</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span>Inquilinos solventes y verificados</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span>Ocupación real de septiembre a junio</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ¿Qué hace Holydeo por ti? */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Qué hace Holydeo por ti y por tus propietarios?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Búsqueda de inquilinos */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                🔍 Búsqueda de inquilinos sin preocupaciones
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Promoción, gestión, filtrado, negociaciones y contrato: todo incluido.
              </p>
            </div>

            {/* Precio óptimo */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                📊 Precio óptimo por temporada
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Analizamos el mercado local y establecemos el mejor precio para media estancia según demanda real.
              </p>
            </div>

            {/* Publicación en portales */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                🏡 Publicación en portales sin coste
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Difusión máxima en los principales portales inmobiliarios, sin pagar anuncios.
              </p>
            </div>

            {/* Evaluación de candidatos */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-orange-100 dark:bg-orange-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                ✔ Evaluación y filtrado de candidatos
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Seleccionamos solo perfiles solventes y compatibles con media estancia.
              </p>
            </div>

            {/* Visitas precalificadas */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                👀 Visitas precalificadas
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Solo van a visita los inquilinos con alta probabilidad de cierre. El agente decide si las hace él o prefiere delegarlas.
              </p>
            </div>

            {/* Contrato verificado */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-teal-100 dark:bg-teal-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FileCheck className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                📃 Contrato verificado
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Contrato específico para medias estancias, revisado por abogados.
              </p>
            </div>

            {/* Gestión completa */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-pink-100 dark:bg-pink-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                🔄 Gestión completa
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                Durante toda la estancia:
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Comunicaciones</li>
                <li>• Incidencias</li>
                <li>• Reclamaciones</li>
                <li>• Coordinación de mantenimiento</li>
                <li>• Salida del inquilino</li>
              </ul>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                Todo sin que el propietario o el agente tenga que involucrarse.
              </p>
            </div>

            {/* Renta garantizada */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                💸 Renta garantizada
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                El propietario cobra puntualmente antes del día 10, aunque el inquilino se retrase.
                <br /><br />
                <strong className="text-emerald-600 dark:text-emerald-400">0% riesgo. 0% impagos.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Datos destacados */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Datos que avalan nuestro trabajo
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "11 días", label: "para alquilar", icon: Clock, color: "from-yellow-400 to-orange-500" },
              { number: "+11.532", label: "propiedades gestionadas", icon: Building2, color: "from-blue-400 to-cyan-500" },
              { number: "0%", label: "morosidad", icon: Shield, color: "from-green-400 to-emerald-500" },
              { number: "+25M €", label: "en rentas garantizadas", icon: DollarSign, color: "from-purple-400 to-pink-500" }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                  <div className={`bg-gradient-to-br ${stat.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact-form" className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 md:p-12 border border-blue-100 dark:border-blue-800">
            <Sparkles className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Listo para unirte?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Regístrate en el formulario y uno de nuestros compañeros te contactará para activar tu acceso a Holydeo y empezar a subir propiedades.
            </p>
            <Link
              to="/register"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
            >
              Regístrate ahora
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default AgentAdvantagesPage;
