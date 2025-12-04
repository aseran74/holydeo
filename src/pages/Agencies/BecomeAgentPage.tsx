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
  FileCheck,
  CreditCard,
  Phone,
  Calendar,
  Wrench,
  ShoppingCart,
  Sparkles,
  MessageCircle
} from 'lucide-react';

const BecomeAgentPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Gana dinero extra enseñando viviendas de alquiler vacacional
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Muchos propietarios de viviendas vacacionales no logran alquilarlas de septiembre a junio, 
              aunque estén en zonas de playa muy demandadas en verano.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
              <p className="text-lg text-blue-100">
                <strong className="text-white">Holydeo soluciona este problema</strong> con una gran cartera de clientes 
                españoles y extranjeros buscando estancias de 1 a 9 meses.
                <br /><br />
                <strong className="text-white">Y tú puedes beneficiarte enseñando esas propiedades.</strong>
              </p>
            </div>
            <Link
              to="#benefits"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors duration-200 shadow-lg"
            >
              Descubre cómo
            </Link>
          </div>
        </div>
      </section>

      {/* Gana ingresos extra */}
      <section id="benefits" className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-blue-100 dark:bg-blue-900/30 rounded-full p-3 mb-6">
                <DollarSign className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Gana ingresos extra realizando visitas
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Regístrate como agente, indica tus horarios y empieza a recibir solicitudes de clientes interesados 
                en alquilar fuera de temporada alta.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                { text: "Tú eliges días y horas", icon: Calendar },
                { text: "Sin exclusividades", icon: Shield },
                { text: "Sin compromisos", icon: CheckCircle },
                { text: "Comisión por cada alquiler cerrado", icon: DollarSign }
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-100 dark:border-blue-800 flex items-center gap-4">
                    <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-gray-900 dark:text-white font-medium">{item.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                Perfecto para agentes que quieren monetizar la temporada baja en zonas turísticas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ¿Cómo puedes colaborar? */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Cómo puedes colaborar con Holydeo?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                👣 Enseña viviendas y gana dinero
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Muestra las casas y apartamentos de nuestra plataforma durante septiembre–junio, cuando más nos necesitan.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Tú enseñas, nosotros cerramos.
                  <br />
                  Y tú cobras.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🔄 Delegamos la gestión del alquiler por ti
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Nosotros nos ocupamos de:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>Filtrar inquilinos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>Gestionar reservas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>Redactar contratos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>Coordinar incidencias</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>Gestionar la estancia completa</span>
                </li>
              </ul>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 italic">
                El propietario y tú solo tenéis que aprobar.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🎯 Amplía tus servicios sin esfuerzo
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Ofrece a tus clientes propietarios una solución real para no tener la vivienda vacía nueve meses al año.
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Incluye:</p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Renta garantizada</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Gestión integral</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Alquiler seguro</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Clientes solventes y verificados</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Renta garantizada destacada */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 md:p-12 border border-green-200 dark:border-green-800 shadow-xl">
              <div className="text-center mb-8">
                <div className="inline-block bg-green-100 dark:bg-green-900/30 rounded-full p-3 mb-6">
                  <CreditCard className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  💸 Ofrece rentas garantizadas
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Punto clave para propietarios vacacionales:
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 mb-6">
                <p className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                  Cobran siempre antes del día 10 del mes, aunque el inquilino falle.
                  <br />
                  <span className="text-green-600 dark:text-green-400">Sin riesgo, sin preocupación.</span>
                </p>
              </div>
              <p className="text-center text-gray-600 dark:text-gray-300">
                Si trabajas principalmente compraventa o alquiler vacacional estival, ahora puedes ganar también en los meses tranquilos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Operamos en toda España */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Globe className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Operamos en toda España
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Podrás seguir cada paso desde tu plataforma privada, ver el estado de tus propiedades y recibir notificaciones en tiempo real.
            </p>
          </div>
        </div>
      </section>

      {/* ¿Qué hacemos por ti? */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Qué hacemos por ti?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Phone, emoji: "📞", title: "Atendemos todas las llamadas y mensajes", desc: "Sin que tú tengas que contestar un solo WhatsApp." },
              { icon: Calendar, emoji: "🗓", title: "Organizamos visitas según tu disponibilidad", desc: "Tú eliges cuándo." },
              { icon: Shield, emoji: "✔", title: "Evaluamos la solvencia", desc: "Solo enviamos candidatos 100% válidos." },
              { icon: FileCheck, emoji: "📝", title: "Redactamos reservas y contratos", desc: "Modelos específicos para media estancia (1–9 meses)." },
              { icon: Wrench, emoji: "🛠", title: "Asistencia al inquilino", desc: "Suministros, mudanzas, seguros, limpieza, mantenimiento… Todo centralizado." },
              { icon: ShoppingCart, emoji: "🛒", title: "Acceso al marketplace de servicios", desc: "Más oportunidades para ti y para tus clientes." }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-2xl">{item.emoji}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Más tecnología, menos burocracia */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-100 dark:bg-blue-900/30 rounded-full p-3 mb-6">
              <Zap className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Más tecnología, menos burocracia
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Gestiona tus propiedades desde móvil u ordenador:
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: FileText, text: "Procesos 100% digitales" },
              { icon: Shield, text: "Nada de papeles" },
              { icon: Clock, text: "Soporte 24/7" },
              { icon: MessageCircle, text: "Comunicación directa y en tiempo real" }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="text-center">
                  <IconComponent className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                  <p className="text-gray-700 dark:text-gray-300">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Beneficios de ser agente Holydeo
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { emoji: "⏳", title: "Ahorra tiempo", desc: "Automatizamos todo lo pesado. Tú haces lo rentable.", icon: Clock },
              { emoji: "💰", title: "Incrementa tus ingresos", desc: "Cobra por: Enseñar viviendas, Traer propietarios interesados, Cierres de alquiler en temporada baja", icon: DollarSign },
              { emoji: "🔓", title: "Sin restricciones", desc: "Trabaja con tus clientes habituales. Holydeo no pide exclusividad.", icon: Shield },
              { emoji: "🤝", title: "Soporte personalizado", desc: "Te acompañamos para ayudarte a crecer en media estancia.", icon: Users },
              { emoji: "🧰", title: "Acceso a más servicios", desc: "Limpieza, pintura, reformas, mantenimiento… Más valor para tus propietarios.", icon: Wrench },
              { emoji: "📱", title: "Plataforma fácil", desc: "Todo online, rápido y sin complicaciones.", icon: Building2 }
            ].map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl">{benefit.emoji}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-blue-100">{benefit.desc}</p>
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
              ¿Quieres unirte como agente?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Completa el formulario y te daremos acceso inmediato a tu área privada para empezar a subir propiedades 
              y recibir solicitudes de visitas.
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

export default BecomeAgentPage;
