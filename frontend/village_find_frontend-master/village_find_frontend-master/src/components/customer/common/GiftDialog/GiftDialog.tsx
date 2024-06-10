import { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import clsx from 'clsx';

import { Button, Input, Select, TextField } from '@/components/forms';
import { useOnClickOutside } from '@/utils';

import styles from './GiftDialog.module.scss';

interface IGiftDialogProps {
  open: boolean;
  existing?: boolean;
  onClose?: () => void;
  onApply?: (gift: {
    receiver: IGiftInfo;
    isHomeDelivery: boolean;
    delivery?: IDeliveryInfo;
  }) => void;
}

interface IGiftInfo {
  name: string;
  phone: string;
  email: string;
  message: string;
}

interface IDeliveryInfo {
  street: string;
  city: string;
  country: string;
  extras: string;
  state: string;
  zipcode: number;
  instruction: string;
}

const initialGiftInfo: IGiftInfo = {
  name: '',
  phone: '',
  email: '',
  message: '',
};

const initialDeliveryInfo: IDeliveryInfo = {
  street: '',
  city: '',
  country: '',
  extras: '',
  state: '',
  zipcode: 0,
  instruction: '',
};

const initialAddrOptions: string[] = [];

export function GiftDialog({
  open,
  existing = true,
  onClose = () => { },
  onApply = () => { },
}: IGiftDialogProps) {
  const [isGiftNew, setIsGiftNew] = useState(!existing);
  const [giftStage, setGiftStage] = useState(0);

  const [giftInfo, setGiftInfo] = useState<IGiftInfo>(initialGiftInfo);
  const [deliveryInfo, setDeliveryInfo] =
    useState<IDeliveryInfo>(initialDeliveryInfo);
  const dialogRef = useRef<HTMLDivElement>(null);

  const onGiftInfoChange = (e: any) => {
    setGiftInfo({
      ...giftInfo,
      [e.target.name]: e.target.value,
    });
  };

  const onDeliveryInfoChange = (e: any) => {
    setDeliveryInfo({
      ...deliveryInfo,
      [e.target.name]:
        e.target.name === 'zipcode' ? Number(e.target.value) : e.target.value,
    });
  };

  const onDeliveryCountryInfoChange = (country: string) => {
    setDeliveryInfo({
      ...deliveryInfo,
      country,
    });
  };

  const onCancelClick = () => {
    setIsGiftNew(false);
    setGiftStage(0);
  };

  const onSameAddrSend = () => {
    onApply({ receiver: giftInfo, isHomeDelivery: true });
  };

  const onOtherAddrSend = () => {
    setGiftStage(giftStage + 1);
  };

  const onGiftApply = () => {
    onApply({
      receiver: giftInfo,
      isHomeDelivery: false,
      delivery: deliveryInfo,
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
    open && (
      <div className={styles.root}>
        <div className={styles.container} ref={dialogRef}>
          <p className={styles.title}>
            {(isGiftNew && giftStage) === 3
              ? 'Enter gift shipping address'
              : 'Gift Information'}
          </p>
          {!isGiftNew ? (
            <div className={styles.existing}>
              <p className={styles.text}>Use existing gift information</p>
              <div className={styles.buttons}>
                <Button
                  className={clsx(styles.button, styles.outlined)}
                  onClick={() => setIsGiftNew(true)}
                >
                  New
                </Button>
                <Button
                  className={clsx(styles.button, styles.contained)}
                  onClick={onClose}
                >
                  Yes
                </Button>
              </div>
            </div>
          ) : isGiftNew && giftStage === 0 ? (
            <div className={styles.receiver}>
              <p className={styles.text}>Who's receiving this order?</p>
              <Select
                placeholder="Address Book"
                className={styles.addrSelect}
                options={initialAddrOptions}
              />
              <div className={styles.elements}>
                <div className={styles.horizon}>
                  <Input
                    name="name"
                    placeholder="Full Name"
                    className={styles.input}
                    value={giftInfo.name}
                    updateValue={onGiftInfoChange}
                  />
                  <Input
                    name="phone"
                    placeholder="Contact Number"
                    className={styles.input}
                    value={giftInfo.phone}
                    updateValue={onGiftInfoChange}
                  />
                </div>
                <Input
                  name="email"
                  placeholder="Email"
                  className={styles.input}
                  value={giftInfo.email}
                  updateValue={onGiftInfoChange}
                />
              </div>
              <div className={styles.buttons}>
                <Button
                  className={clsx(styles.button, styles.outlined)}
                  onClick={onCancelClick}
                >
                  Cancel
                </Button>
                <Button
                  className={clsx(styles.button, styles.contained)}
                  onClick={() => setGiftStage(giftStage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : isGiftNew && giftStage === 1 ? (
            <div className={styles.message}>
              <div className={styles.element}>
                <p className={styles.title}>Send a custome message</p>
                <TextField
                  rows={5}
                  name="message"
                  placeholder="Type gift message"
                  className={styles.msgInput}
                  value={giftInfo.message}
                  updateValue={onGiftInfoChange}
                />
              </div>
              <div className={styles.buttons}>
                <Button
                  className={clsx(styles.button, styles.outlined)}
                  onClick={onCancelClick}
                >
                  Cancel
                </Button>
                <Button
                  className={clsx(styles.button, styles.contained)}
                  onClick={() => setGiftStage(giftStage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : isGiftNew && giftStage === 2 ? (
            <div className={styles.giftAddr}>
              <p className={styles.title}>Send gift to different address</p>
              <div className={styles.buttons}>
                <Button
                  className={clsx(styles.button, styles.outlined)}
                  onClick={onSameAddrSend}
                >
                  No
                </Button>
                <Button
                  className={clsx(styles.button, styles.contained)}
                  onClick={onOtherAddrSend}
                >
                  Yes
                </Button>
              </div>
            </div>
          ) : isGiftNew && giftStage === 3 ? (
            <div className={styles.shippingAddr}>
              <div className={styles.section}>
                <p className={styles.title}>Who's receiving this order?</p>
                <div className={styles.horizon}>
                  <Input
                    name="name"
                    placeholder="Full Name"
                    value={giftInfo.name}
                    updateValue={onGiftInfoChange}
                    className={styles.input}
                  />
                  <Input
                    name="phone"
                    placeholder="Contact Number"
                    value={giftInfo.phone}
                    updateValue={onGiftInfoChange}
                    className={styles.input}
                  />
                </div>
                <Input
                  name="email"
                  placeholder="Email"
                  value={giftInfo.email}
                  updateValue={onGiftInfoChange}
                  className={styles.input}
                />
                <Input
                  name="message"
                  placeholder="Gift Message"
                  value={giftInfo.message}
                  updateValue={onGiftInfoChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.section}>
                <p className={styles.title}>Delivery Details</p>
                <div className={styles.horizon}>
                  <Input
                    name="street"
                    placeholder="Street Address"
                    value={deliveryInfo.street}
                    updateValue={onDeliveryInfoChange}
                    className={styles.input}
                  />
                  <Input
                    name="extras"
                    placeholder="Extras: Appt #, Floor, Unit, Etc..."
                    value={deliveryInfo.extras}
                    updateValue={onDeliveryInfoChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.horizon}>
                  <Input
                    name="city"
                    placeholder="City"
                    value={deliveryInfo.city}
                    updateValue={onDeliveryInfoChange}
                    className={styles.input}
                  />
                  <Input
                    name="state"
                    placeholder="State"
                    value={deliveryInfo.state}
                    updateValue={onDeliveryInfoChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.horizon}>
                  <Select
                    placeholder="Country"
                    value={deliveryInfo.country}
                    updateValue={onDeliveryCountryInfoChange}
                    className={styles.countrySelector}
                  />
                  <Input
                    name="zipcode"
                    placeholder="Zipcode"
                    value={deliveryInfo.zipcode.toString()}
                    updateValue={onDeliveryInfoChange}
                    className={styles.input}
                  />
                </div>
                <TextField
                  name="instruction"
                  placeholder="Delivery Instructions"
                  rows={5}
                  value={deliveryInfo.instruction}
                  updateValue={onDeliveryInfoChange}
                  className={styles.instructionInput}
                />
              </div>
              <div className={styles.buttons}>
                <Button
                  className={clsx(styles.button, styles.contained)}
                  onClick={onGiftApply}
                >
                  Apply
                </Button>
                <Button
                  className={clsx(
                    styles.button,
                    styles.outlined,
                    styles.cancel,
                  )}
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <></>
          )}
          <span className={styles.closeBtn} onClick={onClose}>
            <FaTimes size={24} />
          </span>
        </div>
      </div>
    )
  );
}
