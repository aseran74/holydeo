import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Image as ImageIcon } from 'lucide-react';

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
  const [tipo, setTipo] = useState("Piso o apartamento");
  const [region, setRegion] = useState("Andalucia");
  const [destacada, setDestacada] = useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  
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
      setImagePaths(property.image_paths || []);
    }
  }, [property]);

  const handleAmenityToggle = (value: string) => {
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
      lat,
      lng,
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
    };
    onSave(propertyToSave);
  };

  const AMENITIES = [
    { label: "Piscina", value: "Piscina" },
    { label: "Jardín", value: "Jardín" },
    { label: "Terraza", value: "Terraza" },
    { label: "Garaje", value: "Garaje" },
    { label: "Ascensor", value: "Ascensor" },
    { label: "Aire Acondicionado", value: "Aire Acond." },
    { label: "Vistas al mar", value: "Vistas al mar" },
    { label: "Barbacoa", value: "Barbacoa" },
    { label: "Lujo", value: "Lujo" },
    { label: "Accesible", value: "Accesible" },
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
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            placeholder="Madrid, España"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
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
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Amenities</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {AMENITIES.map(({ label, value }) => (
              <label key={value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={amenities.includes(value)}
                  onChange={() => handleAmenityToggle(value)}
                  className="accent-primary"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Galería de fotos</label>
          <div
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition relative bg-gray-50 dark:bg-gray-700"
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
            <span className="text-gray-500 dark:text-gray-400">Subir imágenes</span>
            {uploading && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Subiendo imágenes...</p>}
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
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Precio mensual (€)</label>
          <input
            type="number"
            value={precioMes}
            onChange={(e) => setPrecioMes(e.target.value)}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            placeholder="Ej: 1200"
          />
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
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center cursor-pointer"
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