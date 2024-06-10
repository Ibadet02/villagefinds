import { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import clsx from 'clsx';

import { Button, Radio, RadioGroup } from '@/components/forms';
import { formatUsDate, useOnClickOutside } from '@/utils';

import styles from './PickupLocationDialog.module.scss';

interface ILocation {
  name: string;
  address: string;
  eventDate?: string;
  pickupWeekday?: number;
  pickupTime: {
    from: string;
    to: string;
  };
  instruction: string;
  charge: number;
}

interface IPickupLocationDialogProps {
  open: boolean;
  locations: ILocation[];
  onClose?: () => void;
  onUpdate?: (pickup: any) => void;
}

function convertTime24to12(time24: string) {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  const period = Number(hours) >= 12 ? 'PM' : 'AM';
  const hours12 = (Number(hours) % 12 || 12);
  return `${hours12}:${minutes} ${period}`;
}

export function PickupLocationDialog({
  open,
  onClose = () => { },
  onUpdate = () => { },
  locations: pickupLocations,
}: IPickupLocationDialogProps) {
  const [isLocPanel, setIsLocPanel] = useState(true);
  const [locIndex, setLocIndex] = useState('0');
  const [dateIndex, setDateIndex] = useState('0');

  const dialogRef = useRef<HTMLDivElement>(null);

  const onUpdateClick = () => {
    const location = pickupLocations[Number(locIndex)];
    onUpdate({
      location: {
        name: location.name,
        address: location.address,
        charge: location.charge,
      },
      fulfillday: {
        day: location.eventDate,
        from: location.pickupTime.from,
        to: location.pickupTime.to,
      },
      instruction: location.instruction
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
    <div className={clsx(styles.root, !open ? styles.hide : '')}>
      <div className={styles.container} ref={dialogRef}>
        <div className={styles.content}>
          <div className={styles.head}>
            <p className={styles.title}>
              {`Choose Your Pickup ${isLocPanel ? 'Location' : 'Date'}`}
            </p>
            <p className={styles.text}>
              {isLocPanel
                ? 'Select a pickup location for your order'
                : 'Select the date you want to pickup your order'}
            </p>
          </div>
          <div className={styles.body}>
            {isLocPanel ? (
              <RadioGroup
                value={locIndex}
                updateValue={(index: string) => setLocIndex(index)}
                className={styles.locPanel}
              >
                {pickupLocations.map((location: any, index: number) => (
                  <div
                    key={index}
                    className={clsx(styles.location, {
                      [styles.active]: locIndex === index.toString(),
                    })}
                    onClick={() => setLocIndex(index.toString())}
                  >
                    <div className={styles.text}>
                      <p className={styles.name}>{location.name}</p>
                      <p className={styles.position}>{location.address}</p>
                    </div>
                    <Radio value={index.toString()} />
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className={styles.datePanel}>
                <div className={styles.location}>
                  <div className={styles.text}>
                    <p className={styles.name}>
                      {pickupLocations[Number(locIndex)].name}
                    </p>
                    <p className={styles.position}>
                      {pickupLocations[Number(locIndex)].address}
                    </p>
                  </div>
                </div>
                <RadioGroup
                  value={dateIndex}
                  updateValue={(index: string) => setDateIndex(index)}
                  className={styles.timePanel}
                >
                  <div
                    className={clsx(styles.timeCell, {
                      // [styles.active]: dateIndex === index.toString(),
                      [styles.active]: true,
                    })}
                  // onClick={() => setDateIndex(index.toString())}
                  >
                    <div className={styles.pickupdate}>
                      <div className={styles.element}>
                        <p className={styles.title}>Pickup date</p>
                        <p className={styles.text}>
                          {/* {formatDate(dateTime.weekday)} */}
                          {pickupLocations[Number(locIndex)].eventDate
                            ? formatUsDate(
                              pickupLocations[Number(locIndex)].eventDate || '',
                            )
                            : ''}
                        </p>
                      </div>
                      <div className={styles.element}>
                        <p className={styles.title}>Pickup Between</p>
                        <p className={styles.text}>
                          {convertTime24to12(pickupLocations[Number(locIndex)].pickupTime.from)}{' '}
                          {convertTime24to12(pickupLocations[Number(locIndex)].pickupTime.to)}
                        </p>
                      </div>
                    </div>
                    <Radio
                      // value={index.toString()}
                      className={styles.radio}
                    />
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>
        </div>
        <div className={styles.buttons}>
          {isLocPanel ? (
            <Button
              className={clsx(styles.button, styles.nextBtn)}
              onClick={() => setIsLocPanel(false)}
            >
              Next
            </Button>
          ) : (
            <>
              <Button
                className={clsx(styles.button, styles.backBtn)}
                onClick={() => setIsLocPanel(true)}
              >
                Back
              </Button>
              <Button
                className={clsx(styles.button, styles.updateBtn)}
                onClick={onUpdateClick}
              >
                Update
              </Button>
            </>
          )}
        </div>
        <span className={styles.closeBtn} onClick={onClose}>
          <FaTimes size={24} />
        </span>
      </div>
    </div>
  );
}
