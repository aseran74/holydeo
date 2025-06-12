import "@/styles/__dates_picker.scss";

export default function BlockDates({ propertyId }: { propertyId: string }) {
  // ... (lógica existente)

  return (
    <div className="p-4 border rounded-lg addListingDatePickerExclude">
      <h3 className="text-lg font-semibold mb-2">Bloquear Fechas</h3>
      <p className="text-sm text-gray-500 mb-4">Haz clic en los días del calendario para marcarlos como no disponibles.</p>
      <DatePicker
        inline
        selected={null}
        onChange={handleDateChange}
        highlightDates={blockedDates}
        monthsShown={2}
        dayClassName={d => blockedDates.some(bd => bd.toDateString() === d.toDateString()) ? 'react-datepicker__day--disabled' : ''}
      />
    </div>
  );
} 