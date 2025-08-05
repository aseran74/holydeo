import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import PageBreadCrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import Button from '../../components/ui/button/Button';
import Input from '../../components/form/input/InputField';
import Label from '../../components/form/Label';
import Select from '../../components/form/Select';
import TextArea from '../../components/form/input/TextArea';
import MultipleImageUploader from '../../components/common/MultipleImageUploader';
import GooglePlacesAutocomplete from '../../components/common/GooglePlacesAutocomplete';
import { Experience } from '../../types';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { es } from 'date-fns/locale';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

const ExperienceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [experience, setExperience] = useState<Experience | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Actividad Turística',
    location: '',
    price: '',
    duration_hours: '',
    max_participants: '',
    external_url: '',
    what_is_included: '',
    what_is_needed: '',
    featured: false,
  });

  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [isWeekly, setIsWeekly] = useState(false);

  // Cargar experiencia si es edición
  useEffect(() => {
    if (id && id !== 'new') {
      fetchExperience();
    }
  }, [id]);

  const fetchExperience = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching experience:', error);
      return;
    }

    setExperience(data);
    setFormData({
      name: data.name || '',
      description: data.description || '',
      category: data.category || 'Actividad Turística',
      location: data.location || '',
      price: data.price?.toString() || '',
      duration_hours: data.duration_hours?.toString() || '',
      max_participants: data.max_participants?.toString() || '',
      external_url: data.external_url || '',
      what_is_included: data.what_is_included || '',
      what_is_needed: data.what_is_needed || '',
      featured: data.featured || false,
    });

    setPhotos(data.photos || []);

    if (data.recurring_dates) {
      const { type, dates, days } = data.recurring_dates;
      if (type === 'weekly' && days) {
        setIsWeekly(true);
      } else if (type === 'specific' && dates) {
        setIsWeekly(false);
        setSelectedDays(dates.map((d: string) => new Date(d)));
      }
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let recurring_dates = null;
    if (isWeekly) {
      recurring_dates = { type: 'weekly', days: selectedDays.map(d => d.getDay()) };
    } else if (selectedDays.length > 0) {
      recurring_dates = { type: 'specific', dates: selectedDays.map(d => d.toISOString().split('T')[0]) };
    }

    const experienceData = {
      ...formData,
      price: parseFloat(formData.price) || null,
      duration_hours: parseInt(formData.duration_hours) || null,
      max_participants: parseInt(formData.max_participants) || null,
      recurring_dates,
      photos,
    };

    const { error } = id && id !== 'new'
      ? await supabase.from('experiences').update(experienceData).eq('id', id)
      : await supabase.from('experiences').insert([experienceData]);

    if (error) {
      console.error('Error saving experience:', error);
      alert('Error guardando la experiencia: ' + error.message);
    } else {
      navigate('/experiences');
    }
    setSaving(false);
  };

  const categoryOptions = [
    { value: 'Actividad Turística', label: 'Actividad Turística' },
    { value: 'Gastronómica', label: 'Gastronómica' },
    { value: 'Deportiva', label: 'Deportiva' },
  ];



  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <PageMeta 
        title={id === 'new' ? "Nueva Experiencia" : "Editar Experiencia"} 
        description="Formulario de experiencias turísticas" 
      />
      <PageBreadCrumb 
        pageTitle={id === 'new' ? "Nueva Experiencia" : "Editar Experiencia"} 
      />
      
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/experiences')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Volver a Experiencias
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                 <Label htmlFor="name">Nombre de la Experiencia *</Label>
                 <Input
                   id="name"
                   type="text"
                   value={formData.name}
                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                   placeholder="Ej: Tour por la Ciudad Vieja"
                   required
                 />
               </div>

              <div>
                <Label htmlFor="category">Categoría *</Label>
                <Select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  options={categoryOptions}
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Ubicación *</Label>
                <GooglePlacesAutocomplete
                  value={formData.location}
                  onChange={(value) => setFormData({ ...formData, location: value })}
                  placeholder="Buscar ubicación..."
                  className="w-full"
                />
              </div>

              
            </div>

            <div className="mt-6">
              <Label htmlFor="description">Descripción *</Label>
              <TextArea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe la experiencia en detalle..."
                rows={4}
                required
              />
            </div>
          </div>

          {/* Precios y Detalles */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Precios y Detalles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="price">Precio (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <Label htmlFor="duration_hours">Duración (horas)</Label>
                <Input
                  id="duration_hours"
                  type="number"
                  value={formData.duration_hours}
                  onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                  placeholder="2"
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="max_participants">Máximo Participantes</Label>
                <Input
                  id="max_participants"
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                  placeholder="10"
                  min="1"
                />
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="external_url">URL Externa</Label>
              <Input
                id="external_url"
                type="url"
                value={formData.external_url}
                onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                placeholder="https://ejemplo.com"
              />
            </div>
          </div>

          {/* Información Adicional */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Información Adicional</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="what_is_included">Qué está incluido</Label>
                <TextArea
                  id="what_is_included"
                  value={formData.what_is_included}
                  onChange={(e) => setFormData({ ...formData, what_is_included: e.target.value })}
                  placeholder="Guía, equipamiento, seguro..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="what_is_needed">Qué necesitas traer</Label>
                <TextArea
                  id="what_is_needed"
                  value={formData.what_is_needed}
                  onChange={(e) => setFormData({ ...formData, what_is_needed: e.target.value })}
                  placeholder="Ropa cómoda, calzado..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Imágenes */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Imágenes</h3>
            <MultipleImageUploader
              images={photos}
              onImagesChange={setPhotos}
              maxImages={5}
              bucketName="experience"
            />
          </div>

          {/* Configuración */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Configuración</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="featured" className="ml-2">
                  Destacar esta experiencia
                </Label>
              </div>

              
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/experiences')}
              className="flex items-center gap-2"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {id === 'new' ? 'Crear Experiencia' : 'Guardar Cambios'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExperienceForm; 