import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import clsx from 'clsx';

import { Radio, RadioGroup, Select, Button } from '@/components/forms';
import { Container } from '@/components/layout/customer';

import styles from './MobileSettingDialog.module.scss';

const initialSortOptiosn = ['Sort Alphabetically, A-Z'];

const initialFilterOptions = ['By Product Type'];

interface IMobileSettingDialogProps {
  open?: boolean;
  onClose?: () => void;
}

export function MobileSettingDialog({
  open = true,
  onClose = () => {},
}: IMobileSettingDialogProps) {
  const [panelType, setPanelType] = useState('Products');
  const [marketType, setMarketType] = useState('Artisan');

  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [open]);

  return (
    <div className={clsx(styles.root, !open ? styles.hide : '')}>
      <div className={styles.scrollWrapper}>
        <Container className={styles.container}>
          <span className={styles.closeBtn} onClick={onClose}>
            <FaTimes fill="white" size={20} />
          </span>
          <div className={styles.inputs}>
            <div className={clsx(styles.element, styles.sort)}>
              <label>Sort</label>
              <Select className={styles.select} options={initialSortOptiosn} />
            </div>
            <div className={clsx(styles.element, styles.filter)}>
              <label>Filter</label>
              <Select
                className={styles.select}
                options={initialFilterOptions}
              />
            </div>
          </div>
          <div className={styles.radios}>
            <div className={clsx(styles.element, styles.panelType)}>
              <label>What you see</label>
              <RadioGroup
                value={panelType}
                color="secondary"
                updateValue={setPanelType}
                className={styles.radiogroup}
              >
                <Radio label="Products" value="Products" />
                <Radio label="Vendor Stores" value="Vendor Stores" />
              </RadioGroup>
            </div>
            <div className={clsx(styles.element, styles.marketType)}>
              <label>Market Type</label>
              <RadioGroup
                value={marketType}
                color="secondary"
                updateValue={setMarketType}
                className={styles.radiogroup}
              >
                <Radio label="Artisan" value="Artisan" />
                <Radio label="Subscription" value="Subscription" />
                <Radio label="Near Me" value="Near Me" />
              </RadioGroup>
            </div>
          </div>
          <div className={styles.buttons}>
            <Button className={clsx(styles.button, styles.applyBtn)}>
              Apply
            </Button>
            <Button className={clsx(styles.button, styles.cancelBtn)}>
              Cancel
            </Button>
          </div>
        </Container>
      </div>
    </div>
  );
}
