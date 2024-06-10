import { useContext, useEffect, useState } from 'react';
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";

import { Input } from '@/components/forms';
import { AuthContext } from '@/providers';
import { ChangeInputEvent } from '@/interfaces';

import styles from './Information.module.scss';

interface IInformation {
    name: string;
    phone: string;
    email: string;
}

const initialInfo: IInformation = {
    name: '',
    phone: '',
    email: ''
};

export function Information() {
    const { account } = useContext(AuthContext);
    const [information, setInformation] = useState<IInformation>(initialInfo);

    const onInfoChange = (e: ChangeInputEvent) => {
        setInformation({ ...information, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        const profile = account?.profile;
        if (profile) {
            setInformation({ ...profile, name: `${profile.firstName} ${profile.lastName}` });
        }
    }, [account]);

    return <div className={styles.root}>
        <div className={styles.header}>
            <p>My Information</p>
            <div className={styles.icons}>
                <div className={styles.edit}>
                    <FaRegEdit />
                    <p>Edit</p>
                </div>
                <FaRegTrashCan />
            </div>
        </div>
        <div className={styles.controls}>
            <div className={styles.control}>
                <Input
                    name='name'
                    placeholder='Full Name'
                    className={styles.input}
                    value={information.name}
                    updateValue={onInfoChange}
                />
            </div>
            <div className={styles.control}>
                <Input
                    name='phone'
                    placeholder='Phone Number'
                    className={styles.input}
                    value={information.phone}
                    updateValue={onInfoChange}
                />
                <Input
                    name='email'
                    placeholder='Email'
                    className={styles.input}
                    value={information.email}
                    updateValue={onInfoChange}
                />
            </div>
        </div>
    </div>
}