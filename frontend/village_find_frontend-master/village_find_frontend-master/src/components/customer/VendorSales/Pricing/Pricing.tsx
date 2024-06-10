import { FaLongArrowAltRight } from 'react-icons/fa';

import { Container } from '@/components/layout/customer';
import { Button } from '@/components/forms';

import clsx from 'clsx';
import styles from './Pricing.module.scss';
import { useNavigate } from 'react-router-dom';

const initialPackages = [
  {
    title: 'Seedling',
    type: 'seedling',
    content: (
      <div className={styles.content}>
        <p>List up to 25 items for free</p>
        <p>
          Transaction fee <span className={styles.emphasis}>10%</span>
        </p>
        <p>Offer shipping nation wide</p>
      </div>
    ),
  },
  {
    title: 'Sprouting',
    type: 'sprouting',
    content: (
      <div className={styles.content}>
        <p>
          Monthly investment <span className={styles.emphasis}>$4.99</span>
        </p>
        <p>
          Transaction fee <span className={styles.emphasis}>8.5%</span>
        </p>
        <p>Offer shipping nation wide</p>
      </div>
    ),
    active: true,
  },
  {
    title: 'Budding',
    type: 'budding',
    content: (
      <div className={styles.content}>
        <p>
          Monthly investment <span className={styles.emphasis}>$9.99</span>
        </p>
        <p>
          Transaction fee <span className={styles.emphasis}>8.5%</span>
        </p>
        <p>Offer shipping nation wide</p>
        <p>Offer local delivery</p>
        <p>Offer local pickup</p>
        <p>Offer pre-ordering with partnered pickup locations</p>
      </div>
    ),
  },
];

const SIGNUP_PATH = '/sign-up/vendor';

export function Pricing() {
  const navigate = useNavigate();

  return (
    <Container id="pricing" className={styles.root}>
      <h1>Choose a package</h1>
      <div className={styles.packages}>
        {initialPackages.map((item: any, index: number) => (
          <div
            key={`package-${index}`}
            className={clsx(
              styles.pkgWrapper,
              item.active ? styles.active : '',
            )}
          >
            <h3>{item.title}</h3>
            <div className={styles.package}>
              {item.content}
              <Button className={styles.button}>
                <p
                  className={styles.text}
                  onClick={() =>
                    navigate(`${SIGNUP_PATH}?subscription=${item.type}`)
                  }
                >
                  Let's Go!
                </p>
                <FaLongArrowAltRight fill="#F2EEE9" fontSize={24} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
