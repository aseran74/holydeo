"use client";

import { MapPinIcon } from "@heroicons/react/24/solid";
import LocationMarker from "@/components/AnyReactComponent/LocationMarker";
import Label from "@/components/Label";
import React, { FC, useRef, useState, ChangeEvent } from "react";
import ButtonSecondary from "@/shared/ButtonSecondary";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import FormItem from "../FormItem";
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from "@react-google-maps/api";

export interface PageAddListing2Props {
  formData: any;
  updateFormData: (fields: Partial<any>) => void;
}

const PageAddListing2: FC<PageAddListing2Props> = ({ formData, updateFormData }) => {
  const [center, setCenter] = useState({ lat: 55.9607277, lng: 36.2172614 });
  const autocompleteRef = useRef<any>(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  // Handlers para los campos controlados
  const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ country: e.target.value });
  };
  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateFormData({ address: e.target.value });
  };
  const handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateFormData({ city: e.target.value });
  };
  const handleStateChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateFormData({ state: e.target.value });
  };
  const handlePostalCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateFormData({ postalCode: e.target.value });
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      const formatted = place.formatted_address || "";
      updateFormData({ address: formatted });
      if (place.geometry && place.geometry.location) {
        setCenter({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold">Your place location</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
        <ButtonSecondary>
          <MapPinIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
          <span className="ml-3">Use current location</span>
        </ButtonSecondary>
        {/* ITEM */}
        <FormItem label="Country/Region">
          <Select value={formData.country || ""} onChange={handleCountryChange}>
            <option value="">Selecciona...</option>
            <option value="Viet Nam">Viet Nam</option>
            <option value="Thailand">Thailand</option>
            <option value="France">France</option>
            <option value="Singapore">Singapore</option>
            <option value="Jappan">Jappan</option>
            <option value="Korea">Korea</option>
            <option value="...">...</option>
          </Select>
        </FormItem>
        <FormItem label="Dirección (usa el autocompletado de Google)">
          {isLoaded ? (
            <Autocomplete
              onLoad={ref => (autocompleteRef.current = ref)}
              onPlaceChanged={onPlaceChanged}
            >
              <input
                type="text"
                placeholder="Buscar dirección"
                value={formData.address || ""}
                onChange={handleAddressChange}
                className="mt-1.5 block w-full border rounded px-3 py-2"
              />
            </Autocomplete>
          ) : (
            <Input placeholder="..." value={formData.address || ""} onChange={handleAddressChange} />
          )}
        </FormItem>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
          <FormItem label="City">
            <Input value={formData.city || ""} onChange={handleCityChange} />
          </FormItem>
          <FormItem label="State">
            <Input value={formData.state || ""} onChange={handleStateChange} />
          </FormItem>
          <FormItem label="Postal code">
            <Input value={formData.postalCode || ""} onChange={handlePostalCodeChange} />
          </FormItem>
        </div>
        <div>
          <Label>Detailed address</Label>
          <span className="block mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {formData.address || "1110 Pennsylvania Avenue NW, Washington, DC 20230"}
          </span>
          <div className="mt-4">
            <div className="aspect-w-5 aspect-h-5 sm:aspect-h-3">
              <div className="rounded-xl overflow-hidden">
                {isLoaded && (
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "300px" }}
                    center={center}
                    zoom={15}
                >
                    <Marker position={center} />
                  </GoogleMap>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageAddListing2;
