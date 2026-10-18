import * as React from 'react';
export interface DonutDatum { label: string; value: number; color?: string }
export interface DonutChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: DonutDatum[];
  size?: number;
  /** Ring thickness in px. Default 14. */
  thickness?: number;
  /** Big number in the middle. */
  centerValue?: React.ReactNode;
  /** Uppercase micro-label under the centre value. */
  centerLabel?: React.ReactNode;
  legend?: boolean;
}
export declare function DonutChart(props: DonutChartProps): JSX.Element;
