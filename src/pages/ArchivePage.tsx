import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import PropertyCard from './Properties/PropertyCard';
import ExperienceCard from '../components/experiences/ExperienceCard';
import PageBreadCrumb from '../components/common/PageBreadCrumb';

interface Property {
  id: string;
  title: string;
  address?: string;
  price?: number;
  bedrooms?: number;
  lat?: number;
  lng?: number;
  available_from?: string;
  available_to?: string;
  price_per_month?: number;
  features?: string[];
}

interface Experience {
  id: string;
  title: string;
  location?: string;
  price?: number;
  lat?: number;
  lng?: number;
  available_from?: string;
  available_to?: string;
  features?: string[];
}

const FEATURES = [
  'Piscina',
  'Terraza',
  'Parking',
  'Jardín',
  'Aire acondicionado',
  'Amueblado',
];

// const GOOGLE_MAPS_API_KEY = 'TU_API_KEY_AQUI'; // <-- Cambia esto por tu API Key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' };
const DEFAULT_CENTER = { lat: 40.4168, lng: -3.7038 }; // Madrid por defecto

const ArchivePage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState<'all' | 'property' | 'experience'>('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [location, setLocation] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [availableTo, setAvailableTo] = useState('');
  const [minPriceMonth, setMinPriceMonth] = useState('');
  const [maxPriceMonth, setMaxPriceMonth] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const locations = Array.from(new Set([
    ...properties.map(p => p.address).filter(Boolean),
    ...experiences.map(e => e.location).filter(Boolean),
  ]));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('id, title, address, price, bedrooms, lat, lng, available_from, available_to, price_per_month, features');
      setProperties(propertiesData || []);
      const { data: experiencesData } = await supabase
        .from('experiences')
        .select('id, title, location, price, lat, lng, available_from, available_to, features');
      setExperiences(experiencesData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredProperties = properties.filter(p => {
    if (type !== 'all' && type !== 'property') return false;
    if (search && !(
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.address?.toLowerCase().includes(search.toLowerCase())
    )) return false;
    if (location && p.address !== location) return false;
    if (minPrice && (p.price ?? 0) < Number(minPrice)) return false;
    if (maxPrice && (p.price ?? 0) > Number(maxPrice)) return false;
    if (bedrooms && p.bedrooms !== Number(bedrooms)) return false;
    if (availableFrom && p.available_from && p.available_from < availableFrom) return false;
    if (availableTo && p.available_to && p.available_to > availableTo) return false;
    if (minPriceMonth && (p.price_per_month ?? 0) < Number(minPriceMonth)) return false;
    if (maxPriceMonth && (p.price_per_month ?? 0) > Number(maxPriceMonth)) return false;
    if (selectedFeatures.length > 0 && (!p.features || !selectedFeatures.every(f => p.features?.includes(f)))) return false;
    return true;
  });

  const filteredExperiences = experiences.filter(e => {
    if (type !== 'all' && type !== 'experience') return false;
    if (search && !(
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.location?.toLowerCase().includes(search.toLowerCase())
    )) return false;
    if (location && e.location !== location) return false;
    if (minPrice && (e.price ?? 0) < Number(minPrice)) return false;
    if (maxPrice && (e.price ?? 0) > Number(maxPrice)) return false;
    if (availableFrom && e.available_from && e.available_from < availableFrom) return false;
    if (availableTo && e.available_to && e.available_to > availableTo) return false;
    if (selectedFeatures.length > 0 && (!e.features || !selectedFeatures.every(f => e.features?.includes(f)))) return false;
    return true;
  });

  // Cargar Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // Unir todos los resultados filtrados con coordenadas
  const filteredResults = useMemo(() => [
    ...filteredProperties.filter(p => p.lat && p.lng),
    ...filteredExperiences.filter(e => e.lat && e.lng),
  ], [filteredProperties, filteredExperiences]);

  // Calcular centro del mapa según los resultados
  const mapCenter = useMemo(() => {
    if (filteredResults.length > 0) {
      return {
        lat: filteredResults[0].lat,
        lng: filteredResults[0].lng,
      };
    }
    return DEFAULT_CENTER;
  }, [filteredResults]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 2xl:p-10">
      <PageBreadCrumb
        pageName="Archivo"
        parentPage="Inicio"
        parentPath="/"
      />

      <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-8">
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white rounded shadow p-4 flex flex-col md:flex-row gap-4 items-center flex-wrap">
            <input
              type="text"
              placeholder="Buscar por nombre, ubicación..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
            />
            <select
              value={type}
              onChange={e => setType(e.target.value as any)}
              className="border rounded px-3 py-2"
            >
              <option value="all">Todos</option>
              <option value="property">Propiedades</option>
              <option value="experience">Experiencias</option>
            </select>
            <select
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">Ubicación</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Precio mín."
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              className="border rounded px-3 py-2 w-28"
              min={0}
            />
            <input
              type="number"
              placeholder="Precio máx."
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              className="border rounded px-3 py-2 w-28"
              min={0}
            />
            <input
              type="number"
              placeholder="Habitaciones"
              value={bedrooms}
              onChange={e => setBedrooms(e.target.value)}
              className="border rounded px-3 py-2 w-28"
              min={0}
              disabled={type === 'experience'}
            />
            <input
              type="date"
              placeholder="Desde"
              value={availableFrom}
              onChange={e => setAvailableFrom(e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="date"
              placeholder="Hasta"
              value={availableTo}
              onChange={e => setAvailableTo(e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Precio/mes mín."
              value={minPriceMonth}
              onChange={e => setMinPriceMonth(e.target.value)}
              className="border rounded px-3 py-2 w-32"
              min={0}
              disabled={type !== 'property'}
            />
            <input
              type="number"
              placeholder="Precio/mes máx."
              value={maxPriceMonth}
              onChange={e => setMaxPriceMonth(e.target.value)}
              className="border rounded px-3 py-2 w-32"
              min={0}
              disabled={type !== 'property'}
            />
            <div className="flex flex-wrap gap-2 items-center">
              {FEATURES.map(f => (
                <label key={f} className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(f)}
                    onChange={e => {
                      if (e.target.checked) setSelectedFeatures([...selectedFeatures, f]);
                      else setSelectedFeatures(selectedFeatures.filter(x => x !== f));
                    }}
                  />
                  {f}
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center text-gray-400 py-12">
                Cargando resultados...
              </div>
            ) : (
              <>
                {filteredProperties.map(p => (
                  <div key={p.id} className="bg-white rounded shadow p-4">
                    <div className="font-bold text-lg mb-1">{p.title}</div>
                    <div className="text-sm text-gray-500 mb-1">{p.address}</div>
                    <div className="text-sm">{p.price} €</div>
                    {p.bedrooms && <div className="text-xs text-gray-400">{p.bedrooms} habitaciones</div>}
                  </div>
                ))}
                {filteredExperiences.map(e => (
                  <div key={e.id} className="bg-white rounded shadow p-4 border-l-4 border-blue-400">
                    <div className="font-bold text-lg mb-1">{e.title}</div>
                    <div className="text-sm text-gray-500 mb-1">{e.location}</div>
                    <div className="text-sm">{e.price} €</div>
                  </div>
                ))}
                {filteredProperties.length === 0 && filteredExperiences.length === 0 && (
                  <div className="col-span-full text-center text-gray-400 py-12">
                    No se encontraron resultados con los filtros seleccionados.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="w-full lg:w-[400px] xl:w-[500px] h-[400px] lg:h-auto bg-gray-100 rounded shadow overflow-hidden">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={MAP_CONTAINER_STYLE}
              center={mapCenter || { lat: 40.4168, lng: -3.7038 }}
              zoom={filteredResults.length > 0 ? 12 : 5}
            >
              {filteredResults.map((item: any) => (
                <Marker
                  key={item.id}
                  position={{ lat: item.lat, lng: item.lng }}
                  // Puedes personalizar el icono según si es propiedad o experiencia
                />
              ))}
            </GoogleMap>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Cargando mapa...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchivePage; 