import DashboardLayout from "@/components/DashboardLayout";

export default function AdminPage() {
  // Ejemplo de usuario admin simulado (en producción, obtén el usuario real)
  const user = { display_name: "Admin Demo", email: "admin@demo.com" };
  const navItems = [
    { label: "Todas las propiedades", href: "/admin/properties" },
    { label: "Todas las experiencias", href: "/admin/experiences" },
    { label: "Usuarios", href: "/admin/users" },
    { label: "Mi perfil", href: "/admin/profile" },
  ];
  return (
    <DashboardLayout user={user} navItems={navItems}>
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <p className="mb-2">Desde aquí puedes gestionar todas las propiedades, experiencias y usuarios de la plataforma.</p>
      <ul className="list-disc pl-6">
        <li>Accede a "Todas las propiedades" para ver y editar cualquier alojamiento.</li>
        <li>Gestiona "Todas las experiencias" de todos los usuarios.</li>
        <li>Administra los "Usuarios" registrados en la plataforma.</li>
        <li>Actualiza tu información en "Mi perfil".</li>
      </ul>
    </DashboardLayout>
  );
} 