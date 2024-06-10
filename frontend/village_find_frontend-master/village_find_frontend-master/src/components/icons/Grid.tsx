import clsx from 'clsx';

import GridSvg from '/assets/common/icons/Grid.svg';

export interface IGridIconProps {
  onClick?: () => void;
  className?: string;
}

export function GridIcon({ className = '', ...attrs }) {
  return (
    <img
      alt="Grid Icon"
      src={GridSvg}
      className={clsx('h-6 w-6', className)}
      {...attrs}
    />
  );
}
