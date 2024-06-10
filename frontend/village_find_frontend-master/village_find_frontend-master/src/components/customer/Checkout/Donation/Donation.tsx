import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa6';
import clsx from 'clsx';

import styles from './Donation.module.scss';

interface IDonationProps {
  donation: number;
  setDonation: (_: number) => void;
}

export function Donation({ donation, setDonation }: IDonationProps) {
  const [donIndex, setDonIndex] = useState(1);
  const [donText, setDonText] = useState('__.__');

  const buildDonText = (str: string) => {
    if (str.length <= 2) {
      return `${str.padEnd(2, '_')}.__`;
    }
    return `${str.slice(0, 2)}.${str.slice(2).padEnd(2, '_')}`;
  };

  const pureText = (str: string) => {
    return str.replace(/[_\.]/g, '');
  };

  const onDonTextChange = (e: any) => {
    const text = e.target.value,
      trimText = pureText(text);
    if (trimText.length > 4) return;

    if (text.length === 4 && pureText(donText).length !== 4) {
      setDonText(buildDonText(trimText.slice(0, trimText.length - 1)));
    } else {
      setDonText(buildDonText(trimText));
    }
  };

  useEffect(() => {
    if (donIndex === 3) return;
    setDonation([1, 3, 5][donIndex]);
  }, [donIndex]);

  useEffect(() => {
    if (!donText.includes('_')) {
      setDonation(Number(donText));
    }
  }, [donText]);

  // useEffect(() => {
  //   const donations = [1, 3, 5];
  //   const index = donations.findIndex(item => item === donation);
  //   if (index !== -1) {
  //     setDonIndex(index);
  //   } else {
  //     setDonIndex(3);
  //     setDonText(donation.toString());
  //   }
  // }, [donation]);

  return (
    <div className={styles.root}>
      <p className={styles.head}>Do good and donate</p>
      <p className={styles.body}>
        We'll give your donation to a non-profit helping hunger or education
      </p>
      <div className={styles.donations}>
        {[1, 3, 5, -1].map((price: number, index: number) => (
          <div
            key={index}
            className={clsx(styles.donation, {
              [styles.active]: donIndex === index,
            })}
            onClick={() => setDonIndex(index)}
          >
            <span className={styles.check}>
              {donIndex === index && <FaCheck fill="#84A98C" size={12} />}
            </span>
            {price === -1 ? (
              <div className={styles.priceInput}>
                <span>$ </span>
                <input value={donText} onChange={onDonTextChange} />
              </div>
            ) : (
              <p className={styles.price}>$ {price.toFixed(2)}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
