"use client";

import React, { FC, useEffect, useState } from "react";
import AnyReactComponent from "@/components/AnyReactComponent/AnyReactComponent";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import ButtonClose from "@/shared/ButtonClose";
import Checkbox from "@/shared/Checkbox";
import Pagination from "@/shared/Pagination";
import TabFilters from "./TabFilters";
import Heading2 from "@/shared/Heading2";
import StayCard2 from "@/components/StayCard2";
import { supabase } from "@/utils/supabaseClient";
import MiniStayCard from "@/components/MiniStayCard";

export interface SectionGridHasMapProps {}

const SectionGridHasMap: FC<SectionGridHasMapProps> = () => {
  const [currentHoverID, setCurrentHoverID] = useState<string | number>(-1);
  const [showFullMapFixed, setShowFullMapFixed] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("properties").select("*");
      setProperties(data || []);
      setLoading(false);
    };
    fetchProperties();
  }, []);

  // Validar propiedades con coordenadas válidas
  const propertiesWithCoords = properties.filter(
    (item) =>
      item.map &&
      typeof item.map.lat === "number" &&
      typeof item.map.lng === "number" &&
      !isNaN(item.map.lat) &&
      !isNaN(item.map.lng)
  );

  const defaultCenter =
    propertiesWithCoords.length > 0
      ? propertiesWithCoords[0].map
      : { lat: 40.4168, lng: -3.7038 };

  // Configuración del loader de Google Maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  return (
    <div>
      <div className="relative flex min-h-screen">
        {/* CARDS */}
        <div className="min-h-screen w-full xl:w-[60%] 2xl:w-[60%] max-w-[1184px] flex-shrink-0 xl:px-8 ">
          <Heading2 className="!mb-8" />
          <div className="mb-8 lg:mb-11">
            <TabFilters />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 2xl:gap-x-6 gap-y-8">
            {properties.map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => setCurrentHoverID((_) => item.id)}
                onMouseLeave={() => setCurrentHoverID((_) => -1)}
              >
                <StayCard2 data={item} />
              </div>
            ))}
          </div>
          <div className="flex mt-16 justify-center items-center">
            <Pagination />
          </div>
        </div>

        {!showFullMapFixed && (
          <div
            className={`flex xl:hidden items-center justify-center fixed bottom-16 md:bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-neutral-900 text-white shadow-2xl rounded-full z-30  space-x-3 text-sm cursor-pointer`}
            onClick={() => setShowFullMapFixed(true)}
          >
            <i className="text-lg las la-map"></i>
            <span>Show map</span>
          </div>
        )}

        {/* MAPA */}
        <div
          className={`xl:flex-1 xl:static xl:block ${
            showFullMapFixed ? "fixed inset-0 z-50" : "hidden"
          }`}
        >
          {showFullMapFixed && (
            <ButtonClose
              onClick={() => setShowFullMapFixed(false)}
              className="bg-white absolute z-50 left-3 top-3 shadow-lg rounded-xl w-10 h-10"
            />
          )}

          <div className="fixed xl:sticky top-0 xl:top-[88px] left-0 w-full h-full xl:h-[calc(100vh-88px)] rounded-md overflow-hidden">
            <div className="absolute bottom-5 left-3 lg:bottom-auto lg:top-2.5 lg:left-1/2 transform lg:-translate-x-1/2 py-2 px-4 bg-white dark:bg-neutral-800 shadow-xl z-10 rounded-2xl min-w-max">
              <Checkbox
                className="text-xs xl:text-sm"
                name="xx"
                label="Search as I move the map"
              />
            </div>
            <div style={{ width: "100%", height: "100%", position: "relative" }}>
              {isLoaded && propertiesWithCoords.length > 0 ? (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={defaultCenter}
                  zoom={12}
                >
                  {propertiesWithCoords.map((item) => (
                    <Marker
                      key={item.id}
                      position={item.map}
                      onMouseOver={() => {
                        if (!isMobile) setCurrentHoverID(item.id);
                      }}
                      onMouseOut={() => {
                        if (!isMobile) setCurrentHoverID(-1);
                      }}
                      onClick={() => {
                        if (isMobile) setSelectedProperty(item);
                      }}
                    />
                  ))}
                  {/* Minicard en escritorio */}
                  {!isMobile && currentHoverID !== -1 && (
                    (() => {
                      const prop = propertiesWithCoords.find(p => p.id === currentHoverID);
                      if (!prop) return null;
                      return (
                        <MiniStayCard property={prop} />
                      );
                    })()
                  )}
                </GoogleMap>
              ) : propertiesWithCoords.length === 0 ? (
                <div className="flex items-center justify-center h-full text-neutral-500">
                  No hay propiedades con coordenadas válidas para mostrar en el mapa.
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-neutral-500">
                  Cargando mapa...
                </div>
              )}
              {/* Minicard en móvil */}
              {isMobile && selectedProperty && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
                  <MiniStayCard property={selectedProperty} onClose={() => setSelectedProperty(null)} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionGridHasMap;
