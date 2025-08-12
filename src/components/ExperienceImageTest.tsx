import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { AlertCircle } from 'lucide-react';

const ExperienceImageTest = () => {
  const [bucketStatus, setBucketStatus] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [testImageUrl, setTestImageUrl] = useState<string>('');
  const [testResult, setTestResult] = useState<string>('');

  const checkBucket = async () => {
    try {
      // Verificar si el bucket existe
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      if (bucketsError) {
        setBucketStatus({ error: bucketsError.message });
        return;
      }

      const experienceBucket = buckets.find(b => b.name === 'experience');
      if (!experienceBucket) {
        setBucketStatus({ error: 'Bucket "experience" no encontrado' });
        return;
      }

      // Listar archivos en el bucket
      const { data: filesList, error: filesError } = await supabase.storage
        .from('experience')
        .list('', { limit: 100 });

      if (filesError) {
        setBucketStatus({ error: filesError.message });
        return;
      }

      setFiles(filesList || []);
      setBucketStatus({ 
        success: true, 
        bucket: experienceBucket,
        filesCount: filesList?.length || 0
      });
    } catch (error) {
      setBucketStatus({ error: error instanceof Error ? error.message : 'Error desconocido' });
    }
  };

  const testImageDisplay = async () => {
    if (files.length === 0) {
      setTestResult('No hay archivos para probar');
      return;
    }

    const testFile = files[0];
    try {
      // Generar URL pública
      const { data } = supabase.storage
        .from('experience')
        .getPublicUrl(testFile.name);

      if (data?.publicUrl) {
        setTestImageUrl(data.publicUrl);
        setTestResult(`URL generada: ${data.publicUrl}`);
      } else {
        setTestResult('Error: No se pudo generar la URL pública');
      }
    } catch (error) {
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const testExperienceData = async () => {
    try {
      // Obtener una experiencia de prueba
      const { data: experiences, error } = await supabase
        .from('experiences')
        .select('id, name, photos')
        .limit(1);

      if (error) {
        setTestResult(`Error obteniendo experiencias: ${error.message}`);
        return;
      }

      if (experiences && experiences.length > 0) {
        const experience = experiences[0];
        setTestResult(`Experiencia: ${experience.name}, Fotos: ${JSON.stringify(experience.photos)}`);
        
        // Probar la función getExperienceImageUrl
        if (experience.photos && experience.photos.length > 0) {
          const firstPhoto = experience.photos[0];
          let imageUrl = firstPhoto;
          
          if (!firstPhoto.startsWith('http')) {
            const { data } = supabase.storage
              .from('experience')
              .getPublicUrl(firstPhoto);
            imageUrl = data.publicUrl || firstPhoto;
          }
          
          setTestImageUrl(imageUrl);
          setTestResult(prev => prev + `\nURL de imagen: ${imageUrl}`);
        }
      } else {
        setTestResult('No se encontraron experiencias');
      }
    } catch (error) {
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Prueba de Imágenes de Experiencias
      </h2>

      {/* Botón para verificar bucket */}
      <div className="mb-6">
        <button
          onClick={checkBucket}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Verificar Bucket de Storage
        </button>
      </div>

      {/* Estado del bucket */}
      {bucketStatus && (
        <div className={`p-4 rounded-lg mb-6 ${
          bucketStatus.error ? 'bg-red-100 border border-red-300' : 'bg-green-100 border border-green-300'
        }`}>
          {bucketStatus.error ? (
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{bucketStatus.error}</span>
            </div>
          ) : (
            <div className="text-green-700">
              <p><strong>Bucket encontrado:</strong> {bucketStatus.bucket.name}</p>
              <p><strong>Archivos:</strong> {bucketStatus.filesCount}</p>
              <p><strong>Público:</strong> {bucketStatus.bucket.public ? 'Sí' : 'No'}</p>
            </div>
          )}
        </div>
      )}

      {/* Lista de archivos */}
      {files.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Archivos en el bucket:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, index) => (
              <div key={index} className="border rounded-lg p-3 bg-gray-50">
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-xs text-gray-500">
                  Tamaño: {(file.metadata?.size / 1024).toFixed(1)} KB
                </p>
                <p className="text-xs text-gray-500">
                  Creado: {new Date(file.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botones de prueba */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={testImageDisplay}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Probar Generación de URL
        </button>
        <button
          onClick={testExperienceData}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Probar Datos de Experiencias
        </button>
      </div>

      {/* Resultados de las pruebas */}
      {testResult && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Resultados de las pruebas:</h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
          </div>
        </div>
      )}

      {/* Imagen de prueba */}
      {testImageUrl && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Imagen de prueba:</h3>
          <div className="border rounded-lg p-4 bg-gray-50">
            <img
              src={testImageUrl}
              alt="Imagen de prueba"
              className="max-w-full h-auto max-h-64 rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder.jpg';
                setTestResult(prev => prev + '\nError: La imagen no se pudo cargar');
              }}
            />
            <p className="text-sm text-gray-600 mt-2">URL: {testImageUrl}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceImageTest;
