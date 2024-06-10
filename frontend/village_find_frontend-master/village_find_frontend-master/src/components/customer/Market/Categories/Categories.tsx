import { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Input } from '@/components/forms';
import { MagnifierIcon } from '@/components/icons';
import { CategoryContext } from '@/providers';
import { ChangeInputEvent } from '@/interfaces';
import { useOnClickOutside } from '@/utils';

import styles from './Categories.module.scss';

export function Categories() {
  const navigate = useNavigate();
  const { categories, filter, setFilter } = useContext(CategoryContext);
  const { setCategoryBar } = useContext(CategoryContext);

  const catRef = useRef<HTMLDivElement>(null);

  const onCatClick = (category: string) => () => {
    navigate(`/market?category=${category.toLowerCase()}`);
    setCategoryBar(false);
  }

  useOnClickOutside(catRef, () => setCategoryBar(false), 'mousedown');

  return (
    <div className={styles.root} ref={catRef}>
      <div className={styles.categorybar}>
        <p className={styles.head}>All Categories</p>
        <Input
          rounded="full"
          placeholder="Search Categories"
          className={styles.catInput}
          adornment={{
            position: 'right',
            content: <MagnifierIcon />,
          }}
          value={filter}
          updateValue={(e: ChangeInputEvent) => setFilter(e.target.value)}
        />
      </div>
      <ul className={styles.categories}>
        {categories.map((category: any, index: number) => (
          <li key={`category-${index}`} onClick={onCatClick(category.name)}>
            <span>{category.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
