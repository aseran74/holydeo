import { Property } from '../types';

export const properties: Property[] = [
  {
    id: "1",
    title: "Villa de lujo en Marbella",
    description: "Hermosa villa con vistas al mar y todas las comodidades",
    price: 250000,
    location: "Marbella, Málaga",
    bedrooms: 4,
    bathrooms: 3,
    image_paths: ["/images/property-1.jpg"],
    amenities: ["Piscina", "Jardín", "Garaje", "Terraza"],
    owner_id: "owner1",
    agency_id: "agency1",
    created_at: "2024-01-15"
  },
  {
    id: "2",
    title: "Apartamento en el centro de Madrid",
    description: "Apartamento moderno en el corazón de Madrid",
    price: 180000,
    location: "Madrid Centro",
    bedrooms: 2,
    bathrooms: 2,
    image_paths: ["/images/property-2.jpg"],
    amenities: ["Ascensor", "Terraza", "Aire Acondicionado"],
    owner_id: "owner2",
    agency_id: "agency2",
    created_at: "2024-01-10"
  },
  {
    id: "3",
    title: "Casa rural en Asturias",
    description: "Encantadora casa rural con vistas a las montañas",
    price: 320000,
    location: "Asturias",
    bedrooms: 3,
    bathrooms: 2,
    image_paths: ["/images/property-3.jpg"],
    amenities: ["Jardín", "Chimenea", "Vistas", "Senderismo"],
    owner_id: "owner3",
    agency_id: "agency3",
    created_at: "2024-01-05"
  }
];

export const featuredPropertiesExample = properties; 