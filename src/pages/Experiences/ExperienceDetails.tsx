import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import PageBreadCrumb from '../../components/common/PageBreadCrumb';
import Button from '../../components/ui/button/Button';
import { Experience } from '../../types';
import { MapPinIcon, ClockIcon, UsersIcon, StarIcon, CalendarIcon, ExternalLinkIcon } from '../../icons';

const ExperienceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchExperience = async () => {
      if (!id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching experience:', error);
      } else {
        setExperience(data);
      }
      setLoading(false);
    };

    fetchExperience();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDuration = (duration: number) => {
    if (duration < 60) return `${duration} min`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  };

  if (loading) {
    return (
      <div className="p-4">
        <PageBreadCrumb pageTitle="Cargando..." />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="p-4">
        <PageBreadCrumb pageTitle="Experiencia no encontrada" />
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Experiencia no encontrada</h2>
          <p className="text-gray-600 mb-6">La experiencia que buscas no existe o ha sido eliminada.</p>
          <Link to="/experiences">
            <Button>Volver a Experiencias</Button>
          </Link>
        </div>
      </div>
    );
  }

  const mainImage = experience.photos && experience.photos.length > 0 
    ? experience.photos[selectedImage] 
    : null;

  return (
    <div className="p-4">
      <PageBreadCrumb pageTitle={experience.title} />

      <div className="max-w-6xl mx-auto">
        {/* Imágenes */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Imagen principal */}
            <div className="lg:col-span-2">
              <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={experience.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-lg">Sin imagen</span>
                  </div>
                )}
                {experience.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                      Destacada
                    </span>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {experience.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Información principal */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {experience.title}
                </h1>

                <div className="text-2xl font-bold text-blue-600 mb-6">
                  {formatPrice(experience.price)}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="w-5 h-5 mr-3" />
                    <span>{experience.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="w-5 h-5 mr-3" />
                    <span>{formatDuration(experience.duration)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <UsersIcon className="w-5 h-5 mr-3" />
                    <span>Máximo {experience.max_participants} participantes</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button className="w-full">
                    Reservar Experiencia
                  </Button>
                  {experience.external_url && (
                    <a
                      href={experience.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <ExternalLinkIcon className="w-4 h-4 mr-2" />
                      Ver en sitio web
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Galería de imágenes */}
          {experience.photos && experience.photos.length > 1 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Galería de imágenes</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {experience.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-blue-500' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`${experience.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Descripción */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción</h2>
          <p className="text-gray-700 leading-relaxed">
            {experience.description}
          </p>
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lo que incluye */}
          {experience.what_is_included && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Lo que incluye</h3>
              <div className="prose prose-gray max-w-none">
                <div dangerouslySetInnerHTML={{ __html: experience.what_is_included }} />
              </div>
            </div>
          )}

          {/* Lo que necesitas */}
          {experience.what_is_needed && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Lo que necesitas</h3>
              <div className="prose prose-gray max-w-none">
                <div dangerouslySetInnerHTML={{ __html: experience.what_is_needed }} />
              </div>
            </div>
          )}
        </div>

        {/* Fechas recurrentes */}
        {experience.recurring_dates && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2" />
              Fechas disponibles
            </h3>
            <div className="space-y-2">
              {experience.recurring_dates.dates && experience.recurring_dates.dates.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Fechas específicas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {experience.recurring_dates.dates.map((date, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {new Date(date).toLocaleDateString('es-ES')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {experience.recurring_dates.days && experience.recurring_dates.days.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Días de la semana:</h4>
                  <div className="flex flex-wrap gap-2">
                    {experience.recurring_dates.days.map((day, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-between items-center mt-8">
          <Link to="/experiences">
            <Button variant="outline">
              Volver a Experiencias
            </Button>
          </Link>
          <div className="flex space-x-4">
            <Button variant="outline">
              Compartir
            </Button>
            <Button>
              Reservar Ahora
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetails; 