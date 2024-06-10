import { useNavigate } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa6';

import {
    AddressBook,
    Information,
    Orders,
    Payment,
} from '@/components/customer/Profile';
import { Container } from '@/components/layout/customer';

import styles from './Profile.module.scss';

const MARKET_PATH = '/market';

export function Profile() {
    const navigate = useNavigate();

    return <Container className={styles.root}>
        <div className={styles.back}>
            <span onClick={() => navigate(MARKET_PATH)}><FaChevronLeft /></span>
            <p>Back to Market</p>
        </div>
        <Information />
        <Orders />
        <Payment />
        <AddressBook />
    </Container>
}