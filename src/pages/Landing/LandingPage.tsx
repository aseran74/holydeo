import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import PropertyCard from "../Properties/PropertyCard";
import ExperienceCard from "../../components/experiences/ExperienceCard";
import LandingHero from "../../components/landing/LandingHero";
import HowItWorks from "../../components/landing/HowItWorks";
import FAQ from "../../components/landing/FAQ";
import ContactSection from "../../components/landing/ContactSection";
import LandingFooter from "../../components/landing/LandingFooter";

const LandingPage = () => {
    const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
    const [featuredExperiences, setFeaturedExperiences] = useState<any[]>([]);

    useEffect(() => {
        const fetchFeatured = async () => {
            const { data: properties, error: propertiesError } = await supabase
                .from('properties')
                .select('*')
                .eq('featured', true)
                .limit(6);

            if (properties) setFeaturedProperties(properties);
            if (propertiesError) console.error("Error fetching featured properties:", propertiesError);

            const { data: experiences, error: experiencesError } = await supabase
                .from('experiences')
                .select('*')
                .eq('featured', true)
                .limit(6);
            
            if (experiences) setFeaturedExperiences(experiences);
            if(experiencesError) console.error("Error fetching featured experiences:", experiencesError);
        };

        fetchFeatured();
    }, []);

    return (
        <>
            {/* Hero Section con Buscador */}
            <LandingHero />
            
            {/* Sección de Propiedades Destacadas */}
            <section className="py-20 px-4 bg-white dark:bg-gray-800">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Propiedades Destacadas
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Descubre nuestras mejores propiedades seleccionadas para ti
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredProperties.map(property => (
                            <PropertyCard 
                                key={property.id} 
                                property={property} 
                                onEdit={() => {}} 
                                onDelete={() => {}} 
                            />
                        ))}
                    </div>
                    {featuredProperties.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">
                                No hay propiedades destacadas disponibles en este momento.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Sección How it Works */}
            <HowItWorks />

            {/* Sección de Experiencias Destacadas */}
            <section className="py-20 px-4 bg-white dark:bg-gray-800">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Experiencias Únicas
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Vive momentos inolvidables con nuestras experiencias seleccionadas
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredExperiences.map(experience => (
                            <ExperienceCard key={experience.id} experience={experience} />
                        ))}
                    </div>
                    {featuredExperiences.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">
                                No hay experiencias destacadas disponibles en este momento.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Sección FAQ */}
            <FAQ />

            {/* Sección de Contacto */}
            <ContactSection />

            {/* Footer */}
            <LandingFooter />
        </>
    );
};

export default LandingPage; 