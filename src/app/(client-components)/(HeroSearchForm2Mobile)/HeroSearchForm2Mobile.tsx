"use client";

import React, { Fragment, useState } from "react";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import ButtonSubmit from "./ButtonSubmit";
import StaySearchForm from "./(stay-search-form)/StaySearchForm";
import CarsSearchForm from "./(car-search-form)/CarsSearchForm";
import FlightSearchForm from "./(flight-search-form)/FlightSearchForm";
import TabFilters from "@/app/(stay-listings)/TabFilters";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonThird from "@/shared/ButtonThird";
import ButtonClose from "@/shared/ButtonClose";
import Checkbox from "@/shared/Checkbox";
import Slider from "rc-slider";
import convertNumbThousand from "@/utils/convertNumbThousand";
import { AMENITIES } from "@/data/amenities";
import LocationInput from "./LocationInput";
import DatesRangeInput from "./DatesRangeInput";

const HeroSearchForm2Mobile = ({ open, onClose }: { open?: boolean; onClose?: () => void }) => {
  const [showModalInternal, setShowModalInternal] = useState(false);
  const showModal = typeof open === 'boolean' ? open : showModalInternal;
  const setShowModal = (value: boolean) => {
    if (typeof open === 'boolean' && onClose) {
      if (!value) onClose();
    } else {
      setShowModalInternal(value);
    }
  };

  // Estado para el modal de filtros avanzados
  const [isOpenMoreFilterMobile, setIsOpenMoreFilterMobile] = useState(false);
  const [rangePrices, setRangePrices] = useState([0, 1000]);
  const seasonOptions = [
    "Sep a Julio",
    "Sep a Junio",
    "Sep a Mayo",
    "Oct a Julio",
    "Oct a Junio",
    "Oct a Mayo",
  ];
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const typeOfPaces = [
    { name: "Entire place", description: "Have a place to yourself" },
    { name: "Private room", description: "Have your own room and share some common spaces" },
    { name: "Hotel room", description: "Have a private or shared room in a boutique hotel, hostel, and more" },
    { name: "Shared room", description: "Stay in a shared space, like a common room" },
  ];
  const moreFilter1 = AMENITIES.map(a => ({ name: a.label, key: a.key }));
  const moreFilter2 = [
    { name: " Free parking on premise" },
    { name: "Hot tub" },
    { name: "Gym" },
    { name: " Pool" },
    { name: " EV charger" },
  ];
  const moreFilter3 = [
    { name: " House" },
    { name: "Bed and breakfast" },
    { name: "Apartment", defaultChecked: true },
    { name: " Boutique hotel" },
    { name: " Bungalow" },
    { name: " Chalet", defaultChecked: true },
    { name: " Condominium", defaultChecked: true },
    { name: " Cottage" },
    { name: " Guest suite" },
    { name: " Guesthouse" },
  ];
  const moreFilter4 = [{ name: " Pets allowed" }, { name: "Smoking allowed" }];

  // Estado para location y fechas
  const [location, setLocation] = useState("");
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);

  // Estado para controlar el modal secundario de fechas
  const [showDatesModal, setShowDatesModal] = useState(false);

  // Añade el estado para controlar el campo activo
  const [fieldNameShow, setFieldNameShow] = useState<'location' | 'dates' | 'seasons'>('location');

  function closeModal() {
    setShowModal(false);
  }

  function openModal() {
    setShowModal(true);
  }

  const renderButtonOpenModal = () => {
    if (typeof open === 'boolean') return null;
    return (
      <button
        onClick={openModal}
        className="relative flex items-center w-full border border-neutral-200 dark:border-neutral-6000 px-4 py-2 pr-11 rounded-full shadow-lg bg-white"
      >
        <MagnifyingGlassIcon className="flex-shrink-0 w-5 h-5 text-black" />
        <div className="ml-3 flex-1 text-left overflow-hidden">
          <span className="block font-medium text-sm text-black">¿Donde vas?</span>
          <span className="block mt-0.5 text-xs font-light text-black ">
            <span className="line-clamp-1">
              ¿Donde?  • ¿Cuando?  • ¿Precios?
            </span>
          </span>
        </div>
        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-6000 text-black">
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            role="presentation"
            focusable="false"
            className="block w-4 h-4"
            fill="currentColor"
          >
            <path d="M5 8c1.306 0 2.418.835 2.83 2H14v2H7.829A3.001 3.001 0 1 1 5 8zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6-8a3 3 0 1 1-2.829 4H2V4h6.17A3.001 3.001 0 0 1 11 2zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
          </svg>
        </span>
      </button>
    );
  };

  const handleSeasonChange = (option: string) => {
    setSelectedSeasons((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const renderMoreFilterItem = (
    data: { name: string; defaultChecked?: boolean }[]
  ) => {
    const list1 = data.filter((_, i) => i < data.length / 2);
    const list2 = data.filter((_, i) => i >= data.length / 2);
    return (
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col space-y-5">
          {list1.map((item) => (
            <Checkbox
              key={item.name}
              name={item.name}
              label={item.name}
              defaultChecked={!!item.defaultChecked}
            />
          ))}
        </div>
        <div className="flex flex-col space-y-5">
          {list2.map((item) => (
            <Checkbox
              key={item.name}
              name={item.name}
              label={item.name}
              defaultChecked={!!item.defaultChecked}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderXClear = () => (
    <span className="w-4 h-4 rounded-full bg-primary-500 text-white flex items-center justify-center ml-3 cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </span>
  );

  return (
    <div className="HeroSearchForm2Mobile font-poppins">
      {renderButtonOpenModal()}
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="HeroSearchFormMobile__Dialog relative z-max"
          onClose={closeModal}
        >
          <div className="fixed inset-0 bg-white/80">
            <div className="flex h-full">
              <Transition.Child
                as={Fragment}
                enter="ease-out transition-transform"
                enterFrom="opacity-0 translate-y-52"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in transition-transform"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-52"
              >
                <Dialog.Panel className="relative h-full overflow-hidden flex-1 flex flex-col justify-between bg-white">
                    <Tab.Group manual>
                      <div className="absolute left-4 top-4">
                        <button className="" onClick={closeModal}>
                          <XMarkIcon className="w-5 h-5 text-black dark:text-white" />
                        </button>
                      </div>
                      <Tab.List className="pt-12 flex w-full justify-center font-semibold text-sm sm:text-base text-neutral-500 dark:text-neutral-400 space-x-6 sm:space-x-8">
                      {['Stay', 'Experiences'].map((item, index) => (
                          <Tab key={index} as={Fragment}>
                            {({ selected }) => (
                              <div className="relative focus:outline-none focus-visible:ring-0 outline-none select-none">
                              <div className={`${selected ? 'text-black dark:text-white' : ''}  `}>{item}</div>
                                {selected && (
                                  <span className="absolute inset-x-0 top-full border-b-2 border-black dark:border-white"></span>
                                )}
                              </div>
                            )}
                          </Tab>
                        ))}
                      </Tab.List>
                      <div className="flex-1 pt-3 px-1.5 sm:px-4 flex overflow-hidden">
                        <Tab.Panels className="flex-1 overflow-y-auto hiddenScrollbar py-4">
                          <Tab.Panel>
                          <div className="transition-opacity animate-[myblur_0.4s_ease-in-out] space-y-7">
                            {/* Ubicación */}
                            <div className="py-2">
                              <h3 className="text-xl font-medium">Ubicación</h3>
                              <div className="mt-4">
                                <div className={`w-full bg-white overflow-hidden ${fieldNameShow === 'location' ? 'rounded-2xl shadow-lg' : 'rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]'}`}> 
                                  {fieldNameShow !== 'location' ? (
                                    <button
                                      className="w-full flex justify-between text-sm font-medium p-4"
                                      onClick={() => setFieldNameShow('location')}
                                    >
                                      <span className="text-neutral-400">¿Dónde?</span>
                                      <span>{location || 'Ubicación'}</span>
                                    </button>
                                  ) : (
                                    <LocationInput
                                      defaultValue={location}
                                      onChange={(value) => {
                                        setLocation(value);
                                        setFieldNameShow('dates');
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* Fechas de reserva */}
                            <div className="py-2">
                              <h3 className="text-xl font-medium">Reserva de días</h3>
                              <div className="mt-4">
                                <div className={`w-full bg-white overflow-hidden ${fieldNameShow === 'dates' ? 'rounded-2xl shadow-lg' : 'rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]'}`}> 
                                  {fieldNameShow !== 'dates' ? (
                                    <button
                                      className="w-full flex justify-between text-sm font-medium p-4"
                                      onClick={() => setFieldNameShow('dates')}
                                    >
                                      <span className="text-neutral-400">¿Cuándo?</span>
                                      <span>
                                        {dates[0]
                                          ? `${dates[0]?.toLocaleDateString()} - ${dates[1]?.toLocaleDateString()}`
                                          : 'Añadir fecha'}
                                      </span>
                                    </button>
                                  ) : (
                                    <DatesRangeInput
                                      value={dates}
                                      onChange={(selectedDates) => {
                                        setDates(selectedDates);
                                        setFieldNameShow('seasons');
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* Temporada */}
                            <div className="py-2">
                              <h3 className="text-xl font-medium">Temporada</h3>
                              <div className="mt-4">
                                <div className={`w-full bg-white overflow-hidden ${fieldNameShow === 'seasons' ? 'rounded-2xl shadow-lg' : 'rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]'}`}> 
                                  {fieldNameShow !== 'seasons' ? (
                                    <button
                                      className="w-full flex justify-between text-sm font-medium p-4"
                                      onClick={() => setFieldNameShow('seasons')}
                                    >
                                      <span className="text-neutral-400">Temporada</span>
                                      <span>{selectedSeasons.length > 0 ? selectedSeasons.join(', ') : 'Seleccionar'}</span>
                                    </button>
                                  ) : (
                                    <div className="p-4">
                                      <h3 className="text-lg font-medium mb-3">Elige temporada</h3>
                                      <div className="grid grid-cols-3 gap-4">
                                        {seasonOptions.map(option => (
                                          <label key={option} className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input
                                              type="checkbox"
                                              checked={selectedSeasons.includes(option)}
                                              onChange={() => handleSeasonChange(option)}
                                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            {option}
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* --- Filtros avanzados --- */}
                            <div className="space-y-5 pt-4">
                              {/* Rango de precios */}
                              <div className="bg-white rounded-xl border shadow-md p-4">
                                <h3 className="text-base font-semibold mb-2">Rango de precios</h3>
                                <Slider
                                  range
                                  className="text-red-400"
                                  min={0}
                                  max={2000}
                                  defaultValue={[0, 1000]}
                                  allowCross={false}
                                  onChange={(e) => setRangePrices(e as number[])}
                                />
                                <div className="flex justify-between mt-3">
                                  <div>
                                    <label className="block text-xs font-medium text-neutral-700">Mínimo</label>
                                    <input
                                      type="text"
                                      disabled
                                      className="block w-20 px-2 py-1 border rounded text-center"
                                      value={rangePrices[0]}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-neutral-700">Máximo</label>
                                    <input
                                      type="text"
                                      disabled
                                      className="block w-20 px-2 py-1 border rounded text-center"
                                      value={rangePrices[1]}
                                    />
                                  </div>
                                </div>
                              </div>
                              {/* Tipo de lugar */}
                              <div className="bg-white rounded-xl border shadow-md p-4">
                                <h3 className="text-base font-semibold mb-2">Tipo de lugar</h3>
                                {renderMoreFilterItem(typeOfPaces)}
                              </div>
                              {/* Comodidades */}
                              <div className="bg-white rounded-xl border shadow-md p-4">
                                <h3 className="text-base font-semibold mb-2">Comodidades</h3>
                                {renderMoreFilterItem(moreFilter1)}
                              </div>
                              {/* Instalaciones */}
                              <div className="bg-white rounded-xl border shadow-md p-4">
                                <h3 className="text-base font-semibold mb-2">Instalaciones</h3>
                                {renderMoreFilterItem(moreFilter2)}
                              </div>
                              {/* Tipo de propiedad */}
                              <div className="bg-white rounded-xl border shadow-md p-4">
                                <h3 className="text-base font-semibold mb-2">Tipo de propiedad</h3>
                                {renderMoreFilterItem(moreFilter3)}
                              </div>
                              {/* Reglas de la casa */}
                              <div className="bg-white rounded-xl border shadow-md p-4">
                                <h3 className="text-base font-semibold mb-2">Reglas de la casa</h3>
                                {renderMoreFilterItem(moreFilter4)}
                              </div>
                            </div>
                            </div>
                          </Tab.Panel>
                          <Tab.Panel>
                            <div className="transition-opacity animate-[myblur_0.4s_ease-in-out]">
                              <StaySearchForm />
                            </div>
                          </Tab.Panel>
                        </Tab.Panels>
                      </div>
                      <div className="px-4 py-3 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 flex justify-between">
                        <button
                          type="button"
                          className="underline font-semibold flex-shrink-0"
                        onClick={closeModal}
                        >
                          Clear all
                        </button>
                        <ButtonSubmit
                          onClick={closeModal}
                        />
                      </div>
                    </Tab.Group>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default HeroSearchForm2Mobile;
