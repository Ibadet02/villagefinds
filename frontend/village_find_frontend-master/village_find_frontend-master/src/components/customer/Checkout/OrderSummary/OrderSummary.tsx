import clsx from 'clsx';

import { Button, Input } from '@/components/forms';
import { ISummary } from '@/pages/customer';

import styles from './OrderSummary.module.scss';

const initialSummary = {
  total: 168.3,
  pickupFee: 9.99,
  safePickupFee: 0,
  shipping: 'Calculated on next page',
  giftShipping: 'Calculated on next page',
  coupon: -3.88,
  subtotal: 174.41,
};

interface IOrderSummaryProps {
  summary: ISummary;
}

export function OrderSummary({ summary }: IOrderSummaryProps) {
  const onCouponApply = () => { };

  const formatText = (price: number | string) => {
    if (typeof price === 'string') return price;
    return price === 0
      ? 0
      : price < 0
        ? `-$${(-price).toFixed(2)}`
        : `$${price.toFixed(2)}`;
  };

  return (
    <div className={styles.root}>
      <Input
        placeholder="Coupon Code"
        className={styles.coupon}
        disabled={true}
        adornment={{
          position: 'right',
          content: (
            <Button className={styles.applyBtn} onClick={onCouponApply}>
              Apply
            </Button>
          ),
        }}
      />
      <div className={styles.summary}>
        <p className={styles.head}>Order Totals</p>
        <div className={styles.body}>
          <div className={clsx(styles.row, styles.total)}>
            <p className={styles.title}>Order Total</p>
            <p className={styles.text}>{formatText(summary.orderTotal)}</p>
          </div>
          <div className={clsx(styles.row, styles.pickup)}>
            <p className={styles.title}>
              Partnered Pickup Location Delivery Fee
              <span>(Vendors Near Me Fee)</span>
            </p>
            <p className={styles.text}>
              {formatText(summary.pickupLocationFee)}
            </p>
          </div>
          <div className={clsx(styles.row, styles.safePickup)}>
            <p className={styles.title}>Delivery Fee</p>
            <p className={styles.text}>{formatText(summary.deliveryFee)}</p>
          </div>
          <div className={clsx(styles.row, styles.safePickup)}>
            <p className={styles.title}>Safe Pickup Fee</p>
            <p className={styles.text}>{formatText(summary.safePickupFee)}</p>
          </div>
          <div className={styles.row}>
            <p className={styles.title}>Shipping</p>
            <p className={styles.text}>{formatText(summary.shippingFee)}</p>
          </div>
          <div className={styles.row}>
            <p className={styles.title}>Gift Shipping</p>
            <p className={styles.text}>
              {formatText(initialSummary.giftShipping)}
            </p>
          </div>
          <div className={clsx(styles.row, styles.coupon)}>
            <p className={styles.title}>Coupon</p>
            <p className={styles.text}>{formatText(summary.giftShippingFee)}</p>
          </div>
          <div className={clsx(styles.row, styles.total)}>
            <p className={styles.title}>Sub Total</p>
            <p className={styles.text}>{formatText(summary.orderTotal)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
