import React from "react";
import Image from "next/image";

interface MiniStayCardProps {
  property: any;
  onClose?: () => void;
}

const MiniStayCard: React.FC<MiniStayCardProps> = ({ property, onClose }) => {
  const gallery = Array.isArray(property.gallery) && property.gallery.length > 0 ? property.gallery : ["/no-image.jpg"];
  return (
    <div className="bg-white rounded-xl shadow-lg p-2 flex items-center space-x-3 min-w-[220px] max-w-xs border border-neutral-200 relative">
      {onClose && (
        <button
          className="absolute top-1 right-1 text-neutral-400 hover:text-neutral-700"
          onClick={onClose}
        >
          <span className="text-lg">×</span>
        </button>
      )}
      <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100">
        <Image
          src={gallery[0]}
          alt={property.title}
          width={64}
          height={64}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate">{property.title}</div>
        <div className="text-xs text-neutral-500 truncate">{property.address}</div>
        <div className="text-primary-600 font-bold text-base mt-1">
          {property.price ? `€${property.price}` : "Sin precio"}
          <span className="text-xs text-neutral-400 font-normal ml-1">/noche</span>
        </div>
      </div>
    </div>
  );
};

export default MiniStayCard; 