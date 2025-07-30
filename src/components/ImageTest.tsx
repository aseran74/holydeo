import React from 'react';

const ImageTest: React.FC = () => {
  const testImages = [
    'https://wnevxdjytvbelknmtglf.supabase.co/storage/v1/object/public/property-images/property_1753695481752_kmvf6r.webp',
    'https://wnevxdjytvbelknmtglf.supabase.co/storage/v1/object/public/property-images/property_1753695407955_m4rvkf.webp',
    'https://wnevxdjytvbelknmtglf.supabase.co/storage/v1/object/public/property-images/property-images_1753012657192_7cun5a.webp'
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Prueba de Imágenes de Supabase</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testImages.map((url, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Imagen {index + 1}</h3>
            <p className="text-sm text-gray-600 mb-2 break-all">{url}</p>
            <div className="relative h-48 bg-gray-100 rounded">
              <img 
                src={url} 
                alt={`Test image ${index + 1}`}
                className="w-full h-full object-cover rounded"
                onError={(e) => {
                  console.log(`Error loading image ${index + 1}:`, url);
                  e.currentTarget.style.display = 'none';
                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                }}
                onLoad={() => {
                  console.log(`Image ${index + 1} loaded successfully:`, url);
                }}
              />
              <div 
                className="hidden w-full h-full items-center justify-center text-red-500 font-bold"
                style={{display: 'none'}}
              >
                ❌ Error al cargar
              </div>
            </div>
            <button 
              onClick={() => window.open(url, '_blank')}
              className="mt-2 w-full btn btn-sm btn-outline"
            >
              Abrir en nueva pestaña
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageTest; 