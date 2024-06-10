import { FaX } from 'react-icons/fa6';
import { ChangeEvent, KeyboardEvent, useState } from 'react';
import clsx from 'clsx';

import styles from './TagInput.module.scss';

type Rounded = 'full' | 'small';

export interface ITagInput {
  tags?: string[];
  updateTags?: (tags: string[]) => void;
  className?: string;
  label?: string;
  placeholder?: string;
  rounded?: Rounded;
}

export function TagInput({
  tags = [],
  updateTags = () => {},
  className = '',
  label = 'Select...',
  placeholder = '',
  rounded = 'full',
}: ITagInput) {
  const [inputText, setInputText] = useState('');

  const roundClasses =
    rounded === 'full' ? styles.fullRound : styles.smallRound;

  const onClose = (name: string) => {
    updateTags(
      tags.filter((tag: string, index: number) => name !== `${tag}-${index}`),
    );
  };

  const onInputTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      setInputText('');
      updateTags([...tags, inputText]);
    }
  };

  return (
    <div className={clsx(styles.root, roundClasses, className)}>
      <div className={styles.tags}>
        {tags.length ? (
          tags.map((tag: string, index: number) => (
            <p key={`${tag}-${index}`}>
              {tag}
              <span>
                <FaX
                  fill="white"
                  size={'8px'}
                  onClick={() => onClose(`${tag}-${index}`)}
                />
              </span>
            </p>
          ))
        ) : (
          <span className={styles.placeholder}>{label}</span>
        )}
        <input
          value={inputText}
          onChange={onInputTextChange}
          onKeyDown={onKeyDown}
          placeholder={tags.length ? placeholder : ''}
        />
      </div>
    </div>
  );
}
