import { Link } from 'react-router-dom';
import LandingNavbar from '../../components/landing/LandingNavbar';
import LandingFooter from '../../components/landing/LandingFooter';
import { 
  CheckCircle, 
  CreditCard, 
  FileText, 
  Shield, 
  Zap,
  Clock,
  Calendar,
  Lock,
  Sparkles,
  FileCheck
} from 'lucide-react';

const ReservationProcessPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full p-3 mb-6">
              <CreditCard className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              🔵 ¿Cómo funciona la reserva en Holydeo?
            </h1>
            <p className="text-2xl md:text-3xl text-blue-100 font-semibold">
              Fácil, rápida y 100% online
            </p>
            <p className="text-xl text-blue-100 mt-6 max-w-3xl mx-auto">
              En Holydeo hemos simplificado el proceso para que propietarios e inquilinos puedan reservar sin complicaciones. 
              Solo hay dos tipos de reserva, según la duración de la estancia.
            </p>
          </div>
        </div>
      </section>

      {/* Reserva de Media Estancia */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-blue-100 dark:bg-blue-900/30 rounded-full p-4 mb-6">
                <Calendar className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                1️⃣ Reserva de Media Estancia
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                (de septiembre a junio / julio)
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">
                Ideal para inquilinos que buscan quedarse toda la temporada.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Proceso sencillo en 3 pasos:
              </h3>

              <div className="space-y-6">
                {/* Paso 1 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">✅</span>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                          1. Reserva inicial
                        </h4>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        El inquilino realiza un primer pago del <strong className="text-blue-600 dark:text-blue-400">10% del precio mensual</strong> como señal para bloquear la vivienda durante toda la temporada.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Paso 2 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">✅</span>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                          2. Datos y documentación
                        </h4>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        Recogemos los datos del inquilino, realizamos la verificación y preparamos un <strong className="text-green-600 dark:text-green-400">borrador de contrato</strong> para que el propietario pueda revisarlo.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Paso 3 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <FileCheck className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">✅</span>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                          3. Firma digital y pago del resto
                        </h4>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        Una vez ambas partes firman el contrato digitalmente, el inquilino realiza el <strong className="text-purple-600 dark:text-purple-400">pago restante</strong> correspondiente a la entrada, y la reserva queda confirmada.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  Todo el proceso se realiza online, rápido y con total transparencia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reserva de Estancia Corta */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-green-100 dark:bg-green-900/30 rounded-full p-4 mb-6">
                <Zap className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                2️⃣ Reserva de Estancia Corta
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                (entre 15 y 90 días)
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">
                Perfecto para profesionales desplazados, nómadas digitales o clientes temporales.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Lock className="w-8 h-8 text-green-600 dark:text-green-400" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  🔒 Proceso express:
                </h3>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-green-200 dark:border-green-700">
                <p className="text-lg text-gray-700 dark:text-gray-300 text-center">
                  El inquilino realiza el <strong className="text-green-600 dark:text-green-400">pago íntegro del importe</strong> de la estancia en el momento de la reserva.
                </p>
                <div className="mt-4 text-center">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    Sin trámites adicionales: pagas y listo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ventajas */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-100 dark:bg-blue-900/30 rounded-full p-3 mb-6">
              <Sparkles className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              💡 Ventajas para propietarios y agentes
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { 
                icon: Shield, 
                title: "Proceso seguro y verificado", 
                color: "from-blue-500 to-blue-600",
                bg: "bg-blue-50 dark:bg-blue-900/20",
                border: "border-blue-200 dark:border-blue-800"
              },
              { 
                icon: FileText, 
                title: "Contratos digitales y automatizados", 
                color: "from-green-500 to-green-600",
                bg: "bg-green-50 dark:bg-green-900/20",
                border: "border-green-200 dark:border-green-800"
              },
              { 
                icon: CreditCard, 
                title: "Pagos protegidos", 
                color: "from-purple-500 to-purple-600",
                bg: "bg-purple-50 dark:bg-purple-900/20",
                border: "border-purple-200 dark:border-purple-800"
              },
              { 
                icon: Zap, 
                title: "Sin gestiones complicadas", 
                color: "from-orange-500 to-orange-600",
                bg: "bg-orange-50 dark:bg-orange-900/20",
                border: "border-orange-200 dark:border-orange-800"
              },
              { 
                icon: Clock, 
                title: "Reservas rápidas en menos de 5 minutos", 
                color: "from-indigo-500 to-indigo-600",
                bg: "bg-indigo-50 dark:bg-indigo-900/20",
                border: "border-indigo-200 dark:border-indigo-800"
              }
            ].map((advantage, index) => {
              const IconComponent = advantage.icon;
              return (
                <div 
                  key={index}
                  className={`${advantage.bg} ${advantage.border} rounded-xl p-6 border hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                >
                  <div className={`bg-gradient-to-br ${advantage.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {advantage.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para reservar?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Explora nuestras propiedades y encuentra el alojamiento perfecto para tu estancia.
          </p>
          <Link
            to="/search"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
          >
            Buscar propiedades
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default ReservationProcessPage;

