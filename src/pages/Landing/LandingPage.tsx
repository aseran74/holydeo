import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import PropertyCard from "../Properties/PropertyCard";
import ExperienceCard from "../../components/experiences/ExperienceCard";
import LandingHero from "../../components/landing/LandingHero";

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
            <LandingHero />
            
            {/* Sección de Propiedades Destacadas */}
            <section className="py-20 px-4">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Propiedades Destacadas</h2>
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
                </div>
            </section>

            {/* Sección de Experiencias Destacadas */}
            <section className="py-20 px-4 bg-white dark:bg-gray-800">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Experiencias Únicas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredExperiences.map(experience => (
                            <ExperienceCard key={experience.id} experience={experience} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default LandingPage; 