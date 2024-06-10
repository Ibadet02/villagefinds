import { useContext, useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { enqueueSnackbar } from 'notistack';

import { Button } from '@/components/forms';
import { ZipcodeContext } from '@/providers';
import { GEOLOCATION_API_KEY } from '@/config/global';

import { getLocationFromCoords } from '@/utils/third-api/zipcode';
import { capitalizeFirstLetter } from '@/utils';
import styles from './LocationConfirmDialog.module.scss';

interface ILocationConfirmDialogProps {
  onConfirm: () => void;
  onOtherClick: () => void;
  onClose: () => void;
}

export function LocationConfirmDialog({
  onClose,
  onConfirm,
  onOtherClick,
}: ILocationConfirmDialogProps) {
  const { zipcode, changeZipcode, cityName, changeCityName } =
    useContext(ZipcodeContext);
  const [currentZipcode, setCurrentZipcode] = useState(zipcode);
  const [currentCityName, setCurrentCityName] = useState(cityName);

  const onConfirmClick = () => {
    changeZipcode(currentZipcode);
    changeCityName(currentCityName);
    onConfirm();
  };

  useEffect(() => {
    if (!zipcode) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;
          (async () => {
            const result = await getLocationFromCoords({ latitude, longitude });
            if (result) {
              const {
                _normalized_city,
                county,
                state_code,
                country_code,
                postcode,
              } = result;
              setCurrentCityName(
                `${_normalized_city || county}, ${capitalizeFirstLetter(
                  state_code || country_code,
                )}`,
              );
              setCurrentZipcode(postcode);
            }
          })();
        },
      );
    }
  }, [zipcode]);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <span onClick={onClose}>
          <FaTimes />
        </span>
        <p>Want to see items local to you?</p>
      </div>
      <div className={styles.body}>
        <p className={styles.question}>
          Are you in <span>{currentCityName}</span>? Click the button below to
          see new shops in your area!
        </p>
        <Button className={styles.confirmBtn} onClick={onConfirmClick}>
          Confirm Location
        </Button>
        <p className={styles.otherLoc}>
          Not your location?{' '}
          <span onClick={onOtherClick}>
            Click here
          </span>
        </p>
      </div>
    </div>
  );
}
