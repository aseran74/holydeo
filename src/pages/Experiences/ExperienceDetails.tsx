import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { Calendar as CalendarIcon, Tag, Euro, Check, X, Info } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import PageBreadCrumb from '../../components/common/PageBreadCrumb';

const ExperienceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [experience, setExperience] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
        if (data.photos && data.photos.length > 0) {
          setSelectedImage(data.photos[0]);
        }
      }
      setLoading(false);
    };

    fetchExperience();
  }, [id]);
  
  // Lógica para el calendario de disponibilidad
  const disabledDays = experience?.recurring_dates?.type === 'specific'
    ? experience.recurring_dates.dates.map((d:string) => new Date(d))
    : [];
    
  const weeklyDays = experience?.recurring_dates?.type === 'weekly' 
    ? experience.recurring_dates.days.map((d:number) => (d + 1) % 7) // Ajustar de lunes=0 a domingo=0
    : [];

  const modifiers = {
    available: weeklyDays.length > 0 ? { dayOfWeek: weeklyDays } : [],
    booked: disabledDays,
  };

  const modifiersStyles = {
    available: {
      color: 'white',
      backgroundColor: '#3B82F6',
    },
    booked: {
      color: 'white',
      backgroundColor: '#EF4444',
      textDecoration: 'line-through',
    },
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Cargando detalles de la experiencia...</p></div>;
  }

  if (!experience) {
    return <div className="flex justify-center items-center h-screen"><p>Experiencia no encontrada.</p></div>;
  }

  const mainImage = selectedImage || (experience.photos && experience.photos.length > 0 ? experience.photos[0] : '/public/images/cards/card-02.jpg');

  return (
    <div className="container mx-auto p-4 md:p-6 2xl:p-10">
      <PageBreadCrumb
        pageName={experience.name}
        parentPage="Experiencias"
        parentPath="/archivo"
      />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Galería y Descripción */}
        <div className="lg:col-span-2">
          {/* Galería de Imágenes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="h-96 mb-4 rounded-lg overflow-hidden">
                <img src={mainImage} alt={experience.name} className="w-full h-full object-cover"/>
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              {experience.photos?.map((photo: string, index: number) => (
                <button key={index} onClick={() => setSelectedImage(photo)} className={`w-24 h-24 rounded-md overflow-hidden border-2 ${selectedImage === photo ? 'border-blue-500' : 'border-transparent'}`}>
                  <img src={photo} alt={`${experience.name} ${index + 1}`} className="w-full h-full object-cover"/>
                </button>
              ))}
            </div>
          </div>
          
          {/* Descripción y Detalles */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{experience.name}</h1>
            <p className="text-md text-primary font-semibold mb-4 flex items-center">
              <Tag className="w-5 h-5 mr-2" />{experience.category}
            </p>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{experience.description}</p>
          </div>

           {/* Qué entra / Qué se necesita */}
           <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white"><Check className="mr-2 text-green-500"/>¿Qué entra?</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    {experience.what_is_included?.split('\\n').map((item:string, i:number) => item.trim() && <li key={i}>{item.trim()}</li>)}
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white"><Info className="mr-2 text-yellow-500"/>¿Qué se necesita?</h3>
                 <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    {experience.what_is_needed?.split('\\n').map((item:string, i:number) => item.trim() && <li key={i}>{item.trim()}</li>)}
                </ul>
              </div>
           </div>
        </div>

        {/* Columna Derecha: Precio y Calendario */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Precio</h2>
              <span className="text-3xl font-bold text-primary flex items-center">
                <Euro className="w-7 h-7 mr-1"/>{experience.price}
              </span>
            </div>
            
            <div className="mt-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center"><CalendarIcon className="mr-2"/>Disponibilidad</h3>
                <DayPicker
                  mode="multiple"
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                  className="rounded-md"
                />
                 <div className="mt-4 flex flex-col gap-2 text-sm">
                    <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-blue-500 mr-2"></span>Disponible</div>
                    <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-red-400 mr-2"></span>No disponible / Reservado</div>
                 </div>
            </div>
            
            <button className="mt-6 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
              Reservar ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetails; 