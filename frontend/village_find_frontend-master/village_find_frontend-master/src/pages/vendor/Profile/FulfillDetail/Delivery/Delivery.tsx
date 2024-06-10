import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import clsx from 'clsx';

import { Input, Radio, RadioGroup } from '@/components/forms';
import { HttpService } from '@/services';
import { ChangeInputEvent } from '@/interfaces';

import styles from './Delivery.module.scss';

const weekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export function Delivery() {
  const [leadTime, setLeadTime] = useState<number>(0);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [deliveryDays, setDeliveryDays] = useState<number[]>([]);
  const [deliveryTimes, setDeliveryTimes] = useState<
    { from: string; to: string }[]
  >(Array(weekdays.length).fill({ from: '', to: '' }));

  const onPickDayChange = (value: string) => {
    if (deliveryDays.includes(Number(value))) {
      setDeliveryDays(deliveryDays.filter(item => item.toString() !== value));
    } else {
      setDeliveryDays([...deliveryDays, Number(value)]);
    }
  };

  const onPickTimeChange =
    (index: number, pos: 'from' | 'to') => (e: ChangeInputEvent) => {
      setDeliveryTimes(
        deliveryTimes.map((time: any, id: number) =>
          id === index ? { ...time, [pos]: e.target.value } : time,
        ),
      );
    };

  const onUpdateBtnClick = () => {
    HttpService.put('/user/vendor/profile/fulfillment/delivery', {
      leadTime,
      deliveryFee,
      deliveryDays: deliveryDays.map(weekday => ({
        weekday,
        ...deliveryTimes[weekday],
      })),
    }).then(response => {
      const { status } = response;
      if (status === 200) {
        enqueueSnackbar('Delivery days updated.', { variant: 'success' });
      }
    });
  };

  useEffect(() => {
    HttpService.get('/user/vendor/profile/fulfillment/delivery').then(
      response => {
        const { leadTime: time, deliveryFee, days: deliverDays } = response;
        const days = deliverDays || [];
        const leadTime = time || 0;
        const allowDays = days.map((item: any) => item.weekday);
        setLeadTime(leadTime);
        setDeliveryFee(deliveryFee);
        setDeliveryDays(allowDays);
        setDeliveryTimes(
          deliveryTimes.map((item: any, index: number) =>
            allowDays.includes(index)
              ? days.find((item: any) => item.weekday === index)
              : item,
          ),
        );
      },
    );
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.control}>
            <p>
              Lead Time <span>(In Hours)</span>
            </p>
            <Input
              type="number"
              placeholder="Lead Time"
              rounded="full"
              border="none"
              bgcolor="secondary"
              className={styles.timeInput}
              value={leadTime}
              updateValue={(e: ChangeInputEvent) =>
                setLeadTime(Number(e.target.value))
              }
            />
          </div>
        </div>
        <RadioGroup
          multiple={true}
          value={deliveryDays.map(item => item.toString())}
          updateValue={onPickDayChange}
        >
          <div className={styles.timeRanges}>
            {weekdays.map((day: string, index: number) => (
              <div
                key={day}
                className={clsx(
                  styles.row,
                  deliveryDays.includes(index) ? styles.active : '',
                )}
              >
                <div className={styles.weekday}>
                  <Radio label={day} value={index.toString()} />
                </div>
                <div className={styles.ranges}>
                  <div className={styles.range}>
                    <span>Starting Time</span>
                    <Input
                      type="time"
                      className={clsx(styles.timepicker, {
                        [styles.active]: deliveryDays.includes(index),
                      })}
                      value={
                        deliveryDays.includes(index)
                          ? deliveryTimes[index].from
                          : ''
                      }
                      updateValue={
                        deliveryDays.includes(index)
                          ? onPickTimeChange(index, 'from')
                          : () => { }
                      }
                    />
                  </div>
                  <div className={styles.range}>
                    <span>Ending Time</span>
                    <Input
                      type="time"
                      className={clsx(styles.timepicker, {
                        [styles.active]: deliveryDays.includes(index),
                      })}
                      value={
                        deliveryDays.includes(index)
                          ? deliveryTimes[index].to
                          : ''
                      }
                      updateValue={
                        deliveryDays.includes(index)
                          ? onPickTimeChange(index, 'to')
                          : () => { }
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>
        <div className={styles.buttonBar}>
          <div className={styles.control}>
            <p>
              Delivery fee
            </p>
            <Input
              type="number"
              placeholder="Delivery Fee"
              rounded="full"
              border="none"
              bgcolor="secondary"
              className={styles.timeInput}
              value={deliveryFee}
              updateValue={(e: ChangeInputEvent) =>
                setDeliveryFee(Number(e.target.value))
              }
              adornment={{
                position: 'left',
                content: '$'
              }}
            />
          </div>
          <button onClick={onUpdateBtnClick}>Update</button>
        </div>
      </div>
    </div>
  );
}
