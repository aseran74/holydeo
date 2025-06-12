"use client";

import React, { FC, Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowRightIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import CommentListing from "@/components/CommentListing";
import FiveStartIconForRate from "@/components/FiveStartIconForRate";
import StartRating from "@/components/StartRating";
import Avatar from "@/shared/Avatar";
import Badge from "@/shared/Badge";
import ButtonCircle from "@/shared/ButtonCircle";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import ButtonClose from "@/shared/ButtonClose";
import Input from "@/shared/Input";
import LikeSaveBtns from "@/components/LikeSaveBtns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import StayDatesRangeInput from "../StayDatesRangeInput";
import GuestsInput from "../GuestsInput";
import SectionDateRange from "../../SectionDateRange";
import { Route } from "next";
import { supabase } from "@/utils/supabaseClient";
import { AMENITIES } from "@/data/amenities";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMediaQuery } from 'react-responsive';

interface Props {
  params: { id: string };
}

const isMobileOrTablet = typeof window !== 'undefined' && window.innerWidth < 1024;

const ListingStayDetailPage: FC<Props> = ({ params }) => {
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false);
  const router = useRouter();
  const [occupiedDates, setOccupiedDates] = useState<Date[]>([]);
  const [calendarData, setCalendarData] = useState<any[]>([]);
  const [monthsShown, setMonthsShown] = useState(2);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", params.id)
        .single();
      setProperty(data);
      setLoading(false);
    };
    fetchProperty();
  }, [params.id]);

  useEffect(() => {
    async function fetchOccupiedDates() {
      // 1. Fechas bloqueadas
      const { data: blocked } = await supabase
        .from('blocked_dates')
        .select('date')
        .eq('property_id', params.id);
      // 2. Reservas aprobadas
      const { data: bookings } = await supabase
        .from('bookings')
        .select('start_date, end_date')
        .eq('property_id', params.id)
        .eq('status', 'aprobada');
      let dates: Date[] = [];
      if (blocked) {
        dates = dates.concat(blocked.map((b: any) => new Date(b.date)));
      }
      if (bookings) {
        bookings.forEach((b: any) => {
          let current = new Date(b.start_date);
          const end = new Date(b.end_date);
          while (current <= end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
        });
      }
      // Eliminar duplicados
      const unique = Array.from(new Set(dates.map(d => d.toDateString()))).map(str => new Date(str));
      setOccupiedDates(unique);
    }
    fetchOccupiedDates();
  }, [params.id]);

  useEffect(() => {
    async function fetchCalendarData() {
      // 1. Fechas bloqueadas (manual e iCal)
      const { data: blocked } = await supabase
        .from('blocked_dates')
        .select('date, source')
        .eq('property_id', params.id);
      // 2. Reservas aprobadas
      const { data: bookings } = await supabase
        .from('bookings')
        .select('start_date, end_date')
        .eq('property_id', params.id)
        .eq('status', 'aprobada');
      // 3. Precios especiales
      const { data: specialPrices } = await supabase
        .from('special_prices')
        .select('date, price')
        .eq('property_id', params.id);
      let days: any[] = [];
      // Bloqueos manuales y ical
      if (blocked) {
        blocked.forEach((b: any) => {
          days.push({
            date: b.date,
            type: b.source === 'ical_import' ? 'ical' : 'manual',
          });
        });
      }
      // Reservas aprobadas
      if (bookings) {
        bookings.forEach((b: any) => {
          let current = new Date(b.start_date);
          const end = new Date(b.end_date);
          while (current <= end) {
            days.push({
              date: current.toISOString().slice(0, 10),
              type: 'booking',
            });
            current.setDate(current.getDate() + 1);
          }
        });
      }
      // Unificar por fecha y tipo (prioridad: booking > manual > ical)
      const dayMap: Record<string, any> = {};
      days.forEach(d => {
        if (!dayMap[d.date] || d.type === 'booking') {
          dayMap[d.date] = d;
        } else if (d.type === 'manual' && dayMap[d.date].type !== 'booking') {
          dayMap[d.date] = d;
        } else if (d.type === 'ical' && !dayMap[d.date]) {
          dayMap[d.date] = d;
        }
      });
      // Añadir precios especiales
      if (specialPrices) {
        specialPrices.forEach((sp: any) => {
          if (dayMap[sp.date]) {
            dayMap[sp.date].specialPrice = sp.price;
          } else {
            dayMap[sp.date] = { date: sp.date, type: null, specialPrice: sp.price };
          }
        });
      }
      setCalendarData(Object.values(dayMap));
    }
    fetchCalendarData();
  }, [params.id]);

  useEffect(() => {
    function handleResize() {
      setMonthsShown(window.innerWidth < 1024 ? 1 : 2);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) return <div className="p-8">Cargando...</div>;
  if (!property) return <div className="p-8 text-red-600">Propiedad no encontrada</div>;

  // Utilidades para mostrar datos reales
  const gallery = Array.isArray(property.gallery) && property.gallery.length > 0 ? property.gallery : ["/no-image.jpg"];
  const temporadas = property.seasons || [];
  const amenities = property.amenities || [];

  const renderDayContents = (day: number, date: Date) => {
    const iso = date.toISOString().slice(0, 10);
    const info = calendarData.find(d => d.date === iso);
    let bg = '';
    if (info?.type === 'booking') bg = 'bg-red-500 text-white';
    else if (info?.type === 'manual') bg = 'bg-gray-400 text-white';
    else if (info?.type === 'ical') bg = 'bg-green-500 text-white';
    return (
      <div className={`relative w-10 h-10 flex items-center justify-center rounded-full ${bg}`}>
        <span>{day}</span>
        {info?.specialPrice && (
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs rounded-full px-1 border border-white">{info.specialPrice}€</span>
        )}
      </div>
    );
  };

  // Render principal
  return (
    <div className="nc-ListingStayDetailPage">
      {/*  HEADER */}
      <header className="rounded-md sm:rounded-xl">
        <div className="relative grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2">
          <div
            className="col-span-2 row-span-3 sm:row-span-2 relative rounded-md sm:rounded-xl overflow-hidden cursor-pointer"
          >
            {gallery[0] ? (
              <Image
                fill
                className="object-cover rounded-md sm:rounded-xl"
                src={gallery[0]}
                alt={property.title}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
              />
            ) : (
              <div className="w-full h-full bg-neutral-200 flex items-center justify-center">Sin imagen</div>
            )}
            <div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity"></div>
          </div>
          {gallery.slice(1, 5).map((item: string, index: number) => (
            <div
              key={index}
              className={`relative rounded-md sm:rounded-xl overflow-hidden ${
                index >= 3 ? "hidden sm:block" : ""
              }`}
            >
              <div className="aspect-w-4 aspect-h-3 sm:aspect-w-6 sm:aspect-h-5">
                <Image
                  fill
                  className="object-cover rounded-md sm:rounded-xl "
                  src={item}
                  alt={property.title}
                  sizes="400px"
                />
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* MAIN */}
      <main className=" relative z-10 mt-11 flex flex-col lg:flex-row ">
        {/* CONTENT */}
        <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pr-10">
          {/* Título y temporadas */}
          <div className="listingSection__wrap !space-y-6">
            <div className="flex justify-between items-center">
              <Badge name={property.property_type || "Propiedad"} />
              <LikeSaveBtns />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
              {property.title}
            </h2>
            <div className="flex flex-wrap gap-2 my-4">
              {temporadas.length > 0
                ? temporadas.map((t: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{t}</span>
                  ))
                : <span className="text-neutral-400">Sin temporadas</span>}
            </div>
            <div className="text-neutral-6000 dark:text-neutral-300 text-sm mb-2">
              <strong>Alquiler de temporada entera:</strong> Consulta con el host para más detalles.
            </div>
            {/* Info básica */}
            <div className="flex items-center space-x-4">
              <StartRating />
              <span>·</span>
              <span>
                <i className="las la-map-marker-alt"></i>
                <span className="ml-1"> {property.address || "Sin dirección"}</span>
              </span>
            </div>
            <div className="flex items-center">
              <Avatar hasChecked sizeClass="h-10 w-10" radius="rounded-full" />
              <span className="ml-2.5 text-neutral-500 dark:text-neutral-400">
                Hosted by <span className="text-neutral-900 dark:text-neutral-200 font-medium">{property.host_name || "Host"}</span>
              </span>
            </div>
            <div className="w-full border-b border-neutral-100 dark:border-neutral-700" />
            <div className="flex items-center justify-between xl:justify-start space-x-8 xl:space-x-12 text-sm text-neutral-700 dark:text-neutral-300">
              <div className="flex items-center space-x-3 "><i className=" las la-user text-2xl "></i><span>{property.guests || 0} <span className="hidden sm:inline-block">guests</span></span></div>
              <div className="flex items-center space-x-3"><i className=" las la-bed text-2xl"></i><span>{property.beds || 0} <span className="hidden sm:inline-block">beds</span></span></div>
              <div className="flex items-center space-x-3"><i className=" las la-bath text-2xl"></i><span>{property.bathrooms || 0} <span className="hidden sm:inline-block">baths</span></span></div>
              <div className="flex items-center space-x-3"><i className=" las la-door-open text-2xl"></i><span>{property.bedrooms || 0} <span className="hidden sm:inline-block">bedrooms</span></span></div>
            </div>
          </div>

          {/* Información de la estancia */}
          <div className="listingSection__wrap">
            <h2 className="text-2xl font-semibold">Información</h2>
            <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
            <div className="text-neutral-6000 dark:text-neutral-300">
              {property.details || "Sin descripción"}
            </div>
          </div>

          {/* Amenities */}
          <div className="listingSection__wrap">
            <div>
              <h2 className="text-2xl font-semibold">Servicios y comodidades</h2>
              <span className="block mt-2 text-neutral-500 dark:text-neutral-400">Servicios y comodidades</span>
            </div>
            <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-sm text-neutral-700 dark:text-neutral-300 ">
              {amenities.length > 0
                ? amenities.map((key: string, i: number) => {
                    const amenity = AMENITIES.find((a) => a.key === key);
                    return amenity ? (
                      <div key={amenity.key} className="flex items-center space-x-3">
                        {amenity.icon && <i className={`text-3xl las ${amenity.icon}`}></i>}
                        <span>{amenity.label}</span>
                      </div>
                    ) : null;
                  })
                : <span className="text-neutral-400">Sin amenities</span>}
            </div>
          </div>

          {/* Calendario de disponibilidad */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Disponibilidad</h2>
            <div className="font-poppins rounded-xl overflow-hidden border bg-white w-full">
              <DatePicker
                inline
                selected={null}
                monthsShown={monthsShown}
                calendarClassName={monthsShown === 1 ? 'flex flex-col gap-4 w-full' : 'flex flex-row gap-4 w-full'}
                renderDayContents={renderDayContents}
                disabledKeyboardNavigation
                onChange={() => {}}
              />
            </div>
            <div className="flex gap-4 mt-4">
              <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-red-500 inline-block"></span> Reserva huésped</span>
              <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-gray-400 inline-block"></span> Bloqueo manual</span>
              <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-green-500 inline-block"></span> Bloqueo iCal</span>
              <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-yellow-400 inline-block border border-white"></span> Precio especial</span>
            </div>
          </div>

          {/* ...puedes seguir adaptando el resto de secciones según los datos reales... */}
        </div>

        {/* SIDEBAR */}
        <div className="hidden lg:block flex-grow mt-14 lg:mt-0">
          <div className="sticky top-28">
            <div className="listingSectionSidebar__wrap shadow-xl">
              <div className="flex justify-between">
                <span className="text-3xl font-semibold">
                  {property.price ? `$${property.price}` : "Sin precio"}
                  <span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">/noche</span>
                </span>
                <StartRating />
              </div>
              {/* ...puedes seguir adaptando el sidebar... */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListingStayDetailPage; 