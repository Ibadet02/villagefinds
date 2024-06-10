import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';

import { useOnClickOutside, useWindowScroll, useWindowResize } from '@/utils';

import styles from './Select.module.scss';

type RoundedType = 'full' | 'small';
type BorderType = 'solid' | 'none';
type BgColorType = 'primary' | 'secondary' | 'blue' | 'red' | 'white' | 'dark';

export interface ISelectProps {
  value?: string | string[];
  updateValue?: (e: string) => void;
  placeholder?: string;
  options?: (string | { _id?: string; name: string; value: string })[];
  rounded?: RoundedType;
  border?: BorderType;
  bgcolor?: BgColorType;
  className?: string;
  disabled?: boolean;
  colorable?: boolean;
  multiple?: boolean;
  colors?: { status: string; color: string }[];
}

export function Select({
  value = '',
  updateValue = () => { },
  placeholder = 'Select',
  options = [],
  rounded = 'small',
  border = 'solid',
  bgcolor = 'white',
  className = '',
  disabled = false,
  colorable = false,
  multiple = false,
  colors = [],
}: ISelectProps) {
  const [anchor, setAnchor] = useState<boolean>(false);
  const [position, setPosition] = useState<{
    left: number;
    top: number;
    width?: number;
    height?: number;
  }>({
    left: 0,
    top: 0,
  });
  const currentName = useMemo(() => {
    if (disabled) return placeholder;
    if (multiple) {
      const multiOpts = options.filter((item: any) => value.includes(typeof item === 'object' ? item.value : item.toLowerCase()));
      return !multiOpts.length
        ? placeholder
        : multiOpts.map(item => typeof item === 'object' ? item.name : item).join(', ');
    }
    const curOpt = options.find((item: any) => typeof item === 'object'
      ? item.value === value
      : item.toLowerCase() === (value as string)?.toLowerCase())
    return !curOpt ? placeholder : typeof curOpt === 'object' ? curOpt.name : curOpt;
  }, [value]);

  const selectRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const colorClasses = () => {
    const currentColor = colors.find(
      (color: { status: string; color: string }) => color.status === value,
    );
    if (!currentColor) return {};
    return clsx([styles.colorable], {
      [styles.successSelectBox]: currentColor.color === 'success',
      [styles.warningSelectBox]: currentColor.color === 'warning',
      [styles.lightSelectBox]: currentColor.color === 'light',
      [styles.graySelectBox]: currentColor.color === 'gray',
    });
  };

  const classes = clsx(
    styles.root,
    rounded === 'full' ? styles.roundedFull : '',
    border === 'none' ? styles.borderNone : '',
    bgcolor === 'primary'
      ? styles.bgColorPrimary
      : bgcolor === 'secondary'
        ? styles.bgColorSecondary
        : bgcolor === 'blue'
          ? styles.bgColorBlue
          : bgcolor === 'red'
            ? styles.bgColorRed
            : bgcolor === 'dark'
              ? styles.bgColorDark
              : colorable === true
                ? colorClasses()
                : '',
    className,
  );

  const onSelectOption = (option: string) => {
    if (disabled) return;
    updateValue(option);
    if (!multiple) setAnchor(false);
  };

  const onPositionFix = () => {
    if (!boxRef.current) return;
    const { left, top, width, height } = boxRef.current.getBoundingClientRect();
    setPosition({ left, top: top + height, width, height });
  };

  const onSelectBoxClick = () => {
    if (disabled) return;
    onPositionFix();
    setAnchor(!anchor);
  };

  useOnClickOutside(selectRef, () => setAnchor(false), 'mousedown');
  useWindowScroll(onPositionFix);
  useWindowResize(onPositionFix);

  useEffect(() => {
    onPositionFix();
  }, []);

  return (
    <div className={classes} ref={selectRef}>
      <div className={styles.selectBox} onClick={onSelectBoxClick} ref={boxRef}>
        <span className={clsx({ [styles.placeholder]: !value || disabled })}>
          {currentName}
        </span>
        {anchor ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {anchor && !disabled && options.length > 0 && (
        <div
          className={styles.viewBox}
          style={{
            width: (boxRef.current && boxRef.current.clientWidth) || 150,
            left: position.left,
            top: position.top,
          }}
        >
          {options.map(
            (
              option: string | { _id?: string; name: string; value: string },
              index: number,
            ) => (
              <span
                key={index}
                onClick={() =>
                  onSelectOption(
                    typeof option === 'object' ? option.value : option,
                  )
                }
                className={clsx({
                  [styles.activeItem]:
                    option === value
                    || (option as any).value === value
                    || (multiple && value.includes((option as any).value))
                })}
              >
                {typeof option === 'object' ? option.name : option}
              </span>
            ),
          )}
        </div>
      )}
    </div>
  );
}
