"use client";

import converSelectedDateToString from "@/utils/converSelectedDateToString";
import React, { useState } from "react";
import { GuestsObject } from "../../type";
import GuestsInput from "../GuestsInput";
import LocationInput from "../LocationInput";
import DatesRangeInput from "../DatesRangeInput";
import { supabase } from "@/utils/supabaseClient";
import StayCard2 from "@/components/StayCard2";
import { useRouter } from "next/navigation";
import SeasonInput from '@/app/(client-components)/(HeroSearchForm)/(stay-search-form)/SeasonInput';

const StaySearchForm = () => {
  //
  const [fieldNameShow, setFieldNameShow] = useState<
    "location" | "dates" | "seasons"
  >("location");
  //
  const [locationInputTo, setLocationInputTo] = useState("");
  const [guestInput, setGuestInput] = useState<GuestsObject>({
    guestAdults: 0,
    guestChildren: 0,
    guestInfants: 0,
  });
  const [startDate, setStartDate] = useState<Date | null>(
    new Date("2023/02/06")
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date("2023/02/23"));
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  //

  const onChangeDate = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (locationInputTo) params.append("location", locationInputTo);
    if (startDate && endDate) params.append("dates", `${startDate.toISOString()},${endDate.toISOString()}`);
    if (selectedSeasons.length > 0) params.append("seasons", selectedSeasons.join(","));
    router.push(`/listing-stay?${params.toString()}`);
  };

  const renderInputLocation = () => {
    const isActive = fieldNameShow === "location";
    return (
      <div
        className={`w-full bg-white overflow-hidden ${
          isActive
            ? "rounded-2xl shadow-lg"
            : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
        }`}
      >
        {!isActive ? (
          <button
            className={`w-full flex justify-between text-sm font-medium p-4`}
            onClick={() => setFieldNameShow("location")}
          >
            <span className="text-neutral-400">¿Dónde?</span>
            <span>{locationInputTo || "Ubicación"}</span>
          </button>
        ) : (
          <LocationInput
            defaultValue={locationInputTo}
            onChange={(value) => {
              setLocationInputTo(value);
              setFieldNameShow("dates");
            }}
          />
        )}
      </div>
    );
  };

  const renderInputDates = () => {
    const isActive = fieldNameShow === "dates";
    return (
      <div
        className={`w-full bg-white overflow-hidden ${
          isActive
            ? "rounded-2xl shadow-lg"
            : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
        }`}
      >
        {!isActive ? (
          <button
            className={`w-full flex justify-between text-sm font-medium p-4  `}
            onClick={() => setFieldNameShow("dates")}
          >
            <span className="text-neutral-400">¿Cuándo?</span>
            <span>
              {startDate
                ? converSelectedDateToString([startDate, endDate])
                : "Añadir fecha"}
            </span>
          </button>
        ) : (
          <DatesRangeInput />
        )}
      </div>
    );
  };

  const renderInputSeasons = () => {
    const isActive = fieldNameShow === "seasons";
    return (
      <div
        className={`w-full bg-white overflow-hidden ${
          isActive
            ? "rounded-2xl shadow-lg"
            : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
        }`}
      >
        {!isActive ? (
          <button
            className={`w-full flex justify-between text-sm font-medium p-4`}
            onClick={() => setFieldNameShow("seasons")}
          >
            <span className="text-neutral-400">Temporada</span>
            <span>{selectedSeasons.length > 0 ? selectedSeasons.join(", ") : `Seleccionar`}</span>
          </button>
        ) : (
          <SeasonInput selectedSeasons={selectedSeasons} onChange={setSelectedSeasons} />
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSearch}>
      <div className="w-full space-y-5">
        {renderInputLocation()}
        {renderInputDates()}
        {renderInputSeasons()}
      </div>
      <button type="submit" className="mt-4 w-full px-6 py-2 rounded-full bg-blue-600 text-white font-semibold">Buscar</button>
    </form>
  );
};

export default StaySearchForm;