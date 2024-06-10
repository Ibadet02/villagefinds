import { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import { useDrag, useDrop } from 'react-dnd';

import { ITableColumn } from '@/interfaces';

import styles from './TableRow.module.scss';

interface ITableRow {
  row: any;
  rowIndex: number;
  columns: ITableColumn[];
  expandable: boolean;
  selectable: boolean;
  expandPanel: React.ReactNode;
  isLastRow: boolean;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
}

const DEFAULT_COLUMN_WIDTH = 150;

const ItemTypes = {
  ITEM: 'item',
};

interface Item {
  id: string;
  index: number;
}

interface DragItem {
  id: string;
  index: number;
  type: string;
}

export function TableRow({
  columns,
  row,
  rowIndex,
  expandable,
  selectable,
  expandPanel,
  isLastRow,
  moveItem,
}: ITableRow) {
  const [isExpanded, setIsExpanded] = useState(false);

  const [, drag] = useDrag<Item>({
    type: ItemTypes.ITEM,
    item: { id: row._id, index: rowIndex },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.ITEM,
    drop(item: DragItem, monitor) {
      if (item.index !== rowIndex) {
        moveItem(item.index, rowIndex);
        item.index = rowIndex;
      }
    },
  });

  return (
    <div key={rowIndex} ref={node => (selectable ? drag(drop(node)) : null)}>
      <div key={`row-${rowIndex}`} className={styles.row}>
        {columns.map((column: ITableColumn, colIndex: number) => (
          <div
            key={`cell-${rowIndex}-${colIndex}`}
            style={{ width: `${column.width || DEFAULT_COLUMN_WIDTH}px` }}
          >
            {column.cell ? (
              <>{column.cell(row)}</>
            ) : (
              <span>{row[column.name]}</span>
            )}
          </div>
        ))}
        {expandable && (
          <div className={styles.expandIcon}>
            <span onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>
        )}
      </div>
      {expandable && expandPanel && isExpanded && (
        <div className={styles.exSection}>{expandPanel}</div>
      )}
      {!isLastRow && (
        <div key={`divider-${rowIndex}`} className={styles.divider} />
      )}
    </div>
  );
}
