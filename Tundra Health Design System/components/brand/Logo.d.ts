import * as React from 'react';
/**
 * The Tundra lockup.
 * @startingPoint section="Brand" subtitle="Logo lockup and dotted brand surface" viewport="700x300"
 */
export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Cap height of the mark in px. Default 22. */
  size?: number;
  /** Any CSS colour — the mark is masked to currentColor. */
  color?: string;
  /** Set false for the mark alone (favicons, collapsed rails). */
  wordmark?: boolean;
}
export declare function Logo(props: LogoProps): JSX.Element;
