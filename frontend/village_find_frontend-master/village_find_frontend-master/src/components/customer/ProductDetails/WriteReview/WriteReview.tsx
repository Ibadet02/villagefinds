import { useContext, useState } from 'react';
import clsx from 'clsx';

import { Button, Input, TextField } from '@/components/forms';
import { Rater } from '@/components/common';
import { AuthContext } from '@/providers';
import { ChangeInputEvent } from '@/interfaces';

import styles from './WriteReview.module.scss';
import { enqueueSnackbar } from 'notistack';

interface IWriteReviewProps {
  onSubmit: (review: any) => void;
  onCancel: () => void;
}

interface IReview {
  title: string;
  body: string;
  rating: number;
}

const initialReview: IReview = {
  title: '',
  body: '',
  rating: 0,
};

export function WriteReview({
  onSubmit = () => {},
  onCancel = () => {},
}: IWriteReviewProps) {
  const [review, setReview] = useState<IReview>(initialReview);
  const { isLogin } = useContext(AuthContext);

  const onSubmitClick = () => {
    if (!isLogin) {
      enqueueSnackbar('You should signin to write review.', {
        variant: 'warning',
      });
    } else {
      onSubmit(review);
    }
  };

  const onReviewChange = (e: ChangeInputEvent) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.root}>
      <p className={styles.head}>Write A Review</p>
      <div className={styles.rating}>
        <p className={styles.text}>Rating</p>
        <Rater
          rating={review.rating}
          changeRating={(rating: number) => setReview({ ...review, rating })}
          iconSize={30}
          selectable={true}
        />
      </div>

      <div className={clsx(styles.formElement, styles.title)}>
        <p className={styles.text}>Review Title</p>
        <Input
          name="title"
          placeholder="Review Title"
          className={styles.titleInput}
          value={review.title}
          updateValue={onReviewChange}
        />
      </div>
      <div className={clsx(styles.formElement, styles.body)}>
        <p className={styles.text}>Review Body</p>
        <TextField
          rows={3}
          name="body"
          placeholder="Review Body"
          className={styles.bodyInput}
          value={review.body}
          updateValue={onReviewChange}
        />
      </div>
      <div className={styles.buttons}>
        <Button
          className={clsx(styles.button, styles.submitBtn)}
          onClick={onSubmitClick}
        >
          Submit
        </Button>
        <Button
          className={clsx(styles.button, styles.cancelBtn)}
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
