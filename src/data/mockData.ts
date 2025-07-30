import { Property } from '../types';

export const featuredPropertiesExample: Property[] = [
  {
    id: "1",
    title: "Villa Marina con Vista al Mar",
    description: "Hermosa villa con vistas espectaculares al mar Mediterráneo",
    price: 150,
    location: "Marbella, Málaga",
    bedrooms: 4,
    bathrooms: 3,
    guests: 8,
    images: ["/images/cards/card-01.jpg"],
    featured: true,
    amenities: ["Piscina", "WiFi", "Aire acondicionado", "Cocina equipada"]
  },
  {
    id: "2",
    title: "Apartamento en el Centro Histórico",
    description: "Encantador apartamento en el corazón de la ciudad antigua",
    price: 85,
    location: "Sevilla, Andalucía",
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    images: ["/images/cards/card-02.jpg"],
    featured: true,
    amenities: ["Terraza", "WiFi", "Calefacción", "Cocina"]
  },
  {
    id: "3",
    title: "Casa Rural en la Montaña",
    description: "Casa tradicional con vistas panorámicas de la sierra",
    price: 120,
    location: "Sierra de Grazalema, Cádiz",
    bedrooms: 3,
    bathrooms: 2,
    guests: 6,
    images: ["/images/cards/card-03.jpg"],
    featured: true,
    amenities: ["Chimenea", "Jardín", "WiFi", "Estacionamiento"]
  }
]; 