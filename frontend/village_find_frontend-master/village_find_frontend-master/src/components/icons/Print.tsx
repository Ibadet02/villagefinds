import clsx from 'clsx';

import PrintSvg from '/assets/common/icons/Print.svg';

export interface IPrintIconProps {
  onClick?: () => void;
  className?: string;
}

export function PrintIcon({ className = '', ...attrs }: IPrintIconProps) {
  return (
    <img
      alt="Print Icon"
      src={PrintSvg}
      className={clsx('h-6 w-6', className)}
      {...attrs}
    />
  );
}
