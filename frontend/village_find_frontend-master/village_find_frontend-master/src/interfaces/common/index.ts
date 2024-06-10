import { ChangeEvent } from 'react';

export type ImageType = File | string;
export type WeekdayType =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'
  | 'None';

export interface ITableColumn {
  title: string;
  name: string;
  width?: number;
  cell?: (row: any) => React.ReactNode;
  expand?: (row: any) => React.ReactNode;
}

export interface IRange {
  from: string;
  to: string;
}

export interface GetInfinitePagesInterface<T> {
  nextId?: number;
  previousId?: number;
  data: T;
  count: number;
}

export type ChangeInputEvent = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;
