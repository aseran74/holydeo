

const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-pulse">
      {/* Skeleton para la imagen */}
      <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
      
      {/* Skeleton para el contenido */}
      <div className="p-6">
        {/* Título */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
        
        {/* Descripción */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
        
        {/* Precio */}
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
        
        {/* Información adicional */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard; 