import React from 'react';
import clsx from 'clsx';

import { Input, Select } from '@/components/forms';
import {
  MagnifierIcon,
  CloseIcon,
  ExportIcon,
  PrintIcon,
} from '@/components/icons';

import { IRange } from '@/interfaces';
import { RoundedType, BorderType, BgColorType } from '@/components/forms';

import styles from './TableToolbar.module.scss';

export interface ITableToolbarProps {
  searchable?: boolean;
  searchTitle?: string;
  searchPlaceholder?: string;
  searchTitleHidden?: boolean;
  search?: string;
  updateSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rangable?: boolean;
  range?: IRange;
  updateRange?: (
    which: string,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  downloadable?: boolean;
  sortable?: boolean;
  sortOpts?: { name: string; value: string }[] | string[];
  sort?: string;
  updateSort?: (e: string) => void;
  selectable?: boolean;
  selectTitle?: string;
  selectOpts?: { name: string; value: string }[] | string[];
  category?: string;
  updateCategory?: (e: string) => void;
  actions?: React.ReactNode;
  className?: string;
}

export interface IOrder { }

export function TableToolbar({
  searchable = true,
  searchTitle = 'Search',
  searchPlaceholder = '',
  searchTitleHidden = false,
  search = '',
  updateSearch = () => { },
  rangable = false,
  range = { from: '', to: '' },
  updateRange = () => () => { },
  downloadable = false,
  sortable = false,
  sortOpts = [],
  sort = '',
  updateSort = () => { },
  selectable = true,
  selectTitle = 'Select',
  selectOpts = [],
  category = '',
  updateCategory = () => { },
  actions = null,
  className = '',
}: ITableToolbarProps) {
  const commonProps = {
    rounded: 'full' as RoundedType,
    border: 'none' as BorderType,
    bgcolor: 'secondary' as BgColorType,
  };
  // const [orders, setOrders] = useState<IOrder

  return (
    <div className={clsx(styles.root, className)}>
      {searchable && (
        <div className={styles.control}>
          {!searchTitleHidden && <p>{searchTitle}</p>}
          <Input
            value={search}
            updateValue={updateSearch}
            placeholder={searchPlaceholder || searchTitle}
            adornment={{
              position: 'right',
              content: <MagnifierIcon />,
            }}
            className={styles.input}
            {...commonProps}
          />
        </div>
      )}
      {rangable && (
        <div className={styles.control}>
          <p>From</p>
          <Input
            type="date"
            value={range.from}
            updateValue={updateRange('from')}
            adornment={{
              position: 'right',
              content: <CloseIcon onClick={() => console.log('Hello world!')} />,
            }}
            className={styles.input}
            {...commonProps}
          />
        </div>
      )}
      {rangable && (
        <div className={styles.control}>
          <p>To</p>
          <Input
            type="date"
            value={range.to}
            updateValue={updateRange('to')}
            adornment={{
              position: 'right',
              content: <CloseIcon />,
            }}
            className={styles.input}
            {...commonProps}
          />
        </div>
      )}
      {downloadable && (
        <>
          <div className={clsx(styles.control, styles.print)}>
            <p>Print</p>
            <span>
              <PrintIcon />
            </span>
          </div>
          <div className={clsx(styles.control, styles.export)}>
            <p>Export</p>
            <span>
              <ExportIcon />
            </span>
          </div>
        </>
      )}
      {sortable && (
        <div className={styles.control}>
          <p>Sort</p>
          <Select
            value={sort}
            updateValue={updateSort}
            options={sortOpts}
            border="none"
            bgcolor="primary"
            rounded="full"
          />
        </div>
      )}
      {selectable && (
        <div className={styles.control}>
          <p>{selectTitle}</p>
          <Select
            value={category}
            updateValue={updateCategory}
            options={selectOpts}
            border="none"
            bgcolor="primary"
            rounded="full"
          />
        </div>
      )}
      {actions && <>{actions}</>}
    </div>
  );
}
