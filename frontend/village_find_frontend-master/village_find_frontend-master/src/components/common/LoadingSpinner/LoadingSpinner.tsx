import clsx from 'clsx';

import styles from './LoadingSpinner.module.scss';

interface ILoadingSpinerProps {
  isPageLoading?: boolean;
}

function LoadingSpinner({ isPageLoading = false }: ILoadingSpinerProps) {
  return (
    <div className={clsx(styles.screen, { [styles.page]: isPageLoading })}>
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <circle
          className={styles.spin}
          cx="200"
          cy="200"
          fill="none"
          r="100"
          strokeWidth="25"
          stroke="#E387FF"
          strokeDasharray="700 1400"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export { LoadingSpinner };
