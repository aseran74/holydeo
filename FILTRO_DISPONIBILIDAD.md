# Filtro de Disponibilidad de Propiedades

## Descripción

Se ha implementado un sistema de filtrado automático que excluye las propiedades ocupadas cuando se seleccionan fechas de llegada y salida en la búsqueda.

## Funcionalidad

### Cómo Funciona

1. **Detección Automática**: Cuando el usuario selecciona fechas de llegada (`checkIn`) y salida (`checkOut`), el sistema automáticamente aplica el filtro de disponibilidad.

2. **Consulta de Reservas**: El sistema consulta la tabla `bookings` para encontrar reservas que se solapan con las fechas seleccionadas:
   - Busca reservas con estado `'confirmada'`
   - Verifica solapamiento de fechas usando la lógica: `start_date <= checkOut AND end_date >= checkIn`

3. **Filtrado de Propiedades**: Excluye de los resultados las propiedades que tienen reservas confirmadas en las fechas seleccionadas.

### Implementación Técnica

#### Archivos Modificados

- `src/pages/Search/SearchPage.tsx`: Lógica principal del filtro de disponibilidad

#### Lógica de Solapamiento

```typescript
// Una reserva se solapa si:
// - La fecha de inicio de la reserva es anterior o igual a la fecha de salida de la búsqueda
// - Y la fecha de fin de la reserva es posterior o igual a la fecha de llegada de la búsqueda
const { data: bookings } = await supabase
  .from('bookings')
  .select('property_id, start_date, end_date, status')
  .or(`and(start_date.lte.${checkOutDate},end_date.gte.${checkInDate})`)
  .eq('status', 'confirmada');
```

### Indicadores Visuales

#### Filtro Activo
- Se muestra una etiqueta "✅ Solo propiedades disponibles" cuando el filtro está activo
- Aparece en la sección de filtros activos junto con otros filtros

#### Sin Resultados
- Cuando no hay propiedades disponibles, se muestra un mensaje específico
- Incluye las fechas seleccionadas en el mensaje
- Proporciona consejos para el usuario

### Casos de Uso

1. **Búsqueda con Fechas**: El usuario selecciona fechas y solo ve propiedades disponibles
2. **Búsqueda sin Fechas**: El usuario ve todas las propiedades sin filtro de disponibilidad
3. **Sin Resultados**: Se informa al usuario que no hay propiedades disponibles para las fechas seleccionadas

### Manejo de Errores

- Si hay un error al consultar las reservas, se muestran todas las propiedades
- Los errores se registran en la consola para debugging
- El sistema es resiliente y no bloquea la búsqueda en caso de problemas

### Beneficios

1. **Experiencia de Usuario Mejorada**: Los usuarios solo ven propiedades realmente disponibles
2. **Reducción de Confusión**: Evita mostrar propiedades que no se pueden reservar
3. **Eficiencia**: Ahorra tiempo al usuario al filtrar automáticamente
4. **Transparencia**: Informa claramente cuando se aplica el filtro

### Consideraciones Técnicas

- **Performance**: La consulta de disponibilidad se ejecuta solo cuando hay fechas seleccionadas
- **Escalabilidad**: La lógica funciona con cualquier número de reservas
- **Mantenibilidad**: Código bien documentado y estructurado
- **Debugging**: Logs detallados para facilitar el troubleshooting

## Próximas Mejoras

1. **Caché de Disponibilidad**: Implementar caché para mejorar performance
2. **Filtros Avanzados**: Permitir mostrar propiedades ocupadas con indicador visual
3. **Calendario de Disponibilidad**: Mostrar calendario con fechas ocupadas/disponibles
4. **Notificaciones**: Alertar cuando una propiedad se reserva mientras el usuario está viendo resultados 