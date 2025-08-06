import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import PageBreadCrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import { Experience } from '../../types';

const ExperiencesSimple = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExperiences = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('experiences').select('*');
    if (error) {
      console.error('Error fetching experiences:', error);
    } else {
      setExperiences(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  return (
    <div>
      <PageMeta title="Experiencias" description="Gestión de experiencias turísticas" />
      <PageBreadCrumb pageTitle="Experiencias" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mt-4">
          <h1 className="text-2xl font-bold mb-4">Experiencias (Versión Simple)</h1>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2">Cargando experiencias...</span>
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No se encontraron experiencias</p>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {experiences.map((exp) => (
                      <tr key={exp.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{exp.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{exp.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{exp.price ? `${exp.price}€` : 'No especificado'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperiencesSimple; 