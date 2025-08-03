import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Image as ImageIcon } from 'lucide-react';
import GooglePlacesAutocomplete from './common/GooglePlacesAutocomplete';
import AgencySelector from './common/AgencySelector';
import OwnerSelector from './common/OwnerSelector';

interface SimpleProperty {
  id?: string;
  title: string;
  description?: string;
  location: string;
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

interface SimplePropertyFormProps {
  property?: SimpleProperty | null;
  onSave: (property: SimpleProperty) => void;
  onCancel: () => void;
}

const SimplePropertyForm: React.FC<SimplePropertyFormProps> = ({ property, onSave, onCancel }) => {
  // Estados básicos
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
  const [amenities, setAmenities] = useState<string[]>([]);
  const [selectedMesesTemporada, setSelectedMesesTemporada] = useState<string[]>([]);
  const [precioMes, setPrecioMes] = useState("");
  const [alquilaTemporadaCompleta, setAlquilaTemporadaCompleta] = useState(false);
  const [urlIdealista, setUrlIdealista] = useState("");
  const [urlBooking, setUrlBooking] = useState("");
  const [urlAirbnb, setUrlAirbnb] = useState("");
  const [minDays, setMinDays] = useState<number>(1);
  const [maxDays, setMaxDays] = useState<number>(30);
  const [tipo, setTipo] = useState("Apartamento o piso");
  const [region, setRegion] = useState("Andalucia");
  const [destacada, setDestacada] = useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [ownerId, setOwnerId] = useState<string>("");
  const [agencyId, setAgencyId] = useState<string>("");
  
  // Estados para imágenes
  const [imagePaths, setImagePaths] = useState<string[]>(property?.image_paths || []);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Inicializar valores cuando se edita una propiedad
  useEffect(() => {
    if (property) {
      setTitle(property.title || "");
      setDescription(property.description || "");
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
      setAmenities(property.amenities || []);
      setSelectedMesesTemporada(property.meses_temporada || []);
      setPrecioMes(property.precio_mes ? String(property.precio_mes) : "");
      setAlquilaTemporadaCompleta(property.alquila_temporada_completa || false);
      setUrlIdealista(property.url_idealista || "");
      setUrlBooking(property.url_booking || "");
      setUrlAirbnb(property.url_airbnb || "");
      setMinDays(property.min_days || 1);
      setMaxDays(property.max_days || 30);
      setTipo(property.tipo || "Piso o apartamento");
      setRegion(property.region || "Andalucia");
      setDestacada(property.destacada || false);
      setLat(property.lat || null);
      setLng(property.lng || null);
      setOwnerId(property.owner_id || "");
      setAgencyId(property.agency_id || "");
      setImagePaths(property.image_paths || []);
    }
  }, [property]);

    const handleComplementoToggle = (value: string) => {
    setAmenities(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const handleSeasonChange = (key: string) => {
    setSelectedMesesTemporada(prev =>
      prev.includes(key)
        ? prev.filter(s => s !== key)
        : [...prev, key]
    );
  };

  // Función para subir imágenes
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    setUploading(true);
    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const filePath = `property_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const { error } = await supabase.storage.from('property-images').upload(filePath, file);
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
    setUploading(false);
  };

  // Función para eliminar imágenes
  const handleRemoveImage = async (url: string) => {
    setImagePaths((prev) => prev.filter((img) => img !== url));
    const path = url.split('/property-images/')[1];
    if (path) {
      await supabase.storage.from('property-images').remove([path]);
    }
  };

  // Función para drag and drop
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !location || !precioEntresemana || !tipo || !region) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const propertyToSave: SimpleProperty = {
      ...property,
      title,
      description,
      location,
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
      lat: lat || undefined,
      lng: lng || undefined,
      amenities,
      meses_temporada: selectedMesesTemporada,
      precio_mes: precioMes ? Number(precioMes) : 0,
      alquila_temporada_completa: alquilaTemporadaCompleta,
      image_paths: imagePaths,
      url_idealista: urlIdealista,
      url_booking: urlBooking,
      url_airbnb: urlAirbnb,
      min_days: minDays,
      max_days: maxDays,
      tipo,
      region,
      destacada,
      owner_id: ownerId || undefined,
      agency_id: agencyId || undefined,
    };
    onSave(propertyToSave);
  };

  const COMPLEMENTOS = [
    { label: "Piscina", value: "Piscina", icon: "🏊" },
    { label: "Jardín", value: "Jardín", icon: "🌳" },
    { label: "Terraza", value: "Terraza", icon: "🏖️" },
    { label: "Garaje", value: "Garaje", icon: "🚗" },
    { label: "Ascensor", value: "Ascensor", icon: "🛗" },
    { label: "Aire Acondicionado", value: "Aire Acond.", icon: "❄️" },
    { label: "Vistas al mar", value: "Vistas al mar", icon: "🌊" },
    { label: "Barbacoa", value: "Barbacoa", icon: "🔥" },
    { label: "Lujo", value: "Lujo", icon: "💎" },
    { label: "Accesible", value: "Accesible", icon: "♿" },
  ];

  const TIPOS_VIVIENDA = [
    { label: "Apartamento o piso", value: "Apartamento o piso" },
    { label: "Ático", value: "Ático" },
    { label: "Bajo con jardín", value: "Bajo con jardín" },
    { label: "Chalet adosado", value: "Chalet adosado" },
    { label: "Chalet individual", value: "Chalet individual" },
  ];

  const SEASONS = [
    { key: "Septiembre a Mayo", label: "Septiembre a Mayo" },
    { key: "Octubre a Mayo", label: "Octubre a Mayo" },
    { key: "Septiembre a Junio", label: "Septiembre a Junio" },
    { key: "Octubre a Junio", label: "Octubre a Junio" },
    { key: "Septiembre a Julio", label: "Septiembre a Julio" },
    { key: "Octubre a Julio", label: "Octubre a Julio" },
  ];

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

        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Ubicación</label>
          <GooglePlacesAutocomplete
            value={location}
            onChange={setLocation}
            placeholder="Ubicación de la propiedad"
            className="w-full"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Escribe para buscar direcciones y selecciona una opción
          </p>
        </div>

        {/* Mapa de ubicación */}
        {(lat && lng) && (
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Ubicación en mapa</label>
            <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg border flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl mb-2">🗺️</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Coordenadas: {lat.toFixed(6)}, {lng.toFixed(6)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Mapa interactivo próximamente
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Tipo de vivienda</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            required
          >
            {TIPOS_VIVIENDA.map((tipoOption) => (
              <option key={tipoOption.value} value={tipoOption.value}>
                {tipoOption.label}
              </option>
            ))}
          </select>
        </div>

        {/* Campos de propietario y agencia */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <OwnerSelector
            value={ownerId}
            onChange={setOwnerId}
            placeholder="Seleccionar propietario..."
          />
          <AgencySelector
            value={agencyId}
            onChange={setAgencyId}
            placeholder="Seleccionar agencia..."
          />
        </div>

        {/* Campos de dirección que se llenan automáticamente */}
        {(streetAddress || city || state || postalCode) && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              📍 Detalles de dirección (se llenan automáticamente)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {streetAddress && (
                <div>
                  <label className="block text-xs font-medium text-blue-700 dark:text-blue-300">Dirección</label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-blue-200 dark:border-blue-700 rounded bg-white dark:bg-gray-800"
                    placeholder="Dirección de la calle"
                  />
                </div>
              )}
              {city && (
                <div>
                  <label className="block text-xs font-medium text-blue-700 dark:text-blue-300">Ciudad</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-blue-200 dark:border-blue-700 rounded bg-white dark:bg-gray-800"
                    placeholder="Ciudad"
                  />
                </div>
              )}
              {state && (
                <div>
                  <label className="block text-xs font-medium text-blue-700 dark:text-blue-300">Provincia</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-blue-200 dark:border-blue-700 rounded bg-white dark:bg-gray-800"
                    placeholder="Provincia"
                  />
                </div>
              )}
              {postalCode && (
                <div>
                  <label className="block text-xs font-medium text-blue-700 dark:text-blue-300">Código Postal</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-blue-200 dark:border-blue-700 rounded bg-white dark:bg-gray-800"
                    placeholder="Código postal"
                  />
                </div>
              )}
            </div>
            {(lat && lng) && (
              <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                📍 Coordenadas: {lat.toFixed(6)}, {lng.toFixed(6)}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Precio entre semana/día</label>
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
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Precio mensual (€)</label>
          <input
            type="number"
            value={precioMes}
            onChange={(e) => setPrecioMes(e.target.value)}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            placeholder="Ej: 1200"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Baños</label>
            <input
              type="number"
              min={1}
              value={bathrooms}
              onChange={(e) => setBathrooms(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Habitaciones</label>
            <input
              type="number"
              min={1}
              value={bedrooms}
              onChange={(e) => setBedrooms(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Aseos</label>
            <input
              type="number"
              min={1}
              value={toilets}
              onChange={(e) => setToilets(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Complementos</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {COMPLEMENTOS.map(({ label, value, icon }) => (
              <label key={value} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={amenities.includes(value)}
                  onChange={() => handleComplementoToggle(value)}
                  className="accent-primary"
                />
                <span className="text-lg">{icon}</span>
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>



        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Temporadas disponibles</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {SEASONS.map((season) => (
              <label key={season.key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedMesesTemporada.includes(season.key)}
                  onChange={() => handleSeasonChange(season.key)}
                  className="accent-primary"
                />
                {season.label}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={destacada}
              onChange={(e) => setDestacada(e.target.checked)}
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
              onChange={(e) => setAlquilaTemporadaCompleta(e.target.checked)}
              className="accent-primary"
            />
            Alquila temporada completa
          </label>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Imágenes</label>
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Arrastra y suelta imágenes aquí o haz clic para seleccionar
            </p>
            {uploading && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Subiendo imágenes...</p>}
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {imagePaths.map((url, index) => (
              <div key={url} className="relative group">
                <img src={url} alt={`Property image ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(url)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Eliminar imagen"
                >
                  ✗
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            type="submit"
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default SimplePropertyForm; 