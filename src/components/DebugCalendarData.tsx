import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface DebugCalendarDataProps {
  propertyId: string;
}

const DebugCalendarData: React.FC<DebugCalendarDataProps> = ({ propertyId }) => {
  const [availabilityData, setAvailabilityData] = useState<any[]>([]);
  const [advancedData, setAdvancedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (propertyId) {
      fetchBothDataSets();
    }
  }, [propertyId]);

  const fetchBothDataSets = async () => {
    setLoading(true);
    
    try {
      console.log('=== DEBUGGING CALENDAR DATA FOR PROPERTY:', propertyId, '===');
      
      // Consulta exacta de AvailabilityCalendar
      console.log('--- AvailabilityCalendar Query ---');
      const { data: availabilityBookings, error: availabilityError } = await supabase
        .from('bookings')
        .select('id, check_in, check_out, status')
        .eq('property_id', propertyId)
        .eq('status', 'confirmada');

      console.log('AvailabilityCalendar - Query Result:', availabilityBookings);
      console.log('AvailabilityCalendar - Error:', availabilityError);

      // Consulta exacta de AdvancedCalendarManager
      console.log('--- AdvancedCalendarManager Query ---');
      const { data: advancedBookings, error: advancedError } = await supabase
        .from('bookings')
        .select(`
          id, 
          guest_id, 
          check_in, 
          check_out, 
          status, 
          created_at,
          guests(users(full_name))
        `)
        .eq('property_id', propertyId)
        .eq('status', 'confirmada');

      console.log('AdvancedCalendarManager - Query Result:', advancedBookings);
      console.log('AdvancedCalendarManager - Error:', advancedError);

      // Consulta simple sin JOIN para comparar
      console.log('--- Simple Query (No JOIN) ---');
      const { data: simpleBookings, error: simpleError } = await supabase
        .from('bookings')
        .select('id, guest_id, check_in, check_out, status, created_at')
        .eq('property_id', propertyId)
        .eq('status', 'confirmada');

      console.log('Simple Query - Result:', simpleBookings);
      console.log('Simple Query - Error:', simpleError);

      // Verificar datos de guests independientemente
      console.log('--- Guests Table Check ---');
      if (advancedBookings && advancedBookings.length > 0) {
        const guestIds = advancedBookings.map(b => b.guest_id).filter(Boolean);
        console.log('Guest IDs found in bookings:', guestIds);
        
        if (guestIds.length > 0) {
          const { data: guestsData, error: guestsError } = await supabase
            .from('guests')
            .select('id, users(full_name)')
            .in('id', guestIds);
          
          console.log('Guests data:', guestsData);
          console.log('Guests error:', guestsError);
        }
      }

      setAvailabilityData(availabilityBookings || []);
      setAdvancedData(advancedBookings || []);

      // Comparar resultados
      console.log('=== COMPARISON ===');
      console.log('AvailabilityCalendar count:', availabilityBookings?.length || 0);
      console.log('AdvancedCalendarManager count:', advancedBookings?.length || 0);
      console.log('Simple query count:', simpleBookings?.length || 0);

      if (availabilityBookings && advancedBookings) {
        const availabilityIds = availabilityBookings.map(b => b.id).sort();
        const advancedIds = advancedBookings.map(b => b.id).sort();
        console.log('AvailabilityCalendar IDs:', availabilityIds);
        console.log('AdvancedCalendarManager IDs:', advancedIds);
        console.log('IDs match:', JSON.stringify(availabilityIds) === JSON.stringify(advancedIds));
      }

    } catch (error) {
      console.error('Error in debug fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const testDateLogic = () => {
    console.log('=== TESTING DATE LOGIC ===');
    
    // Crear una fecha de prueba (1 de agosto de 2024)
    const testDate = new Date(2024, 7, 1); // Agosto es mes 7 (0-indexed)
    console.log('Test date:', testDate.toDateString());

    // Probar con datos de ejemplo
    const sampleBooking = {
      check_in: '2024-08-01',
      check_out: '2024-08-03'
    };

    // Lógica de AvailabilityCalendar
    const checkDate = new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate());
    const startDate = new Date(sampleBooking.check_in);
    const endDate = new Date(sampleBooking.check_out);
    const bookingStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const bookingEnd = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    const isBooked = checkDate >= bookingStart && checkDate <= bookingEnd;

    console.log('Sample booking:', sampleBooking);
    console.log('Check date normalized:', checkDate.toDateString());
    console.log('Booking start normalized:', bookingStart.toDateString());
    console.log('Booking end normalized:', bookingEnd.toDateString());
    console.log('Is booked (should be true for Aug 1):', isBooked);
  };

  if (loading) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
        <h3 className="font-semibold text-yellow-800 mb-2">🔍 Debugging Calendar Data</h3>
        <p className="text-yellow-700">Analyzing booking data...</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 m-4">
      <h3 className="font-semibold text-blue-800 mb-4">🔍 Calendar Data Debug Results</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-medium text-blue-700 mb-2">AvailabilityCalendar Data</h4>
          <div className="bg-white rounded p-3 text-sm">
            <p><strong>Count:</strong> {availabilityData.length}</p>
            {availabilityData.map(booking => (
              <div key={booking.id} className="border-b py-1">
                <p><strong>ID:</strong> {booking.id}</p>
                <p><strong>Dates:</strong> {booking.check_in} to {booking.check_out}</p>
                <p><strong>Status:</strong> {booking.status}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-blue-700 mb-2">AdvancedCalendarManager Data</h4>
          <div className="bg-white rounded p-3 text-sm">
            <p><strong>Count:</strong> {advancedData.length}</p>
            {advancedData.map(booking => (
              <div key={booking.id} className="border-b py-1">
                <p><strong>ID:</strong> {booking.id}</p>
                <p><strong>Dates:</strong> {booking.check_in} to {booking.check_out}</p>
                <p><strong>Status:</strong> {booking.status}</p>
                <p><strong>Guest:</strong> {booking.guests?.users?.full_name || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={fetchBothDataSets}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
        >
          Refresh Data
        </button>
        <button 
          onClick={testDateLogic}
          className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
        >
          Test Date Logic
        </button>
      </div>
      
      <p className="text-blue-600 text-xs mt-2">
        Check browser console for detailed comparison results
      </p>
    </div>
  );
};

export default DebugCalendarData;