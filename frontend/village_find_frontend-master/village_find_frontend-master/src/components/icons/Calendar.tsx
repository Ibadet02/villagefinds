import clsx from 'clsx';

import CalendarSvg from '/assets/common/icons/Calendar.svg';

export interface ICalendarIconProps {
  onClick?: () => void;
  className?: string;
}

export function CalendarIcon({ className = '', ...attrs }: ICalendarIconProps) {
  return (
    <img
      alt="Calendar Icon"
      src={CalendarSvg}
      className={clsx('h-4 w-4', className)}
      {...attrs}
    />
  );
}
