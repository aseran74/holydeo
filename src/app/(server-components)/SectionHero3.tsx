"use client";
import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import HeroSearchForm from "../(client-components)/(HeroSearchForm)/HeroSearchForm";
import HeroSearchForm2Mobile from "../(client-components)/(HeroSearchForm2Mobile)/HeroSearchForm2Mobile";
import SectionGridCategoryBox from "@/components/SectionGridCategoryBox";
import CardCategory6 from "@/components/CardCategory6";
import { createClient } from '@supabase/supabase-js';
import { TaxonomyType } from "@/data/types";
import { Route } from "@/routers/types";

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Hook para detectar si es escritorio
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isDesktop;
}

export interface SectionHero3Props {
  className?: string;
}

const SectionHero3: FC<SectionHero3Props> = ({ className = "" }) => {
  const [parallaxX, setParallaxX] = useState(0);
  const [categories, setCategories] = useState<TaxonomyType[]>([]);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    const handleScroll = () => {
      // Ajusta la velocidad del parallax multiplicando por un valor menor
      // por ejemplo, 0.3 para un movimiento más sutil.
      setParallaxX(window.scrollY * 0.3); 
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cargar categorías desde Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        
        // Transformar los datos de Supabase al formato TaxonomyType
        const formattedCategories: TaxonomyType[] = (data || []).map(category => ({
          id: category.id,
          name: category.name,
          href: category.href as Route,
          taxonomy: "category",
          count: category.count || 0,
          thumbnail: category.thumbnail || "",
          desc: category.description || "",
          listingType: "stay"
        }));

        setCategories(formattedCategories);
      } catch (error) {
        console.error('Error cargando categorías:', error);
      }
    };

    fetchCategories();
  }, []);

  // Definir el scale según el tamaño de pantalla
  const scale = isDesktop ? 1.5 : 1.5;
  // Definir el top según el tamaño de pantalla
  const top = isDesktop ? "45%" : "45%";

  return (
    <div
      className={`nc-SectionHero3 relative pb-12 ${className}`}
      data-nc-id="SectionHero3"
    >
      {/* 
        Contenedor para el texto y los formularios de búsqueda.
        Lo ponemos por encima de las imágenes con z-index.
      */}
      <div className="absolute z-10 inset-x-0 top-[10%] sm:top-[15%] text-center flex flex-col items-center w-full space-y-4 lg:space-y-5 xl:space-y-8">
        <div className="relative flex flex-col items-center">
          <img src="/Logo4.png" alt="Logo Holydeo" className="w-auto max-h-40" />
        </div>
        <span className="sm:text-lg md:text-xl font-semibold text-white block mt-2 font-poppins" style={{ fontWeight: 600 }}>
          Alojate y vive experiencias a precios inbatibles
        </span>
        {/* Botón Buscador solo en móvil/tablet */}
        <div className="w-full block lg:hidden pt-4">
          <HeroSearchForm2Mobile />
        </div>
        {/* Buscador stays/experiences solo en desktop */}
        <div className="w-full mt-8 px-0 sm:px-8 md:px-16 lg:px-24 xl:px-32 hidden lg:block">
          <HeroSearchForm />
        </div>

        {/* Grid de categorías */}
        <div className="w-full mt-8 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
          <SectionGridCategoryBox categories={categories} />
        </div>

        {/* Grid de CardCategory6 */}
        <div className="w-full mt-8 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
            {categories.map((category, index) => (
              <CardCategory6 key={index} taxonomy={category} />
            ))}
          </div>
        </div>
      </div>

      {/* 
        Contenedor para las imágenes (fondo y furgoneta).
        overflow-hidden es clave para que la furgoneta no se salga del cuadro.
      */}
      <div className="relative w-full min-h-screen overflow-hidden rounded-3xl">
        <video
          className="w-full h-full object-cover absolute inset-0"
          src="/video-hero.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </div>
  );
};

export default SectionHero3;