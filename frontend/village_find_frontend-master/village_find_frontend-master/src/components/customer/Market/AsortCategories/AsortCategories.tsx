import { Container } from '@/components/layout/customer';
import { ProductCard } from '../../common';

import styles from './AsortCategories.module.scss';
import { useEffect, useState } from 'react';
import { HttpService } from '@/services';

export function AsortCategories() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    HttpService.get('/products/public').then(response => {
      
    })
  }, []);

  return (
    <Container className={styles.root}>
      <p className={styles.head}>Assorted Categories</p>
      <div className={styles.categories}>
        {[].map((category: any, index: number) => (
          <ProductCard key={`asorted-category-${index}`} product={category} />
        ))}
      </div>
    </Container>
  );
}
