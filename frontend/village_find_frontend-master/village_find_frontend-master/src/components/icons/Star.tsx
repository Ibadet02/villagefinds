import clsx from 'clsx';

import FillStarSvg from '/assets/common/icons/Star-active.svg';
import EmptyStarSvg from '/assets/common/icons/Star-empty.svg';

export interface IStarIconProps {
  onClick?: () => void;
  className?: string;
  active?: boolean;
}

export function StarIcon({
  className = '',
  active = false,
  ...attrs
}: IStarIconProps) {
  return (
    <img
      alt="Star Icon"
      src={active ? FillStarSvg : EmptyStarSvg}
      className={clsx('h-6 w-6', className)}
      {...attrs}
    />
  );
}
