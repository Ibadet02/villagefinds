import clsx from 'clsx';

import styles from './Button.module.scss';

type Size = 'large' | 'medium' | 'small';
type VariantType = 'filled' | 'outlined' | 'none';
type ColorType = 'success' | 'light';
type TextColorType = 'white' | 'black';

export interface IButtonProps {
  size?: Size;
  color?: ColorType;
  textColor?: TextColorType;
  variant?: VariantType;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({
  size = 'large',
  variant = 'filled',
  color = 'success',
  textColor = 'white',
  className = '',
  disabled = false,
  onClick = () => {},
  children,
}: IButtonProps) {
  const classes = clsx(
    styles.root,
    variant === 'outlined'
      ? styles.variantOutlined
      : variant === 'none'
      ? styles.variantNone
      : '',
    { [styles.colorLight]: color === 'light' },
    { [styles.sizeMedium]: size === 'medium' },
    {
      [styles.sizeSmall]: size === 'small',
    },
    className,
  );
  return (
    <button className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
