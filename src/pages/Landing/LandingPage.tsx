import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Property, Experience } from "../../types";
import { featuredPropertiesExample } from "../../data/mockData";

// Importa tus componentes
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingHero from "../../components/landing/LandingHero";
import HowItWorks from "../../components/landing/HowItWorks";
import FAQ from "../../components/landing/FAQ";
import ContactSection from "../../components/landing/ContactSection";
import LandingFooter from "../../components/landing/LandingFooter";
import FeaturedSection from "../../components/shared/FeaturedSection";
import PublicPropertyCard from "../../components/common/PublicPropertyCard";
import ExperienceCard from "../../components/experiences/ExperienceCard";


const LandingPage = () => {
    const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
    const [featuredExperiences, setFeaturedExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeatured = async () => {
            console.log("🔍 Iniciando fetch de datos destacados...");
            setLoading(true);
            setError(null);
            
            try {
                console.log("📡 Consultando Supabase...");
                
                const [propertiesResponse, experiencesResponse] = await Promise.all([
                    supabase.from('properties').select('*').eq('destacada', true).limit(6),
                    supabase.from('experiences').select('*').eq('featured', true).limit(6)
                ]);

                console.log("📊 Respuesta de propiedades:", propertiesResponse);
                console.log("📊 Respuesta de experiencias:", experiencesResponse);

                if (propertiesResponse.error) {
                    console.error("❌ Error en propiedades:", propertiesResponse.error);
                    throw propertiesResponse.error;
                }
                
                if (experiencesResponse.error) {
                    console.error("❌ Error en experiencias:", experiencesResponse.error);
                    throw experiencesResponse.error;
                }

                console.log("✅ Datos de propiedades:", propertiesResponse.data);
                console.log("✅ Datos de experiencias:", experiencesResponse.data);

                // Verificar si hay propiedades destacadas
                if (propertiesResponse.data && propertiesResponse.data.length > 0) {
                    console.log("✅ Usando propiedades reales de Supabase");
                    setFeaturedProperties(propertiesResponse.data);
                } else {
                    console.log("⚠️ No hay propiedades destacadas, usando ejemplos");
                    setFeaturedProperties(featuredPropertiesExample);
                }

                setFeaturedExperiences(experiencesResponse.data || []);
                
            } catch (err: any) {
                console.error("💥 Error completo:", err);
                setError("Hubo un problema al cargar el contenido. Inténtalo de nuevo.");
                console.error("Fetch error:", err.message);
            } finally {
                setLoading(false);
                console.log("🏁 Fetch completado");
            }
        };

        fetchFeatured();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <LandingNavbar />
            <LandingHero />



            {error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <p className="text-center text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                        {error}
                    </p>
                </div>
            )}

            <FeaturedSection
                title="Propiedades Destacadas"
                description="Descubre nuestras mejores propiedades seleccionadas para ti."
                items={featuredProperties}
                loading={loading}
                renderItem={(property) => (
                    <PublicPropertyCard key={property.id} property={property} />
                )}
            />

            <div id="how-it-works" className="bg-gray-50 dark:bg-gray-900">
                <HowItWorks />
            </div>

            <FeaturedSection
                title="Experiencias Únicas"
                description="Vive momentos inolvidables con nuestras experiencias seleccionadas."
                items={featuredExperiences}
                loading={loading}
                renderItem={(experience) => (
                    <ExperienceCard key={experience.id} experience={experience} />
                )}
            />
            
            <div id="faq" className="bg-gray-50 dark:bg-gray-900">
                <FAQ />
            </div>

            <div id="contact" className="bg-white dark:bg-gray-800">
                <ContactSection />
            </div>

            <LandingFooter />
        </div>
    );
};

export default LandingPage; 