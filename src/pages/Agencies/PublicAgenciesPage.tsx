import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import LandingNavbar from '../../components/landing/LandingNavbar';
import LandingFooter from '../../components/landing/LandingFooter';
import { Building2, MapPin, Globe, ExternalLink, Filter } from 'lucide-react';

interface Agency {
  id: string;
  name: string;
  website?: string;
  zone?: string;
  city?: string;
  region?: string;
  phone?: string;
  contact_email?: string;
  logo_url?: string;
}

const PublicAgenciesPage = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [zones, setZones] = useState<string[]>([]);

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('agencies')
        .select('*')
        .order('zone', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching agencies:', error);
        return;
      }

      if (data) {
        setAgencies(data);
        // Extraer zonas únicas
        const uniqueZones = [...new Set(data.map(agency => agency.zone).filter(Boolean))];
        setZones(uniqueZones.sort());
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgencies = selectedZone === 'all' 
    ? agencies 
    : agencies.filter(agency => agency.zone === selectedZone);

  const agenciesByZone = filteredAgencies.reduce((acc, agency) => {
    const zone = agency.zone || 'Otras';
    if (!acc[zone]) {
      acc[zone] = [];
    }
    acc[zone].push(agency);
    return acc;
  }, {} as Record<string, Agency[]>);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <LandingNavbar />
      
      <div className="pt-24 pb-16">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Agencias
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Trabajamos con las mejores agencias inmobiliarias de España para ofrecerte las mejores opciones de alojamiento
            </p>
          </div>
        </div>

        {/* Filtros por zona */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex flex-wrap items-center gap-4 justify-center">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filtrar por zona:</span>
            </div>
            <button
              onClick={() => setSelectedZone('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedZone === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Todas
            </button>
            {zones.map(zone => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedZone === zone
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {zone}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {Object.keys(agenciesByZone).length === 0 ? (
              <div className="text-center py-20">
                <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No se encontraron agencias
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {Object.entries(agenciesByZone).map(([zone, zoneAgencies]) => (
                  <div key={zone} className="mb-12">
                    {/* Título de zona */}
                    <div className="flex items-center gap-3 mb-6">
                      <MapPin className="w-6 h-6 text-blue-600" />
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        {zone}
                      </h2>
                      <span className="text-gray-500 dark:text-gray-400">
                        ({zoneAgencies.length} {zoneAgencies.length === 1 ? 'agencia' : 'agencias'})
                      </span>
                    </div>

                    {/* Grid de agencias */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {zoneAgencies.map(agency => (
                        <div
                          key={agency.id}
                          className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 dark:border-gray-700"
                        >
                          {/* Logo o icono */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              {agency.logo_url ? (
                                <img
                                  src={agency.logo_url}
                                  alt={agency.name}
                                  className="w-12 h-12 object-contain rounded"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                  <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                              )}
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                                  {agency.name}
                                </h3>
                                {agency.city && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {agency.city}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Información adicional */}
                          <div className="space-y-2 mb-4">
                            {agency.region && (
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Región:</span> {agency.region}
                              </p>
                            )}
                            {agency.phone && (
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Teléfono:</span>{' '}
                                <a
                                  href={`tel:${agency.phone}`}
                                  className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  {agency.phone}
                                </a>
                              </p>
                            )}
                            {agency.contact_email && (
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Email:</span>{' '}
                                <a
                                  href={`mailto:${agency.contact_email}`}
                                  className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  {agency.contact_email}
                                </a>
                              </p>
                            )}
                          </div>

                          {/* Botón de website */}
                          {agency.website && (
                            <a
                              href={agency.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium w-full justify-center"
                            >
                              <Globe className="w-4 h-4" />
                              Visitar sitio web
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <LandingFooter />
    </div>
  );
};

export default PublicAgenciesPage;

