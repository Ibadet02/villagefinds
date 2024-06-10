import { FaTimes } from 'react-icons/fa';
import clsx from 'clsx';

import styles from './Switch.module.scss';

interface ISwitchProps {
    value?: boolean;
    updateValue?: (value: boolean) => void;
}

export function Switch({
    value = false,
    updateValue = () => { }
}: ISwitchProps) {
    return <div className={clsx(styles.root, { [styles.active]: value })}>
        <span className={styles.switch} onClick={() => updateValue(!value)}>
            <FaTimes />
        </span>
    </div >
}