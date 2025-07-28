import { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Image as ImageIcon } from 'lucide-react';

const ImageUploadTest = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    setUploading(true);
    setError(null);
    const newUrls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const filePath = `test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      
      try {
        console.log('Intentando subir archivo:', file.name);
        const { data, error } = await supabase.storage.from('property-images').upload(filePath, file);
        
        if (error) {
          console.error('Error subiendo imagen:', error);
          setError(`Error subiendo ${file.name}: ${error.message}`);
          continue;
        }
        
        console.log('Archivo subido exitosamente:', data);
        const { data: urlData } = supabase.storage.from('property-images').getPublicUrl(filePath);
        
        if (urlData?.publicUrl) {
          newUrls.push(urlData.publicUrl);
          console.log('URL pública generada:', urlData.publicUrl);
        }
      } catch (err) {
        console.error('Error inesperado:', err);
        setError(`Error inesperado subiendo ${file.name}`);
      }
    }
    
    setUploadedUrls(prev => [...prev, ...newUrls]);
    setUploading(false);
  };

  const handleRemoveImage = async (url: string) => {
    try {
      const path = url.split('/property-images/')[1];
      if (path) {
        const { error } = await supabase.storage.from('property-images').remove([path]);
        if (error) {
          console.error('Error eliminando imagen:', error);
          setError(`Error eliminando imagen: ${error.message}`);
        } else {
          setUploadedUrls(prev => prev.filter(u => u !== url));
        }
      }
    } catch (err) {
      console.error('Error inesperado eliminando imagen:', err);
      setError('Error inesperado eliminando imagen');
    }
  };

  const testBucketAccess = async () => {
    try {
      console.log('Probando acceso al bucket...');
      const { data, error } = await supabase.storage.from('property-images').list();
      
      if (error) {
        console.error('Error accediendo al bucket:', error);
        setError(`Error accediendo al bucket: ${error.message}`);
      } else {
        console.log('Archivos en el bucket:', data);
        setError(null);
      }
    } catch (err) {
      console.error('Error inesperado probando bucket:', err);
      setError('Error inesperado probando bucket');
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4">Prueba de Subida de Imágenes</h2>
      
      <div className="mb-4">
        <button
          onClick={testBucketAccess}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Probar Acceso al Bucket
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">
          Subir Imágenes de Prueba
        </label>
        <div
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition relative bg-gray-50 dark:bg-gray-700"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
          <span className="text-gray-500 dark:text-gray-400">
            {uploading ? 'Subiendo imágenes...' : 'Haz clic para seleccionar imágenes'}
          </span>
        </div>
      </div>

      {uploadedUrls.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Imágenes Subidas:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {uploadedUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img 
                  src={url} 
                  alt={`Imagen ${index + 1}`} 
                  className="w-full h-32 object-cover rounded shadow"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  onClick={() => handleRemoveImage(url)}
                  title="Eliminar imagen"
                >
                  ×
                </button>
                <div className="mt-2 text-xs text-gray-500 break-all">
                  {url}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
        <h3 className="font-semibold mb-2">Información de Debug:</h3>
        <div className="text-sm">
          <p><strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL}</p>
          <p><strong>Anon Key configurada:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Sí' : 'No'}</p>
          <p><strong>Imágenes subidas:</strong> {uploadedUrls.length}</p>
          <p><strong>Estado de subida:</strong> {uploading ? 'Subiendo...' : 'Inactivo'}</p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadTest; 