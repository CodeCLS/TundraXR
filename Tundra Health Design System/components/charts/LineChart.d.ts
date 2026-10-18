import * as React from 'react';
export interface Series {
  name: string;
  data: number[];
  color?: string;
  /** Render as a muted dashed line with no fill — use for the prior-period comparison. */
  dashed?: boolean;
}
export interface LineChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** One or more named series. Colours default to ink → cobalt → amber → moss. */
  series: Series[];
  /** X-axis labels, same length as the longest series. */
  labels?: string[];
  height?: number;
  /** Faded gradient under each line. Default true. */
  area?: boolean;
  /** Catmull-Rom smoothing. Default true. */
  curve?: boolean;
  yTicks?: number;
  /** Draws a dashed horizontal benchmark line at this value (target, median, SLA floor). */
  reference?: number;
  /** Uppercase mono caption for the reference line. */
  referenceLabel?: string;
  /** Small circle at every data point — the mood board's scatter-over-line treatment. */
  markers?: boolean;
  /** Formats axis and tooltip values, e.g. v => '$' + v.toLocaleString(). */
  valueFormat?: (v: number) => string;
}
export declare function LineChart(props: LineChartProps): JSX.Element;
