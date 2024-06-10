import React, { useContext } from 'react';
import clsx from 'clsx';

import { RadioContext } from './RadioContext';

import styles from './Radio.module.scss';

export interface IRadio {
  label?: string | React.ReactNode;
  value?: string;
  size?: string;
  className?: string;
}

export function Radio({
  label = '',
  value = '',
  size = 'medium',
  className = '',
}: IRadio) {
  const context = useContext(RadioContext);
  console.log(context.multiple);

  return (
    <div
      className={clsx(styles.root, className)}
      onClick={() => context.updateValue(value)}
    >
      <span
        className={clsx(styles.radio, {
          [styles.active]:
            (context.multiple &&
              Object.values(context.value).includes(value)) ||
            (!context.multiple && context.value === value),
          [styles.small]: size === 'small',
          [styles.secondary]: context.color === 'secondary',
        })}
        onClick={() => context.updateValue(value)}
      />
      <p>{label}</p>
    </div>
  );
}
