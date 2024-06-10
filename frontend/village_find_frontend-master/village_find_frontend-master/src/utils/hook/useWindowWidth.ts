import { useState, useEffect } from 'react';

type BPType = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
interface IBreakPoint {
  breakpoint: BPType;
  minWidth: number;
}

export function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [breakpoint, setBreakpoint] = useState<BPType>('none');
  const breakpoints: IBreakPoint[] = [
    {
      breakpoint: 'none',
      minWidth: 0,
    },
    {
      breakpoint: 'xs',
      minWidth: 425,
    },
    {
      breakpoint: 'sm',
      minWidth: 640,
    },
    {
      breakpoint: 'md',
      minWidth: 768,
    },
    {
      breakpoint: 'lg',
      minWidth: 1024,
    },
    {
      breakpoint: 'xl',
      minWidth: 1280,
    },
    {
      breakpoint: '2xl',
      minWidth: 1536,
    },
    {
      breakpoint: '3xl',
      minWidth: 1920,
    },
  ];

  const onWindowResize = () => {
    setWindowWidth(window.innerWidth);
    const firstbp =
      breakpoints.find(
        (_: IBreakPoint, index: number, total: IBreakPoint[]) => {
          const nextItem = total[index + 1] ?? { minWidth: 2560 };
          return nextItem.minWidth > window.innerWidth;
        },
      ) || breakpoints[0];
    return setBreakpoint(firstbp.breakpoint);
  };

  useEffect(() => {
    onWindowResize();
    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  return [windowWidth, breakpoint];
}
