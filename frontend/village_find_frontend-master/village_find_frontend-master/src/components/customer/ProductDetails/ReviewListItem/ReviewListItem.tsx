import { useMemo } from 'react';

import { Rater } from '@/components/common';

import styles from './ReviewLIstItem.module.scss';

interface IReviewListItemProps {
  rating: number;
  title: string;
  body: string;
  isverified: boolean;
  createdAt: string;
}

export function ReviewListItem({
  rating,
  title,
  body,
  isverified,
  createdAt,
}: IReviewListItemProps) {
  const reviewedDate = useMemo(() => {
    return new Date(createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [createdAt]);

  return (
    <div className={styles.root}>
      <div className={styles.symbol}>
        <Rater rating={rating} />
        <p>{reviewedDate}</p>
      </div>
      <div className={styles.profile}>
        <span className={styles.avatar}>
          <img src="/assets/customer/svgs/review.svg" />
        </span>
        <div className={styles.text}>
          <div className={styles.title}>
            <p>{title}</p>
            {isverified && <span>Verified Review</span>}
          </div>
          <p className={styles.body}>{body}</p>
        </div>
      </div>
    </div>
  );
}
