import * as React from 'react';
export interface ProgressSegment { value: number; color?: string }
export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  label?: React.ReactNode;
  /** Right-aligned mono figure, e.g. "82% · 41 of 50". */
  valueLabel?: React.ReactNode;
  tone?: 'accent' | 'ok' | 'warn' | 'down' | 'ink';
  /** Multiple stacked segments instead of a single value. */
  segments?: ProgressSegment[];
  height?: number;
}
export declare function ProgressBar(props: ProgressBarProps): JSX.Element;
