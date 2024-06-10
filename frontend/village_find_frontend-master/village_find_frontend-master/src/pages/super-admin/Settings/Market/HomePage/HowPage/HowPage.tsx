import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

import { Card } from '@/components/common';
import { ImageUpload, Input } from '@/components/forms';

import { HttpService } from '@/services';

import { ImageType } from '@/interfaces';

import styles from './HowPage.module.scss';

export interface IHowData {
  title: string;
  image: ImageType;
}

export const initialHowData = {
  title: 'Gluten Free, Heavy Weight',
  image: '',
};

export function HowPage() {
  const [howData, setHowData] = useState<IHowData>(initialHowData);
  const [basePath, setBasePath] = useState('');

  const onDataChange = (e: any) => {
    setHowData({
      ...howData,
      [e.target.name]: e.target.value,
    });
  };

  const onImageChange = (image: File) => {
    setHowData({ ...howData, image });
  };

  const onUpdate = () => {
    const formData = new FormData();
    formData.append('title', howData.title);
    if (typeof howData.image !== 'string')
      formData.append('images', howData.image);

    HttpService.post('/settings/marketplace/home', formData, {
      section: 'how',
    }).then((response: any) => {
      if (response) {
        enqueueSnackbar('Updated successfully!', { variant: 'success' });
      }
    });
  };

  useEffect(() => {
    HttpService.get('/settings/marketplace/home', { section: 'how' }).then(
      (response: any) => {
        const result = response || initialHowData;

        setHowData({
          ...result,
          image: result.images[0],
        });
        setBasePath(result.images[0]);
      },
    );
  }, []);

  return (
    <Card title="How It Works" className={styles.root}>
      <div className={styles.wrapper}>
        <div className={styles.titleSection}>
          <p>How it works title text</p>
          <Input
            name="title"
            placeholder="Title"
            className={styles.input}
            value={howData.title}
            updateValue={onDataChange}
          />
        </div>
        <div className={styles.imageSection}>
          <h2>How it works image</h2>
          <ImageUpload
            exWidth={1920}
            exHeight={333}
            baseImagePath={basePath}
            updateBaseImage={onImageChange}
          />
        </div>
      </div>
      <div className={styles.buttonBar}>
        <button className={styles.cancelButton}>Cancel</button>
        <button className={styles.addButton} onClick={onUpdate}>
          Add
        </button>
      </div>
    </Card>
  );
}
