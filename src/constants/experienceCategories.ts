export const EXPERIENCE_CATEGORIES = [
  { value: 'Actividad Turística', label: 'Actividad Turística' },
  { value: 'Gastronómica', label: 'Gastronómica' },
  { value: 'Deportiva', label: 'Deportiva' },
  { value: 'greenfees', label: 'Green fees' },
  { value: 'Experiencias de larga duración', label: 'Experiencias de larga duración' },
];

export type ExperienceCategory = typeof EXPERIENCE_CATEGORIES[number]['value'];

export const getCategoryLabel = (value: string): string => {
  const category = EXPERIENCE_CATEGORIES.find(cat => cat.value === value);
  return category ? category.label : value;
};
