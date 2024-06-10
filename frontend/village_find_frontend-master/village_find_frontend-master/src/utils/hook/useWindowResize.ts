import { useEffect } from 'react';

export function useWindowResize(callback: any) {
  useEffect(() => {
    window.addEventListener('resize', callback);
    return () => {
      window.removeEventListener('resize', callback);
    };
  }, []);
}
