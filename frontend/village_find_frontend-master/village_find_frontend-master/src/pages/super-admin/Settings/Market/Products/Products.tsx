import { useState, ChangeEvent } from 'react';
import { enqueueSnackbar } from 'notistack';

import { Card } from '@/components/common';
import { ImageUpload, Input, TagInput, TextField } from '@/components/forms';

import { HttpService } from '@/services';

import { ImageType } from '@/interfaces';

import styles from './Products.module.scss';

export interface IProduct {
  title: string;
  name: string;
  price: number;
  tags: string[];
  image: ImageType;
  description: string;
  link: string;
}

const initialProduct = {
  title: '',
  name: '',
  price: 0,
  tags: [],
  image: '',
  description: '',
  link: '',
};

export function Products() {
  const [product, setProduct] = useState<IProduct>(initialProduct);

  const updateProduct = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
  ) => {
    const value = e.target.value;
    setProduct({
      ...product,
      [field]: field === 'price' ? Number(value) : e.target.value,
    });
  };

  const onUpdateImage = (image: File) => {
    setProduct({
      ...product,
      image,
    });
  };

  const onUpdate = () => {
    const formData = new FormData();
    formData.append('title', product.title);
    formData.append('name', product.name);
    formData.append('price', JSON.stringify(product.price));
    formData.append('tags', JSON.stringify(product.tags));
    formData.append('description', product.description);
    formData.append('link', product.link);
    if (product.image) formData.append('image', product.image);

    HttpService.post('/settings/marketplace/featured-products', formData).then(
      response => {
        if (response) {
          enqueueSnackbar('Featured product added successfully!', {
            variant: 'success',
          });
          setProduct(initialProduct);
        }
      },
    );
  };

  return (
    <Card title="Featured Prdoucts" className={styles.root}>
      <div className={styles.cardContent}>
        <div className={styles.section}>
          <p>Product Title</p>
          <Input
            value={product.title}
            placeholder="Product Title"
            updateValue={(e: ChangeEvent<HTMLInputElement>) =>
              updateProduct(e, 'title')
            }
            className={styles.input}
          />
        </div>
        <div className={styles.section}>
          <p>Product Name</p>
          <Input
            value={product.name}
            placeholder="Product Name"
            updateValue={(e: ChangeEvent<HTMLInputElement>) =>
              updateProduct(e, 'name')
            }
            className={styles.input}
          />
        </div>
        <div className={styles.section}>
          <p>Product Price</p>
          <Input
            type="number"
            value={product.price}
            placeholder="Product Price"
            updateValue={(e: ChangeEvent<HTMLInputElement>) =>
              updateProduct(e, 'price')
            }
            className={styles.input}
            adornment={{
              position: 'left',
              content: '$',
            }}
          />
        </div>
        <div className={styles.section}>
          <p>Product Tags</p>
          <TagInput
            rounded="small"
            tags={product.tags}
            updateTags={(tags: string[]) => setProduct({ ...product, tags })}
          />
        </div>
        <div className={styles.section}>
          <p className={styles.emphasize}>Image</p>
          <ImageUpload
            exWidth={430}
            exHeight={345}
            updateBaseImage={onUpdateImage}
          />
        </div>
        <div className={styles.section}>
          <p>Description</p>
          <TextField
            value={product.description}
            placeholder="Description"
            updateValue={(e: ChangeEvent<HTMLTextAreaElement>) =>
              updateProduct(e, 'description')
            }
            className={styles.input}
          />
        </div>
        <div className={styles.section}>
          <p>Product Link</p>
          <Input
            value={product.link}
            placeholder="Product Link"
            updateValue={(e: ChangeEvent<HTMLInputElement>) =>
              updateProduct(e, 'link')
            }
            className={styles.input}
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
