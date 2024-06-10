import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { FaTimes } from 'react-icons/fa';
import clsx from 'clsx';

import { Calendar } from '@/components/common';
import { Button } from '@/components/forms';
import { RegisterFormDialog } from '@/components/customer';

import { AuthContext } from '@/providers';

import styles from './EventMeetupDialog.module.scss';

const initialMonthLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

interface IEventMeetupDialogProps {
  open: boolean;
  onClose: () => void;
  events: any[];
  attendees: string[];
}

export function EventMeetupDialog({
  open,
  onClose,
  events,
  attendees,
}: IEventMeetupDialogProps) {
  const navigate = useNavigate();

  const { isLogin } = useContext(AuthContext);

  const [activeEvent, setActiveEvent] = useState(null);

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isRegFormOpen, setIsRegFormOpen] = useState(false);

  const isSelectedDay = (date: string | Date): boolean => {
    if (!selectedDay || !date) return false;

    const eventDay = new Date(date);
    return (
      selectedDay.getFullYear() === eventDay.getFullYear() &&
      selectedDay.getMonth() === eventDay.getMonth() &&
      selectedDay.getDate() === eventDay.getDate()
    );
  };

  const compare = (event1: any, event2: any) => {
    const eventDate1 = (event1.fulfillment && event1.fulfillment.date) ?? '',
      eventDate2 = (event2.fulfillment && event2.fulfillment.date) ?? '';
    return (
      Number(isSelectedDay(eventDate2)) - Number(isSelectedDay(eventDate1))
    );
  };

  const getSortedEvents = () => {
    const result = [...events];
    return result.sort(compare);
  };

  const getEventDates = () => {
    return events.map(
      event => new Date((event.fulfillment && event.fulfillment.date) ?? ''),
    );
  };

  const onRegClick = (event: any) => () => {
    if (!isLogin) {
      enqueueSnackbar('You have to login to register a meetup.', {
        variant: 'warning',
      });
      navigate('/login/customer');
      return;
    }
    setActiveEvent(event);
    setIsRegFormOpen(true);
  };

  if (!open) return;
  return (
    <>
      <div className={styles.root}>
        <div className={styles.container}>
          <div className={styles.calendar}>
            <p className={styles.title}>Events</p>
            <Calendar
              dates={getEventDates()}
              selectedDay={selectedDay}
              onDaySelect={setSelectedDay}
              availableText="Event Days"
              currentText="Current Day"
              selectedText="Selected Day"
            />
            <Button className={styles.updateButton}>Update</Button>
          </div>
          <div className={styles.events}>
            {getSortedEvents().map((event: any, index: number) => (
              <div
                className={clsx(
                  styles.event,
                  {
                    [styles.selectedDay]: isSelectedDay(
                      (event.fulfillment && event.fulfillment.date) ?? '',
                    ),
                  },
                  attendees.includes(event._id)
                    ? styles.active
                    : styles.inactive,
                )}
                key={index}
              >
                <div className={styles.bar} />
                <div className={styles.content}>
                  <div className={styles.titlebar}>
                    <div className={styles.register}>
                      <p className={styles.title}>Vendor Meetups</p>
                      {!attendees.includes(event._id) && (
                        <button
                          className={styles.regButton}
                          onClick={onRegClick(event)}
                        >
                          Register
                        </button>
                      )}
                    </div>
                    <div className={styles.date}>
                      {event.fulfillment && event.fulfillment.date && (
                        <>
                          <p className={styles.day}>
                            {new Date(event.fulfillment.date).getDate()}
                          </p>
                          <p className={styles.month}>
                            {
                              initialMonthLabels[
                                new Date(event.fulfillment.date).getMonth()
                              ]
                            }
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <p className={styles.detail}>{event.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <span className={styles.closeBtn} onClick={onClose}>
            <FaTimes size={24} />
          </span>
        </div>
      </div>
      {!!activeEvent && (
        <RegisterFormDialog
          open={isRegFormOpen}
          onClose={() => setIsRegFormOpen(false)}
          event={activeEvent}
        />
      )}
    </>
  );
}
