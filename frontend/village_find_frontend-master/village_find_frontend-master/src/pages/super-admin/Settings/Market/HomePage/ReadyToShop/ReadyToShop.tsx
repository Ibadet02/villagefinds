import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

import { Card } from '@/components/common';
import { ImageUpload } from '@/components/forms';

import { HttpService } from '@/services';

import { ImageType } from '@/interfaces';

import styles from './ReadyToShop.module.scss';

export interface IReadyToShopData {
  images: ImageType[];
}

export const initialReadyToShopData = {
  images: ['', '', ''],
};
const initialImageCount = 3;

export function ReadyToShop() {
  const [readyToShopData, setReadyToShopData] = useState<IReadyToShopData>(
    initialReadyToShopData,
  );
  const [basePaths, setBasePaths] = useState<string[]>(
    Array(initialImageCount).fill(''),
  );

  const updateImage = (image: File, index: number) => {
    setReadyToShopData({
      ...readyToShopData,
      images: readyToShopData.images.map((_image: ImageType, _index: number) =>
        _index === index ? image : _image,
      ),
    });
  };

  const onUpdate = () => {
    const formData = new FormData();
    readyToShopData.images
      .filter(item => typeof item !== 'string')
      .forEach(image => {
        formData.append('images', image);
      });

    HttpService.post('/settings/marketplace/home', formData, {
      section: 'ready',
    }).then((response: any) => {
      if (response) {
        enqueueSnackbar('Updated successfully!', { variant: 'success' });
      }
    });
  };

  useEffect(() => {
    HttpService.get('/settings/marketplace/home', {
      section: 'ready',
    }).then((response: any) => {
      const result = response || initialReadyToShopData;
      const basePaths = [
        ...result.images,
        ...Array(initialImageCount).fill(''),
      ].slice(0, initialImageCount);

      setReadyToShopData({
        images: basePaths,
      });
      setBasePaths(basePaths);
    });
  }, []);

  return (
    <Card title="Ready To Shop Images" className={styles.root}>
      <div className={styles.wrapper}>
        <div className={styles.sliderSection}>
          {[...Array(initialImageCount)].map((_: any, index: number) => (
            <ImageUpload
              key={index}
              exWidth={455}
              exHeight={455}
              baseImagePath={basePaths[index]}
              updateBaseImage={(image: File) => updateImage(image, index)}
            />
          ))}
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
