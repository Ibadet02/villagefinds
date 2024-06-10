import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import clsx from 'clsx';

import { Input, Select } from '@/components';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { updateSubscription, ISubscription, updateGeneral } from '@/redux/reducers';
import { ProductContext } from '../Provider';
import { HttpService } from '@/services';
import { ChangeInputEvent } from '@/interfaces';
import { getBubbleObject } from '@/utils';

import styles from './Subscription.module.scss';

const initialSubscription: ISubscription = {
  iscsa: false,
  frequencies: [],
  discount: 0,
};

const frequencyOpts = [
  { name: 'Weekly', value: '1-week' },
  { name: 'Every month', value: '1-month' },
  { name: 'Every 2 months', value: '2-month' },
  { name: 'Every 3 months', value: '3-month' },
  { name: 'Every 6 months', value: '6-month' },
];

const PRODUCT_PATH = '/vendor/products';

export function Subscription() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();

  const storeSubscription = useAppSelector(state => state.product.subscription);
  const { deliveryTypes, setDeliveryTypes } = useContext(ProductContext);

  const [subscription, setSubscription] =
    useState<ISubscription>(initialSubscription);

  const isCsa = useMemo(() => {
    if (deliveryTypes.length > 0) {
      const result = deliveryTypes.includes('Local Subscriptions');
      setSubscription({ ...subscription, iscsa: result });
      return result;
    } else {
      return subscription.iscsa;
    }
  }, [deliveryTypes, subscription]);

  const onCancelClick = () => {
    navigate(`${PRODUCT_PATH}/${productId}`);
  };

  const onSubscInputChange = (e: ChangeInputEvent) => {
    setSubscription(getBubbleObject(e.target.name, subscription, e.target.value));
  };

  const onSubscFrequencyChange = (value: string) => {
    if (subscription.frequencies.includes(value)) {
      setSubscription({
        ...subscription, frequencies: subscription.frequencies.filter(item => item !== value)
      });
    } else {
      setSubscription({ ...subscription, frequencies: [...subscription.frequencies, value] });
    }
  };

  const onCsaSubscFrequencyChange = (value: string) => {
    setSubscription({ ...subscription, csa: { duration: 1, ...subscription.csa, frequency: value } })
  }

  const onUpdateClick = () => {
    if (productId === 'create') {
      dispatch(updateSubscription(subscription));
      navigate(`${PRODUCT_PATH}/${productId}`);
    } else {
      HttpService.post(`/products/${productId}/subscription`, subscription).then(response => {
        const { status } = response;
        if (status === 200) {
          enqueueSnackbar('Subscription updated.', { variant: 'success' });
        }
      })
    }
  };

  useEffect(() => {
    if (productId === 'create') {
      setSubscription(storeSubscription);
    } else {
      HttpService.get(`/products/vendor/${productId}`).then(response => {
        const { status, product } = response;

        if (status === 200) {
          setSubscription({
            ...product.subscription,
            iscsa: product.deliveryTypes.includes('Local Subscriptions')
          });
        }
      });
    }
  }, [productId, storeSubscription]);

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.subForm}>
          <h2>Shipping Only</h2>
          <div className={styles.horizon}>
            <div className={styles.control}>
              <p>Subscription Frequency</p>
              <Select
                rounded="full"
                border="none"
                bgcolor="primary"
                placeholder="Select frequency"
                value={subscription.frequencies}
                multiple={true}
                updateValue={onSubscFrequencyChange}
                options={frequencyOpts}
                disabled={isCsa}
              />
            </div>
            <div className={styles.control}>
              <p>Subscription Discount</p>
              <Input
                name="discount"
                rounded="full"
                border="none"
                bgcolor="secondary"
                adornment={{ position: 'left', content: '%' }}
                placeholder="Subscription Discount"
                value={(!isCsa && subscription.discount) || ''}
                updateValue={onSubscInputChange}
                disabled={isCsa}
              />
            </div>
          </div>
        </div>
        <div className={styles.subForm}>
          <h2>For local subscriptions only</h2>
          <div className={styles.horizon}>
            <div className={styles.control}>
              <p>Subscription Frequency</p>
              <Select
                rounded="full"
                border="none"
                bgcolor="primary"
                placeholder="Select frequency"
                value={subscription.csa?.frequency}
                updateValue={onCsaSubscFrequencyChange}
                disabled={!isCsa}
                options={frequencyOpts}
              />
            </div>
            <div className={styles.control}>
              <p>Subscription Discount</p>
              <Input
                name="discount"
                rounded="full"
                border="none"
                bgcolor="secondary"
                adornment={{ position: 'left', content: '%' }}
                placeholder="Subscription Discount"
                value={(isCsa && subscription.discount) || ''}
                updateValue={onSubscInputChange}
                disabled={!isCsa}
              />
            </div>
          </div>
          <div className={styles.horizon}>
            <div className={styles.control}>
              <p>Subscription Duration</p>
              <Input
                name="csa.duration"
                border="none"
                bgcolor="secondary"
                adornment={{ position: 'right', content: 'Weeks' }}
                placeholder="Number"
                value={(isCsa && subscription.csa?.duration) || ''}
                updateValue={onSubscInputChange}
                disabled={!isCsa}
              />
            </div>
          </div>
          <p>Or</p>
          <div className={styles.horizon}>
            <div className={styles.control}>
              <p>
                Start Date <span className={styles.optional}>(Optional)</span>
              </p>
              <Input
                type="date"
                name="csa.startDate"
                rounded="full"
                border="none"
                bgcolor="secondary"
                placeholder="--/--/----"
                value={subscription.csa?.startDate}
                updateValue={onSubscInputChange}
                disabled={!isCsa}
              />
            </div>
            <div className={styles.control}>
              <p>End Date</p>
              <Input
                type="date"
                name="csa.endDate"
                rounded="full"
                border="none"
                bgcolor="secondary"
                placeholder="--/--/----"
                value={subscription.csa?.endDate}
                updateValue={onSubscInputChange}
                disabled={!isCsa}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.buttonBar}>
        <button className={styles.button} onClick={onCancelClick}>
          Cancel
        </button>
        <button
          className={clsx(styles.button, styles.updateBtn)}
          onClick={onUpdateClick}
        >
          {productId === 'create' ? 'Save' : 'Update'}
        </button>
      </div>
    </div>
  );
}
