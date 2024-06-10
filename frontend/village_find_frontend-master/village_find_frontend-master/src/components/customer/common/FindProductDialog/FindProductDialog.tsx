import { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';

import clsx from 'clsx';

import { Button, Input } from '@/components/forms';

import { useOnClickOutside } from '@/utils';

import styles from './FindProductDialog.module.scss';

interface IFindProductDialogProps {
  open: boolean;
  onApply?: () => void;
  onClose?: () => void;
}

export function FindProductDialog({
  open,
  onApply = () => {},
  onClose = () => {},
}: IFindProductDialogProps) {
  const [zipcode, setZipcode] = useState();
  const dialogRef = useRef<HTMLDivElement>(null);

  const onZipcodeChange = (e: any) => {
    setZipcode(e.target.value);
  };

  const onApplyClick = () => {
    if (zipcode) return;
    onApply();
  };

  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [open]);

  useEffect(() => {
    if (dialogRef.current === null) return;
    useOnClickOutside(dialogRef, onClose, 'mousedown');
  }, []);

  return (
    <div className={clsx(styles.root, !open ? styles.hide : '')}>
      <div className={styles.container} ref={dialogRef}>
        <div className={styles.content}>
          <h1>To View Items Near You</h1>
          <div className={styles.zipcode}>
            <label>Add Zipcode</label>
            <Input
              placeholder="Add Zip Code Here"
              value={zipcode}
              updateValue={onZipcodeChange}
              className={styles.input}
            />
            <p>Local Items will be visible to you when you add your zip-code</p>
          </div>
          <div className={styles.buttons}>
            <Button
              className={clsx(styles.button, styles.applyBtn)}
              onClick={onApplyClick}
            >
              Apply
            </Button>
            <Button
              className={clsx(styles.button, styles.cancelBtn)}
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
        <span className={styles.closeBtn} onClick={onClose}>
          <FaTimes size={24} />
        </span>
      </div>
    </div>
  );
}
