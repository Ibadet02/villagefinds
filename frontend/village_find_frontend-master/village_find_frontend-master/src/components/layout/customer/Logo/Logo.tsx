import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import LogoPink from '/assets/common/icons/LogoPink.svg';

export interface ILogoProps {
  className?: string;
}

export function Logo({ className = '' }: ILogoProps) {
  const navigate = useNavigate();

  return (
    <div
      className={clsx(
        'flex cursor-pointer items-center gap-x-1 space-x-1 py-2.5 text-xl font-semibold',
        className,
      )}
      onClick={() => navigate('/')}
    >
      <img src={LogoPink} />
      <span>Village Finds</span>
    </div>
  );
}
