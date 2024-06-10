import clsx from 'clsx';

import ZipcodeSvg from '/assets/common/icons/Zipcode.svg';

export interface IZipCodeIconProps {
  onClick?: () => void;
  className?: string;
}

export function ZipCodeIcon({ className = '', ...attrs }: IZipCodeIconProps) {
  return (
    <img
      alt="Zipcode Icon"
      src={ZipcodeSvg}
      className={clsx('h-6 w-6', className)}
      {...attrs}
    />
  );
}
