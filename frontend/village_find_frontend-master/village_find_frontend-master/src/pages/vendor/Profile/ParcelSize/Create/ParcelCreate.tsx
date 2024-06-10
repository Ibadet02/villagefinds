import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';

import { Card } from '@/components/common';
import { Input, Select } from '@/components/forms';

import styles from './ParcelCreate.module.scss';
import { ChangeInputEvent } from '@/interfaces';
import { HttpService } from '@/services';
import { enqueueSnackbar } from 'notistack';

interface IParcel {
  name: string;
  width: number;
  height: number;
  length: number;
  thickness: number;
  emptyWeight: number;
  maxWeight: number;
  sizeUnit: string;
  massUnit: string;
}

const initialParcel: IParcel = {
  name: '',
  width: 0,
  height: 0,
  length: 0,
  thickness: 0,
  emptyWeight: 0,
  maxWeight: 0,
  sizeUnit: '',
  massUnit: '',
};

const sizeUnitList = ['In'];
const massUnitList = ['Lbs'];
const BACK_PATH = '/vendor/profile/parcel-size';

export function ParcelCreate() {
  const navigate = useNavigate();
  const { id: actionID } = useParams();

  const [parcel, setParcel] = useState<IParcel>(initialParcel);

  const onParcelChange = (e: ChangeInputEvent) => {
    setParcel({ ...parcel, [e.target.name]: e.target.value });
  };

  const onCancelClick = () => {
    navigate(BACK_PATH);
  };

  const onUpdateClick = () => {
    HttpService.put('/user/vendor/profile/shipping/parcel', parcel).then(
      response => {
        const { status } = response;
        if (status === 200) {
          enqueueSnackbar('Parcel created.', { variant: 'success' });
          navigate(BACK_PATH);
        }
      },
    );
  };

  useEffect(() => {
    if (actionID === 'create') return;
    HttpService.get('/user/vendor/profile/shipping/parcel', {
      id: actionID,
    }).then(response => {
      setParcel(response || initialParcel);
    });
  }, [actionID]);

  return (
    <Card title="Add Parcel Size" className={styles.root}>
      <div className={styles.container}>
        <p>Product dimensions padded not packed</p>
        <div className={styles.control}>
          <p>Name</p>
          <Input
            name="name"
            rounded="full"
            border="none"
            bgcolor="secondary"
            placeholder="Name"
            value={parcel.name}
            updateValue={onParcelChange}
          />
        </div>
        <div className={styles.horizon}>
          <div className={styles.horizon}>
            <div className={styles.control}>
              <p>Width</p>
              <Input
                type="number"
                name="width"
                rounded="full"
                border="none"
                bgcolor="secondary"
                placeholder="Width"
                value={parcel.width}
                updateValue={onParcelChange}
              />
            </div>
            <div className={styles.control}>
              <p>Height</p>
              <Input
                type="number"
                name="height"
                rounded="full"
                border="none"
                bgcolor="secondary"
                placeholder="Height"
                value={parcel.height}
                updateValue={onParcelChange}
              />
            </div>
          </div>
          <div className={styles.horizon}>
            <div className={styles.control}>
              <p>Length</p>
              <Input
                type="number"
                name="length"
                rounded="full"
                border="none"
                bgcolor="secondary"
                placeholder="Length"
                value={parcel.length}
                updateValue={onParcelChange}
              />
            </div>
            <div className={styles.control}>
              <p>Thickness (mm)</p>
              <Input
                type="number"
                name="thickness"
                rounded="full"
                border="none"
                bgcolor="secondary"
                placeholder="Thickness (mm)"
                value={parcel.thickness}
                updateValue={onParcelChange}
              />
            </div>
          </div>
        </div>
        <div className={styles.horizon}>
          <div className={styles.control}>
            <p>Empty Box Weight</p>
            <Input
              type="number"
              name="emptyWeight"
              rounded="full"
              border="none"
              bgcolor="secondary"
              placeholder="Empty Box Weight"
              value={parcel.emptyWeight}
              updateValue={onParcelChange}
            />
          </div>
          <div className={styles.control}>
            <p>Max Weight</p>
            <Input
              type="number"
              name="maxWeight"
              rounded="full"
              border="none"
              bgcolor="secondary"
              placeholder="Max Weight"
              value={parcel.maxWeight}
              updateValue={onParcelChange}
            />
          </div>
        </div>
        <div className={styles.horizon}>
          <div className={styles.control}>
            <p>Size Unit</p>
            <Select
              options={sizeUnitList.map(item => ({
                name: item,
                value: item.toLowerCase(),
              }))}
              rounded="full"
              border="none"
              bgcolor="primary"
              placeholder="In"
              value={parcel.sizeUnit}
              updateValue={(value: string) =>
                setParcel({ ...parcel, sizeUnit: value })
              }
            />
          </div>
          <div className={styles.control}>
            <p>Mass Unit</p>
            <Select
              options={massUnitList.map(item => ({
                name: item,
                value: item.toLowerCase(),
              }))}
              rounded="full"
              border="none"
              bgcolor="primary"
              placeholder="Lbs"
              value={parcel.massUnit}
              updateValue={(value: string) =>
                setParcel({ ...parcel, massUnit: value })
              }
            />
          </div>
        </div>
        <div className={styles.buttonBar}>
          <button
            className={clsx(styles.button, styles.cancel)}
            onClick={onCancelClick}
          >
            Cancel
          </button>
          <button className={styles.button} onClick={onUpdateClick}>
            {actionID === 'create' ? 'Create' : 'Update'}
          </button>
        </div>
      </div>
    </Card>
  );
}
