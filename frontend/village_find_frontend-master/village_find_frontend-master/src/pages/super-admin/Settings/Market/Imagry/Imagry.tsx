import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';

import { Card } from '@/components/common';
import { ImageUpload } from '@/components/forms';

import { HttpService } from '@/services';

import { ImageType } from '@/interfaces';

import styles from './Imagry.module.scss';

interface IImagry {
  image: ImageType;
}

const initialImagry: IImagry = {
  image: '',
};

export function Imagry() {
  const [imagry, setImagry] = useState<IImagry>(initialImagry);
  const [basePath, setBasePath] = useState('');

  const onImageUpdate = (image: File) => {
    setImagry({ image });
  };

  const onUpdate = () => {
    const formData = new FormData();
    if (typeof imagry.image !== 'string') {
      formData.append('image', imagry.image);
    }

    HttpService.post('/settings/marketplace/imagry', formData).then(
      (response: any) => {
        if (response) {
          enqueueSnackbar('Updated successfully!', { variant: 'success' });
        }
      },
    );
  };

  useEffect(() => {
    HttpService.get('/settings/marketplace/imagry').then((response: any) => {
      const result = response || initialImagry;

      setImagry(result);
      setBasePath(result.image);
    });
  }, []);

  return (
    <Card title="Imagry" className={styles.root}>
      <h1>Product Discovery Page hero image</h1>
      <ImageUpload
        exWidth={1920}
        exHeight={220}
        baseImagePath={basePath}
        updateBaseImage={onImageUpdate}
      />
      <div className={styles.buttonBar}>
        <button className={styles.cancelButton}>Cancel</button>
        <button className={styles.addButton} onClick={onUpdate}>
          Add
        </button>
      </div>
    </Card>
  );
}
