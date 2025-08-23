import React, { useState } from 'react';
import { Share2, Facebook, Twitter, MessageCircle, Mail, Copy, X } from 'lucide-react';
import { useShareExperience } from '../../hooks/useShareExperience';
import useToast from '../../hooks/useToast';

interface ShareButtonProps {
  experienceId: string;
  experienceName: string;
  experienceDescription?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ShareButton: React.FC<ShareButtonProps> = ({
  experienceId,
  experienceName,
  experienceDescription = '',
  className = '',
  size = 'md'
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { shareOnSocial, copyToClipboard, nativeShare } = useShareExperience();
  const toast = useToast();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const currentUrl = `${window.location.origin}/experiences/${experienceId}`;
  const shareText = `¡Mira esta increíble experiencia: ${experienceName}!`;

  const handleShare = async (platform: string) => {
    try {
      if (platform === 'native') {
        const success = await nativeShare(experienceName, shareText, currentUrl);
        if (!success) {
          // Fallback a copiar enlace si no hay Web Share API
          await handleCopyLink();
        }
      } else if (platform === 'copy') {
        await handleCopyLink();
      } else {
        shareOnSocial(platform, currentUrl, experienceName, experienceDescription);
      }
      
      setShowShareMenu(false);
    } catch (error) {
      toast.error('Error', 'No se pudo compartir la experiencia');
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(currentUrl);
    if (success) {
      toast.success('Enlace copiado', 'El enlace ha sido copiado al portapapeles');
    } else {
      toast.error('Error', 'No se pudo copiar el enlace');
    }
  };

  const shareOptions = [
    { platform: 'facebook', icon: Facebook, label: 'Facebook', color: 'hover:bg-blue-600' },
    { platform: 'twitter', icon: Twitter, label: 'Twitter', color: 'hover:bg-blue-400' },
    { platform: 'whatsapp', icon: MessageCircle, label: 'WhatsApp', color: 'hover:bg-green-500' },
    { platform: 'email', icon: Mail, label: 'Email', color: 'hover:bg-gray-600' },
    { platform: 'copy', icon: Copy, label: 'Copiar enlace', color: 'hover:bg-purple-600' }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className={`
          ${sizeClasses[size]}
          flex items-center justify-center
          rounded-full transition-all duration-200
          bg-white text-gray-600 hover:bg-gray-100 border border-gray-300
          ${className}
        `}
        title="Compartir experiencia"
      >
        <Share2 className={iconSizes[size]} />
      </button>

      {/* Menú de compartir */}
      {showShareMenu && (
        <>
          {/* Overlay para cerrar al hacer clic fuera */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowShareMenu(false)}
          />
          
          {/* Menú de opciones */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-2">
              <div className="flex items-center justify-between mb-2 px-2">
                <h3 className="text-sm font-medium text-gray-900">Compartir en</h3>
                <button
                  onClick={() => setShowShareMenu(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-1">
                {shareOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.platform}
                      onClick={() => handleShare(option.platform)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700
                        rounded-md transition-colors duration-200
                        hover:bg-gray-100 ${option.color}
                      `}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;
