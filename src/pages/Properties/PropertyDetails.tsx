import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { BedDouble, Bath, Users, MapPin, ArrowLeft, CheckCircle2, Star, Wifi, ParkingSquare, Snowflake, UtensilsCrossed, Building, CalendarDays } from "lucide-react";
import { DayPicker, DateRange, Modifiers } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import ReviewsList from '../../components/reviews/ReviewsList';
import ReviewForm from '../../components/reviews/ReviewForm';

// Mapeo de amenities a iconos para una mejor visualización
const amenityIcons: { [key: string]: React.ReactElement } = {
    "Piscina": <Star size={18} className="text-indigo-500" />,
    "Wi-Fi": <Wifi size={18} className="text-indigo-500" />,
    "Aire Acond.": <Snowflake size={18} className="text-indigo-500" />,
    "Cocina": <UtensilsCrossed size={18} className="text-indigo-500" />,
    "Garaje": <ParkingSquare size={18} className="text-indigo-500" />,
    "Vistas al mar": <Star size={18} className="text-indigo-500" />,
};

type BlockedDateInfo = {
    date: Date;
    type: 'booking' | 'manual' | 'ical' | 'special_price';
};

// Componente de Carga Mejorado
const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-slate-50 dark:bg-slate-900 text-slate-500">
        <svg className="animate-spin h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-xl font-medium tracking-wide">Cargando propiedad...</p>
    </div>
);

// Componente de Error Mejorado
const NotFound = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-slate-50 dark:bg-slate-900 text-center p-4">
        <MapPin size={52} className="text-red-500 mb-4" />
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Propiedad no encontrada</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-md">Lo sentimos, no hemos podido encontrar los detalles de la propiedad que buscas. Es posible que haya sido eliminada o la dirección no sea correcta.</p>
        <Link 
            to="/propiedades"
            className="mt-8 inline-flex items-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg"
        >
            <ArrowLeft size={20} />
            Volver a la búsqueda
        </Link>
    </div>
);

