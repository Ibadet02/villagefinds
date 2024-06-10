import { useState } from 'react';

import { Card, TableBody } from '@/components/common';
import { FormViewDialog } from '@/components/community';
import { PrintIcon, ExportIcon } from '@/components/icons';

import { ITableColumn } from '@/interfaces';

import { formatUsDate } from '@/utils';

import { IAttendee } from '../Detail';

import styles from './Attendee.module.scss';

interface IAttendeeProps {
  attendees: IAttendee[];
}

export function Attendee({ attendees }: IAttendeeProps) {
  const columns: ITableColumn[] = [
    {
      title: 'Attendee Name',
      name: 'name',
      width: 250,
      cell: (row: any) => <div className={styles.attendeeCell}>{row.name}</div>,
    },
    {
      title: 'Date',
      name: 'date',
      width: 500,
      cell: (row: any) => (
        <div className={styles.attendeeCell}>
          {row.submited_at && formatUsDate(new Date(row.submited_at))}
        </div>
      ),
    },
    {
      title: 'Action',
      name: 'action',
      width: 150,
      cell: (row: any) => (
        <button
          className={styles.formButton}
          onClick={() => onFormClick(row as IAttendee)}
        >
          Form
        </button>
      ),
    },
  ];

  const [formViewOpen, setFormViewOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState<IAttendee | null>(null);

  const onFormClick = (form: IAttendee) => {
    setFormViewOpen(true);
    setCurrentForm(form);
  };

  return (
    <div className={styles.root}>
      <div className={styles.actions}>
        <button>
          <p>Print</p>
          <span>
            <PrintIcon />
          </span>
        </button>
        <button>
          <p>Export</p>
          <span>
            <ExportIcon />
          </span>
        </button>
      </div>
      <Card title="Attendees">
        <TableBody columns={columns} rows={attendees} />
      </Card>
      <FormViewDialog
        open={formViewOpen}
        onClose={() => setFormViewOpen(false)}
        form={currentForm as IAttendee}
      />
    </div>
  );
}
