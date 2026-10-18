import * as React from 'react';
export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** paper (default warm off-white), cream (brand), ink (dark section). */
  tone?: 'paper' | 'cream' | 'ink';
  /** Dotted survey grid, radially faded. Default true. */
  dots?: boolean;
  /** Film-grain overlay. Default true. */
  grain?: boolean;
  /** Override the dot pitch, e.g. "12px". */
  dotGap?: string;
}
export declare function Surface(props: SurfaceProps): JSX.Element;
