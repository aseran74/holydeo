import { useRef, useState } from "react";
import { supabase } from '../../supabaseClient';

interface ImageUploaderProps {
  bucketName: string;
  initialUrl?: string;
  onUpload: (url: string) => void;
  label?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ bucketName, initialUrl, onUpload, label }) => {
  const [imageUrl, setImageUrl] = useState(initialUrl || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `${bucketName}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const { error } = await supabase.storage.from(bucketName).upload(filePath, file);
    if (error) {
      alert('Error subiendo imagen: ' + error.message);
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    if (urlData?.publicUrl) {
      setImageUrl(urlData.publicUrl);
      onUpload(urlData.publicUrl);
    }
    setUploading(false);
  };

  return (
    <div className="flex flex-col gap-2 items-start">
      {label && <label className="font-medium mb-1">{label}</label>}
      <div className="flex items-center gap-4">
        {imageUrl && (
          <img src={imageUrl} alt="preview" className="w-16 h-16 object-cover rounded shadow" />
        )}
        <button
          type="button"
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Subiendo...' : imageUrl ? 'Cambiar foto' : 'Subir foto'}
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ImageUploader; 