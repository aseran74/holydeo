import { useState } from 'react';
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
  FileCheck,
  X,
  AlertTriangle
} from 'lucide-react';

const ReservationProcessPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeContract, setActiveContract] = useState<'45dias' | '10meses'>('45dias');
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6 animate-bounce">
              <img
                src="/logotrans-white.svg"
                alt="Holydeo Logo"
                className="h-20 w-auto max-w-[200px] object-contain drop-shadow-lg"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Cómo funciona la reserva en Holydeo?
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
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Todo el proceso se realiza online, rápido y con total transparencia.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <FileText className="w-5 h-5" />
                  Ver modelos de contrato
                </button>
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

      {/* Modal de Contratos */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header del Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Modelos de Contrato de Arrendamiento de Temporada
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Tabs para seleccionar el tipo de contrato */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveContract('45dias')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeContract === '45dias'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Modelo 1: 45 Días
              </button>
              <button
                onClick={() => setActiveContract('10meses')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeContract === '10meses'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Modelo 2: 10 Meses
              </button>
            </div>

            {/* Contenido del Modal - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeContract === '45dias' ? (
                <div className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Modelo 1: Contrato de Arrendamiento de Temporada (45 Días)</strong>
                      <br />
                      Este modelo se adapta a una estancia corta donde el pago es único al finalizar la reserva.
                    </p>
                  </div>

                  <div className="prose dark:prose-invert max-w-none">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      CONTRATO DE ARRENDAMIENTO DE TEMPORADA
                    </h3>

                    <div className="space-y-4 text-gray-700 dark:text-gray-300">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">REUNIDOS</h4>
                        <p className="font-semibold mb-2">PARTE ARRENDADORA (PROPIETARIA):</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Nombre/Razón Social: [Nombre completo o Razón Social]</li>
                          <li>NIF/CIF: [Número de identificación fiscal]</li>
                          <li>Domicilio a efectos de notificaciones: [Dirección completa]</li>
                        </ul>
                        <p className="font-semibold mt-4 mb-2">PARTE ARRENDATARIA (INQUILINA):</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Nombre completo: [Nombre completo del inquilino]</li>
                          <li>NIF/NIE: [Número de identificación]</li>
                          <li>Domicilio a efectos de notificaciones: [Dirección de contacto]</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">INTERVIENEN</h4>
                        <p>Ambas partes se reconocen la capacidad legal necesaria para formalizar el presente contrato y, a tal efecto,</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">EXPONEN</h4>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                          <li>Que la Parte Arrendadora es propietaria de la vivienda sita en [Dirección completa de la vivienda], Referencia Catastral: [Número].</li>
                          <li>Que la Parte Arrendataria tiene interés en alquilar dicha vivienda por un período temporal y transitorio, y la Parte Arrendadora acepta.</li>
                          <li>Que la temporalidad se justifica por la siguiente necesidad: [Indicar la causa temporal del inquilino, ej.: Curso de formación, trabajo temporal, proyecto profesional específico, etc.]. La Parte Arrendataria aporta como prueba el documento [Indicar el documento, ej.: Carta de la empresa, matrícula del curso, etc.] que se adjunta como Anexo I.</li>
                          <li>Que el presente contrato se rige por lo dispuesto en el Título III de la Ley 29/1994, de 24 de noviembre, de Arrendamientos Urbanos (LAU).</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">ACUERDAN</h4>
                        <p>Formalizar el presente Contrato de Arrendamiento de Temporada con sujeción a las siguientes:</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">CLÁUSULAS</h4>
                        
                        <div className="mt-4 space-y-4">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">PRIMERA. Objeto y Plazo.</p>
                            <p>El objeto del contrato es la vivienda descrita en el Exponendo 1. El plazo de duración es de 45 días, comenzando el [Día] de [Mes] de [Año] y finalizando el [Día] de [Mes] de [Año], fecha en la que la Parte Arrendataria deberá desalojar la vivienda.</p>
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">SEGUNDA. Renta y Forma de Pago.</p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                              <li>La renta total pactada por los 45 días es de [Cantidad en número] € ([Cantidad en letra] euros).</li>
                              <li>Forma de Pago: La renta se abonará en su totalidad al finalizar la reserva, en el momento de la entrega de llaves y revisión de la vivienda, mediante [Indicar método: transferencia bancaria, efectivo, etc.].</li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">TERCERA. Fianza y Garantías.</p>
                            <p>[OPCIONAL - Para estancias cortas, a menudo se exige un depósito o no se pide fianza legal. Si se exige:] Se constituye un depósito en concepto de garantía por valor de [Cantidad] €, que será devuelto a la Parte Arrendataria tras la finalización del contrato y revisión de la vivienda, descontando los posibles daños o desperfectos.</p>
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">CUARTA. Suministros.</p>
                            <p>Los gastos por suministros (electricidad, agua, gas, internet) corren a cargo de [La Parte Arrendadora / La Parte Arrendataria. Para estancias cortas, lo habitual es que estén incluidos en la renta]. [Si están incluidos, especificar el límite, si lo hay: "Incluidos en la renta, con un límite de consumo de XX €/mes. El exceso correrá a cargo del Arrendatario."]</p>
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">QUINTA. Justificación de la Temporalidad.</p>
                            <p>La Parte Arrendataria declara conocer y aceptar el carácter temporal y transitorio del presente arrendamiento, que no tiene por objeto su residencia habitual, y que está justificado por la causa expuesta en el Exponendo 3.</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">[Lugar y fecha]</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">[Firma del Arrendador] | [Firma del Arrendatario]</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Modelo 2: Contrato de Arrendamiento de Temporada (10 Meses)</strong>
                      <br />
                      Este modelo se adapta a una duración más larga (Septiembre a Junio), con fianza legal, pago mensual y suministros incluidos.
                    </p>
                  </div>

                  <div className="prose dark:prose-invert max-w-none">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      CONTRATO DE ARRENDAMIENTO DE TEMPORADA
                    </h3>

                    <div className="space-y-4 text-gray-700 dark:text-gray-300">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">REUNIDOS</h4>
                        <p className="font-semibold mb-2">PARTE ARRENDADORA (PROPIETARIA): [Datos completos como en el modelo 1]</p>
                        <p className="font-semibold mb-2">PARTE ARRENDATARIA (INQUILINA): [Datos completos como en el modelo 1]</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">INTERVIENEN</h4>
                        <p>Ambas partes se reconocen la capacidad legal necesaria para formalizar el presente contrato y, a tal efecto,</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">EXPONEN</h4>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                          <li>Que la Parte Arrendadora es propietaria de la vivienda sita en [Dirección completa de la vivienda], Referencia Catastral: [Número].</li>
                          <li>Que la Parte Arrendataria tiene interés en alquilar dicha vivienda por un período temporal y transitorio, y la Parte Arrendadora acepta.</li>
                          <li>Que la temporalidad se justifica por la siguiente necesidad: [Indicar la causa temporal: ej.: Estudios universitarios fuera del domicilio habitual, trabajo temporal o desplazamiento laboral, realización de prácticas, etc.]. La Parte Arrendataria aporta como prueba el documento [Indicar el documento, ej.: Matrícula universitaria, contrato laboral temporal, etc.] que se adjunta como Anexo I.</li>
                          <li>Que el presente contrato se rige por lo dispuesto en el Título III de la Ley 29/1994, de 24 de noviembre, de Arrendamientos Urbanos (LAU).</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">ACUERDAN</h4>
                        <p>Formalizar el presente Contrato de Arrendamiento de Temporada con sujeción a las siguientes:</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">CLÁUSULAS</h4>
                        
                        <div className="mt-4 space-y-4">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">PRIMERA. Objeto y Plazo.</p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                              <li>El objeto del contrato es la vivienda descrita en el Exponendo 1.</li>
                              <li>El plazo de duración es de 10 meses, comenzando el 1 de septiembre de [Año] y finalizando el 30 de junio de [Año siguiente], fecha en la que la Parte Arrendataria deberá desalojar la vivienda. No cabe prórroga tácita de este contrato por la naturaleza temporal de la necesidad del Arrendatario.</li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">SEGUNDA. Renta y Forma de Pago.</p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                              <li>La renta mensual es de [Cantidad en número] € ([Cantidad en letra] euros).</li>
                              <li>La Parte Arrendataria abonará la renta dentro de los siete (7) primeros días de cada mes, mediante transferencia a la cuenta bancaria de la Parte Arrendadora: [Número de Cuenta Bancaria (IBAN)].</li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">TERCERA. Fianza y Garantías.</p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                              <li>La Parte Arrendataria entrega en este acto a la Parte Arrendadora la cantidad de [Cantidad en número] € en concepto de Fianza Legal, equivalente a una mensualidad de renta, que la Arrendadora depositará en el organismo competente de la Comunidad Autónoma [Esto es obligatorio por ley].</li>
                              <li>Esta fianza será devuelta al finalizar el contrato, una vez comprobado que no existen desperfectos y se han cumplido todas las obligaciones contractuales.</li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">CUARTA. Suministros y Gastos.</p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                              <li>Los gastos de suministros individuales de la vivienda (electricidad, agua, gas) e internet están incluidos en la renta mensual, asumiendo la Parte Arrendadora su coste.</li>
                              <li>[Cláusula de Límite de Consumo (Recomendado):] Se establece un límite de consumo mensual razonable por un total de [Límite] € (ej. 100€) para la suma de todos los suministros. En caso de superarse dicho límite, la diferencia será abonada por la Parte Arrendataria previa justificación de las facturas por la Arrendadora.</li>
                              <li>Los gastos de Comunidad y de IBI (Impuesto de Bienes Inmuebles) son a cargo de la Parte Arrendadora.</li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">QUINTA. Justificación de la Temporalidad.</p>
                            <p>La Parte Arrendataria declara conocer y aceptar el carácter temporal y transitorio del presente arrendamiento, justificado por la causa expuesta en el Exponendo 3. Si la Parte Arrendataria pretendiera destinar la vivienda a su residencia habitual, el contrato pasaría a regirse por el Título II de la LAU, quedando anulada la naturaleza temporal y pudiendo aplicarse la duración mínima de cinco o siete años.</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">[Lugar y fecha]</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">[Firma del Arrendador] | [Firma del Arrendatario]</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Consideraciones Legales */}
              <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3">
                      ⚠️ Consideraciones Legales Importantes:
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li>
                        <strong>Justificación de la Temporalidad:</strong> Es el elemento más crucial. La LAU establece que estos contratos son para cubrir una necesidad temporal (estudios, trabajo temporal, servicios, etc.). La causa debe ser real y justificarse con documentación (contrato, matrícula, etc.) que debe adjuntarse al contrato (Anexo I). Si la necesidad no es temporal, un juez podría recalificar el contrato como de vivienda habitual.
                      </li>
                      <li>
                        <strong>No hay Prórroga Obligatoria:</strong> A diferencia del contrato de vivienda habitual (5 o 7 años), el contrato de temporada finaliza obligatoriamente en la fecha pactada (el 30 de junio en el segundo caso) y no tiene prórrogas legales automáticas.
                      </li>
                      <li>
                        <strong>Fianza:</strong> En el Modelo 2 (más de 1 mes de duración), la fianza es obligatoria (1 mes de renta) y debe depositarse en el organismo autonómico correspondiente.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <LandingFooter />
    </div>
  );
};

export default ReservationProcessPage;

