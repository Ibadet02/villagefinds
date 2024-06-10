import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

import { Card } from '@/components/common';
import { ImageUpload } from '@/components/forms';

import { HttpService } from '@/services';

import { ImageType } from '@/interfaces';

import styles from './Vendor.module.scss';

export interface IVendorData {
  images: ImageType[];
}

export const initialVendorData = {
  images: ['', '', ''],
};

const initialImageCount = 3;

export function Vendor() {
  const [vendorData, setVendorData] = useState<IVendorData>(initialVendorData);
  const [basePaths, setBasePaths] = useState<string[]>(
    Array(initialImageCount).fill(''),
  );

  const updateImage = (image: File, index: number) => {
    setVendorData({
      ...vendorData,
      images: vendorData.images.map((_image: ImageType, _index: number) =>
        _index === index ? image : _image,
      ),
    });
  };

  const onUpdate = () => {
    const formData = new FormData();
    vendorData.images
      .filter(item => typeof item !== 'string')
      .forEach(image => {
        formData.append('images', image);
      });

    HttpService.post('/settings/marketplace/home', formData, {
      section: 'community',
    }).then((response: any) => {
      if (response) {
        enqueueSnackbar('Updated successfully!', { variant: 'success' });
      }
    });
  };

  useEffect(() => {
    HttpService.get('/settings/marketplace/home', {
      section: 'community',
    }).then((response: any) => {
      const result = response || initialVendorData;
      const basePaths = [
        ...result.images,
        ...Array(initialImageCount).fill(''),
      ].slice(0, initialImageCount);

      setVendorData({
        images: basePaths,
      });
      setBasePaths(basePaths);
    });
  }, []);

  return (
    <Card title="Vendor Community Images" className={styles.root}>
      <div className={styles.wrapper}>
        <div className={styles.sliderSection}>
          <h2>Slider Images</h2>
          {[...Array(initialImageCount)].map((_: any, index: number) => (
            <ImageUpload
              key={index}
              exWidth={375}
              exHeight={210}
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
