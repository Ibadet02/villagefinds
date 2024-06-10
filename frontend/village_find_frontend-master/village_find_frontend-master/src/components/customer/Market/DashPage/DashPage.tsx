// import { useContext } from 'react';
import { Container } from '@/components/layout/customer';

// import { Categories } from '../Categories';

// import { CategoryContext } from '@/providers';

import styles from './DashPage.module.scss';

export function DashPage() {
  // const { isCategoryBar } = useContext(CategoryContext);
  // console.log(isCategoryBar);

  return (
    <Container className={styles.root}>
      <div className={styles.container}>
        <h1>Handmade with love</h1>
        <div className={styles.grayLayer} />
      </div>
    </Container>
  );
}
