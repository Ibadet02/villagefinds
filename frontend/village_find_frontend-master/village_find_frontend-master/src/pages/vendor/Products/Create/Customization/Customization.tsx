import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import clsx from 'clsx';

import { Input, Radio, TextField } from '@/components/forms';
import { HttpService } from '@/services';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { ICustomization, updateCustomization } from '@/redux/reducers';
import { ChangeInputEvent } from '@/interfaces';

import styles from './Customization.module.scss';

const initialCustomization: ICustomization = {
  customText: '',
  fee: 0,
};
const PRODUCT_PATH = '/vendor/products';

export function Customization() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();

  const isCustomizable = useAppSelector(state => state.product.iscustomizable);
  const storeCustomization = useAppSelector(state => state.product.customization);

  const [isActivated, setIsActivated] = useState(false);
  const [customization, setCustomization] = useState<ICustomization>(
    initialCustomization
  );

  const onUpdateClick = () => {
    if (productId === 'create') {
      dispatch(updateCustomization({ iscustomizable: isActivated, customization }));
      navigate(`${PRODUCT_PATH}/${productId}/subscription`);
    } else {
      HttpService.post(
        `/products/${productId}/customization`,
        customization,
      ).then(response => {
        const { status } = response;
        if (status === 200) {
          enqueueSnackbar('Customization updated.', {
            variant: 'success',
          });
        } else {
          enqueueSnackbar('Something went wrong.', { variant: 'error' });
        }
      });
    }
  };

  const onCustomChange = (e: ChangeInputEvent) => {
    setCustomization({
      ...(customization || {}),
      [e.target.name]: e.target.value,
    });
  };

  const onActivateClick = () => {
    setIsActivated(!isActivated);
  };

  useEffect(() => {
    if (productId === 'create') {
      setIsActivated(isCustomizable);
      setCustomization(storeCustomization);
    } else {
      HttpService.get(`/products/${productId}/customization`).then(response => {
        const { status, iscustomizable, customization } = response;
        if (status === 200) {
          setIsActivated(iscustomizable);
          setCustomization(customization || initialCustomization);
        }
      });
    }
  }, [productId, isCustomizable, storeCustomization]);

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.control}>
          <p>Add Product Customization</p>
          <button
            className={clsx(styles.button, {
              [styles.buttonChecked]: isActivated,
            })}
            onClick={onActivateClick}
          >
            <Radio label="Activate" className={styles.radio} />
          </button>
        </div>
        <div className={styles.control}>
          <p>Share how to customize</p>
          <TextField
            name="customText"
            rounded="full"
            border="none"
            bgcolor="secondary"
            placeholder="Share how to customize"
            value={isActivated ? customization?.customText : ''}
            updateValue={onCustomChange}
            disabled={!isActivated}
          />
        </div>
        <div className={styles.control}>
          <p>Customization Fee</p>
          <Input
            name="fee"
            type="number"
            rounded="full"
            border="none"
            bgcolor="secondary"
            placeholder="Size fee option"
            adornment={{
              position: 'left',
              content: '$',
            }}
            className={styles.feeInput}
            value={customization?.fee}
            updateValue={onCustomChange}
            disabled={!isActivated}
          />
        </div>
      </div>
      <div className={styles.buttonBar}>
        <button className={styles.button} onClick={() => navigate(PRODUCT_PATH)}>
          Cancel
        </button>
        <button
          className={clsx(styles.button, styles.updateBtn)}
          onClick={onUpdateClick}
        >
          {productId === 'create' ? 'Save' : 'Update'}
        </button>
      </div>
    </div>
  );
}
