import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

import { Card } from '@/components/common';
import { ImageUpload, Input, TextField } from '@/components/forms';

import { ImageType } from '@/interfaces';

import { HttpService } from '@/services';

import styles from './Slider.module.scss';

export interface IHomeData {
  title: string;
  subtitle: string;
  images: ImageType[];
}

export const initialHomeData = {
  title: '',
  subtitle: '',
  images: ['', '', ''],
};

const sliderLength = 3;

export function Slider() {
  const [homeData, setHomeData] = useState<IHomeData>(initialHomeData);
  const [basePaths, setBasePaths] = useState<string[]>(
    Array(sliderLength).fill(''),
  );

  const updateImage = (image: ImageType, index: number) => {
    setHomeData({
      ...homeData,
      images: homeData.images.map((_image: ImageType, _index: number) =>
        _index === index ? image : _image,
      ),
    });
  };

  const onDataChange = (e: any) => {
    setHomeData({ ...homeData, [e.target.name]: e.target.value });
  };

  const onUpdate = () => {
    const formData = new FormData();
    formData.append('title', homeData.title);
    formData.append('subtitle', homeData.subtitle);
    homeData.images
      .filter((image: ImageType) => typeof image !== 'string')
      .forEach(image => {
        formData.append('images', image);
      });

    HttpService.post('/settings/marketplace/home', formData, {
      section: 'slider',
    }).then(response => {
      if (response) {
        enqueueSnackbar('Updated succsesfully!', { variant: 'success' });
      }
    });
  };

  useEffect(() => {
    HttpService.get('/settings/marketplace/home', { section: 'slider' }).then(
      (response: any) => {
        const result = response || initialHomeData;
        const basePaths = [
          ...result.images,
          ...Array(sliderLength).fill(''),
        ].slice(0, 3);

        setHomeData({
          ...result,
          images: basePaths,
        });
        setBasePaths(basePaths);
      },
    );
  }, []);

  return (
    <Card title="Home Page" className={styles.root}>
      <div className={styles.wrapper}>
        <div className={styles.textSection}>
          <div>
            <p>Title Text</p>
            <Input
              name="title"
              placeholder="Section Title"
              className={styles.input}
              value={homeData.title}
              updateValue={onDataChange}
            />
          </div>
          <div>
            <p>Title Subtext</p>
            <TextField
              name="subtitle"
              placeholder="Title Subtext"
              className={styles.input}
              value={homeData.subtitle}
              updateValue={onDataChange}
            />
          </div>
        </div>
        <div className={styles.sliderSection}>
          <h2>Slider Images</h2>
          {[...Array(sliderLength)].map((_: any, index: number) => (
            <ImageUpload
              key={index}
              exWidth={1920}
              exHeight={487}
              baseImagePath={basePaths[index]}
              updateBaseImage={(image: ImageType) => updateImage(image, index)}
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
