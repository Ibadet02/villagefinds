import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import _ from 'lodash';
import clsx from 'clsx';

import {
  Button,
  Input,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@/components';
import { ChangeInputEvent } from '@/interfaces';
import { HttpService } from '@/services';

import styles from './PickupLocationCreate.module.scss';

interface ILocation {
  name: string;
  address: string;
  pickupTime: {
    from: string;
    to: string;
  };
  pickupWeekday?: number;
  eventDate?: string;
  instruction: string;
  charge: number;
  status: string;
}

const initialLocation: ILocation = {
  name: '',
  address: '',
  pickupTime: {
    from: '',
    to: '',
  },
  pickupWeekday: -1,
  eventDate: '',
  instruction: '',
  charge: 0,
  status: 'inactive',
};

const weekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const PICKUP_LOCATION_PATH = '/vendor/profile/fulfillment/location';

export function PickupLocationCreate() {
  const navigate = useNavigate();
  const { id: actionID } = useParams();

  const [location, setLocation] = useState<ILocation>(initialLocation);
  const [isSpecialEvent, setIsSpecialEvent] = useState(false);
  const [eventDate, setEventDate] = useState('');

  const onLocationChange = (e: ChangeInputEvent) => {
    setLocation({ ...location, [e.target.name]: e.target.value });
  };

  const onEventToggleClick = () => {
    if (isSpecialEvent) setEventDate('');
    setIsSpecialEvent(!isSpecialEvent);
  };

  const onCreateOrUpdateClick = () => {
    const reqJson: any = { ...location };
    const reqParams: any = {};
    if (isSpecialEvent) {
      reqJson.eventDate = eventDate;
      delete reqJson.pickupWeekday;
    } else delete reqJson.eventDate;

    if (actionID && actionID !== 'create') reqParams.id = actionID;
    HttpService.put('/user/vendor/profile/fulfillment/location', reqJson, reqParams).then(response => {
      const { status } = response;
      if (status === 200) {
        enqueueSnackbar(`Partnered pickup location ${actionID === 'create' ? 'created' : 'updated'}.`, { variant: 'success' });
        navigate(PICKUP_LOCATION_PATH);
      }
    })
  };

  useEffect(() => {
    if (actionID === 'create') return;
    HttpService.get('/user/vendor/profile/fulfillment/location', {
      id: actionID,
    }).then(response => {
      setLocation(response);
    });
  }, [actionID]);

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.control}>
          <p>Partnered pickup location name</p>
          <Input
            name="name"
            rounded="full"
            border="none"
            bgcolor="secondary"
            placeholder="Partnered pickup location name"
            className={styles.input}
            value={location.name}
            updateValue={onLocationChange}
          />
        </div>
        <div className={styles.control}>
          <p>Partnered pickup location address</p>
          <Input
            name="address"
            rounded="full"
            border="none"
            bgcolor="secondary"
            placeholder="Partnered pickup location address"
            className={styles.input}
            value={location.address}
            updateValue={onLocationChange}
          />
        </div>
        <div className={styles.inputWithButton}>
          <p>Special Event Fulfillment Date</p>
          <div className={styles.control}>
            <Input
              type="date"
              rounded="full"
              border="none"
              bgcolor="secondary"
              className={clsx(styles.input, styles.fit)}
              value={eventDate}
              updateValue={(e: ChangeInputEvent) =>
                setEventDate(e.target.value)
              }
            />
            {
              <Button
                size="medium"
                className={styles.button}
                onClick={onEventToggleClick}
                disabled={!eventDate}
              >
                {isSpecialEvent ? 'Remove' : 'Add'}
              </Button>
            }
          </div>
        </div>
        <div className={styles.pickup}>
          <div className={styles.control}>
            <p>Weekly pickup day</p>
            <Select
              rounded="full"
              border="none"
              bgcolor="primary"
              placeholder="Monday"
              className={styles.pickupDay}
              options={weekdays.map((item: string, index: number) => ({
                name: item,
                value: index.toString(),
              }))}
              value={location.pickupWeekday?.toString()}
              updateValue={value =>
                setLocation({
                  ...location,
                  pickupWeekday: Number(value)
                })
              }
              disabled={!!location.eventDate}
            />
          </div>
          <div className={styles.control}>
            <p>Pickup window (from)</p>
            <div className={styles.pickupPicker}>
              <Input
                type="time"
                className={styles.pickInput}
                value={location.pickupTime.from}
                border="none"
                bgcolor="secondary"
                updateValue={(e: ChangeInputEvent) =>
                  setLocation({
                    ...location,
                    pickupTime: { ...location.pickupTime, from: e.target.value },
                  })
                }
              />
            </div>
          </div>
          <div className={styles.control}>
            <p>Pickup window (to)</p>
            <div className={styles.pickupPicker}>
              <Input
                type="time"
                className={styles.pickInput}
                value={location.pickupTime.to}
                border="none"
                bgcolor="secondary"
                updateValue={(e: ChangeInputEvent) =>
                  setLocation({
                    ...location,
                    pickupTime: { ...location.pickupTime, to: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>
        <div className={styles.control}>
          <p>Special instructions (Sent in email to customer)</p>
          <TextField
            rounded="full"
            border="none"
            bgcolor="secondary"
            placeholder="Special instructions (Sent in email to customer)"
            className={styles.input}
            value={location.instruction}
            updateValue={(e: ChangeInputEvent) =>
              setLocation({ ...location, instruction: e.target.value })
            }
          />
        </div>
        <div className={styles.control}>
          <p>Delivery charge</p>
          <Input
            type="number"
            rounded="full"
            border="none"
            bgcolor="secondary"
            placeholder="00.00"
            className={styles.fit}
            value={location.charge}
            updateValue={(e: ChangeInputEvent) =>
              setLocation({ ...location, charge: Number(e.target.value) })
            }
          />
        </div>
        <div className={styles.control}>
          <p>Active</p>
          <RadioGroup
            value={location.status}
            updateValue={(value: string) =>
              setLocation({ ...location, status: value })
            }
          >
            <Radio
              label="Yes"
              value="active"
              className={clsx(styles.radio, {
                [styles.active]: location.status === 'active',
              })}
            />
            <Radio
              label="No"
              value="inactive"
              className={clsx(styles.radio, {
                [styles.active]: location.status === 'inactive',
              })}
            />
          </RadioGroup>
        </div>
      </div>
      <div className={styles.buttonBar}>
        <button
          className={clsx(styles.button, styles.cancelButton)}
          onClick={() => navigate(PICKUP_LOCATION_PATH)}
        >
          Cancel
        </button>
        <button className={styles.button} onClick={onCreateOrUpdateClick}>
          {actionID === 'create' ? 'Create' : 'Update'}
        </button>
      </div>
    </div>
  );
}
