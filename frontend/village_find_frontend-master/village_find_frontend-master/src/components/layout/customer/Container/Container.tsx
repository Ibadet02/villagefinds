import clsx from 'clsx';

import styles from './Container.module.scss';

export interface IContainerProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

export function Container({
  id = '',
  className = '',
  children,
}: IContainerProps) {
  return (
    <div id={id} className={clsx(styles.root, className)}>
      {children}
    </div>
  );
}
