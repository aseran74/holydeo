import DashboardLayout from "@/components/DashboardLayout";

export default function DashboardPage() {
  // Ejemplo de usuario simulado (en producción, obtén el usuario real)
  const user = { display_name: "Usuario Demo", email: "usuario@demo.com" };
  const navItems = [
    { label: "Mis propiedades", href: "/dashboard/properties" },
    { label: "Mis experiencias", href: "/dashboard/experiences" },
    { label: "Mi perfil", href: "/dashboard/profile" },
  ];
  return (
    <DashboardLayout user={user} navItems={navItems}>
      <h1 className="text-2xl font-bold mb-4">¡Bienvenido a tu panel de control!</h1>
      <p className="mb-2">Desde aquí puedes gestionar tus propiedades, experiencias y tu perfil.</p>
      <ul className="list-disc pl-6">
        <li>Haz clic en "Mis propiedades" para ver y editar tus alojamientos.</li>
        <li>Haz clic en "Mis experiencias" para gestionar tus actividades.</li>
        <li>Accede a "Mi perfil" para actualizar tus datos personales.</li>
      </ul>
    </DashboardLayout>
  );
} 