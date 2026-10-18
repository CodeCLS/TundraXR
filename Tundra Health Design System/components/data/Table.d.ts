import * as React from 'react';
export interface TableColumn<T = any> {
  key: string;
  header: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: number | string;
  /** Render this column in Geist Mono — ids, serials, dates, currency. */
  mono?: boolean;
  muted?: boolean;
  /** Allow the cell to wrap instead of truncating on one line. */
  wrap?: boolean;
  render?: (row: T) => React.ReactNode;
}
/**
 * Dense record table.
 * @startingPoint section="Data" subtitle="Tables, field lists, timelines and stat tiles" viewport="700x340"
 */
export interface TableProps<T = any> extends React.HTMLAttributes<HTMLDivElement> {
  columns: TableColumn<T>[];
  rows: T[];
  onRowClick?: (row: T, index: number) => void;
  /** 34px rows instead of 42px. */
  dense?: boolean;
}
export declare function Table(props: TableProps): JSX.Element;
