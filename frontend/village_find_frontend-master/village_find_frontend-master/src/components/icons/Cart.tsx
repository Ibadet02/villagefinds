import clsx from 'clsx';

import CartSvg from '/assets/common/icons/Cart.svg';
import CartPinkSvg from '/assets/common/icons/Cart-pink.svg';

type ColorType = 'black' | 'pink';

export interface ICartIconProps {
  onClick?: () => void;
  color?: ColorType;
  className?: string;
}

export function CartIcon({
  className = '',
  color = 'black',
  ...attrs
}: ICartIconProps) {
  return (
    <img
      alt="Cart Icon"
      src={color === 'pink' ? CartPinkSvg : CartSvg}
      className={clsx('h-6 w-6', className)}
      {...attrs}
    />
  );
}
