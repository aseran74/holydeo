import { useCallback } from 'react';

export const useShareExperience = () => {
  // Función para compartir en redes sociales
  const shareOnSocial = useCallback((platform: string, url: string, title: string, description: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=CHISREACT`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  }, []);

  // Función para copiar enlace al portapapeles
  const copyToClipboard = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  }, []);

  // Función para compartir usando Web Share API (dispositivos móviles)
  const nativeShare = useCallback(async (title: string, text: string, url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url
        });
        return true;
      } catch (error) {
        console.error('Error sharing:', error);
        return false;
      }
    }
    return false;
  }, []);

  return {
    shareOnSocial,
    copyToClipboard,
    nativeShare
  };
};
