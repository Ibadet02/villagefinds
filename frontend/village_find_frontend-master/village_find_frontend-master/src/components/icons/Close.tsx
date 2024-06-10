import { GrClose } from 'react-icons/gr';
import clsx from 'clsx';

import CloseSvg from '/assets/common/icons/Close.svg';

export interface ICloseIconProps {
  onClick?: () => void;
  className?: string;
}

export function CloseIcon({ className = '', ...attrs }) {
  return (
    <img
      alt="Close Icon"
      src={CloseSvg}
      className={clsx('h-6 w-6', className)}
      {...attrs}
    />
  );
}
