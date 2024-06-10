import { useState, useEffect, useContext } from 'react';

import { Button } from '@/components/forms';
import { Rater } from '@/components/common';

import {
  ReviewListItem,
  WriteReview,
} from '@/components/customer/ProductDetails';

import styles from './AuthenticReviews.module.scss';
import { HttpService } from '@/services';
import { useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { AuthContext } from '@/providers';

interface IReview {
  customerID: string;
  productID: string;
  rating: number;
  title: string;
  body: string;
  isverified: boolean;
  createdAt: string;
}

// const initialReviews: IReview[] = [
//   {
//     rating: 5,
//     title: 'April Cohen',
//     body: "I mean it's really good but I would like a little bolder taste I am still drinking it though it's not a complaint just a helpful suggestion",
//     isverified: true,
//     createdAt: 'April 22, 2023',
//   },
//   {
//     rating: 5,
//     title: 'April Cohen',
//     body: "I mean it's really good but I would like a little bolder taste I am still drinking it though it's not a complaint just a helpful suggestion",
//     isverified: true,
//     createdAt: 'April 22, 2023',
//   },
//   {
//     rating: 5,
//     title: 'April Cohen',
//     body: "I mean it's really good but I would like a little bolder taste I am still drinking it though it's not a complaint just a helpful suggestion",
//     isverified: true,
//     createdAt: 'April 22, 2023',
//   },
// ];

type Rating = 1 | 2 | 3 | 4 | 5;

interface IRating {
  rating: 1 | 2 | 3 | 4 | 5;
  count: number;
}

const initialRatings: IRating[] = [...Array(6).keys()]
  .slice(1)
  .map(rating => ({ rating: rating as Rating, count: 0 }));

export function AuthenticReviews() {
  const { id: productID } = useParams();
  const { isLogin, account } = useContext(AuthContext);

  const [reviewCount, setReviewCount] = useState(3);
  const [customerCount, setCustomerCount] = useState(0);
  const [averageRating, setAverageRating] = useState(3.5);
  const [totalRatings, setTotalRatings] = useState<any[]>(initialRatings);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isReviewed, setIsReviewed] = useState(false);
  const [isWriteReview, showWriteReview] = useState(false);

  const onSwitchReview = () => {
    if (isReviewed) {
      if (!account?.profile?._id) {
        enqueueSnackbar('Customer credential invalid.', { variant: 'warning' });
        return;
      } else {
        HttpService.delete('/reviews', { productID }).then(response => {
          const { status } = response;
          if (status === 200) {
            enqueueSnackbar('Review canceled.', { variant: 'success' });
            setIsReviewed(false);
            showWriteReview(false);
            setReviews(
              reviews.filter(
                item =>
                  item.customerID !== account.profile._id &&
                  item.productID !== productID,
              ),
            );
          }
        });
      }
    } else {
      showWriteReview(true);
    }
  };

  const onReviewSubmit = (review: {
    title: string;
    body: string;
    rating: number;
  }) => {
    if (!productID) {
      enqueueSnackbar('Cannot load the product.', { variant: 'warning' });
      return;
    }
    HttpService.post('/reviews', review, { productID }).then(response => {
      const { status, review } = response;
      if (status === 200) {
        enqueueSnackbar(
          `You have written the review with rating ${review.rating}`,
          { variant: 'success' },
        );
        setReviews([review, ...reviews].slice(0, reviewCount));
      } else if (status == 400) {
        enqueueSnackbar('You have written the review already.', {
          variant: 'warning',
        });
      }
    });
  };

  const onLoadMoreClick = () => {
    if (customerCount < reviewCount) {
      enqueueSnackbar('No more reviews so far.', { variant: 'info' });
    }
    setReviewCount(reviewCount + 3);
  };

  const getRatingPercent = (count: number) =>
    customerCount === 0 ? 0 : count / customerCount;

  useEffect(() => {
    if (!productID || !account?.profile?._id) return;
    HttpService.get('/reviews', { productID, count: reviewCount }).then(
      response => {
        const { ratings, reviews, customers } = response;
        setCustomerCount(customers || 0);
        setReviews(reviews);
        setTotalRatings(ratings.overall || initialRatings);
        setAverageRating(ratings.average || 0);
      },
    );
  }, [productID]);

  useEffect(() => {
    if (!isLogin) return;
    HttpService.get('/reviews/check', { productID }).then(response => {
      const { reviewed } = response;
      setIsReviewed(reviewed);
    });
  }, [isLogin]);

  return (
    <div className={styles.root}>
      <p className={styles.head}>Authentic Member Reviews</p>
      <div className={styles.reviewBar}>
        <div className={styles.customer}>
          <div className={styles.rating}>
            <Rater rating={averageRating} />
            <p>{averageRating} out of 5</p>
          </div>
          <p className={styles.text}>Out of {customerCount} customers</p>
        </div>
        <div className={styles.total}>
          {totalRatings.reverse().map((item: IRating, index: number) => (
            <div key={index} className={styles.reviewItem}>
              <Rater rating={item.rating} iconSize={20} />
              <div className={styles.progress}>
                <div
                  style={{ width: `${getRatingPercent(item.count)}%` }}
                  className={styles.loading}
                ></div>
              </div>
              <p>{item.count}</p>
            </div>
          ))}
        </div>
        <div className={styles.button}>
          <Button className={styles.cancelBtn} onClick={onSwitchReview}>
            {isReviewed ? 'Cancel Review' : 'Write Review'}
          </Button>
        </div>
      </div>
      <div className={styles.writeReview}>
        {isWriteReview && (
          <WriteReview
            onSubmit={onReviewSubmit}
            onCancel={() => showWriteReview(false)}
          />
        )}
      </div>
      <div className={styles.reviewList}>
        <div className={styles.reviews}>
          {reviews.map((review: IReview, index: number) => (
            <ReviewListItem key={index} {...review} />
          ))}
        </div>
        {reviews.length > 0 && (
          <Button className={styles.loadBtn} onClick={onLoadMoreClick}>
            Load More
          </Button>
        )}
      </div>
    </div>
  );
}
