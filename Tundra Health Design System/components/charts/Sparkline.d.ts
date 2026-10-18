import * as React from 'react';
export interface SparklineProps extends React.SVGAttributes<SVGSVGElement> {
  /** Ordered series values. */
  data: number[];
  width?: number;
  height?: number;
  /** Stroke colour. Defaults to glacier. */
  color?: string;
  /** Faded gradient fill under the line. Default true. */
  area?: boolean;
  strokeWidth?: number;
}
export declare function Sparkline(props: SparklineProps): JSX.Element | null;
