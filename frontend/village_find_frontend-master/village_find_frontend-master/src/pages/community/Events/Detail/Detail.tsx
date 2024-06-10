import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import { Input, TextField } from '@/components/forms';

import { formatDate, getBubbleObject } from '@/utils';

import styles from './Detail.module.scss';

const homePath = '/village-community/events';

interface IDetailProps {
  event: IEventDetail;
  updateEvent: (_: any) => void;
  onNextUpdate: () => void;
}

export interface IEventDetail {
  name: string;
  address: string;
  fulfillment: {
    date: string;
    startTime: string;
    endTime: string;
  };
  detail: string;
  isActive: boolean;
}

export interface IAttendee {
  _id?: string;
  name: string;
  height: string;
  weight: string;
  submited_at: string;
  attending: string;
}

export type IEditingEventDetail = IEventDetail & {
  attendees: IAttendee[];
};

export function Detail({ event, updateEvent, onNextUpdate }: IDetailProps) {
  const navigate = useNavigate();

  const onEventChange = (e: any) => {
    updateEvent(getBubbleObject(e.target.name, event, e.target.value));
  };

  return (
    <div className={styles.root}>
      <div className={styles.form}>
        <div className={styles.control}>
          <p className={styles.label}>Event name</p>
          <Input
            placeholder="Event name"
            className={styles.input}
            rounded="full"
            bgcolor="secondary"
            border="none"
            name="name"
            value={event.name}
            updateValue={onEventChange}
          />
        </div>
        <div className={styles.control}>
          <p className={styles.label}>Event Location</p>
          <Input
            placeholder="Partnered pickup location address"
            className={styles.input}
            rounded="full"
            bgcolor="secondary"
            border="none"
            name="address"
            value={event.address}
            updateValue={onEventChange}
          />
        </div>
        <div className={styles.horizon}>
          <div className={styles.control}>
            <p className={styles.label}>Special Event Fulfillment Date</p>
            <Input
              type="date"
              className={styles.input}
              rounded="full"
              border="none"
              bgcolor="secondary"
              name="fulfillment.date"
              value={formatDate(new Date(event.fulfillment.date))}
              updateValue={onEventChange}
            />
          </div>
          <div className={styles.control}>
            <p className={styles.label}>Event Start</p>
            <Input
              type="time"
              className={styles.input}
              rounded="full"
              border="none"
              bgcolor="secondary"
              name="fulfillment.startTime"
              value={event.fulfillment.startTime}
              updateValue={onEventChange}
            />
          </div>
          <div className={styles.control}>
            <p className={styles.label}>Event End</p>
            <Input
              type="time"
              className={styles.input}
              rounded="full"
              border="none"
              bgcolor="secondary"
              name="fulfillment.endTime"
              value={event.fulfillment.endTime}
              updateValue={onEventChange}
            />
          </div>
        </div>
        <div className={styles.control}>
          <p className={styles.label}>Event Details</p>
          <TextField
            placeholder="Special instructions (Sent in email to customer)"
            className={styles.textarea}
            rounded="full"
            bgcolor="secondary"
            border="none"
            name="detail"
            value={event.detail}
            updateValue={onEventChange}
          />
        </div>
        <div className={styles.control}>
          <p className={styles.label}>Active</p>
          <div className={styles.radios}>
            <div
              className={clsx(styles.button, {
                [styles.active]: event.isActive === true,
              })}
              onClick={() => updateEvent({ ...event, isActive: true })}
            >
              <span />
              <p>Yes</p>
            </div>
            <div
              className={clsx(styles.button, {
                [styles.active]: event.isActive === false,
              })}
              onClick={() => updateEvent({ ...event, isActive: false })}
            >
              <span />
              <p>No</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.buttons}>
        <button className={styles.button} onClick={() => navigate(homePath)}>
          Cancel
        </button>
        <button
          className={clsx(styles.button, styles.update)}
          onClick={onNextUpdate}
        >
          Update
        </button>
      </div>
    </div>
  );
}
