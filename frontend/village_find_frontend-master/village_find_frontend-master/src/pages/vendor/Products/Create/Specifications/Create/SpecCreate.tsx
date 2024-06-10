import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import clsx from 'clsx';

import { Select, TextField } from '@/components';
import { ChangeInputEvent } from '@/interfaces';
import { HttpService } from '@/services';
import { useAppSelector, useAppDispatch } from '@/redux/store';
import { ISpecification, createSpec, updateSpec } from '@/redux/reducers';

import styles from './SpecCreate.module.scss';

const SPEC_KEYS = [
  'SKU',
  'UPC',
  'Weight',
  'Height',
  'Width',
  'Length',
  'Package Quantity',
];

const PRODUCT_PATH = '/vendor/products';

export function SpecCreate() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { productId, specId } = useParams();

  const storeSpecs = useAppSelector(state => state.product.specifications);
  const [specName, setSpecName] = useState('');
  const [specValue, setSpecValue] = useState('');

  const onSpecNameChange = (value: string) => {
    setSpecName(value);
  };

  const onSpecValueChange = (e: ChangeInputEvent) => {
    setSpecValue(e.target.value);
  };

  const onCancelClick = () => {
    navigate(`${PRODUCT_PATH}/${productId}/specifications`);
  }

  const onUpdateClick = () => {
    if (productId === 'create') {
      if (specId === 'create') {
        dispatch(createSpec({
          index: -1,
          name: specName,
          value: specValue
        }));
      } else {
        dispatch(updateSpec({
          id: Number(specId),
          spec: {
            name: specName,
            value: specValue
          }
        }));
      }
      navigate(`${PRODUCT_PATH}/${productId}/specifications`);
    } else {
      HttpService.post(
        `/products/${productId}/specification`,
        {
          name: specName,
          value: specValue,
        },
        { specId },
      ).then(response => {
        const { status } = response;
        if (status === 200) {
          navigate(`${PRODUCT_PATH}/${productId}/specifications`);
          enqueueSnackbar('Specification added successfully!', {
            variant: 'success',
          });
        }
      });
    }
  };


  useEffect(() => {
    if (productId === 'create') {
      if (specId === 'create') {
        setSpecName('');
        setSpecValue('');
      } else {
        const spec = storeSpecs.find((item: ISpecification) => item.index === Number(specId));
        if (spec) {
          setSpecName(spec.name);
          setSpecValue(spec.value);
        }
      }
    } else {
      HttpService.get(`/products/${productId}/specification`).then(response => {
        const { status, specifications } = response;
        if (status === 200) {
          const specification = specifications.find(
            (item: any) => item._id === specId,
          );
          setSpecName(specification.name);
          setSpecValue(specification.value);
        }
      });
    }
  }, [productId, specId, storeSpecs]);

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.control}>
          <p>Add Specification</p>
          <Select
            rounded="full"
            border="none"
            bgcolor="primary"
            placeholder="Select here"
            options={SPEC_KEYS.map(item => ({ name: item, value: item.toLowerCase() }))}
            value={specName}
            updateValue={onSpecNameChange}
          />
        </div>
        <div className={styles.values}>
          <TextField
            rows={1}
            maxRows={1}
            rounded="full"
            border="none"
            bgcolor="primary"
            placeholder="Enter Specification Values"
            value={specValue}
            updateValue={onSpecValueChange}
            className={styles.valueField}
          />
        </div>
      </div>
      <div className={styles.buttonBar}>
        <button
          className={styles.button}
          onClick={onCancelClick}
        >
          Cancel
        </button>
        <button
          className={clsx(styles.button, styles.updateBtn)}
          onClick={onUpdateClick}
        >
          {specId === 'create' ? 'Add' : 'Update'}
        </button>
      </div>
    </div>
  );
}
