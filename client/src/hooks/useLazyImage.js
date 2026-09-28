import { useState, useEffect, useRef } from 'react';
import { getCachedImage, setCachedImage, fetchProductImage } from '../service/api.js';

/**
 * Hook para carga perezosa (lazy load) de imágenes con caché en memoria.
 * Maximiza el rendimiento en redes lentas y mala señal celular:
 * 1. Solo descarga la imagen cuando el elemento está a 250px de entrar en pantalla.
 * 2. Mantiene una caché en memoria para nunca descargar la misma imagen dos veces.
 * 3. En caso de corte o lentitud de red, no bloquea la interfaz de usuario.
 */
export const useLazyImage = (productId) => {
  const [imgSrc, setImgSrc] = useState(() => {
    if (!productId) return null;
    const cached = getCachedImage(productId);
    return (cached && cached !== 'loading' && cached !== 'none') ? cached : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!productId) {
      setImgSrc(null);
      return;
    }

    const cached = getCachedImage(productId);
    if (cached && cached !== 'loading') {
      setImgSrc(cached !== 'none' ? cached : null);
      return;
    }

    const el = cardRef.current;
    if (!el) return;

    let isMounted = true;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          observer.disconnect();
          const currentCached = getCachedImage(productId);
          if (currentCached === 'loading') return;
          if (currentCached && currentCached !== 'loading') {
            if (isMounted) setImgSrc(currentCached !== 'none' ? currentCached : null);
            return;
          }

          setCachedImage(productId, 'loading');
          if (isMounted) setIsLoading(true);

          const token = localStorage.getItem('token');
          fetchProductImage(productId, token)
            .then(data => {
              const src = data?.imagen || null;
              setCachedImage(productId, src || 'none');
              if (isMounted) {
                setImgSrc(src);
                setIsLoading(false);
              }
            })
            .catch(() => {
              // En caso de fallo o timeout por mala señal, guardar 'none' para no reintentar infinitamente en bucle
              setCachedImage(productId, 'none');
              if (isMounted) {
                setImgSrc(null);
                setIsLoading(false);
              }
            });
        }
      },
      { rootMargin: '250px' } // Pre-cargar con anticipación para que aparezca ya lista al scrollear
    );

    observer.observe(el);

    return () => {
      isMounted = false;
      observer.disconnect();
    };
  }, [productId]);

  return { imgSrc, isLoading, cardRef };
};

export default useLazyImage;
