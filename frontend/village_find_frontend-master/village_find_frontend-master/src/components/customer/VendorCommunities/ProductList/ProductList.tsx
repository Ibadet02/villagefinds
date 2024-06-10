import { ProductCard } from '@/components/customer/common';

import styles from './ProductList.module.scss';

interface IProductListProps {
  products: any[];
  isMobile: boolean;
}

function ProductList({ products, isMobile }: IProductListProps) {
  return (
    <div className={styles.products}>
      {products.map((product: any, index: number) => (
        <ProductCard
          key={`product-${index}`}
          product={product}
          isActive={isMobile}
        />
      ))}
    </div>
  );
}

export { ProductList };