const PropertyDetails = () => {
  const { id } = useParams();
    const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState<string>("");
    const [blockedDates, setBlockedDates] = useState<BlockedDateInfo[]>([]);
    const [bookingRange, setBookingRange] = useState<DateRange | undefined>();
    const [isBooking, setIsBooking] = useState(false);
    const [reviews, setReviews] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [guestsList, setGuestsList] = useState<any[]>([]);
    const [selectedGuestId, setSelectedGuestId] = useState<string>('');
    const [isFullSeason, setIsFullSeason] = useState(false);

    const numberOfNights = bookingRange?.from && bookingRange?.to ? Math.round((bookingRange.to.getTime() - bookingRange.from.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (id) {
                await fetchPropertyAndBlockedDates(user);
            } else {
                setLoading(false);
            }
        };

        fetchInitialData();
  }, [id]);

    useEffect(() => {
        if (numberOfNights <= 30) {
            setIsFullSeason(false);
        }
    }, [numberOfNights]);

    const fetchPropertyAndBlockedDates = async (currentUser: any) => {
    setLoading(true);
        // 1. Fetch property details
        const { data: propertyData, error: propertyError } = await supabase
            .from("properties")
            .select("*")
            .eq("id", id)
            .single();
        
        if (propertyError) {
            console.error("fetchProperty: Error al obtener la propiedad:", propertyError);
            setProperty(null);
        } else if (propertyData) {
            setProperty(propertyData);
            if (propertyData.gallery && propertyData.gallery.length > 0) {
                setMainImage(propertyData.gallery[0]);
            }
        }

        // 2. Fetch bookings, manual blocks, and special prices
        const { data: bookingsData, error: bookingsError } = await supabase
            .from('bookings').select('start_date, end_date').eq('property_id', id).eq('status', 'confirmada');
        const { data: manualBlocks, error: manualBlocksError } = await supabase
            .from('blocked_dates').select('date, source').eq('property_id', id);
        const { data: specialPrices, error: specialPricesError } = await supabase
            .from('special_prices').select('date').eq('property_id', id);

        if (bookingsError || manualBlocksError || specialPricesError) {
            console.error("Error fetching blocked dates:", bookingsError || manualBlocksError || specialPricesError);
        } else {
            const bookingDates: BlockedDateInfo[] = (bookingsData || []).flatMap(d => {
                const dates: BlockedDateInfo[] = [];
                let currentDate = new Date(d.start_date + 'T00:00:00Z');
                const endDate = new Date(d.end_date + 'T00:00:00Z');
                while(currentDate <= endDate) {
                    dates.push({ date: new Date(currentDate), type: 'booking' });
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                return dates;
            });

            const manualBlockDates: BlockedDateInfo[] = (manualBlocks || []).map(d => ({
                date: new Date(d.date + 'T00:00:00Z'),
                type: d.source === 'ical' ? 'ical' : 'manual'
            }));

            const specialPriceDates: BlockedDateInfo[] = (specialPrices || []).map(d => ({
                date: new Date(d.date + 'T00:00:00Z'),
                type: 'special_price'
            }));
            
            const allBlockedInfo = [...bookingDates, ...manualBlockDates, ...specialPriceDates];

            const uniqueDates = Array.from(
                allBlockedInfo.reduce((map, info) => {
                    const time = info.date.getTime();
                    const priority = { booking: 4, manual: 3, ical: 2, special_price: 1 };
                    if (!map.has(time) || priority[info.type] > priority[map.get(time)!.type]) {
                        map.set(time, info);
                    }
                    return map;
                }, new Map<number, BlockedDateInfo>()).values()
            ).sort((a,b) => a.date.getTime() - b.date.getTime());

            setBlockedDates(uniqueDates);
        }

        // 3. Fetch reviews
        await fetchReviews();

        // 4. Fetch guests for admin booking dropdown
        if (currentUser) {
            const { data: guestsData, error: guestsError } = await supabase
                .from('clients').select('id, name').order('name', { ascending: true });

            if (guestsError) console.error("ADMIN LOG: Error de Supabase al cargar huéspedes:", guestsError);
            else if (guestsData) setGuestsList(guestsData);
        }

    setLoading(false);
  };

    const fetchReviews = async () => {
        const { data, error } = await supabase.from('reviews').select('*').eq('property_id', id).order('created_at', { ascending: false });
        if (error) console.error("Error fetching reviews:", error);
        else if (data) setReviews(data);
    };

    const handleBooking = async () => {
        if (!user) {
            toast.error("Necesitas iniciar sesión para poder reservar.");
            navigate('/signin');
            return;
        }

        if (user && !selectedGuestId) {
            toast.error("Por favor, selecciona un huésped para la reserva.");
            return;
        }

        if (!bookingRange?.from || !bookingRange?.to) {
            toast.error("Por favor, selecciona un rango de fechas.");
            return;
        }

        const blockedDatesSet = new Set(blockedDates.map(d => d.date.toISOString().split('T')[0]));
        let currentDate = new Date(bookingRange.from);
        while (currentDate <= bookingRange.to) {
            if (blockedDatesSet.has(currentDate.toISOString().split('T')[0])) {
                toast.error('El rango seleccionado incluye días no disponibles.');
                return;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        const numberOfNights = Math.round((bookingRange.to.getTime() - bookingRange.from.getTime()) / (1000 * 60 * 60 * 24));
        const totalCost = property.price && numberOfNights > 0 ? parseFloat(property.price) * numberOfNights : 0;

        setIsBooking(true);
        const { error } = await supabase.from('bookings').insert({
            property_id: id,
            client_id: selectedGuestId,
            start_date: bookingRange.from.toISOString().split('T')[0],
            end_date: bookingRange.to.toISOString().split('T')[0],
            status: 'confirmada',
            total_price: totalCost,
            is_full_season: isFullSeason,
        });

        if (error) {
            console.error("Error al crear la reserva:", error);
            toast.error("Hubo un error al intentar realizar la reserva.");
        } else {
            toast.success("¡Reserva realizada con éxito!");
            fetchPropertyAndBlockedDates(user);
            setBookingRange(undefined);
            setSelectedGuestId('');
            setIsFullSeason(false);
        }
        setIsBooking(false);
    };

    const handleDayClick = (day: Date, modifiers: Modifiers) => {
        if (modifiers.disabled) {
            toast.error('Esta fecha no está disponible.');
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!property) return <NotFound />;

    // Desestructuración de los datos de la propiedad
    const { gallery, property_type, address, title, bedrooms, guests, bathrooms, price, description, amenities, rating, reviews: propertyReviews, monthly_price, seasons } = property;
    const totalCost = price && numberOfNights > 0 ? parseFloat(price) * numberOfNights : 0;
    
    // NUEVO ESTILO PARA EL CALENDARIO
    const dayModifiers = {
        disabled: blockedDates.map(info => info.date),
        booking: blockedDates.filter(info => info.type === 'booking').map(info => info.date),
        manual: blockedDates.filter(info => info.type === 'manual').map(info => info.date),
        ical: blockedDates.filter(info => info.type === 'ical').map(info => info.date),
    };

    const dayModifiersClassNames = {
        selected: '!bg-indigo-600 !text-white',
        range_start: '!bg-indigo-600 !text-white rounded-l-full',
        range_end: '!bg-indigo-600 !text-white rounded-r-full',
        range_middle: '!bg-indigo-100 !text-indigo-800 dark:!bg-indigo-900/50 dark:!text-slate-100',
        today: '!text-indigo-600 dark:!text-indigo-400 !font-bold',
        disabled: '!text-slate-400 dark:!text-slate-600 cursor-not-allowed line-through',
        booking: '!bg-blue-200 dark:!bg-blue-900/60 !text-blue-800 dark:!text-blue-200 !cursor-not-allowed',
        manual: '!bg-red-200 dark:!bg-red-900/60 !text-red-800 dark:!text-red-200 !cursor-not-allowed',
        ical: '!bg-yellow-200 dark:!bg-yellow-900/60 !text-yellow-800 dark:!text-yellow-200 !cursor-not-allowed',
    };

  return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pt-24 md:pt-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* SECCIÓN DE TÍTULO Y UBICACIÓN MEJORADA */}
      <div className="mb-6">
                    <Link to="/propiedades" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Volver a la búsqueda
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-4">{title}</h1>
                    <div className="flex flex-wrap items-center text-slate-600 dark:text-slate-400 mt-2 gap-x-6 gap-y-2">
                        <div className="flex items-center gap-2">
                            <Star size={16} className="text-yellow-500 fill-current" />
                            <span className="font-bold text-slate-800 dark:text-white">{rating || 'Nuevo'}</span>
                            <a href="#reviews" className="underline hover:text-indigo-500">({propertyReviews?.length || 0} reseñas)</a>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span>{address}</span>
                        </div>
                    </div>
                </div>

                {/* --- GALERÍA DE IMÁGENES REDISEÑADA Y RESPONSIVA --- */}
                <div className="mb-8">
                    {/* Vista para Móvil: Imagen principal + scroll de thumbnails */}
                    <div className="sm:hidden">
                        <div className="w-full h-80 rounded-xl overflow-hidden shadow-lg mb-2">
                            <img 
                                src={mainImage || 'https://via.placeholder.com/800x600?text=No+Image'} 
                                alt={title} 
                                className="w-full h-full object-cover" 
                            />
        </div>
                        {gallery && gallery.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {gallery.map((img: string, idx: number) => (
                                    <img 
                                        key={idx} 
                                        src={img} 
                                        alt={`thumbnail ${idx + 1}`}
                                        onClick={() => setMainImage(img)}
                                        className={`flex-shrink-0 w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${mainImage === img ? 'border-indigo-500' : 'border-transparent'}`} 
                                    />
              ))}
            </div>
          )}
        </div>
                    
                    {/* Vista para Desktop: Grid estilo Airbnb */}
                    <div className="hidden sm:grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-96 shadow-lg">
                        <div className="col-span-2 row-span-2">
                            <img 
                                src={mainImage || 'https://via.placeholder.com/800x600?text=No+Image'} 
                                alt={title} 
                                className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                onClick={() => gallery && gallery.length > 0 && setMainImage(gallery[0])}
                            />
                        </div>
                        {gallery && gallery.slice(1, 5).map((img: string, idx: number) => (
                            <div key={idx} className="w-full h-full">
                                <img 
                                    src={img} 
                                    alt={`thumbnail ${idx + 1}`} 
                                    onClick={() => setMainImage(img)} 
                                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity" 
                                />
                            </div>
                        ))}
                    </div>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* --- CONTENIDO PRINCIPAL --- */}
                    <div className="lg:col-span-2">
                        <div className="pb-6">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{property_type} en {address?.split(',')[0]}</h2>
                            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4 text-slate-700 dark:text-slate-300">
                                <span className="flex items-center gap-2 text-lg"><Users size={20} /> {guests || 'N/A'} huéspedes</span>
                                <span className="flex items-center gap-2 text-lg"><BedDouble size={20} /> {bedrooms || 'N/A'} hab.</span>
                                <span className="flex items-center gap-2 text-lg"><Bath size={20} /> {bathrooms || 'N/A'} baños</span>
                            </div>
                        </div>

                        <hr className="my-6 dark:border-slate-700"/>

                        <div className="py-6">
                            <h3 className="font-bold text-xl mb-3 text-slate-800 dark:text-white">Sobre esta propiedad</h3>
                            <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">{description || 'No hay descripción disponible.'}</p>
                        </div>
                        
                        <hr className="my-6 dark:border-slate-700"/>

                        <div className="py-6">
                             <h3 className="font-bold text-xl mb-4 text-slate-800 dark:text-white">Servicios que ofrecemos</h3>
                             <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-slate-700 dark:text-slate-300">
                                 {amenities && amenities.length > 0 ? amenities.map((item: string, i: number) => (
                                     <li key={i} className="flex items-center gap-4">
                                         {amenityIcons[item] || <CheckCircle2 size={18} className="text-green-500" />}
                                         <span className="text-base">{item}</span>
                                     </li>
                                 )) : <li className="text-slate-500 col-span-2">No hay servicios especificados para esta propiedad.</li>}
                             </ul>
                        </div>
                        
                        {/* SECCIÓN DE TEMPORADAS MEJORADA */}
                        {seasons && seasons.length > 0 && monthly_price && (
                             <div className="py-6 mt-6">
                                <hr className="my-6 dark:border-slate-700"/>
                                <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-3"><CalendarDays/> Disponibilidad por Temporada Larga</h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-4">Esta propiedad está disponible para alquileres de larga estancia durante los siguientes periodos:</p>
                                    <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
                                        {seasons.map((seasonKey: string) => {
                                             const seasonLabels: { [key: string]: string } = {
                                                  "sep_may": "Septiembre a Mayo", "sep_jun": "Septiembre a Junio", "sep_jul": "Septiembre a Julio",
                                                  "oct_may": "Octubre a Mayo", "oct_jun": "Octubre a Junio", "oct_jul": "Octubre a Julio",
                                             };
                                             return (
                                                <li key={seasonKey} className="flex items-center gap-3">
                                                    <CheckCircle2 size={16} className="text-indigo-500"/>
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">{seasonLabels[seasonKey] || seasonKey}</span>
                                                </li>
                                             );
                                        })}
                                    </ul>
                                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                         <span className="font-semibold text-slate-800 dark:text-white text-lg">Precio Mensual</span>
                                         <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{monthly_price.toLocaleString()}€</span>
                                    </div>
                                </div>
                             </div>
                        )}
                        
                        <hr id="reviews" className="my-8 dark:border-slate-700"/>

                        {/* SECCIÓN DE RESEÑAS */}
                        <div className="py-6">
                            <h3 className="font-bold text-xl mb-4 text-slate-800 dark:text-white">Reseñas de huéspedes</h3>
                            <ReviewsList reviews={reviews} />
                            <div className="mt-10">
                                <ReviewForm propertyId={id!} onReviewAdded={fetchReviews} />
                            </div>
                        </div>
                    </div>

                    {/* SIDEBAR DE RESERVA REDISEÑADO */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-28 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
                            <div className="flex items-baseline mb-4">
                                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{price}€</span>
                                <span className="ml-1.5 text-lg text-slate-600 dark:text-slate-400">/ noche</span>
                            </div>
                            
                            <div className="flex justify-center border-t border-b dark:border-slate-700 py-4 my-4">
                                <DayPicker
                                    locale={es}
                                    mode="range"
                                    selected={bookingRange}
                                    onSelect={setBookingRange}
                                    onDayClick={handleDayClick}
                                    modifiers={dayModifiers}
                                    modifiersClassNames={dayModifiersClassNames}
                                    numberOfMonths={1}
                                    className="w-full"
                                />
                            </div>

                            {user && (
          <div className="mb-4">
                                    <label htmlFor="guest-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Asignar a huésped</label>
                                    <select
                                        id="guest-select"
                                        value={selectedGuestId}
                                        onChange={(e) => setSelectedGuestId(e.target.value)}
                                        className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    >
                                        <option value="" disabled>-- Elige un huésped --</option>
                                        {guestsList.map((guest) => (
                                            <option key={guest.id} value={guest.id}>{guest.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {numberOfNights > 30 && (
                                <div className="my-4 p-3 bg-indigo-50 dark:bg-slate-700 rounded-lg flex items-center">
                                    <input
                                        type="checkbox"
                                        id="full-season-checkbox"
                                        checked={isFullSeason}
                                        onChange={(e) => setIsFullSeason(e.target.checked)}
                                        className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                    />
                                    <label htmlFor="full-season-checkbox" className="ml-3 block text-sm text-slate-800 dark:text-slate-200">
                                        Marcar como reserva de temporada completa.
                                    </label>
                                </div>
                            )}

                            {bookingRange?.from && bookingRange?.to && numberOfNights > 0 && (
                                <div className="mt-5 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600 dark:text-slate-300 underline underline-offset-2 decoration-dotted">{price}€ x {numberOfNights} noches</span>
                                        <span className="font-semibold text-slate-800 dark:text-white">{totalCost.toLocaleString()}€</span>
                                    </div>
                                    <div className="flex justify-between items-center font-bold text-lg border-t pt-3 border-slate-300 dark:border-slate-600">
                                        <span className="text-slate-900 dark:text-white">Total a pagar</span>
                                        <span className="text-slate-900 dark:text-white">{totalCost.toLocaleString()}€</span>
            </div>
          </div>
        )}

                            <button 
                                onClick={handleBooking}
                                disabled={!bookingRange?.from || !bookingRange?.to || numberOfNights === 0 || isBooking}
                                className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                {isBooking ? 'Procesando reserva...' : (user ? 'Reservar ahora' : 'Iniciar sesión para reservar')}
        </button>
                            {!bookingRange?.from && (
                                 <p className="text-xs text-center text-slate-500 mt-3">Selecciona tus fechas para continuar</p>
                            )}
                        </div>
                    </aside>
      </div>
            </div>
             <div className="h-16"></div> {/* Espaciador al final */}
    </div>
  );
};

export default PropertyDetails; 