import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function SimplePropertiesTest() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        console.log('Fetching properties from SimplePropertiesTest...');
        
        const { data, error } = await supabase
          .from('properties')
          .select('id, title, location, price')
          .limit(5);

        if (error) {
          console.error('Error fetching properties:', error);
          setError(error.message);
        } else {
          console.log('Properties fetched successfully:', data);
          setProperties(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Error inesperado');
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg">
        <p>Cargando propiedades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 rounded-lg">
      <h3 className="font-bold mb-2">Prueba Simple de Propiedades</h3>
      <p>Propiedades encontradas: {properties.length}</p>
      {properties.length > 0 && (
        <ul className="mt-2 space-y-1">
          {properties.map((property) => (
            <li key={property.id} className="text-sm">
              • {property.title} - {property.location} - €{property.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 