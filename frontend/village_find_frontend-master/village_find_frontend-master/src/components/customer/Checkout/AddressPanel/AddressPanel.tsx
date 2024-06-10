import { useEffect, useState } from 'react';
import parseAddress from 'parse-address';

import { Input, Select, TextField } from '@/components/forms';
import { http } from '@/services';
import { ChangeInputEvent } from '@/interfaces';
import { IAddress } from '../MyCart';

import styles from './AddressPanel.module.scss';

export interface IRecipient {
  name: string;
  phone: string;
  email: string;
}

export interface IDelivery {
  street: string;
  extra: string;
  city: string;
  state: string;
  country: string;
  zipcode: number;
  instruction: string;
}

interface IAddressPanelProps {
  addressList: IAddress[];
  recipient: IRecipient | undefined;
  delivery: IDelivery | undefined;
  setRecipient: (_: IRecipient) => void;
  setDelivery: (_: IDelivery) => void;
}

const initialRecipient: IRecipient = {
  name: '',
  phone: '',
  email: '',
};

const initialDelivery: IDelivery = {
  street: '',
  city: '',
  country: '',
  extra: '',
  instruction: '',
  state: '',
  zipcode: 0,
};

const getDetailedInfo = (address: string): any => {
  const parsed = parseAddress.parseLocation(address);

  if (!parsed) {
    return {};
  }

  const addressLine1 = [parsed.number, parsed.prefix, parsed.street, parsed.type, parsed.suffix]
    .filter(Boolean)
    .join(' ');
  const city = parsed.city;
  const state = parsed.state;
  const zipcode = parsed.zip;

  return {
    street: addressLine1,
    city,
    state,
    zipcode,
  };
}

export function AddressPanel({
  addressList,
  recipient,
  delivery,
  setRecipient,
  setDelivery
}: IAddressPanelProps) {
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);

  const onShippingChange = (e: ChangeInputEvent) => {
    setRecipient({ ...(recipient || initialRecipient), [e.target.name]: e.target.value });
  };

  const onDeliveryChange = (e: ChangeInputEvent) => {
    setDelivery({ ...(delivery || initialDelivery), [e.target.name]: e.target.value });
  };

  const onAddressBookChange = (id: string) => {
    const address = addressList.find(item => item._id === id);
    if (address) {
      setDelivery({ ...delivery, ...getDetailedInfo(address.address), extra: address.extras });
    }
  }

  useEffect(() => {
    http
      .get('https://countriesnow.space/api/v0.1/countries/capital')
      .then(response => response.data)
      .then(response => {
        const { error, data } = response;
        if (!error) {
          setCountries(data.map((item: { name: string }) => item.name));
        }
      });
  }, []);

  useEffect(() => {
    http
      .post('https://countriesnow.space/api/v0.1/countries/states', {
        country: delivery?.country,
      })
      .then(response => response.data)
      .then(response => {
        const {
          err,
          data: { states },
        } = response;
        setStates(states);
      });
  }, [delivery?.country]);

  useEffect(() => {
    const address = addressList.find(item => item.default);
    if (address) {
      setDelivery({ ...delivery, ...getDetailedInfo(address.address), extra: address.extras });
    }
  }, [addressList]);

  return (
    <div className={styles.root}>
      <p className={styles.head}>Shipping & Delivery Address</p>
      <div className={styles.section}>
        <p className={styles.text}>Who's receiving this order?</p>
        <Select
          placeholder="Address Book"
          options={addressList.map(item => ({ name: item.name, value: item._id as string }))}
          value={addressList.find(item => item.default)?._id}
          updateValue={onAddressBookChange}
          className={styles.addressBook}
        />
        <div className={styles.horizon}>
          <Input
            name="name"
            placeholder="Full Name"
            className={styles.input}
            value={recipient?.name}
            updateValue={onShippingChange}
          />
          <Input
            name="phone"
            placeholder="Contact Number"
            className={styles.input}
            value={recipient?.phone}
            updateValue={onShippingChange}
          />
        </div>
        <Input
          name="email"
          placeholder="Email"
          className={styles.input}
          value={recipient?.email}
          updateValue={onShippingChange}
        />
      </div>
      <div className={styles.section}>
        <p className={styles.text}>Delivery Details</p>
        <div className={styles.horizon}>
          <Input
            name="street"
            placeholder="Street Address"
            className={styles.input}
            value={delivery?.street}
            updateValue={onDeliveryChange}
          />
          <Input
            name="extra"
            placeholder="Extras: Appt #, Floor, Unit, Etc..."
            className={styles.input}
            value={delivery?.extra}
            updateValue={onDeliveryChange}
          />
        </div>
        <div className={styles.horizon}>
          <Input
            name="city"
            placeholder="City"
            className={styles.input}
            value={delivery?.city}
            updateValue={onDeliveryChange}
          />
          <Input
            name="state"
            placeholder="State"
            className={styles.input}
            value={delivery?.state}
            updateValue={onDeliveryChange}
          />
        </div>
        <div className={styles.horizon}>
          <Select
            placeholder="Country"
            className={styles.country}
            options={countries}
            value={delivery?.country}
            updateValue={(country: string) =>
              setDelivery({ ...(delivery || initialDelivery), country })
            }
          />
          <Input
            name="zipcode"
            placeholder="Zipcode"
            className={styles.input}
            value={delivery?.zipcode}
            updateValue={onDeliveryChange}
          />
        </div>
        <TextField
          name="instruction"
          placeholder="Delivery Instructions"
          rows={3}
          className={styles.instruction}
          value={delivery?.instruction}
          updateValue={onDeliveryChange}
        />
      </div>
    </div>
  );
}
