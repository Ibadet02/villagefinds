import clsx from 'clsx';

import LogoHub from '/assets/common/icons/LogoHub.svg';
import styles from './Logo.module.scss';

export type LogoSize = 'small' | 'medium';

export interface ILogoProps {
  size: LogoSize;
}

export function Logo({ size }: ILogoProps) {
  return (
    <div
      className={clsx(
        `${size === 'small' ? styles.smallLogo : styles.mediumLogo}`,
        styles.logo,
      )}
    >
      <img src={LogoHub} className={styles.logoImage} />
    </div>
  );
}
