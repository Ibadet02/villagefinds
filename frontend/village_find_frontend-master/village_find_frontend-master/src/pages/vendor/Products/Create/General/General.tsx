import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import clsx from 'clsx';

import {
  Radio,
  RadioGroup,
  Input,
  Select,
  TextField,
} from '@/components/forms';
import { AIDialog } from '@/components/super-admin/common';
import { MagicIcon } from '@/components/icons';
import { CategoryContext } from '@/providers';
import { ProductContext } from '../Provider';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { IGeneral, updateGeneral } from '@/redux/reducers';
import { HttpService } from '@/services';
import { ChangeInputEvent } from '@/interfaces';

import styles from './General.module.scss';

type PayType = 'Shipping' | 'Near By' | 'Local Subscriptions';
type TopicType =
  | 'product name'
  | 'short product description'
  | 'long product description'
  | 'disclaimer';

const initialInfo: IGeneral = {
  name: '',
  deliveryTypes: [],
  category: '',
  shortDesc: '',
  longDesc: '',
  disclaimer: '',
  soldByUnit: '',
  price: 0,
  quantity: 0,
  tax: 0,
};

const CREATE_PATH = '/vendor/products/create';
const NEXT_PATH = `${CREATE_PATH}/style`;

export function General() {
  const dispatch = useAppDispatch();
  const { productId } = useParams();
  const navigate = useNavigate();
  const storeGeneral = useAppSelector(state => state.product.general);
  const metrics = useAppSelector(state => state.metric.metrics);

  const { categories } = useContext(CategoryContext);
  const { nutrition, setNutrition, image, setImage } = useContext(ProductContext);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [generalInfo, setGeneralInfo] =
    useState<IGeneral>(initialInfo);
  const [dialogTopic, setDialogTopic] = useState<TopicType>('product name');

  const onAnswerSelect = (answer: string) => {
    setGeneralInfo({
      ...generalInfo,
      [dialogTopic === 'product name'
        ? 'name'
        : dialogTopic === 'long product description'
          ? 'longDesc'
          : dialogTopic === 'short product description'
            ? 'shortDesc'
            : 'disclaimer']: answer,
    });
    setProductDialogOpen(false);
  };

  const onDialogOpenClick = (topic: TopicType) => () => {
    if (!generalInfo.category) {
      return enqueueSnackbar('Choose on the product categories.', {
        variant: 'warning',
      });
    }
    setDialogTopic(topic);
    setProductDialogOpen(true);
  };

  const onNutritionChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setNutrition(e.target.files[0] as File);
  };

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setImage(e.target.files[0] as File);
  };

  const onDeliveryTypeChange = (value: string) => {
    const deliveryTypes = generalInfo.deliveryTypes;
    const isExist = deliveryTypes.includes(value);
    if (isExist) {
      setGeneralInfo({
        ...generalInfo,
        deliveryTypes: deliveryTypes.filter(item => item !== value),
      });
      return;
    }
    if (
      (value === 'Shipping' && deliveryTypes.includes('Local Subscriptions')) ||
      (value === 'Local Subscriptions' && deliveryTypes.includes('Shipping'))
    )
      return;
    setGeneralInfo({
      ...generalInfo,
      deliveryTypes: [...deliveryTypes, value as PayType],
    });
  };

  const onProductChange = (e: ChangeInputEvent) => {
    setGeneralInfo({
      ...generalInfo,
      [e.target.name]: e.target.value,
    });
  };

  const onCancelClick = () => {
    navigate('/vendor/products');
  };

  const onSubmitClick = () => {
    if (productId === 'create') {
      dispatch(updateGeneral(generalInfo));
      navigate(NEXT_PATH);
    } else {
      const formData = new FormData();
      formData.append('name', generalInfo.name);
      formData.append('category', generalInfo.category);
      formData.append('deliveryTypes', JSON.stringify(generalInfo.deliveryTypes));
      formData.append('shortDesc', generalInfo.shortDesc);
      formData.append('longDesc', generalInfo.longDesc);
      formData.append('disclaimer', generalInfo.disclaimer);
      formData.append('soldByUnit', generalInfo.soldByUnit);
      formData.append('price', generalInfo.price.toString());
      formData.append('quantity', generalInfo.quantity.toString());
      formData.append('tax', `${generalInfo.tax}`);
      if (nutrition) formData.append('nutrition', nutrition);
      if (image) formData.append('image', image);
      HttpService.put(`/products/${productId}`, formData).then(response => {
        const { status } = response;
        if (status === 200) {
          enqueueSnackbar('Product updated.', { variant: 'success' });
        }
      })
    }
  };

  useEffect(() => {
    if (productId === 'create') {
      setGeneralInfo(storeGeneral);
    } else {
      HttpService.get(`/products/vendor/${productId}`).then(response => {
        const { status, product } = response;
        if (status === 200) {
          setGeneralInfo(product);
        }
      });
    }
  }, [productId, storeGeneral]);

  return (
    <div className={styles.root}>
      <div className={styles.information}>
        <div className={styles.container}>
          <div className={styles.variant}>
            <div className={styles.paytype}>
              <RadioGroup
                multiple={true}
                value={generalInfo.deliveryTypes}
                updateValue={onDeliveryTypeChange}
              >
                {['Shipping', 'Near By', 'Local Subscriptions'].map(
                  (type: string) => (
                    <div
                      key={type}
                      className={clsx(
                        styles.radioPanel,
                        generalInfo.deliveryTypes.includes(type as PayType)
                          ? styles.active
                          : '',
                      )}
                      onClick={() => onDeliveryTypeChange(type)}
                    >
                      <Radio
                        value={type}
                        label={type}
                        className={styles.radio}
                      />
                    </div>
                  ),
                )}
              </RadioGroup>
            </div>
          </div>
          <div className={styles.form}>
            <div className={styles.control}>
              <p>Product Category</p>
              <Select
                placeholder="Product category"
                options={categories.map(item => ({ ...item, value: item.name.toLowerCase() }))}
                className={styles.categories}
                value={generalInfo.category}
                updateValue={(category: string) =>
                  setGeneralInfo({ ...generalInfo, category })
                }
              />
            </div>
            <div className={styles.control}>
              <p>Product name</p>
              <Input
                name="name"
                rounded="full"
                border="none"
                bgcolor="secondary"
                placeholder="Product name"
                value={generalInfo.name}
                updateValue={onProductChange}
                className={styles.input}
                adornment={{
                  position: 'right',
                  content: (
                    <MagicIcon onClick={onDialogOpenClick('product name')} />
                  ),
                }}
              />
            </div>
            <div className={styles.control}>
              <p>Short Product Description</p>
              <Input
                name="shortDesc"
                rounded="full"
                border="none"
                bgcolor="secondary"
                placeholder="Short Product Description"
                className={styles.input}
                value={generalInfo.shortDesc}
                updateValue={onProductChange}
                adornment={{
                  position: 'right',
                  content: (
                    <MagicIcon
                      onClick={onDialogOpenClick('short product description')}
                    />
                  ),
                }}
              />
            </div>
            <div className={styles.control}>
              <p>Long Product Description</p>
              <TextField
                name="longDesc"
                rounded="full"
                border="none"
                bgcolor="secondary"
                placeholder="Long Product Description"
                value={generalInfo.longDesc}
                updateValue={onProductChange}
                className={styles.textInput}
                adornment={{
                  position: 'right',
                  content: (
                    <MagicIcon
                      onClick={onDialogOpenClick('long product description')}
                    />
                  ),
                }}
              />
            </div>
            <div className={styles.control}>
              <p>Disclaimer</p>
              <TextField
                name="disclaimer"
                rounded="full"
                border="none"
                bgcolor="secondary"
                placeholder="Disclaimer"
                className={styles.textInput}
                value={generalInfo.disclaimer}
                updateValue={onProductChange}
                adornment={{
                  position: 'right',
                  content: (
                    <MagicIcon onClick={onDialogOpenClick('disclaimer')} />
                  ),
                }}
              />
            </div>
            <div className={styles.control}>
              <p>Product Nutrition Facts</p>
              <Input
                type="file"
                rounded="full"
                border="none"
                bgcolor="secondary"
                value={nutrition}
                updateValue={onNutritionChange}
              />
            </div>
            <div className={styles.control}>
              <p>Price</p>
              <Input
                type="number"
                name="price"
                rounded="full"
                border="none"
                bgcolor="secondary"
                placeholder="Price"
                value={generalInfo.price}
                updateValue={onProductChange}
                adornment={{
                  position: 'left',
                  content: '$'
                }}
              />
            </div>
            <div className={styles.control}>
              <p>Quantity</p>
              <Input
                type="number"
                name="quantity"
                rounded="full"
                border="none"
                bgcolor="secondary"
                placeholder="Quantity"
                value={generalInfo.quantity}
                updateValue={onProductChange}
              />
            </div>
            <div className={styles.control}>
              <p>Product Image</p>
              <Input
                type="file"
                rounded="full"
                border="none"
                bgcolor="secondary"
                value={image}
                updateValue={onImageChange}
              />
            </div>
            <div className={styles.control}>
              <p>Sold By Units</p>
              <Select
                rounded="full"
                border="none"
                bgcolor="primary"
                placeholder="unit"
                options={metrics.map(item => ({ ...item, value: item.name.toLowerCase() }))}
                value={generalInfo.soldByUnit}
                updateValue={(value: string) => setGeneralInfo({ ...generalInfo, soldByUnit: value })}
              />
            </div>
            <div className={styles.control}>
              <p>Tax</p>
              <Input
                type="number"
                name="tax"
                rounded="full"
                border="none"
                bgcolor="secondary"
                placeholder="Tax"
                value={generalInfo.tax}
                updateValue={onProductChange}
              />
            </div>
          </div>
          <div className={styles.buttonBar}>
            <button className={styles.button} onClick={onCancelClick}>
              Cancel
            </button>
            <button
              className={clsx(styles.button, styles.updateButton)}
              onClick={onSubmitClick}
            >
              {productId === 'create' ? 'Save' : 'Update'}
            </button>
          </div>
        </div>
      </div>
      <AIDialog
        open={productDialogOpen}
        topic={dialogTopic}
        category={generalInfo.category}
        onClose={() => setProductDialogOpen(false)}
        onSelect={onAnswerSelect}
      />
    </div>
  );
}
