import clsx from 'clsx';

import LogoutSvg from '/assets/common/icons/Logout.svg';

interface ILogoutIconProps {
  className?: string;
}

export function LogoutIcon({ className = '' }: ILogoutIconProps) {
  return (
    <img
      alt="Logout Icon"
      src={LogoutSvg}
      className={clsx('h-[24px] w-[18px]', className)}
    />
  );
}
