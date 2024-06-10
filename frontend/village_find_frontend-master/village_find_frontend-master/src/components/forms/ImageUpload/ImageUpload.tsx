import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { Input } from '@/components/forms';
import { CancelIcon } from '@/components/icons';

import { SERVER_URL } from '@/config/global';

import styles from './ImageUpload.module.scss';

export interface IImageUploadProps {
  exWidth: number;
  exHeight: number;
  className?: string;
  rounded?: boolean;
  baseImagePath?: string;
  updateBaseImage?: (src: File) => void;
  labelEnhancer?: (_width: number, _height: number) => string;
}

export function ImageUpload({
  exWidth,
  exHeight,
  className = '',
  rounded = false,
  baseImagePath = '',
  updateBaseImage = () => { },
  labelEnhancer = () =>
    `Image pixel size:${exWidth} width X ${exHeight} height`,
}: IImageUploadProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [imagePath, setImagePath] = useState<string>('');
  const imgInputRef = useRef<HTMLInputElement>(null);

  const classes = clsx(styles.root, rounded ? styles.rounded : '', className);

  const uploadImage = (file: File) => {
    const reader = new FileReader();
    reader.addEventListener('load', function (e: ProgressEvent<FileReader>) {
      if (!e.target || !e.target?.result) return;
      const result = e.target?.result as string;
      setImageSrc(result);
    });
    reader.readAsDataURL(file);
  };

  const onUploadChange = (e: any) => {
    if (!e.target.files.length) return;

    uploadImage(e.target.files[0]);
    updateBaseImage(e.target.files[0]);
  };

  const onUploadCancel = () => {
    setImageSrc('');
    if (imgInputRef.current) {
      console.log('Upload Cancel');
      imgInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (typeof baseImagePath === 'string') {
      setImagePath(baseImagePath);
    }
  }, [baseImagePath]);

  return (
    <div className={classes}>
      {exWidth !== 0 && exHeight !== 0 && (
        <p>{labelEnhancer(exWidth, exHeight)}</p>
      )}
      <div className={styles.body}>
        <div className={styles.imgSelector}>
          <Input type="file" updateValue={onUploadChange} ref={imgInputRef} />
          {imageSrc !== '' && <CancelIcon onClick={onUploadCancel} />}
        </div>
        {imageSrc !== '' ? (
          <img
            alt="The image to be uploaded"
            src={imageSrc}
            className={styles.imgViewer}
          />
        ) : imagePath !== '' ? (
          <img
            alt="The base uploaded image"
            src={`${SERVER_URL}/${imagePath}`}
            className={styles.imgViewer}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
