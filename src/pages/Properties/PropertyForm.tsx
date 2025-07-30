import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  Star, 
  Car, 
  Building,
  BedDouble,
  Building2,
  CalendarDays,
  Waves,
  Snowflake,
  UtensilsCrossed,
  ParkingSquare,
  Tv,
  TreePine,
  Sun,
  Moon,
  Mountain,
  MapPinIcon,
  Image as ImageIcon
} from 'lucide-react';
import { useJsApiLoader, Autocomplete, GoogleMap, Marker } from "@react-google-maps/api";
import PropertyCalendarManager from './PropertyCalendarManager';
import { getLatLngFromAddress } from '../../lib/geocode';

interface Property {
  id?: string;
  title: string;
  description?: string;
  location: string;
  price?: number;
  precio_entresemana?: number;
  precio_fin_de_semana?: number;
  precio_dia?: number;
  bathrooms?: number;
  bedrooms?: number;
  toilets?: number;
  square_meters?: number;
  street_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  main_image_path?: string;
  image_paths?: string[];
  amenities?: string[];
  lat?: number;
  lng?: number;
  meses_temporada?: string[];
  precio_mes?: number;
  alquila_temporada_completa?: boolean;
  url_idealista?: string;
  url_booking?: string;
  url_airbnb?: string;
  min_days?: number;
  max_days?: number;
  owner_id?: string;
  agency_id?: string;
  destacada?: boolean;
  tipo?: string;
  region?: string;
}

interface PropertyFormProps {
  property?: Property | null;
  onSave: (property: Property) => void;
  onCancel: () => void;
}

const libraries = ["places"];

const AMENITIES = [
  { label: "Piscina", value: "Piscina", icon: Waves },
  { label: "Jardín", value: "Jardín", icon: TreePine },
  { label: "Garaje", value: "Garaje", icon: Car },
  { label: "Terraza", value: "Terraza", icon: Sun },
  { label: "Aire Acondicionado", value: "Aire Acondicionado", icon: Snowflake },
  { label: "Ascensor", value: "Ascensor", icon: Building2 },
  { label: "Trastero", value: "Trastero", icon: Building },
  { label: "Vistas al mar", value: "Vistas al mar", icon: Waves },
  { label: "Accesible", value: "Accesible", icon: Building },
  { label: "Lujo", value: "Lujo", icon: Star },
  { label: "Obra nueva", value: "Obra nueva", icon: Building2 },
];

const SEASONS = [
  { key: "sep_may", label: "Septiembre a Mayo" },
  { key: "sep_jun", label: "Septiembre a Junio" },
  { key: "sep_jul", label: "Septiembre a Julio" },
  { key: "oct_may", label: "Octubre a Mayo" },
  { key: "oct_jun", label: "Octubre a Junio" },
  { key: "oct_jul", label: "Octubre a Julio" },
];

