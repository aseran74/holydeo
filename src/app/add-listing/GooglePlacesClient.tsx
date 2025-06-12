"use client";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

export default function GooglePlacesClient({ value, onChange, onInputChange }: { value: any, onChange: (value: any) => void, onInputChange?: (inputValue: string) => void }) {
  return (
    <GooglePlacesAutocomplete
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      selectProps={{
        value,
        onChange,
        onInputChange,
        placeholder: 'Escribe una dirección...'
        // Puedes añadir aquí tus estilos personalizados si lo deseas
      }}
    />
  );
} 