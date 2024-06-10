import clsx from 'clsx';

import ClipboardSvg from '/assets/common/icons/Clipboard.svg';

export interface IClipboardIconProps {
  onClick?: () => void;
  className?: string;
}

export function ClipboardIcon({
  className = '',
  ...attrs
}: IClipboardIconProps) {
  return (
    <img
      alt="Clipboard Icon"
      src={ClipboardSvg}
      className={clsx('h-4 w-4', className)}
      {...attrs}
    />
  );
}
