import { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';

import { Button } from '@/components/forms';
import { Calendar } from '@/components/common';

import { useOnClickOutside } from '@/utils';

import styles from './PickDateDialog.module.scss';

interface IPickDateDialogProps {
  open: boolean;
  onUpdate?: (date: Date) => void;
  onClose?: () => void;
  dates?: Date[];
  selectedDay: Date;
  setSelectedDay: (date: Date) => void;
}

export function PickDateDialog({
  open,
  dates = [],
  onUpdate = () => {},
  onClose = () => {},
  selectedDay = new Date(),
  setSelectedDay = () => {},
}: IPickDateDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  const onDateChange = () => {
    onUpdate(selectedDay);
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
    open && (
      <div className={styles.root}>
        <div className={styles.container} ref={dialogRef}>
          <p className={styles.title}>Choose a fulfillment date</p>
          <Calendar
            dates={dates}
            selectedDay={selectedDay}
            onDaySelect={(day: Date | null) => setSelectedDay(day as Date)}
            availableText="Available Days"
            currentText="Current Day"
            selectedText="Selected Day"
          />
          <Button className={styles.updateBtn} onClick={onDateChange}>
            Update
          </Button>
          <span className={styles.closeBtn} onClick={onClose}>
            <FaTimes size={24} />
          </span>
        </div>
      </div>
    )
  );
}
