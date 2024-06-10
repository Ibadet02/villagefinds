import { ChangeEvent } from 'react';
import clsx from 'clsx';

import { BgColorType, BorderType, RoundedType, IAdornment } from '../Input';

import styles from './TextField.module.scss';

export interface ITextFieldProps {
  name?: string;
  value?: string;
  updateValue?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  maxRows?: number;
  placeholder?: string;
  className?: string;
  rounded?: RoundedType;
  border?: BorderType;
  bgcolor?: BgColorType;
  adornment?: IAdornment;
  disabled?: boolean;
}

export function TextField({
  rows = 4,
  name = '',
  value = '',
  placeholder = '',
  className = '',
  updateValue,
  rounded = 'small',
  border = 'solid',
  bgcolor = 'primary',
  disabled = false,
  adornment,
  ...nativeAttrs
}: ITextFieldProps) {
  const classes = clsx(
    styles.root,
    rounded === 'full' ? styles.roundedFull : '',
    border === 'none' ? styles.borderNone : '',
    bgcolor === 'secondary' ? styles.bgColorSec : '',
    adornment && adornment.position === 'left'
      ? styles.leftAdornment
      : adornment && adornment.position === 'right'
      ? styles.rightAdornment
      : '',
    className,
  );

  return (
    <div className={classes}>
      <textarea
        rows={rows}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={updateValue}
        disabled={disabled}
        {...nativeAttrs}
      />
      {adornment ? (
        <span
          className={clsx(
            adornment.position === 'left'
              ? styles.leftAdorn
              : styles.rightAdorn,
            typeof adornment.content === 'string'
              ? styles.textBar
              : styles.circleBar,
          )}
        >
          {adornment.content}
        </span>
      ) : (
        <></>
      )}
    </div>
  );
}
