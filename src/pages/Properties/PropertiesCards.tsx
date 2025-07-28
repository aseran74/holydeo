import { useState } from "react";
import PropertyCard from "./PropertyCard";

interface Property {
  id: string;
  title: string;
  location: string;
  price?: number;
  property_code?: string;
  main_image_path?: string | null;
  image_paths?: string[] | null;
  precio_entresemana?: number;
  bedrooms?: number;
  bathrooms?: number;
  toilets?: number;
  square_meters?: number;
  destacada?: boolean;
  // Campos adicionales que pueden estar presentes
  description?: string;
  amenities?: string[] | null;
  precio_mes?: number;
  precio_dia?: number;
  precio_fin_de_semana?: number;
  tipo?: string;
  region?: string;
}

interface PropertiesCardsProps {
  properties: Property[];
  onEdit: (property: Property) => void;
  onDelete: (propertyId: string) => void;
}

const PropertiesCards: React.FC<PropertiesCardsProps> = ({ properties, onEdit, onDelete }) => {
  const [filter, setFilter] = useState("");

  const filtered = properties.filter((p) =>
    p.title.toLowerCase().includes(filter.toLowerCase()) ||
    (p.location && p.location.toLowerCase().includes(filter.toLowerCase())) ||
    (p.property_code && p.property_code.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="p-6 pb-12">
      <h1 className="text-2xl font-bold mb-4">Propiedades (Vista tarjetas)</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por título, dirección o código..."
          className="input input-bordered w-full max-w-md"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filtered.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onEdit={() => onEdit(property)}
            onDelete={() => onDelete(property.id)}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-gray-500 text-center mt-8">No se encontraron propiedades.</div>
      )}
    </div>
  );
};

export default PropertiesCards; 