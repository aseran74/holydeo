import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const DebugSupabase = () => {
    const [allProperties, setAllProperties] = useState<any[]>([]);
    const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const debugSupabase = async () => {
            console.log("🔍 Debug: Consultando todas las propiedades...");
            
            try {
                // Obtener todas las propiedades
                const { data: allProps, error: allError } = await supabase
                    .from('properties')
                    .select('*')
                    .limit(10);

                console.log("📊 Todas las propiedades:", allProps);
                if (allError) console.error("❌ Error obteniendo todas las propiedades:", allError);

                // Obtener propiedades destacadas
                const { data: featuredProps, error: featuredError } = await supabase
                    .from('properties')
                    .select('*')
                    .eq('destacada', true)
                    .limit(10);

                console.log("⭐ Propiedades destacadas:", featuredProps);
                if (featuredError) console.error("❌ Error obteniendo propiedades destacadas:", featuredError);

                setAllProperties(allProps || []);
                setFeaturedProperties(featuredProps || []);

            } catch (err) {
                console.error("💥 Error en debug:", err);
            } finally {
                setLoading(false);
            }
        };

        debugSupabase();
    }, []);

    if (loading) {
        return <div className="p-4">Cargando debug...</div>;
    }

    return (
        <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg m-4">
            <h3 className="font-bold text-lg mb-4">🔍 Debug Supabase</h3>
            
            <div className="mb-4">
                <h4 className="font-semibold">📊 Total de propiedades: {allProperties.length}</h4>
                <div className="text-sm">
                    {allProperties.map((prop, index) => (
                        <div key={index} className="mb-2 p-2 bg-white dark:bg-gray-800 rounded">
                            <strong>ID:</strong> {prop.id} | 
                            <strong>Nombre:</strong> {prop.title} | 
                            <strong>Destacada:</strong> {prop.destacada ? '✅' : '❌'}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="font-semibold">⭐ Propiedades destacadas: {featuredProperties.length}</h4>
                <div className="text-sm">
                    {featuredProperties.map((prop, index) => (
                        <div key={index} className="mb-2 p-2 bg-green-100 dark:bg-green-900/20 rounded">
                            <strong>ID:</strong> {prop.id} | 
                            <strong>Nombre:</strong> {prop.title} | 
                            <strong>Destacada:</strong> {prop.destacada ? '✅' : '❌'}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DebugSupabase; 