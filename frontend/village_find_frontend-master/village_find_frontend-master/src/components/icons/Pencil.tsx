import clsx from 'clsx';

import PencilSvg from '/assets/common/icons/Pencil.svg';

export interface IPencilIconProps {
  onClick?: () => void;
  className?: string;
  style?: any;
}

export function PencilIcon({
  className = '',
  onClick = () => { },
}: IPencilIconProps) {
  return (
    <img
      alt="Pencil Icon"
      src={PencilSvg}
      className={clsx('h-6 w-6', className)}
      onClick={onClick}
    />
  );
}
