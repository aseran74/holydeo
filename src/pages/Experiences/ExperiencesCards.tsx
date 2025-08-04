import { useState } from "react";
import ExperienceCard from "./ExperienceCard";
import { Experience } from "../../types";

interface ExperiencesCardsProps {
  experiences: Experience[];
  onEdit: (experience: Experience) => void;
  onEditForm: (experience: Experience) => void;
  onDelete: (experienceId: string) => void;
}

const ExperiencesCards: React.FC<ExperiencesCardsProps> = ({ experiences, onEdit, onEditForm, onDelete }) => {
  const [filter, setFilter] = useState("");

  const filtered = experiences.filter((exp) =>
    (exp.title && exp.title.toLowerCase().includes(filter.toLowerCase())) ||
    (exp.location && exp.location.toLowerCase().includes(filter.toLowerCase())) ||
    (exp.category && exp.category.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="p-6 pb-12">
      <h1 className="text-2xl font-bold mb-4">Experiencias (Vista tarjetas)</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por título, ubicación o categoría..."
          className="input input-bordered w-full max-w-md"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filtered.map((experience) => (
          <ExperienceCard
            key={experience.id}
            experience={experience}
            onEdit={() => onEdit(experience)}
            onEditForm={() => onEditForm(experience)}
            onDelete={() => onDelete(experience.id)}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-gray-500 text-center mt-8">No se encontraron experiencias.</div>
      )}
    </div>
  );
};

export default ExperiencesCards; 