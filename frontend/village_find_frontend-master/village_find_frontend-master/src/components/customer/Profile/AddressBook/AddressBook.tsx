import { useEffect, useState } from 'react';
import clsx from 'clsx';

import { Button, Input } from '@/components/forms';
import { HttpService } from '@/services';
import { ChangeInputEvent } from '@/interfaces';

import styles from './AddressBook.module.scss';
import { enqueueSnackbar } from 'notistack';

interface IAddrBook {
    name: string;
    address: string;
    extras: string;
    default?: boolean;
}

const initialBook: IAddrBook = {
    name: '',
    address: '',
    extras: ''
};

export function AddressBook() {
    const [addingBook, setAddingBook] = useState<IAddrBook>(initialBook);
    const [addrList, setAddrList] = useState<IAddrBook[]>([]);

    const onBookChange = (e: ChangeInputEvent) => {
        setAddingBook({ ...addingBook, [e.target.name]: e.target.value });
    }

    const onAddBtnClick = () => {
        HttpService.put('/user/customer/address',
            { addressBook: [...addrList, { ...addingBook, default: false }] }
        ).then(response => {
            const { status } = response;
            if (status === 200) {
                setAddrList([...addrList, addingBook]);
                setAddingBook(initialBook);
                enqueueSnackbar('Address added.', { variant: 'success' });
            }
        });
    }

    const onDefaultClick = (id: number) => () => {
        const addresses = addrList.map((item, index) => index === id ? { ...item, default: true } : item);
        HttpService.put('/user/customer/address', { addressBook: addresses }).then(response => {
            const { status } = response;
            if (status === 200) {
                setAddrList(addresses);
                enqueueSnackbar('Address set as default.', { variant: 'success' });
            }
        })
    }

    useEffect(() => {
        HttpService.get('/user/customer/address').then(response => {
            setAddrList(response || []);
        })
    }, []);

    return <div className={styles.root}>
        <div className={styles.addingAddr}>
            <p>Address Book</p>
            <div className={styles.controls}>
                <Input
                    name='name'
                    placeholder='Address Nick Name'
                    value={addingBook.name}
                    updateValue={onBookChange}
                    className={styles.input}
                />
                <Input
                    name='address'
                    placeholder='New Address'
                    value={addingBook.address}
                    updateValue={onBookChange}
                    className={styles.input}
                />
                <Input
                    name='extras'
                    placeholder='Extras: Appt #, Floor, Unit, Etc...'
                    value={addingBook.extras}
                    updateValue={onBookChange}
                    className={styles.input}
                />
            </div>
            <Button className={styles.addBtn} onClick={onAddBtnClick}>Add Address</Button>
        </div>
        <div className={styles.addrList}>
            <div className={styles.header}>
                <p>Address Nick Name</p>
                <p>Address</p>
            </div>
            <div className={styles.body}>
                {
                    addrList.map((address: IAddrBook, index: number) =>
                        <div key={index} className={clsx(styles.row, { [styles.active]: address.default })}>
                            <p>{address.name}</p>
                            <p>{address.address}</p>
                            {address.default
                                ? <p>Current default</p>
                                : <Button
                                    className={styles.defaultBtn}
                                    onClick={onDefaultClick(index)}
                                >
                                    Set as default
                                </Button>
                            }
                        </div>
                    )
                }
            </div>
        </div>
    </div>
}