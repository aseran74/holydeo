import { useRef, useState } from "react";
import { supabase } from '../../supabaseClient';
import { Upload, X } from 'lucide-react';

interface MultipleImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  bucketName?: string;
}

const MultipleImageUploader: React.FC<MultipleImageUploaderProps> = ({ 
  images, 
  onImagesChange, 
  maxImages = 5,
  bucketName = "experience"
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Verificar límite de imágenes
    if (images.length + files.length > maxImages) {
      alert(`No puedes subir más de ${maxImages} imágenes`);
      return;
    }

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of files) {
      try {
        const fileExt = file.name.split('.').pop();
        const filePath = `${bucketName}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        
        const { error } = await supabase.storage.from(bucketName).upload(filePath, file);
        if (error) {
          console.error('Error subiendo imagen:', error);
          alert('Error subiendo imagen: ' + error.message);
          continue;
        }

        const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
        if (urlData?.publicUrl) {
          newUrls.push(urlData.publicUrl);
        }
      } catch (error) {
        console.error('Error procesando imagen:', error);
      }
    }

    onImagesChange([...images, ...newUrls]);
    setUploading(false);
    
    // Limpiar el input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageUrl = images[index];
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);

    // Intentar eliminar del storage si es una URL de Supabase
    if (imageUrl.includes('supabase.co')) {
      try {
        const path = imageUrl.split('/').pop();
        if (path) {
          await supabase.storage.from(bucketName).remove([path]);
        }
      } catch (error) {
        console.error('Error eliminando imagen del storage:', error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const fileList = new DataTransfer();
      files.forEach(file => fileList.items.add(file));
      if (fileInputRef.current) {
        fileInputRef.current.files = fileList.files;
        handleFileChange({ target: { files: fileList.files } } as any);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Área de subida */}
      <div
        className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors ${
          uploading ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 mb-2">
          {uploading ? 'Subiendo imágenes...' : 'Arrastra imágenes aquí o haz clic para seleccionar'}
        </p>
        <p className="text-xs text-gray-500">
          {images.length}/{maxImages} imágenes subidas
        </p>
        <button
          type="button"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
        >
          {uploading ? 'Subiendo...' : 'Seleccionar Imágenes'}
        </button>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      {/* Galería de imágenes */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`Imagen ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg shadow-sm"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder.jpg';
                }}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultipleImageUploader; 