import React, { useState, useEffect } from 'react';
import MessagingModal from '../../components/common/MessagingModal';
import { supabase } from '../../supabaseClient';

interface Booking {
  id: string;
  property_id: string;
  check_in: string;
  check_out: string;
  total_price: number;
  status?: string;
  property?: { title: string };
}

const ClientDashboard: React.FC = () => {
  // Estado para el modal de mensajes
  const [openAdminModal, setOpenAdminModal] = useState(false);
  const [openManagerModal, setOpenManagerModal] = useState(false);

  // Estado para destinatarios
  const [adminId, setAdminId] = useState<string | null>(null);
  const [adminName, setAdminName] = useState<string>('Administrador');
  const [gestorId, setGestorId] = useState<string | null>(null);
  const [gestorName, setGestorName] = useState<string>('Mi Gestor');
  const [loading, setLoading] = useState(true);

  // Estado para reservas
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    const fetchRecipients = async () => {
      setLoading(true);
      // Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      // Buscar admin
      const { data: adminProfile } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'admin')
        .limit(1)
        .single();
      if (adminProfile) {
        setAdminId(adminProfile.id);
        setAdminName(adminProfile.full_name || 'Administrador');
      }
      // Buscar la reserva más reciente del usuario
      const { data: booking } = await supabase
        .from('bookings')
        .select('property_id')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (booking && booking.property_id) {
        // Buscar la propiedad y su agente
        const { data: property } = await supabase
          .from('properties')
          .select('agent_id')
          .eq('id', booking.property_id)
          .single();
        if (property && property.agent_id) {
          // Buscar el perfil del agente
          const { data: agentProfile } = await supabase
            .from('real_estate_agents')
            .select('id, name')
            .eq('id', property.agent_id)
            .single();
          if (agentProfile) {
            setGestorId(agentProfile.id);
            setGestorName(agentProfile.name || 'Mi Gestor');
          }
        }
      }
      setLoading(false);
    };
    fetchRecipients();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoadingBookings(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setBookings([]);
        setLoadingBookings(false);
        return;
      }
      // Traer reservas con la propiedad asociada
      const { data, error } = await supabase
        .from('bookings')
        .select('id, property_id, check_in, check_out, total_price, status, properties (title)')
        .eq('guest_id', user.id)
        .order('check_in', { ascending: false });
      if (error) {
        setBookings([]);
      } else {
        // Mapear para que property sea más accesible
        setBookings(
          (data || []).map((b: any) => ({
            ...b,
            property: b.properties,
          }))
        );
      }
      setLoadingBookings(false);
    };
    fetchBookings();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Mi Panel de Huésped</h1>
      {/* Sección de Mensajes */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Mensajes</h2>
        <div className="bg-white rounded shadow p-4 flex flex-col gap-4">
          {loading && <p>Cargando destinatarios...</p>}
          {!loading && adminId && (
            <button
              className="py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setOpenAdminModal(true)}
            >
              Chatear con el administrador
            </button>
          )}
          {!loading && gestorId && (
            <button
              className="py-2 px-4 rounded-lg bg-green-600 text-white hover:bg-green-700"
              onClick={() => setOpenManagerModal(true)}
            >
              Chatear con mi gestor
            </button>
          )}
          {!loading && !adminId && !gestorId && (
            <p>No se encontraron destinatarios para chatear.</p>
          )}
        </div>
        {/* Modales de mensajes */}
        {openAdminModal && adminId && (
          <MessagingModal
            recipientId={adminId}
            recipientName={adminName}
            recipientType="clients" // O "admin" si tienes un tipo específico
            onClose={() => setOpenAdminModal(false)}
          />
        )}
        {openManagerModal && gestorId && (
          <MessagingModal
            recipientId={gestorId}
            recipientName={gestorName}
            recipientType="real_estate_agents"
            onClose={() => setOpenManagerModal(false)}
          />
        )}
      </section>
      {/* Sección de Reservas */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Mis Reservas</h2>
        <div className="bg-white rounded shadow p-4">
          {loadingBookings ? (
            <p>Cargando reservas...</p>
          ) : bookings.length === 0 ? (
            <p>No tienes reservas registradas.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {bookings.map((b) => (
                <li key={b.id} className="py-3">
                  <div className="font-semibold">{b.property?.title || 'Propiedad desconocida'}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(b.check_in).toLocaleDateString()} - {new Date(b.check_out).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-700 mt-1">Coste: <span className="font-bold">{b.total_price} €</span></div>
                  {b.status && <div className="text-xs text-gray-500 mt-1">Estado: {b.status}</div>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default ClientDashboard; 