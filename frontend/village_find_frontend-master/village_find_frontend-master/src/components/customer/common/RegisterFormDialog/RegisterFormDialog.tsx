import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { FaTimes } from 'react-icons/fa';

import { Input } from '@/components/forms';

import { HttpService } from '@/services';

import styles from './RegisterFormDialog.module.scss';

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

const initialFormControls = [
  {
    title: 'Name',
    name: 'name',
  },
  {
    title: 'Height',
    name: 'height',
  },
  {
    title: 'Weight',
    name: 'weight',
  },
  {
    title: 'Attending',
    name: 'attending',
  },
];

interface IRegisterFormDialogProps {
  open: boolean;
  onClose: () => void;
  event: {
    _id: string;
    fulfillment?: {
      date: string;
    };
  };
}

export function RegisterFormDialog({
  open,
  onClose,
  event,
}: IRegisterFormDialogProps) {
  const navigate = useNavigate();

  const [form, setForm] = useState<{ [key: string]: string } | null>(null);

  const onFormChange = (e: any) => {
    if (!form) {
      setForm({ [e.target.name]: e.target.value });
      return;
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmitClick = () => {
    HttpService.post('/communities/meetup', form, {
      eventId: event._id,
    })
      .then(response => {
        const { status, attendee } = response;
        console.log(attendee);
        if (status === 200) {
          enqueueSnackbar('Form registered successfully!', {
            variant: 'success',
          });
          onClose();
        } else if (status === 400) {
          enqueueSnackbar('Form already registered!', {
            variant: 'warning',
          });
        } else {
          enqueueSnackbar('Something went wrong with server.', {
            variant: 'error',
          });
        }
      })
      .catch(err => {
        enqueueSnackbar('Something went wrong with server', {
          variant: 'error',
        });
      });
  };

  useEffect(() => {
    if (!open) {
      setForm(null);
    }
  }, [open]);

  if (!open) return;
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Vendor Meetups</h1>
          <p>
            This meet up is a great way to connect with more endors around the
            community you may not know or want to know but you have to know.
          </p>
          {event.fulfillment && (
            <div className={styles.date}>
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
            </div>
          )}
        </div>
        <div className={styles.body}>
          <p className={styles.title}>Registration Form</p>
          <div className={styles.content}>
            <div className={styles.controls}>
              {initialFormControls.map((control: any, index: number) => (
                <div className={styles.control} key={index}>
                  <p className={styles.label}>{control.title}</p>
                  <Input
                    name={control.name}
                    placeholder={control.title}
                    value={form && form[control.name]}
                    updateValue={onFormChange}
                  />
                </div>
              ))}
            </div>
            <div className={styles.buttons}>
              <button className={styles.submitButton} onClick={onSubmitClick}>
                Submit
              </button>
              <button className={styles.cancelButton} onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
        <span className={styles.closeBtn} onClick={onClose}>
          <FaTimes size={24} />
        </span>
      </div>
    </div>
  );
}
