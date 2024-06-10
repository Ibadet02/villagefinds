import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import { Button, Input } from '@/components/forms';
import { Logo } from '@/components/layout/customer';
import { HttpService } from '@/services';
import { AuthContext } from '@/providers';
import { ChangeInputEvent } from '@/interfaces';
import { setupToken } from '@/utils';

import styles from './Login.module.scss';

interface IAccount {
    email: string;
    password: string;
}

const initialAccount: IAccount = {
    email: '',
    password: ''
};

const ADMIN_PATH = '/admin/dashboard';

export function Login() {
    const navigate = useNavigate();

    const { setIsLogin } = useContext(AuthContext);
    const [account, setAccount] = useState<IAccount>(initialAccount);

    const onAccountChange = (e: ChangeInputEvent) => {
        setAccount({ ...account, [e.target.name]: e.target.value });
    }

    const onLoginClick = () => {
        HttpService.post('/admin/login', account).then(response => {
            const { status, token } = response;
            if (status === 200) {
                setIsLogin(true);
                setupToken(token, 'admin');
                navigate(ADMIN_PATH);
                enqueueSnackbar('Admin login success.', { variant: 'success' });
            } else if (status === 400) {
                enqueueSnackbar('Invalid credential.', { variant: 'warning' });
            }
        });
    }

    return <div className={styles.root}>
        <div className={styles.container}>
            <div className={styles.header}>
                <Logo />
            </div>
            <div className={styles.controls}>
                <Input
                    name='email'
                    placeholder='Email/Phone'
                    value={account.email}
                    updateValue={onAccountChange}
                    className={styles.input}
                />
                <Input
                    name='password'
                    type='password'
                    placeholder='Password'
                    value={account.password}
                    updateValue={onAccountChange}
                    className={styles.input}
                />
            </div>
            <div className={styles.buttons}>
                <Button className={styles.submitBtn} onClick={onLoginClick}>Login</Button>
            </div>
        </div>
    </div>;
}