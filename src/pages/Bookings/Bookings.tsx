import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { ListIcon, GridIcon, PencilIcon } from "../../icons";
import RecentBookings from "../../components/common/RecentBookings";

interface Booking {
  id: string;
  property_id: string;
  client_id: string;
  check_in: string;
  check_out: string;
  status: 'confirmada' | 'pendiente' | 'cancelada';
  total_price: number;
}

interface Property {
  id: string;
  title: string;
}

interface Guest {
  id: string;
  name: string;
}

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [filter, setFilter] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: bookingsData, error: bookingsError } = await supabase.from("bookings").select("*");
    if (bookingsError) console.error("Error fetching bookings:", bookingsError);
    else setBookings(bookingsData || []);

    const { data: propertiesData, error: propertiesError } = await supabase.from("properties").select("id, title");
    if (propertiesError) {
      console.error("Error fetching properties:", propertiesError);
      setProperties([]);
    } else {
      setProperties(propertiesData || []);
    }

    // Comentado temporalmente - la tabla 'clients' no existe
    /*
    const { data: guestsData, error: guestsError } = await supabase.from("clients").select("id, name");
    if (guestsError) console.error("Error fetching guests:", guestsError);
    else setGuests(guestsData || []);
    */
    
    // Por ahora, usar datos mock para guests
    setGuests([]);
  };

  const handleEditBooking = (booking: Booking) => {
    setEditBooking(booking);
    setEditModalOpen(true);
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'confirmada':
        return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Confirmada</span>;
      case 'pendiente':
        return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">Pendiente</span>;
      case 'cancelada':
        return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">Cancelada</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">{status}</span>;
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const search = filter.toLowerCase();
    const property = properties.find(p => p.id === b.property_id);
    const guest = guests.find(g => g.id === b.client_id);
    return (
      property?.title.toLowerCase().includes(search) ||
      guest?.name.toLowerCase().includes(search) ||
      b.status.toLowerCase().includes(search)
    );
  });

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Reservas</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Filtrar por propiedad, huésped o estado..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              <ListIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              <GridIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Componente de últimas reservas */}
      <div className="mb-8">
        <RecentBookings limit={3} />
      </div>

      {viewMode === 'list' ? (
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto mt-4">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Propiedad</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Huésped</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fechas</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Precio Total</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => {
                const property = properties.find(p => p.id === booking.property_id);
                const guest = guests.find(g => g.id === booking.client_id);
                return (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-3 align-middle">{property?.title || 'N/A'}</td>
                    <td className="px-6 py-3 align-middle">{guest?.name || 'N/A'}</td>
                    <td className="px-6 py-3 align-middle">{new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}</td>
                    <td className="px-6 py-3 align-middle">${booking.total_price.toLocaleString()}</td>
                    <td className="px-6 py-3 align-middle">{getStatusChip(booking.status)}</td>
                    <td className="px-6 py-3 align-middle">
                      <button className="text-blue-600 hover:text-blue-800" onClick={() => handleEditBooking(booking)}>
                        <PencilIcon className="w-5 h-5"/>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBookings.map((booking) => {
            const property = properties.find(p => p.id === booking.property_id);
            const guest = guests.find(g => g.id === booking.client_id);
            return (
              <div key={booking.id} className="bg-white rounded-xl shadow p-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg truncate">{property?.title || 'Propiedad no encontrada'}</h3>
                  <p className="text-sm text-gray-600">Huésped: {guest?.name || 'Huésped no encontrado'}</p>
                  <div className="mt-3 text-sm">
                                  <p><strong>Desde:</strong> {new Date(booking.check_in).toLocaleDateString()}</p>
              <p><strong>Hasta:</strong> {new Date(booking.check_out).toLocaleDateString()}</p>
                  </div>
                  <p className="mt-2 font-semibold">Precio: ${booking.total_price.toLocaleString()}</p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  {getStatusChip(booking.status)}
                  <button className="text-blue-600 hover:text-blue-800" onClick={() => handleEditBooking(booking)}>
                    <PencilIcon className="w-5 h-5"/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Placeholder for Edit Modal */}
      {editModalOpen && editBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={() => setEditModalOpen(false)}>×</button>
            <h2 className="text-lg font-bold mb-4">Editar Reserva</h2>
            <p>El modal de edición de reservas está en construcción.</p>
            {/* Form will go here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings; 