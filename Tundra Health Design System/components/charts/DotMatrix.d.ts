import * as React from 'react';
export interface DotMatrixDatum { label?: string; value: number; color?: string }
export interface DotMatrixProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Plain numbers, or {label, value, color} per column. */
  data: Array<number | DotMatrixDatum>;
  /** Vertical resolution — how many cells a full column contains. Default 12. */
  rows?: number;
  /** Cell edge length in px. Default 5. */
  cell?: number;
  /** Gap between cells in a column. Default 2. */
  gap?: number;
  /** Gap between columns. Default 3. */
  columnGap?: number;
  color?: string;
  /** Colour of the unfilled cells. */
  emptyColor?: string;
  /** Show the axis label row (swaps to the value on hover). */
  labels?: boolean;
  valueFormat?: (v: number) => string;
}
export declare function DotMatrix(props: DotMatrixProps): JSX.Element;
