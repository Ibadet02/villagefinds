import clsx from 'clsx';

import styles from './Container.module.scss';

interface IContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = '' }: IContainerProps) {
  return <div className={clsx(styles.root, className)}>{children}</div>;
}
