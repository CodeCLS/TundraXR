import * as React from 'react';

/**
 * Dense before/after bar comparison.
 * @startingPoint section="Charts" subtitle="Before/after step-change comparison" viewport="700x260"
 */
export interface SplitBarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** One value per bar — 60–200 bars reads best. */
  data: number[];
  /** Index where the "after" state begins. Defaults to the midpoint. */
  split?: number;
  height?: number;
  /** Pixel gap between bars. Default 1. */
  barGap?: number;
  leftLabel?: string;
  rightLabel?: string;
  leftColor?: string;
  rightColor?: string;
  /** Axis tick labels, spread edge to edge. */
  ticks?: Array<string | number>;
  valueFormat?: (value: number) => string;
}
export declare function SplitBarChart(props: SplitBarChartProps): JSX.Element;
