import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const ExperienceDebug = () => {
  const [allExperiences, setAllExperiences] = useState<any[]>([]);
  const [featuredExperiences, setFeaturedExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener todas las experiencias
        const { data: allData, error: allError } = await supabase
          .from('experiences')
          .select('*');

        if (allError) {
          console.error('Error fetching all experiences:', allError);
        } else {
          console.log('All experiences:', allData);
          setAllExperiences(allData || []);
        }

        // Obtener experiencias destacadas
        const { data: featuredData, error: featuredError } = await supabase
          .from('experiences')
          .select('*')
          .eq('featured', true);

        if (featuredError) {
          console.error('Error fetching featured experiences:', featuredError);
        } else {
          console.log('Featured experiences:', featuredData);
          setFeaturedExperiences(featuredData || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Debug de Experiencias</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Todas las Experiencias ({allExperiences.length})</h2>
          <div className="space-y-4">
            {allExperiences.map((exp, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold">{exp.name || 'Sin nombre'}</h3>
                <p>ID: {exp.id}</p>
                <p>Precio: {exp.price || 'No especificado'}</p>
                <p>Destacada: {exp.featured ? 'SÍ' : 'NO'}</p>
                <p>Ubicación: {exp.location || 'No especificada'}</p>
                <p>Fotos: {exp.photos ? exp.photos.length : 0}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Experiencias Destacadas ({featuredExperiences.length})</h2>
          <div className="space-y-4">
            {featuredExperiences.map((exp, index) => (
              <div key={index} className="bg-green-100 p-4 rounded-lg shadow border border-green-300">
                <h3 className="font-semibold text-green-800">{exp.name || 'Sin nombre'}</h3>
                <p className="text-green-700">ID: {exp.id}</p>
                <p className="text-green-700">Precio: {exp.price || 'No especificado'}</p>
                <p className="text-green-700">Destacada: {exp.featured ? 'SÍ' : 'NO'}</p>
                <p className="text-green-700">Ubicación: {exp.location || 'No especificada'}</p>
                <p className="text-green-700">Fotos: {exp.photos ? exp.photos.length : 0}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {featuredExperiences.length === 0 && (
        <div className="mt-8 bg-yellow-100 p-4 rounded-lg border border-yellow-300">
          <h3 className="text-lg font-semibold text-yellow-800">⚠️ No hay experiencias destacadas</h3>
          <p className="text-yellow-700">
            Para que se muestren los precios con fondo verde, necesitas tener experiencias con el campo 
            <code className="bg-yellow-200 px-2 py-1 rounded">featured: true</code> en la base de datos.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExperienceDebug;
