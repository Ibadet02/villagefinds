import clsx from 'clsx';

import ExportSvg from '/assets/common/icons/Export.svg';

export interface IExportIconProps {
  onClick?: () => void;
  className?: string;
}

export function ExportIcon({ className = '', ...attrs }: IExportIconProps) {
  return (
    <img
      alt="Print Icon"
      src={ExportSvg}
      className={clsx('h-6 w-6', className)}
      {...attrs}
    />
  );
}
