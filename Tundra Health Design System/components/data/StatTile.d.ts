import * as React from 'react';
export interface StatTileProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Trailing unit, e.g. "%", "days". */
  unit?: React.ReactNode;
  /** Change figure, e.g. "12%". */
  delta?: React.ReactNode;
  /** Colour of the delta only: ok = good movement (moss), down = bad movement (rust). */
  deltaTone?: 'neutral' | 'ok' | 'down';
  /** Arrow direction — which way the number actually moved. Defaults to the tone-derived guess. */
  deltaDirection?: 'up' | 'down';
  /** A Sparkline (or any node) rendered under the value. */
  chart?: React.ReactNode;
  /** Value size: sm 26 / md 32 / lg 44. */
  size?: 'sm' | 'md' | 'lg';
  /** Set 'inverse' when the tile sits on an ink Surface. */
  tone?: 'default' | 'inverse';
  /** Drop the card chrome — for tiles sat inside a hairline-divided strip. */
  bare?: boolean;
  /** Period or provenance note. */
  hint?: React.ReactNode;
}
export declare function StatTile(props: StatTileProps): JSX.Element;
