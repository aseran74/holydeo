import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import Select from '../form/Select';
import TextArea from '../form/input/TextArea';
interface Experience {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  location: string;
  max_guests: number;
  what_is_included: string;
  what_is_needed: string;
  photos: string[];
  created_at: string;
  external_url?: string;
  featured?: boolean;
  recurring_dates?: {
    type: string;
    dates: string[];
    days: string[];
  };
}
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { es } from 'date-fns/locale';
import ImageUploader from '../common/ImageUploader';

interface ExperienceModalProps {
  experience: Experience | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ExperienceModal = ({ experience, onClose, onSuccess }: ExperienceModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Actividad Turística',
    external_url: '',
    price: '',
    description: '',
    what_is_included: '',
    what_is_needed: '',
    featured: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [isWeekly, setIsWeekly] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (experience) {
      setFormData({
        name: experience.name || '',
        category: experience.category || 'Actividad Turística',
        external_url: experience.external_url || '',
        price: experience.price?.toString() || '',
        description: experience.description || '',
        what_is_included: experience.what_is_included || '',
        what_is_needed: experience.what_is_needed || '',
        featured: experience.featured || false,
      });
      
      setPhotos(experience.photos || []);

      if (experience.recurring_dates) {
        const { type, dates, days } = experience.recurring_dates;
        if (type === 'weekly' && days) {
          setIsWeekly(true);
          // For weekly, we just set the toggle, DayPicker doesn't need specific dates.
        } else if (type === 'specific' && dates) {
          setIsWeekly(false);
          setSelectedDays(dates.map((d: string) => new Date(d)));
        }
      }
    }
  }, [experience]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    let recurring_dates = null;
    if (isWeekly) {
      recurring_dates = { type: 'weekly', days: selectedDays.map(d => d.getDay()) };
    } else if (selectedDays.length > 0) {
      recurring_dates = { type: 'specific', dates: selectedDays.map(d => d.toISOString().split('T')[0]) };
    }

    const experienceData = {
      ...formData,
      price: parseFloat(formData.price) || null,
      recurring_dates,
      photos,
    };

    const { error } = experience
      ? await supabase.from('experiences').update(experienceData).eq('id', experience.id)
      : await supabase.from('experiences').insert([experienceData]);

    if (error) {
      alert('Error guardando la experiencia: ' + error.message);
    } else {
      onSuccess();
    }
    setIsSaving(false);
  };
  
  const categoryOptions = [
    { value: 'Actividad Turística', label: 'Actividad Turística' },
    { value: 'Gastronómica', label: 'Gastronómica' },
    { value: 'Deportiva', label: 'Deportiva' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full max-h-full overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{experience ? 'Editar' : 'Añadir'} Experiencia</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div>
              <Label>Nombre</Label>
              <Input name="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} />
            </div>
            <div>
              <Label>Categoría</Label>
              <Select onChange={(value) => setFormData(prev => ({ ...prev, category: value }))} options={categoryOptions} />
            </div>
            <div>
              <Label>URL Externa</Label>
              <Input name="external_url" value={formData.external_url} onChange={(e) => setFormData(prev => ({ ...prev, external_url: e.target.value }))} />
            </div>
            <div>
              <Label>Precio (€)</Label>
              <Input name="price" type="number" value={formData.price} onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))} />
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                />
                <Label htmlFor="featured">Experiencia Destacada</Label>
            </div>
            <div>
                <Label>Descripción</Label>
                <TextArea value={formData.description} onChange={(value) => setFormData(prev => ({ ...prev, description: value }))} rows={4}/>
            </div>
            <div>
                <Label>¿Qué entra?</Label>
                <TextArea value={formData.what_is_included} onChange={(value) => setFormData(prev => ({ ...prev, what_is_included: value }))} rows={3}/>
            </div>
            <div>
                <Label>¿Qué se necesita?</Label>
                <TextArea value={formData.what_is_needed} onChange={(value) => setFormData(prev => ({ ...prev, what_is_needed: value }))} rows={3}/>
            </div>
          </div>
          
          <div className="md:col-span-1 space-y-4">
            <div>
              <Label>Fotos</Label>
              <ImageUploader
                initialUrl={photos.join(',')}
                onUpload={(url: string) => setPhotos(url ? url.split(',').filter(Boolean) : [])}
                bucketName="experience-images"
              />
            </div>
            <div>
              <Label>Fechas</Label>
              <div className="flex items-center gap-4 mb-2">
                <input type="checkbox" checked={isWeekly} onChange={(e) => setIsWeekly(e.target.checked)} id="isWeekly" />
                <label htmlFor="isWeekly">Repetir cada semana</label>
              </div>
              <div className="border rounded-lg p-2">
                <DayPicker
                  mode="multiple"
                  selected={selectedDays}
                  onSelect={setSelectedDays as any}
                  locale={es}
                  showOutsideDays
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {isWeekly ? "Selecciona los días de la semana que se repiten." : "Selecciona fechas específicas."}
              </p>
            </div>
          </div>

          <div className="md:col-span-2 mt-6 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExperienceModal; 