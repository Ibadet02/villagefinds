import { useEffect } from 'react';

export function useWindowScroll(callback: any) {
  useEffect(() => {
    window.addEventListener('scroll', callback);
    return () => {
      window.removeEventListener('scroll', callback);
    };
  }, []);
}
