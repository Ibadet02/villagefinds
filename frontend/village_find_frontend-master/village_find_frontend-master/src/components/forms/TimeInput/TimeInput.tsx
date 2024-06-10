import { useEffect, useState } from 'react';
import clsx from 'clsx';

import { InputPiece } from './InputPiece';

import styles from './TimeInput.module.scss';

export interface ITimeInputProps {
  value?: string;
  active?: boolean;
}

export function TimeInput({ value = '', active = false }: ITimeInputProps) {
  const [inIndex, setInIndex] = useState(-1);
  const [pieces, setPieces] = useState<string[]>(Array(6).fill(''));

  useEffect(() => {
    if (active && inIndex === -1) {
      setInIndex(0);
    }
  }, [active]);

  return (
    <div className={clsx(styles.root, styles.active)}>
      {pieces.map((piece: string, index: number) => (
        <>
          <InputPiece
            key={`${piece}-${index}`}
            value={piece}
            className={clsx(
              index === 3 ? styles.minute : '',
              active ? styles.active : '',
            )}
            focused={active && inIndex === index}
            onFocus={() => setInIndex(index)}
          />
          {index === 1 && <span className={styles.colon}>:</span>}
        </>
      ))}
    </div>
  );
}
