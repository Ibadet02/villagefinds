import { useContext, useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';

import { ImageUpload, Input, TextField } from '@/components/forms';
import { Card } from '@/components/common';

import { AuthContext } from '@/providers';

import { ImageType } from '@/interfaces';

import { HttpService } from '@/services';

import styles from './Profile.module.scss';

interface ICommunityProfile {
  code: string;
  slug: string;
  logoFile: ImageType;
  imageFile: ImageType;
  shortDesc: string;
  longDesc: string;
}

export function Profile() {
  const { account, setAccount } = useContext(AuthContext);
  const [profile, setProfile] = useState<ICommunityProfile | null>(null);

  const onProfileChange = (e: any) => {
    if (!profile) return;
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const onLogoChange = (file: ImageType) => {
    if (!profile) return;
    setProfile({ ...profile, logoFile: file });
  };

  const onImageChange = (file: ImageType) => {
    if (!profile) return;
    setProfile({ ...profile, imageFile: file });
  };

  const onSubmit = () => {
    if (!profile) return;
    const formData = new FormData();
    formData.append('code', profile.code);
    formData.append('slug', profile.slug);
    formData.append('shortDesc', profile.shortDesc);
    formData.append('longDesc', profile.longDesc);
    formData.append('images', profile.logoFile);
    formData.append('images', profile.imageFile);
    HttpService.put('/communities/profile', formData).then(response => {
      const { status, community } = response;
      if (status === 200) {
        console.log(community);
        enqueueSnackbar('Profile update successfully!', { variant: 'success' });
      }
    });
  };

  useEffect(() => {
    if (account && account.profile) {
      setProfile(account.profile);
    }
  }, [account]);

  return (
    <div className={styles.root}>
      <h1>Profile</h1>
      <Card className={styles.form}>
        <div className={styles.control}>
          <p className={styles.label}>Community Code*</p>
          <Input
            name="code"
            rounded="full"
            border="none"
            bgcolor="secondary"
            placeholder="Code"
            className={styles.input}
            value={(profile && profile.code) ?? ''}
            updateValue={onProfileChange}
          />
        </div>
        <div className={styles.control}>
          <p className={styles.label}>Slug*</p>
          <Input
            name="slug"
            rounded="full"
            border="none"
            bgcolor="secondary"
            placeholder="Slug"
            className={styles.input}
            value={(profile && profile.slug) ?? ''}
            updateValue={onProfileChange}
          />
        </div>
        <div className={styles.control}>
          <ImageUpload
            exWidth={500}
            exHeight={500}
            labelEnhancer={(width: number, height: number) =>
              `Your Logo (${width}x${height})*`
            }
            baseImagePath={
              (account &&
                account.profile &&
                account.profile.images &&
                account.profile.images.logoUrl) ??
              ''
            }
            updateBaseImage={onLogoChange}
            className={styles.upload}
          />
        </div>
        <div className={styles.control}>
          <ImageUpload
            exWidth={2400}
            exHeight={1000}
            labelEnhancer={(width: number, height: number) =>
              `Your Image (${width}x${height})*`
            }
            baseImagePath={
              (account &&
                account.profile &&
                account.profile.images &&
                account.profile.images.backgroundUrl) ??
              ''
            }
            updateBaseImage={onImageChange}
            className={styles.upload}
          />
        </div>
        <div className={styles.control}>
          <p className={styles.label}>About Short*</p>
          <TextField
            rows={5}
            name="shortDesc"
            rounded="full"
            border="none"
            bgcolor="secondary"
            className={styles.textarea}
            value={(profile && profile.shortDesc) ?? ''}
            updateValue={onProfileChange}
          />
        </div>
        <div className={styles.control}>
          <p className={styles.label}>About Long*</p>
          <TextField
            rows={5}
            name="longDesc"
            rounded="full"
            border="none"
            bgcolor="secondary"
            className={styles.textarea}
            value={(profile && profile.longDesc) ?? ''}
            updateValue={onProfileChange}
          />
        </div>
        <button onClick={onSubmit}>Submit</button>
      </Card>
    </div>
  );
}
