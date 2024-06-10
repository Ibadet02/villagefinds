import { useNavigate } from 'react-router-dom';
import { FaLongArrowAltRight } from 'react-icons/fa';

import { Container } from '@/components/layout/customer';
import { Button } from '@/components/forms';

import styles from './DashPage.module.scss';

const initialSignUpPath = '/sign-up/vendor';

export function DashPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.root}>
      <Container className={styles.container}>
        <p>Your business deserves better</p>
        <Button
          className={styles.button}
          onClick={() => navigate(initialSignUpPath)}
        >
          <p>Let's Go!</p>
          <FaLongArrowAltRight fill="#F2EEE9" fontSize={24} />
        </Button>
      </Container>
    </div>
  );
}
