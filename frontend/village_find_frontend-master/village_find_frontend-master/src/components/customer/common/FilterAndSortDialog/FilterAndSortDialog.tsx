import { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import clsx from 'clsx';

import { Button, Input, Select } from '@/components/forms';
import { ChangeInputEvent } from '@/interfaces';
import { useOnClickOutside } from '@/utils';

import styles from './FilterAndSortDialog.module.scss';

interface IFilterAndSortDialogProps {
  open: boolean;
  onApply?: (options: any) => void;
  onClose?: () => void;
  minPrice: string;
  maxPrice: string;
  sortOrder: string;
}

const initialSortOptions = [
  { name: 'Sort Alphabetically, A-Z', value: 'ascending' },
  { name: 'Sort Alphabetically, Z-A', value: 'descending' },
  { name: 'None', value: 'none' },
];

export function FilterAndSortDialog({
  open,
  onApply = () => {},
  onClose = () => {},
  minPrice,
  maxPrice,
  sortOrder,
}: IFilterAndSortDialogProps) {
  const [price, setPrice] = useState({
    min: minPrice,
    max: maxPrice,
  });
  const [orderBy, setOrderBy] = useState(sortOrder);
  const dialogRef = useRef<HTMLDivElement>(null);

  const onPriceChange = (e: ChangeInputEvent) => {
    setPrice({ ...price, [e.target.name]: e.target.value });
  };

  const onSortChange = (sort: string) => {
    setOrderBy(sort);
  };

  const onApplyClick = () => {
    onApply({
      minPrice: price.min,
      maxPrice: price.max,
      sortOrder: orderBy,
    });
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
          <div className={styles.filter}>
            <label>Price</label>
            <div className={styles.filterInput}>
              <Input
                name="min"
                placeholder="Min Price"
                className={styles.input}
                value={price.min}
                updateValue={onPriceChange}
              />
              <Input
                name="max"
                placeholder="Max Price"
                className={styles.input}
                value={price.max}
                updateValue={onPriceChange}
              />
            </div>
          </div>
          <div className={styles.sort}>
            <label>Sort</label>
            <Select
              value={orderBy}
              className={styles.sortSelect}
              options={initialSortOptions}
              updateValue={onSortChange}
            />
          </div>
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
        <span className={styles.closeBtn} onClick={onClose}>
          <FaTimes size={24} />
        </span>
      </div>
    </div>
  );
}
