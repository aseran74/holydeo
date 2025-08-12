import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { AlertCircle, Upload, Trash2 } from 'lucide-react';

const ExperienceStorageTest = () => {
  const [bucketStatus, setBucketStatus] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [testImageUrl, setTestImageUrl] = useState<string>('');
  const [testResult, setTestResult] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const checkBucket = async () => {
    try {
      console.log('Verificando bucket "experience"...');
      
      // Verificar si el bucket existe
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      if (bucketsError) {
        console.error('Error listando buckets:', bucketsError);
        setBucketStatus({ error: bucketsError.message });
        return;
      }

      console.log('Buckets disponibles:', buckets);
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
        console.error('Error listando archivos:', filesError);
        setBucketStatus({ error: filesError.message });
        return;
      }

      console.log('Archivos en bucket experience:', filesList);
      setFiles(filesList || []);
      setBucketStatus({ 
        success: true, 
        bucket: experienceBucket,
        filesCount: filesList?.length || 0
      });
    } catch (error) {
      console.error('Error inesperado:', error);
      setBucketStatus({ error: error instanceof Error ? error.message : 'Error desconocido' });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('Archivo seleccionado:', file.name, file.size, file.type);
    }
  };

  const uploadTestImage = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      console.log('Subiendo imagen de prueba...');
      
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      
      console.log('Nombre del archivo:', fileName);
      
      const { error: uploadError } = await supabase.storage
        .from('experience')
        .upload(fileName, selectedFile);

      if (uploadError) {
        console.error('Error subiendo archivo:', uploadError);
        setTestResult(`Error subiendo: ${uploadError.message}`);
        return;
      }

      console.log('Archivo subido exitosamente');
      
      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('experience')
        .getPublicUrl(fileName);

      if (urlData?.publicUrl) {
        setTestImageUrl(urlData.publicUrl);
        setTestResult('✅ Imagen subida exitosamente');
        console.log('URL pública generada:', urlData.publicUrl);
        
        // Refrescar lista de archivos
        checkBucket();
      } else {
        setTestResult('❌ No se pudo generar URL pública');
      }
    } catch (error) {
      console.error('Error inesperado subiendo:', error);
      setTestResult(`Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setUploading(false);
    }
  };

  const testExperienceData = async () => {
    try {
      console.log('Probando consulta a tabla experiences...');
      
      const { data, error } = await supabase
        .from('experiences')
        .select('id, name, photos')
        .limit(5);

      if (error) {
        console.error('Error consultando experiences:', error);
        setTestResult(`Error consultando experiences: ${error.message}`);
        return;
      }

      console.log('Experiencias encontradas:', data);
      setTestResult(`✅ ${data.length} experiencias encontradas. Primera: ${data[0]?.name || 'N/A'}`);
      
      // Probar acceso a fotos si existen
      if (data.length > 0 && data[0].photos && data[0].photos.length > 0) {
        const firstPhoto = data[0].photos[0];
        console.log('Primera foto:', firstPhoto);
        
        if (!firstPhoto.startsWith('http')) {
          const { data: urlData } = supabase.storage
            .from('experience')
            .getPublicUrl(firstPhoto);
          
          console.log('URL de foto generada:', urlData.publicUrl);
        }
      }
    } catch (error) {
      console.error('Error inesperado consultando experiences:', error);
      setTestResult(`Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const deleteTestFile = async (fileName: string) => {
    try {
      console.log('Eliminando archivo de prueba:', fileName);
      
      const { error } = await supabase.storage
        .from('experience')
        .remove([fileName]);

      if (error) {
        console.error('Error eliminando archivo:', error);
        alert('Error eliminando archivo: ' + error.message);
        return;
      }

      console.log('Archivo eliminado exitosamente');
      setTestImageUrl('');
      setTestResult('✅ Archivo de prueba eliminado');
      
      // Refrescar lista de archivos
      checkBucket();
    } catch (error) {
      console.error('Error inesperado eliminando:', error);
      alert('Error inesperado eliminando archivo');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        🔍 Diagnóstico del Bucket "experience"
      </h2>

      {/* Botón para verificar bucket */}
      <div className="mb-6">
        <button
          onClick={checkBucket}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Verificar Bucket "experience"
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
              <p><strong>Tamaño máximo:</strong> {(bucketStatus.bucket.file_size_limit / 1024 / 1024).toFixed(1)}MB</p>
            </div>
          )}
        </div>
      )}

      {/* Lista de archivos */}
      {files.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Archivos en el bucket:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {files.map((file, index) => (
              <div key={index} className="p-3 border rounded-lg bg-gray-50">
                <p className="font-mono text-sm truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.metadata?.size / 1024 / 1024).toFixed(2)}MB
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(file.updated_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subida de imagen de prueba */}
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Subir Imagen de Prueba</h3>
        
        <div className="flex items-center gap-4 mb-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="border rounded px-3 py-2"
          />
          <button
            onClick={uploadTestImage}
            disabled={!selectedFile || uploading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {uploading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Subiendo...
              </div>
            ) : (
              <div className="flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                Subir
              </div>
            )}
          </button>
        </div>

        {testImageUrl && (
          <div className="mb-3">
            <img 
              src={testImageUrl} 
              alt="Imagen de prueba" 
              className="w-32 h-32 object-cover rounded border"
            />
            <button
              onClick={() => deleteTestFile(testImageUrl.split('/').pop() || '')}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            >
              <Trash2 className="w-4 h-4 inline mr-1" />
              Eliminar
            </button>
          </div>
        )}
      </div>

      {/* Prueba de datos de experiencias */}
      <div className="mb-6">
        <button
          onClick={testExperienceData}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Probar Consulta a Tabla "experiences"
        </button>
      </div>

      {/* Resultado de pruebas */}
      {testResult && (
        <div className={`p-4 rounded-lg ${
          testResult.includes('✅') ? 'bg-green-100 border border-green-300' : 
          testResult.includes('❌') ? 'bg-red-100 border border-red-300' : 
          'bg-blue-100 border border-blue-300'
        }`}>
          <p className="font-mono text-sm">{testResult}</p>
        </div>
      )}

      {/* Información de debug */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Información de Debug</h3>
        <p className="text-sm text-gray-600">
          <strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL}<br/>
          <strong>Bucket configurado:</strong> experience<br/>
          <strong>Tabla:</strong> experiences<br/>
          <strong>Columna de fotos:</strong> photos (TEXT[])
        </p>
      </div>
    </div>
  );
};

export default ExperienceStorageTest;
