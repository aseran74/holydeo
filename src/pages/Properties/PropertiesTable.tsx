import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useState } from "react";
import { Property } from "../../types";

interface PropertiesTableProps {
  properties: Property[];
  onEdit: (property: Property) => void;
  onDelete: (propertyId: string) => void;
}

const PropertiesTable: React.FC<PropertiesTableProps> = ({
  properties,
  onEdit,
  onDelete,
}) => {
  const [filter, setFilter] = useState("");
  const filtered = properties.filter(p =>
    p.title.toLowerCase().includes(filter.toLowerCase()) ||
    (p.location && p.location.toLowerCase().includes(filter.toLowerCase()))
  );
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-4">
        <input
          type="text"
          placeholder="Filtrar por título, dirección o código..."
          className="input input-bordered w-full max-w-xs"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow className="border-b border-gray-200">
              <TableCell isHeader className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Título</TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Dirección</TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Precio</TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {filtered.map((property) => (
              <TableRow key={property.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <TableCell className="px-6 py-3 align-middle">{property.title}</TableCell>
                <TableCell className="px-6 py-3 align-middle">{property.location}</TableCell>
                <TableCell className="px-6 py-3 align-middle">{property.price != null ? `${property.price} €` : "-"}</TableCell>
                <TableCell className="px-6 py-3 align-middle">
                  <button onClick={() => onEdit(property)} className="mr-2 text-blue-500">Edit</button>
                  <button onClick={() => onDelete(property.id)} className="text-red-500">Delete</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PropertiesTable; 