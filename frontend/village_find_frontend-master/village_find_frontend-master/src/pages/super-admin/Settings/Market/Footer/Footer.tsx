import { useEffect, useState, ChangeEvent } from 'react';
import { enqueueSnackbar } from 'notistack';

import { Card } from '@/components/common';
import { Input } from '@/components/forms';

import { HttpService } from '@/services';

import styles from './Footer.module.scss';

export interface ISocialLink {
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
}

export interface IContact {
  phone: string;
  email: string;
}

const initialSocialLink = {
  facebook: '',
  instagram: '',
  youtube: '',
  linkedin: '',
};

const initialContact = {
  phone: '',
  email: '',
};

const initialFooterInfo = {
  ...initialSocialLink,
  ...initialContact,
};

export function Footer() {
  const [socialLink, setSocialLink] = useState<ISocialLink>(initialSocialLink);
  const [contact, setContact] = useState<IContact>(initialContact);

  const onSocialLinkChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
  ) => {
    setSocialLink({
      ...socialLink,
      [field]: e.target.value,
    });
  };

  const onContactChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
  ) => {
    setContact({
      ...contact,
      [field]: e.target.value,
    });
  };

  const onLinkUpdate = () => {
    HttpService.post('/settings/marketplace/footer', socialLink).then(
      response => {
        if (response) {
          enqueueSnackbar('Footer Link updated successfully!', {
            variant: 'success',
          });
        }
      },
    );
  };

  const onContactUpdate = () => {
    HttpService.post('/settings/marketplace/footer', contact).then(response => {
      if (response) {
        enqueueSnackbar('Footer Contact updated successfully!', {
          variant: 'success',
        });
      }
    });
  };

  useEffect(() => {
    HttpService.get('/settings/marketplace/footer').then(response => {
      const result = response || initialFooterInfo;

      setSocialLink(result);
      setContact(result);
    });
  }, []);

  return (
    <div className={styles.root}>
      <Card title="Footer" className={styles.section}>
        <div className={styles.wrapper}>
          <h2>Social Media</h2>
          <div className={styles.control}>
            <p>Facebook Link</p>
            <Input
              value={socialLink.facebook}
              placeholder="Link"
              updateValue={(e: ChangeEvent<HTMLInputElement>) =>
                onSocialLinkChange(e, 'facebook')
              }
              className={styles.input}
            />
          </div>
          <div className={styles.control}>
            <p>Instagram Link</p>
            <Input
              value={socialLink.instagram}
              placeholder="Link"
              updateValue={(e: ChangeEvent<HTMLInputElement>) =>
                onSocialLinkChange(e, 'instagram')
              }
              className={styles.input}
            />
          </div>
          <div className={styles.control}>
            <p>Youtube Link</p>
            <Input
              value={socialLink.youtube}
              placeholder="Link"
              updateValue={(e: ChangeEvent<HTMLInputElement>) =>
                onSocialLinkChange(e, 'youtube')
              }
              className={styles.input}
            />
          </div>
          <div className={styles.control}>
            <p>LinkedIn Link</p>
            <Input
              value={socialLink.linkedin}
              placeholder="Link"
              updateValue={(e: ChangeEvent<HTMLInputElement>) =>
                onSocialLinkChange(e, 'linkedin')
              }
              className={styles.input}
            />
          </div>
        </div>
        <div className={styles.buttonBar}>
          <button className={styles.cancelButton}>Cancel</button>
          <button className={styles.addButton} onClick={onLinkUpdate}>
            Add
          </button>
        </div>
      </Card>
      <Card title="Contact Information" className={styles.section}>
        <div className={styles.wrapper}>
          <div className={styles.control}>
            <p>Phone Number</p>
            <Input
              value={contact.phone}
              placeholder="Phone Number"
              updateValue={(e: ChangeEvent<HTMLInputElement>) =>
                onContactChange(e, 'phone')
              }
              className={styles.input}
            />
          </div>
          <div className={styles.control}>
            <p>Email</p>
            <Input
              value={contact.email}
              placeholder="Email Link"
              updateValue={(e: ChangeEvent<HTMLInputElement>) =>
                onContactChange(e, 'email')
              }
              className={styles.input}
            />
          </div>
        </div>
        <div className={styles.buttonBar}>
          <button className={styles.cancelButton}>Cancel</button>
          <button className={styles.addButton} onClick={onContactUpdate}>
            Add
          </button>
        </div>
      </Card>
    </div>
  );
}
