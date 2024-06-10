import clsx from 'clsx';

import MagnifierSvg from '/assets/common/icons/Magnifier.svg';

export interface IMagnifierIcon {
  className?: string;
}

export function MagnifierIcon({ className = '', ...attrs }: IMagnifierIcon) {
  return (
    <img
      alt="Magnifier Icon"
      src={MagnifierSvg}
      className={clsx('h-6 w-6', className)}
      {...attrs}
    />
  );
}
