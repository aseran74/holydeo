// Lista centralizada de amenities para toda la app
export interface Amenity {
  key: string;
  label: string; // Español
  icon?: string; // opcional, clase de icono
}

export const AMENITIES: Amenity[] = [
  { key: 'wifi', label: 'Wifi', icon: 'la-wifi' },
  { key: 'aire_acondicionado', label: 'Aire acondicionado', icon: 'la-snowflake' },
  { key: 'piscina', label: 'Piscina', icon: 'la-swimming-pool' },
  { key: 'parking', label: 'Parking', icon: 'la-parking' },
  { key: 'terraza', label: 'Terraza', icon: 'la-umbrella-beach' },
  { key: 'jardín', label: 'Jardín', icon: 'la-seedling' },
  { key: 'barbacoa', label: 'Barbacoa', icon: 'la-hotdog' },
  { key: 'ascensor', label: 'Ascensor', icon: 'la-elevator' },
  { key: 'lavadora', label: 'Lavadora', icon: 'la-soap' },
  { key: 'secadora', label: 'Secadora', icon: 'la-tshirt' },
  { key: 'calefacción', label: 'Calefacción', icon: 'la-fire' },
  { key: 'cocina', label: 'Cocina', icon: 'la-utensils' },
  { key: 'lavavajillas', label: 'Lavavajillas', icon: 'la-blender' },
  { key: 'microondas', label: 'Microondas', icon: 'la-microchip' },
  { key: 'nevera', label: 'Nevera', icon: 'la-icicles' },
  { key: 'cafetera', label: 'Cafetera', icon: 'la-coffee' },
  { key: 'plancha', label: 'Plancha', icon: 'la-iron' },
  { key: 'tv', label: 'Televisión', icon: 'la-tv' },
  { key: 'ropa_cama', label: 'Ropa de cama', icon: 'la-bed' },
  { key: 'toallas', label: 'Toallas', icon: 'la-bath' },
  { key: 'mascotas', label: 'Mascotas permitidas', icon: 'la-dog' },
  { key: 'no_fumar', label: 'No fumar', icon: 'la-smoking-ban' },
  { key: 'accesible', label: 'Accesible', icon: 'la-wheelchair' },
  { key: 'gimnasio', label: 'Gimnasio', icon: 'la-dumbbell' },
  { key: 'chimenea', label: 'Chimenea', icon: 'la-fireplace' },
  { key: 'balcón', label: 'Balcón', icon: 'la-building' },
  { key: 'vistas', label: 'Vistas al mar', icon: 'la-water' },
  { key: 'cuna', label: 'Cuna', icon: 'la-baby-carriage' },
  { key: 'desayuno', label: 'Desayuno incluido', icon: 'la-bread-slice' },
  { key: 'servicio_limpieza', label: 'Servicio de limpieza', icon: 'la-broom' },
]; 