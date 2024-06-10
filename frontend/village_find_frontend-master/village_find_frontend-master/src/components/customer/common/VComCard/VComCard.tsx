import { useNavigate } from 'react-router-dom';

import { SERVER_URL } from '@/config/global';

import styles from './VComCard.module.scss';
import { useContext } from 'react';
import { CategoryContext } from '@/providers';

interface IVComCardProps {
  vcomId: string;
  backImage: string;
  logoImage: string;
  title: string;
  description: string;
  categories: string[];
  vendors: { _id: string }[];
}

export function VComCard({
  vcomId,
  backImage,
  logoImage,
  title,
  description,
  categories: comCategories,
  vendors,
}: IVComCardProps) {
  const navigate = useNavigate();
  const { categories } = useContext(CategoryContext);

  return (
    <div className={styles.root}>
      <div className={styles.imgwrapper}>
        <img
          alt="Community background image"
          src={`${SERVER_URL}/${backImage}`}
        />
      </div>
      <div className={styles.community}>
        <div className={styles.image}>
          <img
            alt="Community logo image"
            src={`${SERVER_URL}/${logoImage}`}
            onClick={() => navigate(`/communities/${vcomId}`)}
          />
        </div>
        <div className={styles.text}>
          <p
            className={styles.head}
            onClick={() => navigate(`/communities/${vcomId}`)}
          >
            {title}
          </p>
          <p className={styles.body}>{description}</p>
          <div className={styles.extra}>
            <div className={styles.category}>
              <p>Category</p>
              {categories
                .filter(item =>
                  (comCategories || []).includes(item.name.toLowerCase()),
                )
                .map((item: any, index: number) => (
                  <span key={index}>{item.name}</span>
                ))}
            </div>
            <div className={styles.vendor}>
              <p>Vendors</p>
              <span>{vendors.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
