import { useNavigate } from 'react-router-dom';

import styles from './VendorCard.module.scss';

interface IVendorCardProps {
  vendorId: string;
  backImage: string;
  logoImage: string;
  title: string;
  description: string;
  interests: string[];
}

export function VendorCard({
  vendorId,
  backImage,
  logoImage,
  title,
  description,
  interests,
}: IVendorCardProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.root}>
      <div className={styles.backImage}>
        <img src={backImage} />
        <button
          className={styles.shopBtn}
          onClick={() => navigate(`/vendors/${vendorId}`)}
        >
          Shop Now
        </button>
      </div>
      <div className={styles.community}>
        <div className={styles.image}>
          <img src={logoImage} />
        </div>
        <div className={styles.text}>
          <p className={styles.head}>{title}</p>
          <p className={styles.body}>{description}</p>
          <div className={styles.extra}>
            <div className={styles.category}>
              <p>Interested In</p>
              {interests.map((interest: string, index: number) => (
                <span key={index}>{interest}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
