"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import Link from "next/link";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select("id, title, created_at, user_id");
      setProperties(data || []);
      setLoading(false);
    }
    fetchProperties();
  }, []);

  const navItems = [
    { label: "Todas las propiedades", href: "/admin/properties" },
    { label: "Todas las experiencias", href: "/admin/experiences" },
    { label: "Usuarios", href: "/admin/users" },
    { label: "Mi perfil", href: "/admin/profile" },
  ];
  const user = { display_name: "Admin Demo", email: "admin@demo.com" };

  return (
    <DashboardLayout user={user} navItems={navItems}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Todas las propiedades</h1>
        <Link href="/admin/properties/form" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Crear Nueva Propiedad
        </Link>
      </div>
      {loading ? (
        <div>Cargando propiedades...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Título</th>
                <th className="px-4 py-2 border-b">Usuario propietario</th>
                <th className="px-4 py-2 border-b">Fecha de creación</th>
                <th className="px-4 py-2 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <tr key={prop.id}>
                  <td className="px-4 py-2 border-b">{prop.title}</td>
                  <td className="px-4 py-2 border-b">{prop.user_id || <span className="text-gray-400">Sin asignar</span>}</td>
                  <td className="px-4 py-2 border-b">{prop.created_at ? new Date(prop.created_at).toLocaleDateString() : ""}</td>
                  <td className="px-4 py-2 border-b space-x-2">
                    <Link href={`/admin/properties/form?id=${prop.id}`} className="text-blue-600 hover:underline">Editar</Link>
                    <Link href={`/listing-stay-detail/${prop.id}`} className="text-green-600 hover:underline">Ver</Link>
                    {/* Botón de eliminar (puedes implementar lógica de confirmación) */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
} 