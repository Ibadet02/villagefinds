import { KeyboardEvent, useEffect, useMemo, useReducer, useRef } from 'react';
import clsx from 'clsx';

import styles from './InputPiece.module.scss';

export interface IInputPieceProps {
  value?: string;
  className?: string;
  focused?: boolean;
  onInput?: (piece: string) => void;
  onFocus?: () => void;
}

export function InputPiece({
  className = '',
  value = '-',
  focused = false,
  onFocus = () => {},
}: IInputPieceProps) {
  const [piece] = useMemo(() => {
    if (value === '') return '-';
    return value;
  }, [value]);
  const pieceRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (focused && pieceRef.current) {
      pieceRef.current.focus();
    }
  }, [focused]);

  return (
    <span
      className={clsx(styles.root, { [styles.focused]: focused }, className)}
      onClick={onFocus}
      ref={pieceRef}
    >
      {piece}
    </span>
  );
}
