"use client";
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useSearchParams, useRouter } from 'next/navigation';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import NumberStepper from '@/components/NumberStepper';
import BlockDates from './BlockDates';
import SpecialPrices from './SpecialPrices';
import SyncIcal from './SyncIcal';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AMENITIES } from '@/data/amenities';

function ImageUploader({ value, onChange }: { value: string[], onChange: (urls: string[]) => void }) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls = [...value];

    for (const file of Array.from(files)) {
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase
        .storage
        .from('property-images')
        .upload(fileName, file);

      if (error) {
        console.error('Error subiendo imagen:', error);
        continue;
      }
      
      const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(fileName);
      if (publicUrl) {
        newUrls.push(publicUrl);
      }
    }
    onChange(newUrls);
    setUploading(false);
  };

  const handleRemoveImage = (urlToRemove: string) => {
    const newUrls = value.filter(url => url !== urlToRemove);
    onChange(newUrls);
    // Nota: esto no elimina el archivo del bucket, solo del formulario.
    // Se podría añadir la lógica para eliminar del bucket si es necesario.
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Galería de Imágenes</label>
      <div className="mt-2 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="flex text-sm text-gray-600">
            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
              <span>Sube tus archivos</span>
              <input id="file-upload" name="file-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleFileUpload} />
            </label>
            <p className="pl-1">o arrástralos aquí</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
        </div>
      </div>
      {uploading && <p className="mt-2 text-sm text-blue-600">Subiendo imágenes...</p>}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {value.map((url, index) => (
          <div key={index} className="relative">
            <img src={url} alt={`Imagen ${index + 1}`} className="h-24 w-full object-cover rounded-md" />
            <button
              type="button"
              onClick={() => handleRemoveImage(url)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapSection({ value, onLocationChange }: { value: { lat: number, lng: number } | null, onLocationChange: (location: any) => void }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  });

  const [center, setCenter] = useState(value || { lat: 40.416775, lng: -3.703790 });

  const handleSelect = async (place: any) => {
    if (!place) return;
    
    // Aquí podrías usar geocoding para obtener lat/lng si la librería no lo provee directamente
    // Pero react-google-places-autocomplete debería darte acceso a los detalles.
    // Por ahora, asumimos que obtenemos el `label` y centramos el mapa ahí (mejorable con geocoding).
    
    onLocationChange({
        address: place.label,
        // En una implementación real, aquí harías una llamada a la API de Geocoding
        // para obtener lat y lng a partir de place.value.place_id
        map: { lat: 40.416775, lng: -3.703790 } // Coordenadas de ejemplo
    });
    // setCenter(nuevasCoordenadas);
  };
  
  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Dirección con Autocompletado</label>
      <GooglePlacesAutocomplete
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        selectProps={{
            onChange: handleSelect,
            placeholder: 'Escribe una dirección...',
        }}
      />
      <div className="mt-4 h-64 w-full">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={15}
        >
          {value && <Marker position={value} />}
        </GoogleMap>
      </div>
    </div>
  );
}

const isMobileOrTablet = typeof window !== 'undefined' && window.innerWidth < 1024;

function PropertyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('id');

  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [occupiedDates, setOccupiedDates] = useState<Date[]>([]);
  const [calendarData, setCalendarData] = useState<any[]>([]);
  const [monthsShown, setMonthsShown] = useState(2);

  useEffect(() => {
    if (propertyId) {
      const fetchProperty = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single();
        
        if (error) {
          setMessage('Error cargando la propiedad: ' + error.message);
        } else {
          setFormData(data || {});
        }
        setLoading(false);
      };
      fetchProperty();
    }
  }, [propertyId]);

  useEffect(() => {
    if (!propertyId) return;
    async function fetchOccupiedDates() {
      // 1. Fechas bloqueadas
      const { data: blocked } = await supabase
        .from('blocked_dates')
        .select('date')
        .eq('property_id', propertyId);
      // 2. Reservas aprobadas
      const { data: bookings } = await supabase
        .from('bookings')
        .select('start_date, end_date')
        .eq('property_id', propertyId)
        .eq('status', 'aprobada');
      let dates: Date[] = [];
      if (blocked) {
        dates = dates.concat(blocked.map((b: any) => new Date(b.date)));
      }
      if (bookings) {
        bookings.forEach((b: any) => {
          let current = new Date(b.start_date);
          const end = new Date(b.end_date);
          while (current <= end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
        });
      }
      // Eliminar duplicados
      const unique = Array.from(new Set(dates.map(d => d.toDateString()))).map(str => new Date(str));
      setOccupiedDates(unique);
    }
    fetchOccupiedDates();
  }, [propertyId]);

  useEffect(() => {
    if (!propertyId) return;
    async function fetchCalendarData() {
      // 1. Fechas bloqueadas (manual e iCal)
      const { data: blocked } = await supabase
        .from('blocked_dates')
        .select('date, source')
        .eq('property_id', propertyId);
      // 2. Reservas aprobadas
      const { data: bookings } = await supabase
        .from('bookings')
        .select('start_date, end_date')
        .eq('property_id', propertyId)
        .eq('status', 'aprobada');
      // 3. Precios especiales
      const { data: specialPrices } = await supabase
        .from('special_prices')
        .select('date, price')
        .eq('property_id', propertyId);
      let days: any[] = [];
      // Bloqueos manuales y ical
      if (blocked) {
        blocked.forEach((b: any) => {
          days.push({
            date: b.date,
            type: b.source === 'ical_import' ? 'ical' : 'manual',
          });
        });
      }
      // Reservas aprobadas
      if (bookings) {
        bookings.forEach((b: any) => {
          let current = new Date(b.start_date);
          const end = new Date(b.end_date);
          while (current <= end) {
            days.push({
              date: current.toISOString().slice(0, 10),
              type: 'booking',
            });
            current.setDate(current.getDate() + 1);
          }
        });
      }
      // Unificar por fecha y tipo (prioridad: booking > manual > ical)
      const dayMap: Record<string, any> = {};
      days.forEach(d => {
        if (!dayMap[d.date] || d.type === 'booking') {
          dayMap[d.date] = d;
        } else if (d.type === 'manual' && dayMap[d.date].type !== 'booking') {
          dayMap[d.date] = d;
        } else if (d.type === 'ical' && !dayMap[d.date]) {
          dayMap[d.date] = d;
        }
      });
      // Añadir precios especiales
      if (specialPrices) {
        specialPrices.forEach((sp: any) => {
          if (dayMap[sp.date]) {
            dayMap[sp.date].specialPrice = sp.price;
          } else {
            dayMap[sp.date] = { date: sp.date, type: null, specialPrice: sp.price };
          }
        });
      }
      setCalendarData(Object.values(dayMap));
    }
    fetchCalendarData();
  }, [propertyId]);

  useEffect(() => {
    function handleResize() {
      setMonthsShown(window.innerWidth < 1024 ? 1 : 2);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    if (type === 'number') {
      finalValue = value === '' ? null : parseFloat(value);
    }
    if (type === 'checkbox') {
        const checkbox = e.target as HTMLInputElement;
        const currentValues = formData[name] || [];
        if (checkbox.checked) {
            finalValue = [...currentValues, value];
        } else {
            finalValue = currentValues.filter((item: string) => item !== value);
        }
    }
    setFormData((prev: any) => ({ ...prev, [name]: finalValue }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    let result;
    if (propertyId) {
      // Update
      result = await supabase
        .from('properties')
        .update(formData)
        .eq('id', propertyId);
    } else {
      // Insert
      const { data: { user } } = await supabase.auth.getUser();
      result = await supabase
        .from('properties')
        .insert([{ ...formData, user_id: user?.id }]);
    }

    if (result.error) {
      setMessage('Error guardando los datos: ' + result.error.message);
    } else {
      setMessage('¡Propiedad guardada con éxito!');
      router.push('/admin/properties');
    }
    setLoading(false);
  };
  
  const handleLocationChange = (locationData: any) => {
    setFormData((prev: any) => ({
        ...prev,
        address: locationData.address,
        map: locationData.map,
    }));
  };

  const handleNumberChange = (name: string, value: number) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const renderDayContents = (day: number, date: Date) => {
    const iso = date.toISOString().slice(0, 10);
    const info = calendarData.find(d => d.date === iso);
    let bg = '';
    if (info?.type === 'booking') bg = 'bg-red-500 text-white';
    else if (info?.type === 'manual') bg = 'bg-gray-400 text-white';
    else if (info?.type === 'ical') bg = 'bg-green-500 text-white';
    return (
      <div className={`relative w-10 h-10 flex items-center justify-center rounded-full ${bg}`}>
        <span>{day}</span>
        {info?.specialPrice && (
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs rounded-full px-1 border border-white">{info.specialPrice}€</span>
        )}
      </div>
    );
  };

  if (loading && propertyId) {
    return <div>Cargando propiedad...</div>;
  }

  const renderField = (label: string, name: string, type = 'text', options?: string[], placeholder?: string) => (
    <div key={name}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {type === 'textarea' ? (
        <textarea name={name} value={formData[name] || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      ) : type === 'select' ? (
        <select name={name} value={formData[name] || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            <option value="">Selecciona...</option>
            {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : type === 'checkbox' ? (
        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
            {options?.map(opt => (
                <label key={opt} className="flex items-center gap-2">
                    <input type="checkbox" name={name} value={opt} checked={formData[name]?.includes(opt) || false} onChange={handleChange} />
                    {opt}
                </label>
            ))}
        </div>
      ) : (
        <input type={type} name={name} value={formData[name] || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder={placeholder} />
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-8 font-poppins">
      <h1 className="text-2xl font-bold mb-6">{propertyId ? 'Editar Propiedad' : 'Crear Nueva Propiedad'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderField('Título', 'title')}
          {renderField('Zonas', 'zone', 'select', [
            'Asturias',
            'Baleares',
            'Canarias',
            'Costa Catalana',
            'Costa de levante',
            'Euskadi',
            'Galicia',
            'Marruecos',
            'Murcia',
            'Propiedades en Zonas de interior',
          ])}
        </div>
        
        {renderField('Descripción', 'description', 'textarea')}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderField('Tipo de Propiedad', 'property_type', 'select', ['Piso o apartamento', 'Bajo con jardin', 'Chalet adosado', 'Chalet individual', 'Casa rural'])}
          {renderField('Tipo de Alquiler', 'rental_form', 'select', ['alojamiento_entero', 'alquiler_habitacion'])}
        </div>
        
        <h2 className="text-xl font-semibold border-t pt-4 mt-6">Capacidad y Tamaño</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberStepper label="Huéspedes" name="guests" value={formData.guests || 0} onChange={handleNumberChange} />
          <NumberStepper label="Habitaciones" name="bedrooms" value={formData.bedrooms || 0} onChange={handleNumberChange} />
          <NumberStepper label="Camas" name="beds" value={formData.beds || 0} onChange={handleNumberChange} />
          <NumberStepper label="Baños" name="bathrooms" value={formData.bathrooms || 0} onChange={handleNumberChange} />
          {renderField('Superficie (m²)', 'acreage', 'number')}
        </div>

        <h2 className="text-xl font-semibold border-t pt-4 mt-6">Temporadas y Precios</h2>
        {renderField('Temporadas', 'seasons', 'checkbox', ['Sep a Julio', 'Sep a Junio', 'Sep a Mayo', 'Oct a Julio', 'Oct a Junio', 'Oct a Mayo'])}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderField('Precio (L-J)', 'price_weekday', 'number', undefined, '€')}
          {renderField('Precio (V-D)', 'price_weekend', 'number', undefined, '€')}
          {renderField('Precio fijo mensual', 'price_monthly', 'number', undefined, '€')}
        </div>
        
        <h2 className="text-xl font-semibold border-t pt-4 mt-6">Estancia</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderField('Mínimo de Noches', 'nights_min', 'number')}
          {renderField('Máximo de Noches', 'nights_max', 'number')}
        </div>

        <h2 className="text-xl font-semibold border-t pt-4 mt-6">Servicios</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {AMENITIES.map(amenity => (
            <label key={amenity.key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="amenities"
                value={amenity.key}
                checked={formData.amenities?.includes(amenity.key) || false}
                onChange={handleChange}
                className="checkbox"
              />
              {amenity.icon && <i className={`text-xl las ${amenity.icon}`}></i>}
              <span>{amenity.label}</span>
            </label>
          ))}
        </div>

        <h2 className="text-xl font-semibold border-t pt-4 mt-6">Galería</h2>
        <ImageUploader value={formData.gallery || []} onChange={(urls) => handleChange({ target: { name: 'gallery', value: urls, type: 'custom' } } as any)} />

        <h2 className="text-xl font-semibold border-t pt-4 mt-6">Localización</h2>
        <MapSection value={formData.map} onLocationChange={handleLocationChange} />

        <div className="border-t pt-6">
            <div 
                onClick={() => setIsCalendarModalOpen(true)}
                className="group flex flex-col md:flex-row items-center justify-between p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <CalendarDaysIcon className="w-12 h-12 text-gray-400 group-hover:text-primary transition-colors" />
                    <div>
                        <h3 className="text-lg font-bold">Gestionar Calendario y Precios</h3>
                        <p className="text-sm text-gray-500">Bloquea fechas, define precios especiales y sincroniza con iCal.</p>
                    </div>
                </div>
                <button
                    type="button"
                    className="btn btn-primary mt-4 md:mt-0"
                >
                    Abrir Gestor
                </button>
            </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 bg-gray-200 rounded-md">Cancelar</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-300">
            {loading ? 'Guardando...' : 'Guardar Propiedad'}
          </button>
        </div>
        {message && <p className="mt-4 text-center">{message}</p>}
      </form>

      {/* Modal de Gestión de Calendario */}
      {isCalendarModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col font-poppins">
                  <div className="p-4 border-b flex justify-between items-center bg-blue-600 text-white rounded-t-lg">
                      <h2 className="text-xl font-bold">Gestión de Calendario y Precios</h2>
                      <button onClick={() => setIsCalendarModalOpen(false)} className="btn btn-sm btn-circle btn-ghost">✕</button>
                  </div>
                  <div className="p-4 overflow-y-auto flex-1 space-y-8">
                      <BlockDates propertyId={propertyId} />
                      <SpecialPrices propertyId={propertyId} />
                      <SyncIcal propertyId={propertyId} />
                  </div>
              </div>
          </div>
      )}

      {/* Calendario de disponibilidad solo lectura */}
      {propertyId && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Disponibilidad (vista solo lectura)</h2>
          <div className="font-poppins rounded-xl overflow-hidden border bg-white w-full">
            <DatePicker
              inline
              selected={null}
              monthsShown={monthsShown}
              calendarClassName={monthsShown === 1 ? 'flex flex-col gap-4 w-full' : 'flex flex-row gap-4 w-full'}
              renderDayContents={renderDayContents}
              disabledKeyboardNavigation
              onChange={() => {}}
            />
          </div>
          <div className="flex gap-4 mt-4">
            <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-red-500 inline-block"></span> Reserva huésped</span>
            <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-gray-400 inline-block"></span> Bloqueo manual</span>
            <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-green-500 inline-block"></span> Bloqueo iCal</span>
            <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-yellow-400 inline-block border border-white"></span> Precio especial</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Suspense Boundary para useSearchParams
export default function PropertyFormPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <PropertyForm />
        </Suspense>
    );
} 