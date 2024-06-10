import { Input } from '@/components/forms';

import { useState } from 'react';

import styles from './Earning.module.scss';

export function Earning() {
  const [shop, setShop] = useState('');

  const onShopChange = (e: any) => {
    setShop(e.target.value);
  };

  const onResetClick = () => {
    setShop('');
  };

  return (
    <div className={styles.root}>
      <h1>Your Earnings</h1>
      <div className={styles.content}>
        <Input
          placeholder="Vendor"
          rounded="full"
          border="none"
          value={shop}
          updateValue={onShopChange}
          className={styles.input}
        />
        <div className={styles.buttons}>
          <button className={styles.submit}>Submit</button>
          <button className={styles.reset} onClick={onResetClick}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
