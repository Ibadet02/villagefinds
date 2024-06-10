import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { PiUsersFill } from 'react-icons/pi';
import { FaMinus, FaPlus, FaPhone } from 'react-icons/fa6';
import { enqueueSnackbar } from 'notistack';
import clsx from 'clsx';

import { SERVER_URL } from '@/config/global';
import { Button, Select } from '@/components/forms';
import { TrashIcon } from '@/components/icons';
import { GiftDialog } from '@/components/customer/common/GiftDialog';
import {
  PickDateDialog,
  PickupLocationDialog,
} from '@/components/customer/common';
import { IAddress, IOrder } from './MyCart';

import GiftIcon from '/assets/customer/svgs/gift.svg';
import styles from './CartItem.module.scss';

const frequencyOpts = [
  { name: 'Weekly', value: '1-week' },
  { name: 'Every month', value: '1-month' },
  { name: 'Every 2 months', value: '2-month' },
  { name: 'Every 3 months', value: '3-month' },
  { name: 'Every 6 months', value: '6-month' },
];

const getFrequencyUnit = (duration: number, frequency: string) => {
  const values = frequency.split('-');
  return values[1] ? `${values[1]}${duration === 1 ? '' : 's'}` : '';
}

const getFrequencyName = (frequency: string) => {
  const option = frequencyOpts.find(item => item.value === frequency);
  return option?.name || '';
}

const getFrequencyPeriod = (frequency: string) => {
  const values = frequency.split('-');
  return Number(values[0]) || 0;
}

const getFrequencyLabel = (frequency: string) => {
  const values = frequency.split('-');
  if (values.length !== 2) return '';
  const interval = Number(values[0]), unit = values[1];
  return interval === 1 ? `Every ${unit}` : `Every ${interval} ${unit}s`;
};

const getFrequencyOpts = (options: string[]) => {
  return options.reduce((total: any, item: string) => {
    const option = frequencyOpts.find(opt => opt.value === item);
    return option ? [...total, option] : total;
  }, []);
}

function convertTime24to12(time24: string) {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  const period = Number(hours) >= 12 ? 'PM' : 'AM';
  const hours12 = (Number(hours) % 12 || 12);
  return `${hours12}:${minutes} ${period}`;
}

