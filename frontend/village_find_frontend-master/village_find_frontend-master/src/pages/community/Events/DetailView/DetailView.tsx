import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import clsx from 'clsx';

import { Card } from '@/components/common';
import { Attendee, CreateForm, Detail, Registration } from '@/pages/community';

import { IEventDetail, IEditingEventDetail } from '@/pages/community';

import { HttpService } from '@/services';

import styles from './DetailView.module.scss';

interface IRegistration {
  link?: string;
  questions?: string[];
}

type IEvent = IEventDetail & IRegistration;

const initialEvent: IEvent = {
  name: '',
  address: '',
  fulfillment: {
    date: '',
    startTime: '',
    endTime: '',
  },
  detail: '',
  isActive: true,
};

const initialEditingEvent: IEditingEventDetail = {
  ...initialEvent,
  attendees: [],
};

export function DetailView() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<IEvent>(initialEvent);
  const [editingEvent, setEditingEvent] =
    useState<IEditingEventDetail>(initialEditingEvent);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('detail');

  const updateEvent = (eventJson: IEvent) => {
    HttpService.put('/communities/event', eventJson)
      .then(response => {
        const { status } = response;
        if (status === 200) {
          enqueueSnackbar('Event added successfully!', { variant: 'success' });
          navigate('/village-community/events');
        }
      })
      .catch(err => {
        enqueueSnackbar('Something went wrong with server.', {
          variant: 'error',
        });
      });
  };

  const onRegUpdate = (link: string) => {
    updateEvent({ ...event, link });
  };

  const onFormUpdate = (questions: string[]) => {
    updateEvent({ ...event, questions });
  };

  const onDetailUpdate = () => {
    setActiveTab('registration');
  };

  const onEditingUpdate = () => {
    const reqJson = {
      ...editingEvent,
      status: editingEvent.isActive ? 'Active' : 'Inactive',
    };
    HttpService.put(`/communities/event/${eventId}`, reqJson)
      .then(response => {
        const { status } = response;
        if (status === 200) {
          enqueueSnackbar('Event updated successfully!', {
            variant: 'success',
          });
          navigate('/village-community/events');
        } else {
          enqueueSnackbar('Event not found!', { variant: 'error' });
        }
      })
      .catch(err => {
        enqueueSnackbar('Something went wrong with server.', {
          variant: 'error',
        });
      });
  };

  useEffect(() => {
    if (!eventId || eventId === 'create') return;
    HttpService.get(`/communities/event/${eventId}`)
      .then(response => {
        const { status, event } = response;
        if (status === 200) {
          const resJson: IEditingEventDetail = {
            ...event,
            isActive: event.status === 'Active',
          };
          setEditingEvent(resJson);
        } else {
          enqueueSnackbar('Event not found!', { variant: 'error' });
        }
      })
      .catch(err => {
        enqueueSnackbar('Something went wrong with server.', {
          variant: 'error',
        });
      });
    HttpService.get(`/communities/meetup/attendee/${eventId}`)
      .then(response => {
        const { status, attendees } = response;
        if (status === 200) {
          setAttendees(attendees ?? []);
        } else {
          enqueueSnackbar('Event not found!', { variant: 'error' });
        }
      })
      .catch(err => {
        enqueueSnackbar('Something went wrong with server.', {
          variant: 'error',
        });
      });
  }, []);

  return (
    <div className={styles.root}>
      <Card className={styles.detail}>
        <div className={styles.header}>
          <p
            className={clsx(styles.detail, {
              [styles.active]: activeTab === 'detail',
            })}
            onClick={() => setActiveTab('detail')}
          >
            Event Details
          </p>
          {eventId === 'create' && (
            <p
              className={clsx(styles.registration, {
                [styles.active]: activeTab === 'registration',
              })}
              onClick={() => setActiveTab('registration')}
            >
              Registration
            </p>
          )}
        </div>
        {activeTab === 'detail' ? (
          <Detail
            event={eventId === 'create' ? event : editingEvent}
            updateEvent={eventId === 'create' ? setEvent : setEditingEvent}
            onNextUpdate={
              eventId === 'create' ? onDetailUpdate : onEditingUpdate
            }
          />
        ) : (
          <Registration
            link={event.link ?? ''}
            updateLink={(link: string) => setEvent({ ...event, link })}
            onFinalUpdate={onRegUpdate}
          />
        )}
      </Card>
      {eventId === 'create'
        ? activeTab === 'registration' && (
            <CreateForm
              questions={event.questions ?? []}
              updateQuestions={(questions: string[]) =>
                setEvent({ ...event, questions })
              }
              onFinalUpdate={onFormUpdate}
            />
          )
        : activeTab === 'detail' && <Attendee attendees={attendees} />}
    </div>
  );
}
