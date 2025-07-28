import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import PageBreadCrumb from '../../components/common/PageBreadCrumb';
import Button from '../../components/ui/button/Button';
import { PlusIcon } from '../../icons';
import ExperienceModal from '../../components/experiences/ExperienceModal';
import { Experience } from '../../types';

const Experiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

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

  const handleOpenModal = (experience: Experience | null = null) => {
    setSelectedExperience(experience);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExperience(null);
  };

  const handleSuccess = () => {
    fetchExperiences();
    handleCloseModal();
  };

  return (
    <div className="p-4">
      <PageBreadCrumb
        crumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Experiencias' }]}
      />

      <div className="flex justify-end mb-4">
        <Button onClick={() => handleOpenModal()}>
          <PlusIcon className="w-5 h-5 mr-2" />
          Añadir Experiencia
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        {loading ? (
          <p>Cargando experiencias...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {experiences.map((exp) => (
                  <tr key={exp.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{exp.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{exp.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{exp.price ? `${exp.price}€` : 'No especificado'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button variant="outline" size="sm" onClick={() => handleOpenModal(exp)}>
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ExperienceModal
          experience={selectedExperience}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default Experiences; 