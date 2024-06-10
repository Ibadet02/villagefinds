import React from 'react';
import clsx from 'clsx';

import { RadioContext } from './RadioContext';

import styles from './RadioGroup.module.scss';

export interface IRadioGroupProps {
  value?: string | string[];
  updateValue?: (_value: string) => void;
  color?: string;
  className?: string;
  multiple?: boolean;
  children: React.ReactNode;
}

export function RadioGroup({
  value = '',
  updateValue = () => {},
  color = 'primary',
  className = '',
  multiple = false,
  children,
}: IRadioGroupProps) {
  return (
    <RadioContext.Provider
      value={{
        value,
        color,
        multiple,
        updateValue,
      }}
    >
      <div className={clsx(styles.root, className)}>{children}</div>
    </RadioContext.Provider>
  );
}