export function CartItem({
  cartId,
  orderID,
  vendor,
  product,
  price,
  quantity,
  image,
  personalization,
  buymode,
  subscription,
  deliveryType,
  pickuplocation,
  fulfillday,
  gift,
  addressList,
  onDeleteCart,
  onSubscribeChange,
  onGiftChange,
  onDeliveryToggle,
  onPickupLocationChange,
  onQuantityChange,
  onBuymodeChange
}: IOrder & {
  addressList: IAddress[];
  onDeleteCart: () => void;
  onSubscribeChange: (subscribe: any) => void;
  onGiftChange: (gift: any) => void;
  onDeliveryToggle: (option: string) => void;
  onPickupLocationChange: (data: any) => void;
  onQuantityChange: (quantity: number) => void;
  onBuymodeChange: (mode: string) => void;
}) {
  const [isGiftDialog, setIsGiftDialog] = useState(false);
  const [isPickupLocationDialog, setIsPickupLocationDialog] = useState(false);
  const [isDeliveryDateDialog, setIsDeliveryDateDialog] = useState(false);
  const [isSafePickupDateDialog, setIsSafePickupDateDialog] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [safePickupDate, setSafePickupDate] = useState(new Date());

  const csaCycle = useMemo(() => {
    if (!subscription?.iscsa) return 0;
    const duration = subscription?.csa.duration || 0;
    const period = getFrequencyPeriod(subscription?.csa.frequency || '');
    return Math.floor(duration / period);
  }, [subscription]);

  const isDaySame = (day1: Date, day2: Date) => {
    return (
      day1.getFullYear() === day2.getFullYear() &&
      day1.getMonth() === day2.getMonth() &&
      day1.getDate() === day2.getDate()
    );
  };

  const setDate = (date: Date, settingDate: Date) => {
    date.setFullYear(settingDate.getFullYear());
    date.setMonth(settingDate.getMonth());
    date.setDate(settingDate.getDate());
  };

  const getDateStr = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
  };

  const getDeliveryTypes = () => {
    const options = product.deliveryTypes.map((item: string) =>
      item === 'Local Subscriptions'
        ? ''
        : item === 'Near By'
          ? 'Near Me'
          : item,
    );
    return options.filter((item: string) => item);
  };

  const getDeliveryOptions = () => {
    return product.deliveryTypes
      .filter(
        (item: string, index: number, tot: string[]) =>
          !(item === 'Near By' && tot.includes('Local Subscriptions')),
      )
      .map(item =>
        item === 'Shipping'
          ? ['Shipping']
          : item === 'Local Subscriptions'
            ? ['Home Delivery', 'Pickup Location']
            : ['Home Delivery', 'Pickup Location', 'Safe Pickup'],
      )
      .flat();
  };

  const getAvailableDates = useCallback(
    (method: 'delivery' | 'pickup') => {
      if (!vendor.fulfillment?.[method]?.days) return [];
      const deliveryDates = vendor.fulfillment[method].days;

      const firstDayOfMonth = new Date(
        deliveryDate.getFullYear(),
        deliveryDate.getMonth(),
        1,
      ),
        lastDayOfMonth = new Date(
          deliveryDate.getFullYear(),
          deliveryDate.getMonth() + 1,
          0,
        );
      if (firstDayOfMonth.getDay() === 0)
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 7);
      if (lastDayOfMonth.getDay() === 6)
        lastDayOfMonth.setDate(lastDayOfMonth.getDate() + 7);

      let iterator = new Date(firstDayOfMonth);
      while (iterator.getDay()) {
        iterator.setDate(iterator.getDate() - 1);
      }
      setDate(firstDayOfMonth, iterator);

      iterator = new Date(lastDayOfMonth);
      while (iterator.getDay() !== 6) {
        iterator.setDate(iterator.getDate() + 1);
      }
      setDate(lastDayOfMonth, iterator);

      const dayList = [];
      iterator = new Date(firstDayOfMonth);
      while (!isDaySame(iterator, lastDayOfMonth)) {
        const date = deliveryDates.find(
          item => (item.weekday + 1) % 7 === iterator.getDay(),
        );
        if (date) {
          dayList.push({
            date: new Date(iterator),
            from: date.from,
            to: date.to,
          });
        }
        iterator.setDate(iterator.getDate() + 1);
      }

      return dayList;
    },
    [deliveryDate, vendor.fulfillment],
  );

  const onMinusClick = (quantity: number) => () => {
    if (quantity === 0) return;
    // HttpService.put(`/cart/${cartId}`, {
    //   quantity: quantity - 1,
    // }).then(response => {
    //   const { status } = response;
    //   if (status === 200) {
    onQuantityChange(quantity - 1);
    // enqueueSnackbar('Quantity updated.', { variant: 'success' });
    // }
    // });
  };

  const onPlusClick = (quantity: number) => () => {
    // HttpService.put(`/cart/${cartId}`, {
    //   quantity: quantity + 1,
    // }).then(response => {
    //   const { status } = response;
    //   if (status === 200) {
    onQuantityChange(quantity + 1);
    //     enqueueSnackbar('Quantity updated.', { variant: 'success' });
    //   }
    // });
  };

  const onRemoveCartClick = () => {
    // HttpService.delete(`/cart/${cartId}`).then(response => {
    //   const { status } = response;
    //   if (status === 200) {
    onDeleteCart();
    //     enqueueSnackbar('Cart item deleted.', { variant: 'success' });
    //   }
    // });
  };

  const onFrequencyChange = (value: string) => {
    // HttpService.put(`/cart/${cartId}`, {
    //   subscription: { ...subscription, subscribe: value },
    // }).then(response => {
    //   const { status } = response;
    //   if (status === 200) {
    onSubscribeChange({ ...subscription, subscribe: value });
    onBuymodeChange('recurring');
    //     enqueueSnackbar('Subscription frequency updated.', {
    //       variant: 'success',
    //     });
    //   }
    // });
  };

  const onGiftApply = (gift: any) => {
    // HttpService.put(`/cart/${cartId}`, {
    //   gift,
    // }).then(response => {
    //   const { status } = response;
    //   if (status === 200) {
    onGiftChange(gift);
    //     enqueueSnackbar('Gift information saved.', { variant: 'success' });
    //   }
    // });
    setIsGiftDialog(false);
  };

  const onDeliveryOptionClick = (option: string) => () => {
    if (option === 'Pickup Location' && deliveryType !== option) {
      setIsPickupLocationDialog(true);
      return;
    } else if (option === 'Home Delivery' && deliveryType !== option) {
      setIsDeliveryDateDialog(true);
      return;
    }
    // HttpService.put(`/cart/${cartId}`, { deliveryType: option }).then(
    //   response => {
    //     const { status } = response;
    //     if (status === 200) {
    onDeliveryToggle(option);
    //     enqueueSnackbar(`Delivery option updated.`, { variant: 'success' });
    //   }
    // },
    // );
  };

  const onPickupLocationUpdate = (data: any) => {
    // HttpService.put(`/cart/${cartId}`, {
    //   pickuplocation: data.location,
    //   fulfillday: data.fulfillday,
    //   deliveryType: 'Pickup Location',
    // }).then(response => {
    //   const { status } = response;
    //   if (status === 200) {
    //     console.log('Pickup Location update', data);
    onPickupLocationChange(data);
    setIsPickupLocationDialog(false);
    //     enqueueSnackbar('Pickup Location updated.', { variant: 'success' });
    //   }
    // });
  };

  const onDeliveryDateUpdate = (date: Date) => {
    // const deliveryDates = vendor.fulfillment.pickup.days;
    // const currentDate = deliveryDates.find(
    //   item => (item.weekday + 1) % 7 === date.getDay(),
    // );
    // HttpService.put(`/cart/${cartId}`, {
    //   fulfillday: {
    //     day: date,
    //     from: currentDate?.from,
    //     to: currentDate?.to,
    //   },
    //   deliveryType: 'Home Delivery',
    // }).then(response => {
    //   const { status } = response;
    //   if (status === 200) {
    onDeliveryToggle('Home Delivery');
    setIsDeliveryDateDialog(false);
    // enqueueSnackbar('Delivery pickup date updated.', {
    //   variant: 'success',
    // });
    //   }
    // });
  };

  const onSafePickupDateUpdate = (date: Date) => {
    // const safePickupDates = vendor.fulfillment.pickup.days;
    // const currentDate = safePickupDates.find(
    //   item => (item.weekday + 1) % 7 === date.getDay(),
    // );
    // HttpService.put(`/cart/${cartId}`, {
    //   fulfillday: {
    //     day: date,
    //     from: currentDate?.from,
    //     to: currentDate?.to,
    //   },
    //   deliveryType: 'Safe Pickup',
    // }).then(response => {
    //   const { status } = response;
    //   if (status === 200) {
    onDeliveryToggle('Safe Pickup');
    setIsDeliveryDateDialog(false);
    //     enqueueSnackbar('Safe pickup date updated.', {
    //       variant: 'success',
    //     });
    //   }
    // });
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.vendor}>
          <img src={`${SERVER_URL}/${vendor.images?.logoUrl}`} />
          <div className={styles.order}>
            <p className={styles.name}>{vendor.business.name}</p>
            <p className={styles.orderId}>
              Order ID: <span>{orderID}</span>
            </p>
          </div>
        </div>
        <div className={styles.delivery}>
          <p className={styles.title}>Delivery Options</p>
          <p className={styles.body}>{getDeliveryTypes().join(', ')}</p>
        </div>
        <div className={styles.subtotal}>
          <p className={styles.title}>Subtotal</p>
          <p className={styles.body}>${(price * quantity).toFixed(2)}</p>
        </div>
      </div>
      <div className={styles.products}>
        <div className={styles.product}>
          <div className={styles.main}>
            <div className={styles.imageBar}>
              <img
                src={`${SERVER_URL}/${image}`}
                alt="The Product Image"
              />
              <div className={styles.quantity}>
                <span className={styles.minus} onClick={onMinusClick(quantity)}>
                  <FaMinus fill="#3F3F3F" />
                </span>
                <p>{quantity}</p>
                <span className={styles.plus} onClick={onPlusClick(quantity)}>
                  <FaPlus fill="white" />
                </span>
              </div>
            </div>
            <div className={styles.majorInfo}>
              <div className={styles.heading}>
                <p className={styles.title}>{product.name}</p>
                <p className={styles.pricePerUnit}>
                  Minimum 1 Bunch at ${(price || 0).toFixed(2)}/
                  {product.soldByUnit}
                </p>
              </div>
              {!subscription?.iscsa ? (
                <div className={styles.shipping}>
                  <p className={styles.title}>Would you like to</p>
                  <div className={styles.form}>
                    <Button
                      className={styles.giftBtn}
                      onClick={() => setIsGiftDialog(true)}
                    >
                      <p className={styles.label}>
                        {gift ? 'Edit gift information' : "It's as gift"}
                      </p>
                      <span>
                        <img src={GiftIcon} alt="Gift icon" />
                      </span>
                    </Button>
                    {subscription && (
                      <Select
                        value={subscription.subscribe}
                        options={getFrequencyOpts(subscription.frequencies)}
                        placeholder="Subscribe"
                        className={styles.subscSelect}
                        updateValue={onFrequencyChange}
                      />
                    )}
                  </div>
                </div>
              ) : (<div className={styles.subscription}>
                <p className={styles.head}>Would you like to</p>
                <div className={styles.body}>
                  <div className={styles.text}>
                    <span>Subscribed:</span>
                    <p>{ }</p>
                  </div>
                  <div className={clsx(styles.text, styles.duration)}>
                    <span>Subscription Duration:</span>
                    <p>
                      {subscription?.csa.duration} {getFrequencyUnit(subscription.csa.duration, subscription?.csa.frequency)}{' '}
                      {subscription.csa.startDate && subscription.csa.endDate &&
                        `${getDateStr(subscription?.csa.startDate || '')} - ${getDateStr(subscription?.csa.endDate || '')}`}
                    </p>
                  </div>
                  <div className={clsx(styles.text, styles.frequency)}>
                    <span>Subscription Frequency:</span>
                    <p>{getFrequencyName(product.subscription?.csa.frequency || '')}</p>
                  </div>
                  <p className={styles.text}>
                    Your card will be charged{' '}
                    <span>
                      ${(price * quantity * csaCycle).toFixed(2)} every{' '}
                      {subscription.csa.duration} {getFrequencyUnit(subscription.csa.duration, subscription?.csa.frequency)}
                    </span>{' '}
                    or until cancelation
                  </p>
                </div>
              </div>
              )}
              {!subscription?.iscsa &&
                buymode === 'recurring' ? (
                <div className={styles.subscribed}>
                  <div className={styles.frequency}>
                    <span>Subscribed: </span>
                    <p>{getFrequencyLabel(subscription?.subscribe || '')}</p>
                  </div>
                  <p className={styles.hint}>
                    Your card will be charged ${(price * quantity).toFixed(2)}{' '}
                    {getFrequencyLabel(subscription?.subscribe || '')} plus shipping fees or
                    until cancelation
                  </p>
                </div>
              ) : subscription?.iscsa === false ? (
                <div className={styles.extra}>
                  <div className={styles.style}>
                    {/* {inventory.styleId.attributes.map((attribute: any) => (
                      <p className={styles.attr} key={attribute._id}>
                        <span>{attribute.name}: </span>
                        {inventory.attrs[attribute._id]}
                      </p>
                    ))} */}
                  </div>
                  {personalization && (
                    <div className={styles.personalization}>
                      <p className={styles.title}>Personalized: </p>
                      <p className={styles.body}>{personalization.message}</p>
                      <span className={styles.expandBtn}>Expand</span>
                    </div>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className={styles.action}>
            <p className={styles.removeBtn} onClick={onRemoveCartClick}>
              Remove
              <span>
                <TrashIcon />
              </span>
            </p>
            <div className={styles.pricing}>
              <div className={styles.quantity}>
                <span className={styles.minus} onClick={onMinusClick(quantity)}>
                  <FaMinus fill="#3F3F3F" />
                </span>
                <p>{quantity}</p>
                <span className={styles.plus} onClick={onPlusClick(quantity)}>
                  <FaPlus fill="white" />
                </span>
              </div>
              <div className={styles.price}>
                <p className={styles.title}>Price</p>
                <p className={styles.body}>${(price || 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <p className={styles.title}>Delivery Options</p>
        <div className={styles.buttons}>
          {getDeliveryOptions().map((item: string, index: number) => (
            <button
              key={index}
              className={clsx({
                [styles.active]: item === deliveryType,
              })}
              onClick={onDeliveryOptionClick(item)}
            >
              {item}
            </button>
          ))}
        </div>
        {deliveryType === 'Pickup Location' ||
          deliveryType === 'Safe Pickup' ? (
          <div className={styles.detail}>
            <div className={styles.date}>
              {deliveryType === 'Pickup Location' ? <p>
                {getDateStr(pickuplocation?.pickupDate || '')} {convertTime24to12(pickuplocation?.pickupTime.from || '')}{' '}
                {convertTime24to12(pickuplocation?.pickupTime.to || '')}
              </p> : <p></p>}
              <span onClick={() => setIsPickupLocationDialog(true)}>
                Change
              </span>
            </div>
            {deliveryType === 'Pickup Location' ? (
              <div className={styles.location}>
                <p>Pickup Location</p>
                <div className={styles.panel}>
                  <div className={styles.location}>
                    <FaMapMarkerAlt />
                    <div>
                      <p className={styles.name}>{pickuplocation?.name}</p>
                      <p className={styles.address}>
                        {pickuplocation?.address}
                      </p>
                    </div>
                  </div>
                  <div>
                    <FaPhone />
                    <p>{vendor.business.phone}</p>
                  </div>
                  <div>
                    <PiUsersFill />
                    <p>Max Hence, Uli Hence</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.safepickup}>
                <p>
                  A Safe Pickup Location will be emailed to you by your vendor
                  before pickup.
                </p>
                <div>
                  <span></span>
                  <p>!</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
      <GiftDialog
        open={isGiftDialog}
        onApply={onGiftApply}
        onClose={() => setIsGiftDialog(false)}
        existing={gift}
      />
      <PickupLocationDialog
        open={isPickupLocationDialog}
        onUpdate={onPickupLocationUpdate}
        onClose={() => {
          onDeliveryOptionClick('Pickup Location');
          setIsPickupLocationDialog(false);
        }}
        locations={vendor.fulfillment.locations}
      />
      <PickDateDialog
        open={isDeliveryDateDialog}
        selectedDay={deliveryDate}
        setSelectedDay={setDeliveryDate}
        dates={getAvailableDates('delivery').map(item => item.date)}
        onUpdate={onDeliveryDateUpdate}
        onClose={() => setIsDeliveryDateDialog(false)}
      />
      <PickDateDialog
        open={isSafePickupDateDialog}
        selectedDay={safePickupDate}
        setSelectedDay={setSafePickupDate}
        dates={getAvailableDates('pickup').map(item => item.date)}
        onUpdate={onSafePickupDateUpdate}
        onClose={() => setIsSafePickupDateDialog(false)}
      />
    </div>
  );
}
