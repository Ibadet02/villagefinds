import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';

import { Card } from '@/components/common';
import {
  Button,
  ImageUpload,
  Input,
  TagInput,
  TextField,
} from '@/components/forms';

import { HttpService } from '@/services';

import styles from './Store.module.scss';

interface IStoreInfo {
  orderCapacity: string;
  tags: string[];
  shortDesc: string;
  longDesc: string;
  radius: number;
}

const initialStoreInfo: IStoreInfo = {
  orderCapacity: '',
  tags: [],
  shortDesc: '',
  longDesc: '',
  radius: 0,
};

type IFile = File | null;

export function Store() {
  const [storeInfo, setStoreInfo] = useState<IStoreInfo>(initialStoreInfo);
  const [images, setImages] = useState<IFile[]>(Array(4).fill(null));
  const [imageSrcs, setImageSrcs] = useState<string[]>(Array(4).fill(''));

  const onStoreChange = (e: any) => {
    setStoreInfo({
      ...storeInfo,
      [e.target.name]: e.target.value,
    });
  };

  const onTagsChange = (tags: string[]) => {
    setStoreInfo({ ...storeInfo, tags });
  };

  const onImageChange = (index: number) => (image: File) => {
    setImages(
      images.map((_image: IFile, _index: number) =>
        index === _index ? image : _image,
      ),
    );
  };

  const onStoreUpdateClick = () => {
    HttpService.put('/user/vendor/profile/store', storeInfo).then(response => {
      const { status } = response;
      if (status === 200) {
        enqueueSnackbar('Store updated.', { variant: 'success' });
      }
    });
  };

  const onImageUpdateClick = () => {
    const imageLabels = ['logo', 'finder', 'hero'];
    const liveImages: File[] = [],
      liveLabels: string[] = [];

    images.forEach((image: IFile, index: number) => {
      if (image) {
        liveImages.push(image);
        liveLabels.push(imageLabels[index]);
      }
    });

    const formData = new FormData();
    liveImages.forEach((image: File) => {
      formData.append('images', image);
    });
    formData.append('labels', JSON.stringify(liveLabels));
    HttpService.put('/user/vendor/profile/images', formData).then(response => {
      const { status } = response;
      if (status === 200) {
        enqueueSnackbar('Images updated.', { variant: 'success' });
      }
    });
  };

  useEffect(() => {
    HttpService.get('/user/vendor/profile/store').then(response => {
      setStoreInfo(response || initialStoreInfo);
    });
    HttpService.get('/user/vendor/profile/images').then(response => {
      const { logoUrl, finderUrl, slideUrls } = response;
      setImageSrcs([logoUrl, finderUrl, ...slideUrls]);
    });
  }, []);

  return (
    <Card className={styles.root}>
      <div className={styles.container}>
        <div className={styles.store}>
          <h2>Store Information</h2>
          <div className={styles.form}>
            <div className={styles.horizon}>
              <div className={styles.control}>
                <p>Maximum Order Fulfillment Capacity</p>
                <Input
                  name="orderCapacity"
                  rounded="full"
                  border="none"
                  bgcolor="secondary"
                  placeholder="Maximum Order Fulfillment Capacity"
                  value={storeInfo.orderCapacity}
                  updateValue={onStoreChange}
                />
              </div>
              <div className={styles.control}>
                <p>Store Tags</p>
                <TagInput tags={storeInfo.tags} updateTags={onTagsChange} />
              </div>
            </div>
            <div className={styles.control}>
              <p>
                Shop Short Description <span>48 Characters</span>
                {storeInfo.longDesc}
              </p>
              <TextField
                name="shortDesc"
                rows={2}
                rounded="full"
                border="none"
                bgcolor="secondary"
                className={styles.desc}
                placeholder="Shop Short Description"
                value={storeInfo.shortDesc}
                updateValue={onStoreChange}
              />
            </div>
            <div className={styles.control}>
              <p>Shop Long Description</p>
              <TextField
                name="longDesc"
                rows={3}
                rounded="full"
                border="none"
                bgcolor="secondary"
                className={styles.desc}
                placeholder="Shop Long Description"
                value={storeInfo.longDesc}
                updateValue={onStoreChange}
              />
            </div>
            <div className={styles.horizon}>
              <div className={styles.control}>
                <p className={styles.visible}>
                  Visible Radius In Miles <span>(for items sold near by)</span>
                </p>
                <Input
                  type="number"
                  name="radius"
                  rounded="full"
                  border="none"
                  bgcolor="secondary"
                  placeholder="Miles"
                  value={storeInfo.radius}
                  updateValue={onStoreChange}
                />
              </div>
            </div>
          </div>
          <Button className={styles.updateBtn} onClick={onStoreUpdateClick}>
            Update
          </Button>
        </div>
        <div className={styles.images}>
          <h2>Images</h2>
          <div className={styles.form}>
            <div className={styles.horizon}>
              <div className={styles.control}>
                <p>Logo</p>
                <ImageUpload
                  exWidth={0}
                  exHeight={0}
                  rounded={true}
                  baseImagePath={imageSrcs[0]}
                  updateBaseImage={onImageChange(0)}
                />
              </div>
              <div className={styles.control}>
                <p>Store Finder</p>
                <ImageUpload
                  exWidth={350}
                  exHeight={175}
                  rounded={true}
                  baseImagePath={imageSrcs[1]}
                  updateBaseImage={onImageChange(1)}
                  labelEnhancer={(_width: number, _height: number) =>
                    `Best Resolution width by height ${_width} x ${_height}`
                  }
                />
              </div>
            </div>
            <div>
              <p className={styles.form}>Hero Image Slider</p>
              <div className={styles.horizon}>
                <div className={styles.control}>
                  <ImageUpload
                    exWidth={1920}
                    exHeight={390}
                    rounded={true}
                    baseImagePath={imageSrcs[2]}
                    updateBaseImage={onImageChange(2)}
                    labelEnhancer={(_width: number, _height: number) =>
                      `Best Resolution width by height ${_width} x ${_height}`
                    }
                  />
                </div>
                <div className={styles.control}>
                  <ImageUpload
                    exWidth={1920}
                    exHeight={390}
                    rounded={true}
                    baseImagePath={imageSrcs[3]}
                    updateBaseImage={onImageChange(3)}
                    labelEnhancer={(_width: number, _height: number) =>
                      `Best Resolution width by height ${_width} x ${_height}`
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <Button className={styles.updateBtn} onClick={onImageUpdateClick}>
            Update
          </Button>
        </div>
      </div>
    </Card>
  );
}
