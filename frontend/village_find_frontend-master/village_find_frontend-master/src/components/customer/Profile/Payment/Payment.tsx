import { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import MaskInput from 'react-input-mask';
import clsx from 'clsx';

import { Select } from '@/components/forms';

import styles from './Payment.module.scss';
import { ChangeInputEvent } from '@/interfaces';

interface IPayment {
    cardNumber: string;
    expMonth: string;
    expYear: string;
    cvcCode: string;
}

const initialPayment: IPayment = {
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvcCode: ''
};

const getYearOpts = () => {
    const year = new Date().getFullYear() - 2000;
    return [...Array(10).keys()].map(item => `${item + year}`);
}

export function Payment() {
    const [payment, setPayment] = useState<IPayment>(initialPayment);

    return <div className={styles.root}>
        <div className={styles.header}>
            <p>Payment Options</p>
            <div className={styles.icons}>
                <div className={styles.edit}>
                    <FaRegEdit />
                    <p>Edit</p>
                </div>
                <FaRegTrashCan />
            </div>
        </div>
        <div className={styles.card}>
            <div className={clsx(styles.control, styles.number)}>
                <p>Card Number</p>
                <MaskInput
                    mask={'9999-9999-9999-9999'}
                    placeholder={'xxxx-xxxx-xxxx-xxxx'}
                    value={payment.cardNumber}
                    onChange={(e: ChangeInputEvent) => setPayment({ ...payment, cardNumber: e.target.value })}
                    className={styles.input}
                />
            </div>
            <div className={clsx(styles.control, styles.exp)}>
                <p>Exp.Month</p>
                <Select
                    options={[...Array(13).keys()].slice(1).map(item => `${item}`)}
                    value={`${payment.expMonth}`}
                    updateValue={(value: string) => setPayment({ ...payment, expMonth: value })}
                    className={styles.select}
                />
            </div>
            <div className={clsx(styles.control, styles.exp)}>
                <p>Exp.Year</p>
                <Select
                    options={getYearOpts()}
                    value={`${payment.expYear}`}
                    updateValue={(value: string) => setPayment({ ...payment, expYear: value })}
                    className={styles.select}
                />
            </div>
            <div className={clsx(styles.control, styles.cvc)}>
                <p>CVC Code</p>
                <MaskInput
                    mask={'999'}
                    placeholder='XXX'
                    value={payment.cvcCode}
                    onChange={(e: ChangeInputEvent) => setPayment({ ...payment, cvcCode: e.target.value })}
                    className={styles.input}
                />
            </div>
        </div>
    </div>
}