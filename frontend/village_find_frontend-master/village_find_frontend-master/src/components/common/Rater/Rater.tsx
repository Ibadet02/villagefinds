import { useState, MouseEvent } from 'react';
import { FaStar, FaRegStar, FaRegStarHalfStroke } from 'react-icons/fa6';

import styles from './Rater.module.scss';

interface IRaterProps {
  iconValue?: number;
  iconSize?: number;
  rating: number;
  changeRating?: (rating: number) => void;
  selectable?: boolean;
}

export const Rater = ({
  iconValue = 5,
  iconSize = 30,
  rating,
  changeRating = () => {},
  selectable = false,
}: IRaterProps) => {
  const [hoverRating, setHoverRating] = useState<number>(-1);

  const onMouseMove = (index: number) => (e: MouseEvent) => {
    const { x, width } = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - x;
    if (offsetX < width / 2) {
      setHoverRating(index - 0.5);
    } else {
      setHoverRating(index);
    }
  };

  const onMouseDown = (e: MouseEvent) => {
    if (hoverRating === -1) return;
    changeRating(hoverRating);
    setHoverRating(-1);
  };

  return (
    <div
      className={styles.root}
      onMouseLeave={selectable ? () => setHoverRating(-1) : () => {}}
    >
      {[...Array(iconValue + 1).keys()].slice(1).map(index => (
        <span
          key={index}
          onMouseMove={selectable ? onMouseMove(index) : () => {}}
          onMouseDown={selectable ? onMouseDown : () => {}}
        >
          {(hoverRating !== -1 ? hoverRating : rating) + 0.5 === index ? (
            <FaRegStarHalfStroke
              className={styles.halfStar}
              fontSize={iconSize}
            />
          ) : (hoverRating !== -1 ? hoverRating : rating) >= index ? (
            <FaStar fontSize={iconSize} />
          ) : (
            <FaRegStar fontSize={iconSize} />
          )}
        </span>
      ))}
    </div>
  );
};

export default Rater;
