import { Card } from '@/components/common';
import { Input, Select } from '@/components/forms';

import styles from './ShippingAddress.module.scss';

export function ShippingAddress() {
  return (
    <Card title="Shipping Address" className={styles.root}>
      <div className={styles.container}>
        <p>
          This address will be used to calculate shipping costs for customers.
        </p>
        <div className={styles.control}>
          <p>Address</p>
          <Input
            rounded="full"
            border="none"
            bgcolor="secondary"
            placeholder="Address"
          />
        </div>
        <div className={styles.horizon}>
          <div className={styles.control}>
            <p>City</p>
            <Input
              rounded="full"
              border="none"
              bgcolor="secondary"
              placeholder="City"
            />
          </div>
          <div className={styles.control}>
            <p>State</p>
            <Select
              rounded="full"
              border="none"
              bgcolor="primary"
              placeholder="State"
            />
          </div>
          <div className={styles.control}>
            <p>Zipcode</p>
            <Input
              rounded="full"
              border="none"
              bgcolor="secondary"
              placeholder="Zipcode"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
