import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import clsx from 'clsx';

import { ITableColumn } from '@/interfaces';
import { TableRow } from '../TableRow';

import styles from './TableBody.module.scss';

export interface ITableBodyProps {
  columns: ITableColumn[];
  rows: any[];
  expandable?: boolean;
  selectable?: boolean;
  className?: string;
  expandPanel?: React.ReactNode;
  setRows?: (rows: any[]) => void;
  onRowMove?: (ids: string[]) => void;
}

const DEFAULT_COLUMN_WIDTH = 150;

export function TableBody({
  columns,
  rows,
  expandable = false,
  selectable = false,
  className = '',
  expandPanel,
  setRows = () => { },
  onRowMove = () => { },
}: ITableBodyProps) {
  const moveItem = (dragIndex: number, hoverIndex: number): void => {
    if (!selectable) return;
    const dragItem = rows[dragIndex];
    const newItems = [...rows];
    newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, dragItem);
    setRows(newItems);
    onRowMove(newItems.map(item => item._id));
  };

  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.header}>
        {columns.map((column: ITableColumn) => (
          <span
            key={`header-${column.name}`}
            style={{ width: `${column.width || DEFAULT_COLUMN_WIDTH}px` }}
          >
            {column.title}
          </span>
        ))}
        {expandable && <span className={styles.exSpan}></span>}
      </div>
      <DndProvider backend={HTML5Backend}>
        <div className={styles.body}>
          {rows.map((row: any, rowIndex: number) => (
            <TableRow
              columns={columns}
              row={row}
              rowIndex={rowIndex}
              expandable={expandable}
              expandPanel={expandPanel}
              isLastRow={rowIndex === rows.length}
              moveItem={moveItem}
              selectable={selectable}
            />
          ))}
        </div>
      </DndProvider>
    </div>
  );
}
