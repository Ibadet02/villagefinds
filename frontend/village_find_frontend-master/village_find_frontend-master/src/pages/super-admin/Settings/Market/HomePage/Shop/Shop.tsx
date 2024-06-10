import { useState, ChangeEvent, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

import { Card } from '@/components/common';
import { ImageUpload, Input, TextField } from '@/components/forms';

import { HttpService } from '@/services';

import { ImageType } from '@/interfaces';

import styles from './Shop.module.scss';

export interface IBodyText {
  header: string;
  content: string;
}

export interface IShopData {
  title: string;
  subtitle: string;
  images: ImageType[];
  bodyText: IBodyText[];
}

const initialTextCount = 5;
export const initialShopData = {
  title: '',
  subtitle: '',
  images: ['', ''],
  bodyText: Array(initialTextCount).fill({ header: '', content: '' }),
};

const initialImageCount = 2;
const initialImageTitles = [
  'How it works hero image',
  'How it works side image',
];

export function Shop() {
  const [shopData, setShopData] = useState<IShopData>(initialShopData);
  const [basePaths, setBasePaths] = useState<string[]>(
    Array(initialImageCount).fill(''),
  );

  const updateImage = (image: File, index: number) => {
    setShopData({
      ...shopData,
      images: shopData.images.map((_image: ImageType, _index: number) =>
        _index === index ? image : _image,
      ),
    });
  };

  const updateTitle = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
  ) => {
    setShopData({
      ...shopData,
      [field]: e.target.value,
    });
  };

  const updateBodyText = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: string,
  ) => {
    setShopData({
      ...shopData,
      bodyText: shopData.bodyText.map((text: IBodyText, _index: number) =>
        index === _index ? { ...text, [field]: e.target.value } : text,
      ),
    });
  };

  const onUpdate = () => {
    const formData = new FormData();
    formData.append('title', shopData.title);
    formData.append('subtitle', shopData.subtitle);
    formData.append('bodyText', JSON.stringify(shopData.bodyText));
    shopData.images
      .filter(item => typeof item !== 'string')
      .forEach(image => {
        formData.append('images', image);
      });

    HttpService.post('/settings/marketplace/home', formData, {
      section: 'shop',
    }).then((response: any) => {
      if (response) {
        enqueueSnackbar('Updated successfully!', { variant: 'success' });
      }
    });
  };

  useEffect(() => {
    HttpService.get('/settings/marketplace/home', { section: 'shop' }).then(
      (response: any) => {
        const result = response || initialShopData;
        const basePaths = [
          ...result.images,
          ...Array(initialImageCount).fill(''),
        ].slice(0, initialImageCount);

        setShopData({
          ...result,
          images: basePaths,
        });
        setBasePaths(basePaths);
      },
    );
  }, []);

  return (
    <Card title="Shop Intentionally" className={styles.root}>
      <div className={styles.wrapper}>
        <div className={styles.text}>
          <div>
            <p>Title</p>
            <Input
              placeholder="Title"
              className={styles.input}
              value={shopData.title}
              updateValue={(e: ChangeEvent<HTMLInputElement>) =>
                updateTitle(e, 'title')
              }
            />
          </div>
          <div>
            <p>Subtext</p>
            <TextField
              placeholder="Subtext"
              className={styles.input}
              value={shopData.subtitle}
              updateValue={(e: ChangeEvent<HTMLTextAreaElement>) =>
                updateTitle(e, 'subtitle')
              }
            />
          </div>
        </div>
        <div className={styles.images}>
          {initialImageTitles.map((title: string, index: number) => (
            <div key={index}>
              <h2>{title}</h2>
              <ImageUpload
                exWidth={1920}
                exHeight={333}
                baseImagePath={basePaths[index]}
                updateBaseImage={(image: File) => updateImage(image, index)}
              />
            </div>
          ))}
        </div>
        <div className={styles.body}>
          <p>Body</p>
          <div>
            {shopData.bodyText.map((text: IBodyText, index: number) => (
              <div
                key={`body-text-item-${index}`}
                className={styles.bodyTextItem}
              >
                <Input
                  value={text.header}
                  className={styles.input}
                  updateValue={(e: ChangeEvent<HTMLInputElement>) =>
                    updateBodyText(e, index, 'header')
                  }
                />
                <TextField
                  rows={5}
                  value={text.content}
                  className={styles.input}
                  updateValue={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    updateBodyText(e, index, 'content')
                  }
                />
              </div>
            ))}
          </div>
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
