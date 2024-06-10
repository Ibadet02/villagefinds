import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import { Card } from '@/components/common';
import { Radio, RadioGroup } from '@/components/forms';
import { HttpService } from '@/services';

import styles from './ShippingService.module.scss';

const BACKPATH = '/vendor/profile';

const uspsServices = [
  'SPS - First Class Mail/Package',
  'USPS - First Class Package International',
  'USPS - Media Mail, only for existing Shippo customers with grandfathered Media Mail option.',
  'USPS - Parcel Select',
  'USPS - Priority Mail',
  'USPS - Priority Mail Express',
  'USPS - Priority Mail Express International',
  'USPS - Priority Mail International',
];

const upsServices = [
  'UPS - 2nd Day Air®',
  'UPS - 2nd Day Air® A.M.',
  'UPS - 3 Day Select®',
  'UPS - Access Point™ Economy',
  'UPS - Access Point™ Economy',
  'UPS - Expedited®',
  'UPS - Express 12:00',
  'UPS - Express Plus®',
  'UPS - Express®',
  'UPS - Express® Early',
  'UPS - Ground',
  'UPS - Mail Innovations (domestic)',
  'UPS - Next Day Air Saver®',
  'UPS - Next Day Air®',
  'UPS - Next Day Air® Early',
  'UPS - Saver®',
  'UPS - Standard℠',
  'UPS - Surepost',
  'UPS - Surepost Lightweight',
  'UPS - SurePost® Bound Printed Matte',
  'UPS - SurePost® Media',
];

const fedExServices = [
  'FedEx - FedEx 2Day®',
  'FedEx - FedEx 2Day® A.M.',
  'FedEx - FedEx Express Saver®',
  'FedEx - FedEx First Freight',
  'FedEx - FedEx First Overnight®',
  'FedEx - FedEx Freight® Economy',
  'FedEx - FedEx Freight® Priority',
  'FedEx - FedEx Ground®',
  'FedEx - FedEx Home Delivery®',
  'FedEx - FedEx International Economy®',
  'FedEx - FedEx International Economy® Freight',
  'FedEx - FedEx International First®',
  'FedEx - FedEx International Priority®',
  'FedEx - FedEx International Priority® Freight',
  'FedEx - FedEx Next Day Freight',
  'FedEx - FedEx Priority Overnight®',
  'FedEx - FedEx SmartPost®',
  'FedEx - FedEx Standard Overnight®',
];

export function ShippingService() {
  const navigate = useNavigate();
  const [services, setServices] = useState<string[]>([]);

  const onServiceChange = (value: string) => {
    if (services.includes(value)) {
      setServices(services.filter(item => item !== value));
    } else {
      setServices([...services, value]);
    }
  };

  const onCancelClick = () => {
    navigate(BACKPATH);
  };

  const onUpdateClick = () => {
    HttpService.put('/user/vendor/profile/shipping/service', { services }).then(
      response => {
        const { status } = response;
        if (status === 200) {
          enqueueSnackbar('Shipping services updated.', { variant: 'success' });
        }
      },
    );
  };

  useEffect(() => {
    HttpService.get('/user/vendor/profile/shipping/service').then(response => {
      setServices(response || []);
    });
  }, []);

  return (
    <Card title="Shipping Services" className={styles.root}>
      <div className={styles.container}>
        <p>
          Select all of the shipping services that apply to your business needs
        </p>
        <div className={styles.subservice}>
          <div className={styles.ups}>
            <div className={styles.subUps}>
              <h3>USPS</h3>
              <RadioGroup
                value={services}
                className={styles.radioGroup}
                multiple={true}
                updateValue={onServiceChange}
              >
                {uspsServices.map((service: string, index: number) => (
                  <Radio
                    key={index}
                    label={service}
                    value={service.toLowerCase()}
                    size="small"
                  />
                ))}
              </RadioGroup>
            </div>
            <div className={styles.subUps}>
              <h3>UPS</h3>
              <RadioGroup
                value={services}
                className={styles.radioGroup}
                multiple={true}
                updateValue={onServiceChange}
              >
                {upsServices.map((service: string, index: number) => (
                  <Radio
                    key={index}
                    label={service}
                    value={service.toLowerCase()}
                    size="small"
                  />
                ))}
              </RadioGroup>
            </div>
          </div>
          <div className={styles.fedex}>
            <h3>FedEx</h3>
            <RadioGroup
              className={styles.radioGroup}
              multiple={true}
              value={services}
              updateValue={onServiceChange}
            >
              {fedExServices.map((service: string, index: number) => (
                <Radio
                  key={index}
                  label={service}
                  value={service.toLowerCase()}
                  size="small"
                />
              ))}
            </RadioGroup>
          </div>
        </div>
        <div className={styles.buttons}>
          <button onClick={onCancelClick}>Cancel</button>
          <button className={styles.updateBtn} onClick={onUpdateClick}>
            Update
          </button>
        </div>
      </div>
    </Card>
  );
}
