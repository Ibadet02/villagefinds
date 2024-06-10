import { useEffect, useState } from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaPinterestP,
} from 'react-icons/fa6';
import { enqueueSnackbar } from 'notistack';

import { Card } from '@/components/common';
import { Input } from '@/components/forms';

import styles from './SocialMedia.module.scss';
import { HttpService } from '@/services';

export interface ISocialMediaUrls {
  facebook: string;
  twitter: string;
  instagram: string;
  pinterest: string;
  youtube: string;
  linkedin: string;
}

const initialSocialUrls: ISocialMediaUrls = {
  facebook: '',
  twitter: '',
  instagram: '',
  pinterest: '',
  youtube: '',
  linkedin: '',
};

export function SocialMedia() {
  const [socialUrls, setSocialUrls] = useState(initialSocialUrls);

  const onSocialUrlsChange = (e: any) => {
    setSocialUrls({
      ...socialUrls,
      [e.target.name]: e.target.value,
    });
  };

  const onUpdateClick = () => {
    HttpService.put('/user/vendor/profile/social-urls', socialUrls)
      .then(response => {
        const { status } = response;
        if (status === 200) {
          enqueueSnackbar('Social url updated successfully!', {
            variant: 'success',
          });
        } else {
          enqueueSnackbar('Something went wrong with server.', {
            variant: 'error',
          });
        }
      })
      .catch(err => {
        enqueueSnackbar('Something went wrong with server.', {
          variant: 'error',
        });
      });
  };

  useEffect(() => {
    HttpService.get('/user/vendor/profile/social-urls').then(response => {
      setSocialUrls(response ?? initialSocialUrls);
    });
  }, []);

  return (
    <Card title="Social Media" className={styles.root}>
      <div className={styles.container}>
        <p>Will be added to your story page</p>
        <div className={styles.form}>
          <div className={styles.control}>
            <span>
              <FaFacebookF fill="white" className={styles.icon} />
            </span>
            <Input
              name="facebook"
              rounded="full"
              border="none"
              bgcolor="secondary"
              placeholder="URL"
              className={styles.urlInput}
              value={socialUrls.facebook}
              updateValue={onSocialUrlsChange}
            />
          </div>
          <div className={styles.control}>
            <span>
              <FaTwitter fill="white" className={styles.icon} />
            </span>
            <Input
              name="twitter"
              rounded="full"
              border="none"
              bgcolor="secondary"
              placeholder="URL"
              className={styles.urlInput}
              value={socialUrls.twitter}
              updateValue={onSocialUrlsChange}
            />
          </div>
          <div className={styles.control}>
            <span>
              <FaInstagram fill="white" className={styles.icon} />
            </span>
            <Input
              name="instagram"
              rounded="full"
              border="none"
              bgcolor="secondary"
              placeholder="URL"
              className={styles.urlInput}
              value={socialUrls.instagram}
              updateValue={onSocialUrlsChange}
            />
          </div>
          <div className={styles.control}>
            <span>
              <FaPinterestP fill="white" className={styles.icon} />
            </span>
            <Input
              name="pinterest"
              rounded="full"
              border="none"
              bgcolor="secondary"
              placeholder="URL"
              className={styles.urlInput}
              value={socialUrls.pinterest}
              updateValue={onSocialUrlsChange}
            />
          </div>
          <div className={styles.control}>
            <span>
              <FaYoutube fill="white" className={styles.icon} />
            </span>
            <Input
              name="youtube"
              rounded="full"
              border="none"
              bgcolor="secondary"
              placeholder="URL"
              className={styles.urlInput}
              value={socialUrls.youtube}
              updateValue={onSocialUrlsChange}
            />
          </div>
          <div className={styles.control}>
            <span>
              <FaLinkedinIn fill="white" className={styles.icon} />
            </span>
            <Input
              name="linkedin"
              rounded="full"
              border="none"
              bgcolor="secondary"
              placeholder="URL"
              className={styles.urlInput}
              value={socialUrls.linkedin}
              updateValue={onSocialUrlsChange}
            />
          </div>
        </div>
        <div className={styles.buttonBar}>
          <button onClick={onUpdateClick}>Update</button>
        </div>
      </div>
    </Card>
  );
}