const PropertyForm: React.FC<PropertyFormProps> = ({ property, onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [precioEntresemana, setPrecioEntresemana] = useState<number | string>("");
  const [precioFinDeSemana, setPrecioFinDeSemana] = useState<number | string>("");
  const [precioDia, setPrecioDia] = useState<number | string>("");
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [bedrooms, setBedrooms] = useState<number>(1);
  const [toilets, setToilets] = useState<number>(1);
  const [squareMeters, setSquareMeters] = useState<number>(50);
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("España");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [amenities, setAmenities] = useState<string[]>([]);
  const autocompleteRef = useRef<any>(null);
  const [selectedMesesTemporada, setSelectedMesesTemporada] = useState<string[]>(property?.meses_temporada || []);
  const [precioMes, setPrecioMes] = useState(property?.precio_mes ? String(property.precio_mes) : "");
  const [alquilaTemporadaCompleta, setAlquilaTemporadaCompleta] = useState(false);
  const [imagePaths, setImagePaths] = useState<string[]>(property?.image_paths || []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState(property?.description || "");
  const [urlIdealista, setUrlIdealista] = useState(property?.url_idealista || "");
  const [urlBooking, setUrlBooking] = useState(property?.url_booking || "");
  const [urlAirbnb, setUrlAirbnb] = useState(property?.url_airbnb || "");
  const [minDays, setMinDays] = useState<number>(1);
  const [maxDays, setMaxDays] = useState<number>(30);
  const [tipo, setTipo] = useState("Piso o apartamento");
  const [region, setRegion] = useState("Andalucia");
  const [destacada, setDestacada] = useState(false);
  const [featured, setFeatured] = useState(false);
  
  // Nuevos estados para los desplegables
  const [propietarios, setPropietarios] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedPropietario, setSelectedPropietario] = useState<string>('');
  const [selectedAgency, setSelectedAgency] = useState<string>('');
  const [selectedAgent, setSelectedAgent] = useState<string>('');

  const { isLoaded } = useJsApiLoader({
    // --- CORRECCIÓN AQUÍ ---
    // Cambiado VITE_GOOGLE_PLACES_API_KEY a VITE_GOOGLE_MAPS_API_KEY
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries as any,
  });

  useEffect(() => {
    // Cargar datos para los desplegables
    const fetchDataForSelects = async () => {
      // Cargar propietarios desde profiles
      const { data: propietariosData } = await supabase.from('profiles').select('user_id, full_name').eq('role', 'owner');
      if (propietariosData) setPropietarios(propietariosData);
      // Cargar agencias desde profiles
      const { data: agenciesData } = await supabase.from('profiles').select('user_id, username').eq('role', 'agency');
      if (agenciesData) setAgencies(agenciesData);
      // NO se cargan los agentes aquí inicialmente
    };
    fetchDataForSelects();

    if (property) {
      setTitle(property.title || "");
      setLocation(property.location || "");
      setPrecioEntresemana(property.precio_entresemana || "");
      setPrecioFinDeSemana(property.precio_fin_de_semana || "");
      setPrecioDia(property.precio_dia || "");
      setBathrooms(property.bathrooms || 1);
      setBedrooms(property.bedrooms || 1);
      setToilets(property.toilets || 1);
      setSquareMeters(property.square_meters || 50);
      setStreetAddress(property.street_address || "");
      setCity(property.city || "");
      setState(property.state || "");
      setPostalCode(property.postal_code || "");
      setCountry(property.country || "España");
      setLat(property.lat || null);
      setLng(property.lng || null);
      setAmenities(property.amenities || []);
      setSelectedMesesTemporada(property.meses_temporada || []);
      setPrecioMes(property.precio_mes ? String(property.precio_mes) : "");
      setAlquilaTemporadaCompleta(property.alquila_temporada_completa || false);
      setImagePaths(property.image_paths || []);
      setDescription(property.description || "");
      setUrlIdealista(property.url_idealista || "");
      setUrlBooking(property.url_booking || "");
      setUrlAirbnb(property.url_airbnb || "");
      setMinDays(property.min_days || 1);
      setMaxDays(property.max_days || 30);
      setTipo(property.tipo || "Piso o apartamento");
      setRegion(property.region || "Andalucia");
      setDestacada(property.destacada || false);
      setSelectedPropietario(property.owner_id || '');
      setSelectedAgency(property.agency_id || '');
    }
  }, [property]);

  // Nuevo useEffect para cargar agentes cuando cambia la agencia seleccionada
  useEffect(() => {
    if (selectedAgency) {
      const fetchAgentsForAgency = async () => {
        const { data: agentsData, error } = await supabase
          .from('profile')
          .select('user_id, username')
          .eq('role', 'agent')
          .eq('agency_id', selectedAgency);
        if (error) {
          console.error("Error fetching agents:", error);
          setAgents([]);
        } else {
          setAgents(agentsData || []);
        }
      };
      fetchAgentsForAgency();
    } else {
      setAgents([]);
    }
    setSelectedAgent('');
  }, [selectedAgency]);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place && place.formatted_address && place.geometry) {
      setLocation(place.formatted_address);
      setLat(place.geometry.location.lat());
      setLng(place.geometry.location.lng());
    }
  };

  const handleAmenityToggle = (value: string) => {
    setAmenities((prev) =>
      prev.includes(value)
        ? prev.filter((a) => a !== value)
        : [...prev, value]
    );
  };

  const handleSeasonChange = (key: string) => {
    setSelectedMesesTemporada((prev) =>
      prev.includes(key)
        ? prev.filter((s) => s !== key)
        : [...prev, key]
    );
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const filePath = `property_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const { data, error } = await supabase.storage.from('property-images').upload(filePath, file);
      if (error) {
        alert('Error subiendo imagen: ' + error.message);
        continue;
      }
      const { data: urlData } = supabase.storage.from('property-images').getPublicUrl(filePath);
      if (urlData?.publicUrl) {
        uploadedUrls.push(urlData.publicUrl);
      }
    }
    setImagePaths((prev) => [...prev, ...uploadedUrls]);
  };

  const handleRemoveImage = async (url: string) => {
    setImagePaths((prev) => prev.filter((img) => img !== url));
    const path = url.split('/property-images/')[1];
    if (path) {
      await supabase.storage.from('property-images').remove([path]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalLat = lat;
    let finalLng = lng;
    
    // Si no hay lat/lng, geolocalizar
    if (!lat || !lng) {
      const geo = await getLatLngFromAddress(location);
      if (geo) {
        finalLat = geo.lat;
        finalLng = geo.lng;
        setLat(finalLat);
        setLng(finalLng);
      }
    }
    
    // Construir el objeto property a guardar
    const propertyToSave: Property = {
      ...property,
      title,
      location,
      price: Number(precioEntresemana) || 0,
      precio_entresemana: Number(precioEntresemana) || 0,
      precio_fin_de_semana: Number(precioFinDeSemana) || 0,
      precio_dia: Number(precioDia) || 0,
      bathrooms,
      bedrooms,
      toilets,
      square_meters: squareMeters,
      street_address: streetAddress,
      city,
      state,
      postal_code: postalCode,
      country,
      lat: finalLat || undefined,
      lng: finalLng || undefined,
      amenities,
      meses_temporada: selectedMesesTemporada,
      precio_mes: precioMes ? Number(precioMes) : 0,
      alquila_temporada_completa: alquilaTemporadaCompleta,
      image_paths: imagePaths,
      description,
      url_idealista: urlIdealista,
      url_booking: urlBooking,
      url_airbnb: urlAirbnb,
      min_days: minDays,
      max_days: maxDays,
      tipo,
      region,
      destacada,
      owner_id: selectedPropietario,
      agency_id: selectedAgency,
    };
    onSave(propertyToSave);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (dataTransfer) {
      const files = dataTransfer.files;
      if (files.length > 0) {
        handleImageUpload({ target: { files } } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  const handleAgencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAgency(e.target.value);
    // Al cambiar de agencia, se resetea la selección de agente, 
    // el useEffect se encargará de recargar la lista.
  };

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            rows={3}
            placeholder="Describe la propiedad..."
          />
        </div>
        <div className="flex items-center mb-4">
          <input
            id="featured"
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Propiedad Destacada
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Descripción</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe la propiedad, puntos fuertes, entorno, etc."
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Dirección</label>
          {isLoaded ? (
            <Autocomplete onLoad={ref => (autocompleteRef.current = ref)} onPlaceChanged={handlePlaceChanged}>
              <input
                type="text"
                className="input input-bordered w-full"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Busca una dirección..."
                required
              />
            </Autocomplete>
          ) : (
            <input
              type="text"
              className="input input-bordered w-full"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Cargando API de Google Maps..."
              disabled
              required
            />
          )}
          
          {/* --- MEJORA: Reemplazado el iframe por un mapa interactivo --- */}
          {isLoaded && lat && lng && (
            <div className="mt-2 rounded overflow-hidden shadow" style={{ height: '200px', width: '100%' }}>
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={{ lat, lng }}
                zoom={15}
              >
                <Marker position={{ lat, lng }} />
              </GoogleMap>
            </div>
          )}
        </div>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Precio entre semana</label>
            <input
              type="number"
              value={precioEntresemana}
              onChange={(e) => setPrecioEntresemana(e.target.value)}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="€"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Precio fin de semana</label>
            <input
              type="number"
              value={precioFinDeSemana}
              onChange={(e) => setPrecioFinDeSemana(e.target.value)}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="€"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Precio por día</label>
            <input
              type="number"
              value={precioDia}
              onChange={(e) => setPrecioDia(e.target.value)}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="€"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Baños</label>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setBathrooms(Math.max(1, bathrooms - 1))} className="px-2 py-1 bg-gray-200 rounded">-</button>
              <input type="number" min={1} value={bathrooms} onChange={(e) => setBathrooms(Math.max(1, Number(e.target.value)))} className="w-16 text-center px-2 py-1 border rounded" required />
              <button type="button" onClick={() => setBathrooms(bathrooms + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Aseos</label>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setToilets(Math.max(1, toilets - 1))} className="px-2 py-1 bg-gray-200 rounded">-</button>
              <input type="number" min={1} value={toilets} onChange={(e) => setToilets(Math.max(1, Number(e.target.value)))} className="w-16 text-center px-2 py-1 border rounded" required />
              <button type="button" onClick={() => setToilets(toilets + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Metros cuadrados</label>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setSquareMeters(Math.max(10, squareMeters - 10))} className="px-2 py-1 bg-gray-200 rounded">-</button>
              <input type="number" min={10} value={squareMeters} onChange={(e) => setSquareMeters(Math.max(10, Number(e.target.value)))} className="w-20 text-center px-2 py-1 border rounded" required />
              <button type="button" onClick={() => setSquareMeters(squareMeters + 10)} className="px-2 py-1 bg-gray-200 rounded">+</button>
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Dormitorios</label>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setBedrooms(Math.max(1, bedrooms - 1))} className="px-2 py-1 bg-gray-200 rounded">-</button>
              <input type="number" min={1} value={bedrooms} onChange={(e) => setBedrooms(Math.max(1, Number(e.target.value)))} className="w-16 text-center px-2 py-1 border rounded" required />
              <button type="button" onClick={() => setBedrooms(bedrooms + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Dirección completa</label>
          <input
            type="text"
            value={streetAddress}
            onChange={e => setStreetAddress(e.target.value)}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            placeholder="Calle, número, etc."
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Ciudad</label>
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="Madrid"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Provincia</label>
            <input
              type="text"
              value={state}
              onChange={e => setState(e.target.value)}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="Madrid"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Código Postal</label>
            <input
              type="text"
              value={postalCode}
              onChange={e => setPostalCode(e.target.value)}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="28001"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">País</label>
            <input
              type="text"
              value={country}
              onChange={e => setCountry(e.target.value)}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="España"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Días mínimos</label>
            <input
              type="number"
              value={minDays}
              onChange={e => setMinDays(Number(e.target.value))}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="1"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Días máximos</label>
            <input
              type="number"
              value={maxDays}
              onChange={e => setMaxDays(Number(e.target.value))}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="30"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Tipo de propiedad</label>
            <select
              value={tipo}
              onChange={e => setTipo(e.target.value)}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            >
              <option value="Piso o apartamento">Piso o apartamento</option>
              <option value="Casa">Casa</option>
              <option value="Villa">Villa</option>
              <option value="Chalet">Chalet</option>
              <option value="Casa rural">Casa rural</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Región</label>
            <select
              value={region}
              onChange={e => setRegion(e.target.value)}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            >
              <option value="Andalucia">Andalucía</option>
              <option value="Cataluña">Cataluña</option>
              <option value="Madrid">Madrid</option>
              <option value="Valencia">Valencia</option>
              <option value="Baleares">Baleares</option>
              <option value="Canarias">Canarias</option>
              <option value="Asturias">Asturias</option>
              <option value="Galicia">Galicia</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={destacada}
              onChange={e => setDestacada(e.target.checked)}
              className="accent-primary"
            />
            Propiedad destacada
          </label>
        </div>
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={alquilaTemporadaCompleta}
              onChange={e => setAlquilaTemporadaCompleta(e.target.checked)}
              className="accent-primary"
            />
            Alquila temporada completa
          </label>
        </div>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">URL Idealista</label>
            <input
              type="url"
              value={urlIdealista}
              onChange={e => setUrlIdealista(e.target.value)}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="https://www.idealista.com/inmueble/..."
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">URL Booking</label>
            <input
              type="url"
              value={urlBooking}
              onChange={e => setUrlBooking(e.target.value)}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="https://www.booking.com/..."
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">URL Airbnb</label>
            <input
              type="url"
              value={urlAirbnb}
              onChange={e => setUrlAirbnb(e.target.value)}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="https://www.airbnb.com/rooms/..."
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Galería de fotos</label>
          <div
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition relative bg-gray-50"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
            <span className="text-gray-500">Subir imágenes</span>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {imagePaths.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img src={url} alt="preview" className="w-16 h-16 object-cover rounded shadow" />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition"
                    onClick={e => { e.stopPropagation(); handleRemoveImage(url); }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Amenities / Complementos</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {AMENITIES.map(({ label, value, icon: Icon }) => (
              <button
                type="button"
                key={value}
                onClick={() => handleAmenityToggle(value)}
                className={`flex items-center gap-2 px-3 py-2 rounded border transition-colors
                  ${amenities.includes(value)
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-200'}
                `}
              >
                <Icon size={20} />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Temporadas disponibles</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {SEASONS.map((season) => (
              <label key={season.key} className="inline-flex items-center gap-2">
                <input type="checkbox" checked={selectedMesesTemporada.includes(season.key)} onChange={() => handleSeasonChange(season.key)} className="accent-primary" />
                {season.label}
              </label>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2" htmlFor="monthlyPrice">
            Precio mensual (euros)
          </label>
          <input
            id="monthlyPrice"
            type="number"
            min="0"
            step="0.01"
            value={precioMes}
            onChange={(e) => setPrecioMes(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Ej: 1200"
                          disabled={selectedMesesTemporada.length === 0}
              required={selectedMesesTemporada.length > 0}
          />
          {/* {seasonError && <p className="text-red-500 text-sm mt-1">{seasonError}</p>} */}
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2" htmlFor="rules">Reglas de la casa</label>
          <textarea id="rules" className="w-full border rounded px-3 py-2" rows={3} placeholder="Ej: No hacer ruido después de las 22h, no fiestas, etc." />
        </div>
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="accent-primary" /> Se puede fumar
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="accent-primary" /> Se admiten mascotas
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Propietario</label>
            <select value={selectedPropietario} onChange={(e) => setSelectedPropietario(e.target.value)} className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline">
              <option value="">Seleccionar Propietario</option>
              {propietarios.map(p => (
                <option key={p.user_id} value={p.user_id}>
                  {p.username ? (p.full_name ? `${p.username} (${p.full_name})` : p.username) : p.full_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Agencia</label>
            <select value={selectedAgency} onChange={handleAgencyChange} className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline">
              <option value="">Seleccionar Agencia</option>
              {agencies.map(a => (
                <option key={a.user_id} value={a.user_id}>
                  {a.username ? (a.full_name ? `${a.username} (${a.full_name})` : a.username) : a.full_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Agente</label>
            <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} disabled={!selectedAgency || agents.length === 0} className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline disabled:bg-gray-200">
              <option value="">{selectedAgency ? 'Seleccionar Agente' : 'Primero elige una agencia'}</option>
              {agents.map(ag => (
                <option key={ag.user_id} value={ag.user_id}>
                  {ag.username ? (ag.full_name ? `${ag.username} (${ag.full_name})` : ag.username) : ag.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <button type="submit" className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline">
            Guardar
          </button>
          <button type="button" onClick={onCancel} className="px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline">
            Cancelar
          </button>
        </div>
      </form>
      {/* Integración del gestor de calendario */}
      <PropertyCalendarManager propertyId={property?.id || ""} />
    </div>
  );
};

export default PropertyForm;