import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import PageBreadCrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';

import { ListIcon, GridIcon } from '../../icons';
import ExperienceModal from '../../components/experiences/ExperienceModal';
import ExperiencesCards from './ExperiencesCards';
import { Experience } from '../../types';
import Button from '../../components/ui/button/Button';

const Experiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  const handleEdit = (experience: Experience) => {
    setSelectedExperience(experience);
    setIsModalOpen(true);
  };

  const handleEditForm = (experience: Experience) => {
    window.location.href = `/experiences/edit/${experience.id}`;
  };

  const handleDelete = async (experienceId: string) => {
    const { error } = await supabase.from("experiences").delete().eq("id", experienceId);
    if (error) {
      console.error("Error deleting experience:", error);
    } else {
      fetchExperiences();
    }
  };

  return (
    <div>
      <PageMeta title="Experiencias" description="Gestión de experiencias turísticas" />
      <PageBreadCrumb pageTitle="Experiencias" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mt-4">
          {isModalOpen ? (
            <ExperienceModal
              experience={selectedExperience}
              onClose={handleCloseModal}
              onSuccess={handleSuccess}
            />
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleOpenModal()}
                    className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                  >
                    Añadir Experiencia (Modal)
                  </button>
                  <button
                    onClick={() => window.location.href = '/experiences/new'}
                    className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
                  >
                    Nueva Experiencia (Formulario)
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {loading ? "Cargando..." : `${experiences.length} experiencias encontradas`}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    <ListIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    <GridIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-2">Cargando experiencias...</span>
                </div>
              ) : experiences.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No se encontraron experiencias</p>
                  <button
                    onClick={() => handleOpenModal()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  >
                    Crear primera experiencia
                  </button>
                </div>
              ) : viewMode === "list" ? (
                <div className="bg-white p-4 rounded-lg shadow">
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
                            <td className="px-6 py-4 whitespace-nowrap">{exp.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{exp.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{exp.price ? `${exp.price}€` : 'No especificado'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline" size="sm" onClick={() => handleEdit(exp)}>
                                  Editar (Modal)
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleEditForm(exp)}>
                                  Editar (Form)
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <ExperiencesCards
                  experiences={experiences}
                  onEdit={handleEdit}
                  onEditForm={handleEditForm}
                  onDelete={handleDelete}
                />
              )}
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default Experiences; 