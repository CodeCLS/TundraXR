import * as React from 'react';
export interface BarDatum {
  label: string;
  /** A number, or an array of segment values when stacked. */
  value: number | number[];
  color?: string;
}
export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: BarDatum[];
  height?: number;
  color?: string;
  /** Ranked horizontal bars with label + value columns — the default for "top N" breakdowns. */
  horizontal?: boolean;
  /** Treat each datum's array value as stacked segments. */
  stacked?: boolean;
  valueFormat?: (v: number) => string;
}
export declare function BarChart(props: BarChartProps): JSX.Element;
