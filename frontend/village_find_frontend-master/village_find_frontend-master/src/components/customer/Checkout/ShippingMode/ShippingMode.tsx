import { Button, Select } from '@/components/forms';

import styles from './ShippingMode.module.scss';

interface IShippingModeProps {
  onNextStep: () => void;
  shipping: string;
  setShipping: (_: string) => void;
}

export function ShippingMode({ onNextStep = () => { }, shipping, setShipping }: IShippingModeProps) {
  return (
    <div className={styles.root}>
      <div className={styles.shippingMode}>
        <p className={styles.title}>Select Shipping Method</p>
        <Select placeholder="Select" className={styles.selector} value={shipping} updateValue={setShipping} />
      </div>
      <Button className={styles.nextBtn} onClick={onNextStep}>
        Next
      </Button>
    </div>
  );
}
