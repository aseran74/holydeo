import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { supabase } from "../../supabaseClient";
import PropertiesTable from "./PropertiesTable";
import PropertiesCards from "./PropertiesCards";
import SimplePropertyForm from "../../components/SimplePropertyForm";
import { ListIcon, GridIcon } from "../../icons";

const Properties = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    console.log("Fetching properties...");
    const { data, error } = await supabase.from("properties").select("*");
    if (error) {
      console.error("Error fetching properties:", error);
    } else {
      console.log("Properties fetched:", data);
      setProperties(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (property: any) => {
    setEditingProperty(property);
    setShowForm(true);
  };

  const handleDelete = async (propertyId: string) => {
    const { error } = await supabase.from("properties").delete().eq("id", propertyId);
    if (error) {
      console.error("Error deleting property:", error);
    } else {
      fetchProperties();
    }
  };

  const handleSave = async (property: any) => {
    const updateData = {
      ...property,
      owner_id: property.owner_id || null,
      agency_id: property.agency_id || null,
    };
    if (property.id) {
      // Update
      const { error } = await supabase.from("properties").update(updateData).eq("id", property.id);
      if (error) console.error("Error updating property:", error);
    } else {
      // Create
      const { error } = await supabase.from("properties").insert(updateData);
      if (error) console.error("Error creating property:", error);
    }
    fetchProperties();
    setShowForm(false);
    setEditingProperty(null);
  };

  return (
    <div>
      <PageMeta title="Propiedades" description="Gestión de propiedades inmobiliarias" />
      <PageBreadcrumb pageTitle="Propiedades" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mt-4">
          {showForm ? (
            <SimplePropertyForm
              property={editingProperty}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingProperty(null);
              }}
            />
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                  >
                    Añadir Propiedad
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {loading ? "Cargando..." : `${properties.length} propiedades encontradas`}
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
                  <span className="ml-2">Cargando propiedades...</span>
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No se encontraron propiedades</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  >
                    Crear primera propiedad
                  </button>
                </div>
              ) : viewMode === "list" ? (
                <PropertiesTable
                  properties={properties}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ) : (
                <PropertiesCards
                  properties={properties}
                  onEdit={handleEdit}
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

export default Properties; 