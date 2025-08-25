import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import TestimonialsSection from "../../components/landing/TestimonialsSection";


const LandingPage = () => {
    const navigate = useNavigate();
    const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
    const [featuredExperiences, setFeaturedExperiences] = useState<Experience[]>([]);
    const [featuredGreenFees, setFeaturedGreenFees] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeatured = async () => {
            console.log("🔍 Iniciando fetch de datos destacados...");
            setLoading(true);
            setError(null);
            
            try {
                console.log("📡 Consultando Supabase...");
                
                const [propertiesResponse, experiencesResponse, greenFeesResponse] = await Promise.all([
                    supabase.from('properties').select('*').eq('destacada', true).limit(6),
                    supabase.from('experiences').select('*').eq('featured', true).limit(6),
                    supabase.from('experiences').select('*').eq('category', 'greenfees').eq('featured', true).limit(4)
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
                
                if (greenFeesResponse.error) {
                    console.error("❌ Error en green fees:", greenFeesResponse.error);
                    throw greenFeesResponse.error;
                }

                console.log("✅ Datos de propiedades:", propertiesResponse.data);
                console.log("✅ Datos de experiencias:", experiencesResponse.data);
                console.log("✅ Datos de green fees:", greenFeesResponse.data);

                // Verificar si hay propiedades destacadas
                if (propertiesResponse.data && propertiesResponse.data.length > 0) {
                    console.log("✅ Usando propiedades reales de Supabase");
                    setFeaturedProperties(propertiesResponse.data);
                } else {
                    console.log("⚠️ No hay propiedades destacadas, usando ejemplos");
                    setFeaturedProperties(featuredPropertiesExample);
                }

                setFeaturedExperiences(experiencesResponse.data || []);
                setFeaturedGreenFees(greenFeesResponse.data || []);
                
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

    const handleViewExperienceDetails = (experienceId: string) => {
        navigate(`/experiences/${experienceId}`);
    };

    const getExperienceImageUrl = (photos: string[] | undefined) => {
        if (!photos || photos.length === 0) {
            return '/images/cards/card-01.jpg';
        }
        
        const firstPhoto = photos[0];
        
        // Check if it's an external URL (starts with http/https)
        if (firstPhoto.startsWith('http://') || firstPhoto.startsWith('https://')) {
            return firstPhoto;
        } else {
            // It's a Supabase storage path, get the public URL
            const { data } = supabase.storage
                .from('experience')
                .getPublicUrl(firstPhoto);
            return data.publicUrl || '/images/cards/card-01.jpg';
        }
    };

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

            {/* Sección de Green Fees Destacadas */}
            {featuredGreenFees.length > 0 && (
                <div className="bg-white dark:bg-gray-800 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Green Fees Destacados
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                                Acceso exclusivo a los mejores campos de golf de la región con tarifas especiales y condiciones únicas
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {featuredGreenFees.map((experience, index) => (
                                <div key={experience.id} className={`${index >= 2 ? 'hidden lg:block' : ''} bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300`}>
                                    <div className="relative h-48">
                                        <img 
                                            src={getExperienceImageUrl(experience.photos)} 
                                            alt={experience.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                Green Fee
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 md:p-6">
                                        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                            {experience.name}
                                        </h3>
                                        
                                        {experience.location && (
                                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center">
                                                <svg className="w-3 h-3 md:w-4 md:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="hidden sm:inline">{experience.location}</span>
                                                <span className="sm:hidden">Golf</span>
                                            </p>
                                        )}
                                        
                                        {experience.price && (
                                            <div className="mb-4">
                                                <span className="text-lg md:text-2xl font-bold text-green-600 dark:text-green-400">
                                                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(experience.price)}
                                                </span>
                                                <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 ml-1">
                                                    /mes
                                                </span>
                                            </div>
                                        )}
                                        
                                        {experience.description && (
                                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 md:line-clamp-3">
                                                {experience.description}
                                            </p>
                                        )}
                                        
                                        <button 
                                            onClick={() => handleViewExperienceDetails(experience.id)}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 md:px-4 rounded-lg transition-colors duration-200 text-sm md:text-base"
                                        >
                                            Ver Detalles
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

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
            
            {/* Sección de Testimonios */}
            <TestimonialsSection />
            
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