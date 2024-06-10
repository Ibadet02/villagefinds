import clsx from 'clsx';

import ArrowSvg from '/assets/common/icons/Arrow.svg';

export interface IArrowIconProps {
  onClick?: () => void;
  className?: string;
}

export function ArrowIcon({ className = '', ...attrs }: IArrowIconProps) {
  return (
    <img
      alt="Arrow Icon"
      src={ArrowSvg}
      className={clsx('h-6 w-6', className)}
      {...attrs}
    />
  );
}
